import express from 'express';
import {
  getStories,
  createStory,
  updateStory,
  deleteStory,
} from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getStories)
  .post(protect, upload.single('image'), createStory);

router
  .route('/:id')
  .put(protect, upload.single('image'), updateStory)
  .delete(protect, deleteStory);

export default router;
