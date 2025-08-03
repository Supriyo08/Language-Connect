import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDB } from "./db/connection";
import { handleUserProfile } from "./routes/user-profile";
import { handleContestEntry, handleContestLeaderboard, uploadMiddleware } from "./routes/contest";
import { handleRaffleEntry, handleReferralLeaderboard } from "./routes/raffle";
import { handleLogin, handleGetProfile } from "./routes/auth";
import { handleVote, handleGetVotes } from "./routes/voting";

export function createServer() {
  const app = express();

  // Connect to MongoDB (non-blocking)
  connectDB().catch(err => {
    console.log('MongoDB connection failed, continuing with mock data');
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // LanguageKonnect API routes
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/profile/:userId", handleGetProfile);
  app.post("/api/user/profile", handleUserProfile);
  app.post("/api/contest/entry", uploadMiddleware, handleContestEntry);
  app.get("/api/contest/leaderboard", handleContestLeaderboard);
  app.post("/api/contest/vote", handleVote);
  app.get("/api/contest/votes/:entryId", handleGetVotes);
  app.post("/api/raffle-entry", handleRaffleEntry);
  app.get("/api/referral/leaderboard", handleReferralLeaderboard);

  return app;
}
