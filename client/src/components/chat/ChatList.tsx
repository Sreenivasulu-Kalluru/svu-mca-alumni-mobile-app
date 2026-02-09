'use client';

import { IConversation } from '@/types/chat';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
// import Image from 'next/image'; // Remove unused
import UserAvatar from '@/components/UserAvatar';

interface ChatListProps {
  conversations: IConversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  const { user: currentUser } = useAuth();

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
      </div>
      <div className="flex-1">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet.
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(
              (p) => p._id !== currentUser?._id
            );

            if (!otherParticipant) return null;

            return (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation._id)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conversation._id
                    ? 'bg-indigo-50 border-r-4 border-indigo-600'
                    : ''
                }`}
              >
                <div className="relative">
                  <UserAvatar
                    user={otherParticipant}
                    className="w-12 h-12"
                    size={48}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {otherParticipant.name}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessage.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {conversation.lastMessage
                      ? conversation.lastMessage.content
                      : 'Start a conversation'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
