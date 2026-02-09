import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import crypto from 'crypto';
import sendEmail from '../utils/emailService.js';

// ... existing imports and functions ...

// @desc    Get all users (Alumni & Students) with filters
// @route   GET /api/users
// @access  Public (or Protected later)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, role, batch, skill } = req.query;

    let query: any = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { designation: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (batch) {
      query.batch = batch;
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill as string, 'i')] };
    }

    const users = await User.find(query).select('-password'); // Exclude password

    res.json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Update specific fields based on role or if provided
      if (req.body.skills) user.skills = req.body.skills;
      if (req.body.currentCompany)
        user.currentCompany = req.body.currentCompany;
      if (req.body.designation) user.designation = req.body.designation;
      if (req.body.linkedinProfile)
        user.linkedinProfile = req.body.linkedinProfile;
      if (req.body.githubProfile) user.githubProfile = req.body.githubProfile;
      if (req.body.bio) user.bio = req.body.bio;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: (updatedUser as any)._id as string,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skills: updatedUser.skills,
        currentCompany: updatedUser.currentCompany,
        designation: updatedUser.designation,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        linkedinProfile: updatedUser.linkedinProfile,
        githubProfile: updatedUser.githubProfile,
        batch: updatedUser.batch,
        token: req.headers.authorization?.split(' ')[1] || '',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-profile-picture
// @access  Private
export const uploadProfilePicture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = await User.findById((req as any).user._id);

    if (user) {
      // Use path.basename to get just the filename and prevent backslash issues
      user.profilePicture = req.file.path;
      const updatedUser = await user.save();

      res.json({
        profilePicture: updatedUser.profilePicture,
        message: 'Profile picture updated',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the following link to reset your password: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
      console.error(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(500).json({
        message: 'Email could not be sent',
        error: (error as any).message,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Server Error', error: (error as any).message });
  }
};

// @desc    Reset Password
// @route   PUT /api/users/reset-password/:token
// @access  Public
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
