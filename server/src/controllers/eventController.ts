import { Request, Response } from 'express';
import { Event } from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, upcoming } = req.query;

    let query: any = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 }); // Sort by closest date first

    res.json(events);
  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, date, location, type } = req.body;

    // Assuming req.user is populated by auth middleware
    const userId = (req as any).user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      type,
      organizer: userId,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email',
    );

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Get Event By ID Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, date, location, type } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check ownership
    const userId = (req as any).user?._id;
    if (event.organizer.toString() !== userId.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.type = type || event.type;

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Update Event Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check ownership
    const userId = (req as any).user?._id;
    if (event.organizer.toString() !== userId.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
