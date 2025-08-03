import { RequestHandler } from "express";
import { UserProfile } from "../db/models";
import { generateReferralId } from "../utils/helpers";
import { isDBConnected } from "../db/connection";

export const handleUserProfile: RequestHandler = async (req, res) => {
  try {
    const { name, email, nativeLanguages, targetLanguages, experienceLevel, profilePicture, videoIntro } = req.body;

    // Validation
    if (!name || !email || !nativeLanguages || !targetLanguages || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, nativeLanguages, targetLanguages, experienceLevel"
      });
    }

    // Generate unique referral ID
    const referralId = generateReferralId();

    if (!isDBConnected()) {
      // Mock response when database is not available
      console.log('Using mock data - user profile created:', {
        name,
        email,
        referralId
      });

      return res.status(201).json({
        success: true,
        message: "User profile created successfully (demo mode)",
        data: {
          id: "mock-" + Date.now(),
          referralId: referralId
        }
      });
    }

    // Check if user already exists
    const existingUser = await UserProfile.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Create new user profile
    const userProfile = new UserProfile({
      name,
      email,
      nativeLanguages,
      targetLanguages,
      experienceLevel,
      profilePicture,
      videoIntro,
      referralId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await userProfile.save();

    console.log('User profile created successfully:', {
      id: userProfile._id,
      email: userProfile.email,
      referralId: userProfile.referralId
    });

    res.status(201).json({
      success: true,
      message: "User profile created successfully",
      data: {
        id: userProfile._id,
        referralId: userProfile.referralId
      }
    });

  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
