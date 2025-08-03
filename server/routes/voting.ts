import { RequestHandler } from "express";
import { ContestEntry } from "../db/models";
import { isDBConnected } from "../db/connection";

// In-memory vote storage for demo (in production, use database)
const voteStorage = new Map<string, Set<string>>(); // entryId -> Set of userIds who voted

export const handleVote: RequestHandler = async (req, res) => {
  try {
    const { entryId, userId, action } = req.body; // action: 'like' or 'unlike'

    if (!entryId || !userId || !action) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: entryId, userId, action"
      });
    }

    if (!isDBConnected()) {
      // Mock voting system when database is not available
      if (!voteStorage.has(entryId)) {
        voteStorage.set(entryId, new Set());
      }

      const voters = voteStorage.get(entryId)!;
      let newVoteCount = voters.size;

      if (action === 'like' && !voters.has(userId)) {
        voters.add(userId);
        newVoteCount = voters.size;
      } else if (action === 'unlike' && voters.has(userId)) {
        voters.delete(userId);
        newVoteCount = voters.size;
      }

      console.log('Vote processed (mock):', {
        entryId,
        userId,
        action,
        newVoteCount
      });

      return res.status(200).json({
        success: true,
        message: "Vote recorded!",
        votes: newVoteCount,
        isLiked: voters.has(userId)
      });
    }

    // Database implementation
    const entry = await ContestEntry.findById(entryId);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Contest entry not found"
      });
    }

    // In a real implementation, you'd have a separate votes collection
    // For now, we'll just update the vote count directly
    if (action === 'like') {
      entry.votes += 1;
    } else if (action === 'unlike') {
      entry.votes = Math.max(0, entry.votes - 1);
    }

    await entry.save();

    console.log('Vote processed:', {
      entryId,
      userId,
      action,
      newVoteCount: entry.votes
    });

    res.status(200).json({
      success: true,
      message: "Vote recorded!",
      votes: entry.votes,
      isLiked: action === 'like'
    });

  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const handleGetVotes: RequestHandler = async (req, res) => {
  try {
    const { entryId } = req.params;

    if (!isDBConnected()) {
      // Return mock vote count
      const voters = voteStorage.get(entryId) || new Set();
      return res.status(200).json({
        success: true,
        votes: voters.size
      });
    }

    const entry = await ContestEntry.findById(entryId);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Contest entry not found"
      });
    }

    res.status(200).json({
      success: true,
      votes: entry.votes
    });

  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
