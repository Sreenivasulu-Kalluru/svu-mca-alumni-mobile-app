import { Request, Response } from 'express';
import { Post } from '../models/Post.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate('author', 'name role profilePicture') // Get essential author details
      .sort({ createdAt: -1 }); // Newest first

    res.json(posts);
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { content } = req.body;
    let image = '';

    if (req.file) {
      image = req.file.path;
    }

    if (!content && !image) {
      res.status(400).json({ message: 'Content or image is required' });
      return;
    }

    const post = await Post.create({
      content: content || '',
      image,
      author: (req as any).user._id,
    });

    // Populate author details to return a complete post object immediately
    await post.populate('author', 'name role profilePicture');

    res.status(201).json(post);
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.author.toString() !== (req as any).user._id.toString()) {
      res.status(401).json({ message: 'Not authorized to delete this post' });
      return;
    }

    await post.deleteOne();

    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const userId = (req as any).user._id;

    // Check if already liked
    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error('Like Post Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.author.toString() !== (req as any).user._id.toString()) {
      res.status(401).json({ message: 'Not authorized to update this post' });
      return;
    }

    post.content = content || post.content;

    // Handle image update if needed (optional for now based on plan)
    if (req.file) {
      post.image = req.file.path;
    }

    await post.save();

    // Populate author before returning
    await post.populate('author', 'name role profilePicture');

    res.json(post);
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
