import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getConversations,
  getMessages,
  editMessage,
  deleteMessage,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getConversations);
// Specific conversation messages
router.get('/:conversationId', protect, getMessages);
router.put('/:messageId', protect, editMessage);
router.delete('/:messageId', protect, deleteMessage);

export default router;
