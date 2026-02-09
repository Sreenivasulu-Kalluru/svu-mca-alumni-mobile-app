'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { IConversation, IMessage, IUser } from '@/types/chat';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';

function ChatContent() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userIdToChat = searchParams.get('userId');

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [currentMessages, setCurrentMessages] = useState<IMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pendingConversation, setPendingConversation] =
    useState<IConversation | null>(null);

  const [conversationsLoaded, setConversationsLoaded] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      try {
        const token = user.token || localStorage.getItem('token');
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          }/api/chat`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setConversationsLoaded(true);
      }
    };
    fetchConversations();
  }, [user]);

  // Handle userId from URL to start chat
  useEffect(() => {
    if (!userIdToChat || !user || !conversationsLoaded) return;

    // Check if conversation already exists
    const existingConv = conversations.find((c) =>
      c.participants.some((p) => p._id === userIdToChat)
    );

    if (existingConv) {
      setSelectedConversationId(existingConv._id);
    } else {
      // Fetch user details for pending conversation
      const fetchUserAndInit = async () => {
        try {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            }/api/users/${userIdToChat}`
          );
          if (!res.ok) return;
          const otherUser = await res.json();

          // Create temp conversation object
          const tempConv: IConversation = {
            _id: 'new',
            participants: [user as unknown as IUser, otherUser],
            updatedAt: new Date().toISOString(),
          };
          setPendingConversation(tempConv);
          setSelectedConversationId('new');
        } catch (e) {
          console.error('Failed to fetch user for new chat', e);
        }
      };

      // If we are already in pending state for this user, don't re-fetch
      if (
        selectedConversationId === 'new' &&
        pendingConversation?.participants.some((p) => p._id === userIdToChat)
      ) {
        return;
      }

      fetchUserAndInit();
    }
  }, [
    userIdToChat,
    user,
    conversations,
    conversationsLoaded,
    selectedConversationId,
    pendingConversation,
  ]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (!selectedConversationId) return;

    // If "new", clear messages and stop
    if (selectedConversationId === 'new') {
      setCurrentMessages([]);
      return;
    }

    setPendingConversation(null); // Clear pending if switched to real

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const token = user?.token || localStorage.getItem('token');
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          }/api/chat/${selectedConversationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setCurrentMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId, user]);

  // Socket listener for new messages and updates
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message: IMessage) => {
      // Update current messages if looking at that conversation
      if (selectedConversationId === message.conversationId) {
        setCurrentMessages((prev) => [...prev, message]);
      }

      // Update conversations list (last message)
      setConversations((prev) => {
        const existing = prev.find((c) => c._id === message.conversationId);
        let updated;
        if (existing) {
          updated = prev.map((conv) => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: message,
                updatedAt: message.createdAt,
              };
            }
            return conv;
          });
        } else {
          return prev;
        }

        return updated.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    });

    socket.on('message_updated', (updatedMessage: IMessage) => {
      // Update current messages
      if (selectedConversationId === updatedMessage.conversationId) {
        setCurrentMessages((prev) =>
          prev.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
      }

      // Update conversation last message if needed
      setConversations((prev) =>
        prev.map((conv) => {
          if (
            conv._id === updatedMessage.conversationId &&
            conv.lastMessage &&
            (conv.lastMessage as IMessage)._id === updatedMessage._id
          ) {
            return {
              ...conv,
              lastMessage: updatedMessage,
            };
          }
          return conv;
        })
      );
    });

    socket.on('message_deleted', (messageId: string) => {
      // Remove from current messages
      setCurrentMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      // Update conversations if last message was deleted
      // For simplicity/accuracy, since we don't know the new last message without fetching,
      // we might want to re-fetch conversations or just leave it.
      // If we want to be accurate, we should probably fetch the new last message or the conversation again.
      // But let's at least check if the deleted message was the last one previewed
      setConversations((prev) => {
        return prev.map((conv) => {
          if (
            conv.lastMessage &&
            (conv.lastMessage as IMessage)._id === messageId
          ) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                content: 'Message deleted',
              } as IMessage,
            };
          }
          return conv;
        });
      });
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_updated');
      socket.off('message_deleted');
    };
  }, [socket, selectedConversationId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !user) return;

    let targetUserId;
    if (selectedConversationId === 'new') {
      targetUserId = userIdToChat;
    } else {
      const currentConv = conversations.find(
        (c) => c._id === selectedConversationId
      );
      const otherParticipant = currentConv?.participants.find(
        (p) => p._id !== user._id
      );
      targetUserId = otherParticipant?._id;
    }

    try {
      const token = user.token || localStorage.getItem('token');
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipientId: targetUserId,
            content,
          }),
        }
      );
      const newMessage = await res.json();

      // If was new, we now have a real conversation
      if (selectedConversationId === 'new') {
        const resConv = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          }/api/chat`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const conversationsData = await resConv.json();
        setConversations(conversationsData);
        setSelectedConversationId(newMessage.conversationId);
        setPendingConversation(null);
      } else {
        setCurrentMessages((prev) => [...prev, newMessage]);
        // Update list
        setConversations((prev) => {
          return prev
            .map((conv) => {
              if (conv._id === selectedConversationId) {
                return {
                  ...conv,
                  lastMessage: newMessage,
                  updatedAt: newMessage.createdAt,
                };
              }
              return conv;
            })
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!user) return;
    try {
      const token = user.token || localStorage.getItem('token');
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/chat/${messageId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newContent }),
        }
      );

      if (res.ok) {
        const updatedMessage = await res.json();
        // Socket will handle the update for everyone, but we can optimistically update too,
        // or just wait for socket. Since we are collecting IO in backend, socket should fire back to us too?
        // Actually, we usually emit to room/participants. If we are in participants list, we get it.
        // Let's rely on socket or optimistically update if socket fails?
        // For now, let's just update local state manually to be sure UI reflects instant change
        setCurrentMessages((prev) =>
          prev.map((msg) => (msg._id === messageId ? updatedMessage : msg))
        );
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    try {
      const token = user.token || localStorage.getItem('token');
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/chat/${messageId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setCurrentMessages((prev) =>
          prev.filter((msg) => msg._id !== messageId)
        );
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleBack = () => {
    setSelectedConversationId(null);
    router.replace('/chat');
  };

  const selectedConversation =
    selectedConversationId === 'new'
      ? pendingConversation
      : conversations.find((c) => c._id === selectedConversationId);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    // Clear the URL parameter so it doesn't force us back to that user
    if (userIdToChat) {
      router.replace('/chat');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Chat List - Hidden on mobile if conversation selected */}
        <div
          className={`w-full md:w-1/3 md:min-w-[300px] border-r border-gray-200 ${
            selectedConversationId ? 'hidden md:block' : 'block'
          }`}
        >
          <ChatList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Window - Hidden on mobile if no conversation selected */}
        <div
          className={`flex-1 ${
            selectedConversationId ? 'block' : 'hidden md:block'
          }`}
        >
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              loading={loadingMessages}
              onBack={handleBack}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
