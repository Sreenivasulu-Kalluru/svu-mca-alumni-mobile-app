import express from 'express';
import {
  createInquiry,
  getInquiries,
} from '../controllers/inquiryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, admin, getInquiries);

export default router;
