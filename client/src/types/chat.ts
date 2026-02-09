'use client';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  // ... other fields
}

export interface IMessage {
  _id: string;
  conversationId: string;
  sender: string;
  content: string;
  isEdited?: boolean;
  readBy: string[];
  createdAt: string;
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage?: IMessage;
  updatedAt: string;
}
