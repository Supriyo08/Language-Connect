import { RequestHandler } from "express";
import { RaffleEntry, UserProfile } from "../db/models";
import { isDBConnected } from "../db/connection";

export const handleRaffleEntry: RequestHandler = async (req, res) => {
  try {
    const { referralId, userId } = req.body;

    // Validation
    if (!referralId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: referralId"
      });
    }

    if (!isDBConnected()) {
      // Mock response when database is not available
      console.log('Using mock data - raffle entry created:', {
        referralId,
        userId
      });

      return res.status(201).json({
        success: true,
        ticketsEarned: 1,
        message: "🎉 You earned a raffle ticket! (demo mode)"
      });
    }

    // Find the user who owns this referral ID
    const referringUser = await UserProfile.findOne({ referralId });
    if (!referringUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid referral ID"
      });
    }

    // For this example, we'll assume the referred user is created separately
    // In a real implementation, this would be called when a new user signs up with a referral
    const referredUserId = userId || '507f1f77bcf86cd799439012'; // Placeholder

    // Check if this referral already exists
    const existingEntry = await RaffleEntry.findOne({
      userId: referringUser._id,
      referredUserId: referredUserId
    });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: "Referral already recorded"
      });
    }

    // Create raffle entry
    const raffleEntry = new RaffleEntry({
      userId: referringUser._id,
      referralId,
      referredUserId: referredUserId,
      ticketsEarned: 1,
      createdAt: new Date()
    });

    await raffleEntry.save();

    console.log('Raffle entry created successfully:', {
      id: raffleEntry._id,
      referringUserId: referringUser._id,
      referredUserId: referredUserId
    });

    res.status(201).json({
      success: true,
      ticketsEarned: 1,
      message: "🎉 You earned a raffle ticket!"
    });

  } catch (error) {
    console.error('Error creating raffle entry:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export const handleReferralLeaderboard: RequestHandler = async (req, res) => {
  try {
    if (!isDBConnected()) {
      // Mock referral leaderboard when database is not available
      const mockReferralLeaderboard = [
        {
          userId: "mock-user-1",
          userName: "Alex Johnson",
          referralId: "LK-ABC123",
          totalReferrals: 15,
          ticketsEarned: 15,
          rank: 1
        },
        {
          userId: "mock-user-2",
          userName: "Maria Garcia",
          referralId: "LK-DEF456",
          totalReferrals: 12,
          ticketsEarned: 12,
          rank: 2
        },
        {
          userId: "mock-user-3",
          userName: "James Wilson",
          referralId: "LK-GHI789",
          totalReferrals: 8,
          ticketsEarned: 8,
          rank: 3
        }
      ];

      console.log('Using mock referral leaderboard data');
      return res.json(mockReferralLeaderboard);
    }

    // Aggregate referral stats
    const leaderboard = await RaffleEntry.aggregate([
      {
        $group: {
          _id: '$userId',
          totalReferrals: { $sum: 1 },
          ticketsEarned: { $sum: '$ticketsEarned' }
        }
      },
      {
        $lookup: {
          from: 'userprofiles',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          referralId: '$user.referralId',
          totalReferrals: 1,
          ticketsEarned: 1
        }
      },
      {
        $sort: { totalReferrals: -1, ticketsEarned: -1 }
      },
      {
        $limit: 50
      }
    ]);

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    console.log('Referral leaderboard fetched:', {
      count: rankedLeaderboard.length
    });

    res.json(rankedLeaderboard);

  } catch (error) {
    console.error('Error fetching referral leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
