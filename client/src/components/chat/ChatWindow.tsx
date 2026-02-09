import React, { useState, useEffect, useRef } from 'react';
import { IMessage, IConversation } from '@/types/chat';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Send, ArrowLeft, Edit2, X, Check, Trash2 } from 'lucide-react';
// import Image from 'next/image'; // Remove unused
import UserAvatar from '@/components/UserAvatar';
import ConfirmModal from '../ConfirmModal';

interface ChatWindowProps {
  conversation: IConversation;
  messages: IMessage[];
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  loading: boolean;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  loading,
  onBack,
}) => {
  const { user: currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showOptionsMessageId, setShowOptionsMessageId] = useState<
    string | null
  >(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participants.find(
    (p) => p._id !== currentUser?._id
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleEditClick = (message: IMessage) => {
    setEditingMessageId(message._id);
    setEditContent(message.content);
    setShowOptionsMessageId(null);
  };

  const handleDeleteClick = (messageId: string) => {
    setMessageToDelete(messageId);
    setDeleteModalOpen(true);
    setShowOptionsMessageId(null);
  };

  const confirmDelete = async () => {
    if (messageToDelete) {
      await onDeleteMessage(messageToDelete);
      setMessageToDelete(null);
      setDeleteModalOpen(false); // Close modal after deletion
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (editingMessageId && editContent.trim()) {
      await onEditMessage(editingMessageId, editContent);
      setEditingMessageId(null);
      setEditContent('');
    }
  };

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (message: IMessage) => {
    if (message.sender === currentUser?._id) {
      longPressTimerRef.current = setTimeout(() => {
        setShowOptionsMessageId(message._id);
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  if (!otherParticipant) return <div>Conversation error</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden mr-3 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <UserAvatar
          user={otherParticipant}
          className="w-10 h-10 mr-3"
          size={40}
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {otherParticipant.name}
          </h3>
          <p className="text-xs text-green-500">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center mt-4">Loading messages...</div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender === currentUser?._id;
            const isEditing = editingMessageId === message._id;
            const showOptions = showOptionsMessageId === message._id;

            return (
              <div
                key={message._id}
                className={`flex ${
                  isOwn ? 'justify-end' : 'justify-start'
                } group`}
              >
                <div
                  onTouchStart={() => handleTouchStart(message)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm relative ${
                    isOwn
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="text-gray-900 px-2 py-1 rounded bg-white border border-indigo-300 outline-none w-full min-w-[150px]"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 hover:bg-indigo-500 rounded text-green-300"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 hover:bg-indigo-500 rounded text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>{message.content}</p>
                      <div
                        className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                          isOwn ? 'text-indigo-200' : 'text-gray-400'
                        }`}
                      >
                        {message.isEdited && <span>(edited)</span>}
                        <span>{format(new Date(message.createdAt), 'p')}</span>
                      </div>
                    </>
                  )}

                  {/* Options Overlay for Mobile (Long Press) */}
                  {showOptions && isOwn && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl rounded-br-none flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-200">
                      <button
                        onClick={() => handleEditClick(message)}
                        className="p-2 bg-white rounded-full text-indigo-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(message._id)}
                        className="p-2 bg-white rounded-full text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setShowOptionsMessageId(null)}
                        className="absolute top-1 right-1 text-white/80 p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {isOwn && !isEditing && !showOptions && (
                    <div className="absolute bottom-2 left-[-60px] opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => handleEditClick(message)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(message._id)}
                        className="p-1.5 bg-gray-100 hover:bg-red-100 rounded-full text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 p-2"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default ChatWindow;
