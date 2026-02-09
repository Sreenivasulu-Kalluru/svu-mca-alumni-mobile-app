import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

// Generate JWT Token
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Student or Alumni)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role, batch, ...otherDetails } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      batch,
      ...otherDetails,
    });

    if (user) {
      res.status(201).json({
        _id: (user as any)._id as string,
        name: (user as any).name,
        email: (user as any).email,
        role: (user as any).role,
        profilePicture: (user as any).profilePicture,
        bio: (user as any).bio,
        currentCompany: (user as any).currentCompany,
        designation: (user as any).designation,
        skills: (user as any).skills,
        linkedinProfile: (user as any).linkedinProfile,
        githubProfile: (user as any).githubProfile,
        batch: (user as any).batch,
        token: generateToken((user as any)._id.toString(), (user as any).role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password as string))) {
      res.json({
        _id: (user as any)._id as string,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio,
        currentCompany: user.currentCompany,
        designation: user.designation,
        skills: user.skills,
        linkedinProfile: user.linkedinProfile,
        githubProfile: user.githubProfile,
        batch: user.batch,
        token: generateToken((user as any)._id.toString(), user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
