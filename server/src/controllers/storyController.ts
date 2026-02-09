import { Request, Response } from 'express';
import SuccessStory from '../models/SuccessStory.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Get all approved stories
// @route   GET /api/stories
// @access  Public
export const getStories = async (req: Request, res: Response) => {
  try {
    const stories = await SuccessStory.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('user', 'name profilePicture');
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a success story
// @route   POST /api/stories
// @access  Private
export const createStory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, company, content, image, linkedinProfile } = req.body;

    const story = await SuccessStory.create({
      user: req.user?._id,
      name,
      role,
      company,
      content,
      image: (req as any).file ? (req as any).file.path : image,
      linkedinProfile,
      status: 'approved', // Explicitly auto-approve
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a success story
// @route   PUT /api/stories/:id
// @access  Private
export const updateStory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, company, content, linkedinProfile } = req.body;
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check ownership
    if (story.user.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    story.name = name || story.name;
    story.role = role || story.role;
    story.company = company || story.company;
    story.content = content || story.content;
    story.linkedinProfile = linkedinProfile || story.linkedinProfile;

    if ((req as any).file) {
      story.image = (req as any).file.path;
    }

    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a success story
// @route   DELETE /api/stories/:id
// @access  Private
export const deleteStory = async (req: AuthRequest, res: Response) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check ownership
    if (story.user.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await story.deleteOne();
    res.json({ message: 'Story removed' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
