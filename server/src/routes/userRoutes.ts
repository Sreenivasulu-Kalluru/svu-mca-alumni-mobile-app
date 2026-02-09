import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  uploadProfilePicture,
  deleteUser,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', protect, updateUserProfile);
router.post(
  '/upload-profile-picture',
  protect,
  upload.single('profilePicture'),
  uploadProfilePicture
);
router.delete('/profile', protect, deleteUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
