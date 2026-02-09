import { Request, Response } from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { getIO } from '../socket.js';
import mongoose from 'mongoose';

// Extend Request to include user (added by auth middleware)
interface AuthRequest extends Request {
  user?: any;
}

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId, content } = (req as any).body;
    const senderId = req.user._id;

    if (!recipientId || !content) {
      res.status(400).json({ message: 'Recipient and content are required' });
      return;
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
      });
      await conversation.save();
    }

    // Create message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      content,
      readBy: [senderId],
    });

    await newMessage.save();

    // Update conversation last message
    conversation.lastMessage = newMessage._id as mongoose.Types.ObjectId;
    await conversation.save();

    // Emit socket event to recipient
    const io = getIO();
    io.to(recipientId).emit('receive_message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'name email profilePicture')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = (req as any).params;
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const editMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = (req as any).params;
    const { content } = (req as any).body;
    const userId = req.user._id;

    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.sender.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Not authorized to edit this message' });
      return;
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    // Emit socket event
    const io = getIO();
    // Emit to conversation room (if rooms set up) or participants
    // Finding conversation to get participants
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      conversation.participants.forEach((participantId) => {
        io.to(participantId.toString()).emit('message_updated', message);
      });
    }

    res.json(message);
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = (req as any).params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.sender.toString() !== userId.toString()) {
      res
        .status(403)
        .json({ message: 'Not authorized to delete this message' });
      return;
    }

    await Message.deleteOne({ _id: messageId });

    // Emit socket event
    const io = getIO();
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      conversation.participants.forEach((participantId) => {
        io.to(participantId.toString()).emit('message_deleted', messageId);
      });
    }

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
