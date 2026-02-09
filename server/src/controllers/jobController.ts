import { Request, Response } from 'express';
import { Job } from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, location, keyword } = req.query;

    let query: any = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword as string, 'i')] } },
      ];
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Alumni/Admin only)
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      applicationLink,
      contactEmail,
    } = req.body;

    // Assuming req.user is populated by auth middleware (needs to be added to definition or casted)
    // For now, we'll assume the auth middleware adds user to req
    const userId = (req as any).user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
      requirements,
      applicationLink,
      contactEmail,
      postedBy: userId,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'postedBy',
      'name email',
    );

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(job);
  } catch (error) {
    console.error('Get Job By ID Error:', error);
    if ((error as any).kind === 'ObjectId') {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Owner/Admin only)
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if user is owner or admin
    const userId = (req as any).user?._id;
    const userRole = (req as any).user?.role;

    if (job.postedBy.toString() !== userId && userRole !== 'admin') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      applicationLink,
      contactEmail,
    } = req.body;

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.type = type || job.type;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.applicationLink = applicationLink || job.applicationLink;
    job.contactEmail = contactEmail || job.contactEmail;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    console.error('Update Job Error:', error);
    if ((error as any).kind === 'ObjectId') {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner/Admin only)
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if user is owner or admin
    const userId = (req as any).user?._id;
    const userRole = (req as any).user?.role;

    if (job.postedBy.toString() !== userId && userRole !== 'admin') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error('Delete Job Error:', error);
    if ((error as any).kind === 'ObjectId') {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(500).json({ message: 'Server Error' });
  }
};
