import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry.js';

// @desc    Create new contact inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
