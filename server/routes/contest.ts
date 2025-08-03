import { RequestHandler } from "express";
import { ContestEntry, UserProfile } from "../db/models";
import { isDBConnected } from "../db/connection";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 files are allowed'));
    }
  }
});

export const uploadMiddleware = upload.single('video');

export const handleContestEntry: RequestHandler = async (req, res) => {
  try {
    const { language, region, caption, userId } = req.body;
    const videoFile = req.file;

    // Validation
    if (!language || !region || !caption) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: language, region, caption"
      });
    }

    // Check if video file was uploaded
    if (!videoFile) {
      return res.status(400).json({
        success: false,
        message: "Video file is required"
      });
    }

    // For now, we'll simulate video storage and use a placeholder URL
    const videoUrl = `https://placeholder.example.com/videos/${Date.now()}.mp4`;

    console.log('Video file received:', {
      filename: videoFile.originalname,
      size: videoFile.size,
      mimetype: videoFile.mimetype
    });

    if (!isDBConnected()) {
      // Mock response when database is not available
      const mockEntryId = "mock-entry-" + Date.now();
      console.log('Using mock data - contest entry created:', {
        id: mockEntryId,
        language,
        region,
        videoFile: videoFile ? videoFile.originalname : 'No file'
      });

      return res.status(201).json({
        success: true,
        entryId: mockEntryId,
        message: "Video submitted! (demo mode)",
        videoUrl: videoUrl // Return the video URL for client use
      });
    }

    // Create contest entry
    const contestEntry = new ContestEntry({
      userId: userId || req.body.userId || '507f1f77bcf86cd799439011', // Use provided user ID
      language,
      region,
      caption,
      videoUrl,
      votes: 0, // Always start with 0 votes
      rating: 0, // Always start with 0 rating
      createdAt: new Date()
    });

    await contestEntry.save();

    console.log('Contest entry created successfully:', {
      id: contestEntry._id,
      language: contestEntry.language,
      region: contestEntry.region
    });

    res.status(201).json({
      success: true,
      entryId: contestEntry._id,
      message: "Video submitted!"
    });

  } catch (error) {
    console.error('Error creating contest entry:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export const handleContestLeaderboard: RequestHandler = async (req, res) => {
  try {
    const { sortBy = 'votes', language, region } = req.query;

    if (!isDBConnected()) {
      // Mock leaderboard data when database is not available
      const mockLeaderboard = [
        {
          id: "mock-1",
          userName: "Sarah Chen",
          score: 125,
          rank: 1,
          language: "Spanish",
          region: "North America",
          caption: "Practicing my Spanish pronunciation!",
          rating: 4.8,
          createdAt: new Date()
        },
        {
          id: "mock-2",
          userName: "Miguel Rodriguez",
          score: 98,
          rank: 2,
          language: "Japanese",
          region: "South America",
          caption: "Learning Japanese through anime!",
          rating: 4.6,
          createdAt: new Date()
        },
        {
          id: "mock-3",
          userName: "Emma Thompson",
          score: 87,
          rank: 3,
          language: "French",
          region: "Europe",
          caption: "Bonjour from Paris!",
          rating: 4.5,
          createdAt: new Date()
        }
      ];

      console.log('Using mock leaderboard data');
      return res.json(mockLeaderboard);
    }

    // Build filter query
    const filter: any = {};
    if (language) filter.language = language;
    if (region) filter.region = region;

    // Build sort query
    let sortQuery: any = {};
    switch (sortBy) {
      case 'recent':
        sortQuery = { createdAt: -1 };
        break;
      case 'rating':
        sortQuery = { rating: -1, votes: -1 };
        break;
      case 'votes':
      default:
        sortQuery = { votes: -1, createdAt: -1 };
        break;
    }

    // Get contest entries with user data
    const entries = await ContestEntry.find(filter)
      .populate('userId', 'name email')
      .sort(sortQuery)
      .limit(50)
      .lean();

    // Transform data for leaderboard format
    const leaderboard = entries.map((entry, index) => ({
      id: entry._id,
      userName: (entry.userId as any)?.name || 'Anonymous',
      score: entry.votes,
      rank: index + 1,
      language: entry.language,
      region: entry.region,
      caption: entry.caption,
      rating: entry.rating,
      createdAt: entry.createdAt
    }));

    console.log('Contest leaderboard fetched:', {
      count: leaderboard.length,
      sortBy,
      filters: filter
    });

    res.json(leaderboard);

  } catch (error) {
    console.error('Error fetching contest leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
