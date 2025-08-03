import { RequestHandler } from "express";
import { UserProfile } from "../db/models";
import { isDBConnected } from "../db/connection";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: email, password" 
      });
    }

    if (!isDBConnected()) {
      // Mock login when database is not available
      const mockUser = {
        id: "mock-user-" + Date.now(),
        name: "Demo User",
        email: email,
        nativeLanguages: ["English"],
        targetLanguages: ["Spanish", "French"],
        experienceLevel: "intermediate",
        referralId: `LK-${Date.now().toString(36).toUpperCase()}`,
        joinedAt: new Date(),
      };

      console.log('Using mock data - user login:', { 
        email: mockUser.email,
        name: mockUser.name 
      });

      return res.status(200).json({ 
        success: true, 
        message: "Login successful (demo mode)",
        user: mockUser
      });
    }

    // Find user by email
    const user = await UserProfile.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // In a real app, you would verify the password hash here
    // For now, we'll accept any password for demo purposes

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      nativeLanguages: user.nativeLanguages,
      targetLanguages: user.targetLanguages,
      experienceLevel: user.experienceLevel,
      profilePicture: user.profilePicture,
      videoIntro: user.videoIntro,
      referralId: user.referralId,
      joinedAt: user.createdAt,
    };

    console.log('User login successful:', { 
      id: userData.id, 
      email: userData.email,
      name: userData.name 
    });

    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      user: userData
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export const handleGetProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isDBConnected()) {
      return res.status(200).json({
        success: true,
        user: null
      });
    }

    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      nativeLanguages: user.nativeLanguages,
      targetLanguages: user.targetLanguages,
      experienceLevel: user.experienceLevel,
      profilePicture: user.profilePicture,
      videoIntro: user.videoIntro,
      referralId: user.referralId,
      joinedAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
