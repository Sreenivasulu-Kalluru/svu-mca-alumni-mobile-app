'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { Edit2, Trash2, Quote } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { motion } from 'framer-motion';
import UserAvatar from '@/components/UserAvatar';
import { getImageUrl } from '@/utils/imageHelper';

interface IStory {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  linkedinProfile?: string;
  user: {
    _id: string; // Add _id for ownership checks
    name: string;
    profilePicture?: string;
  };
}

export default function StoriesPage() {
  const [stories, setStories] = useState<IStory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Deletion state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          }/api/stories`,
        );
        const data = await res.json();
        setStories(data);
      } catch (error) {
        console.error('Failed to fetch stories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!user || !deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/stories/${deletingId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (res.ok) {
        setStories(stories.filter((s) => s._id !== deletingId));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Delete story error:', error);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Success Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Inspiring journeys from our distinguished alumni.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link
              href="/stories/create"
              className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
            >
              Share Your Journey
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading inspiring stories..." />
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {story.image && (
                  <div className="h-52 w-full overflow-hidden relative border-b border-gray-100">
                    <Image
                      src={getImageUrl(story.image) || ''}
                      alt={`${story.name}'s Success Story`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 shrink-0">
                      <UserAvatar
                        user={{
                          name: story.name,
                          profilePicture:
                            story.user?.profilePicture || story.image,
                        }}
                        className="w-16 h-16 ring-4 ring-white"
                        size={64}
                      />
                    </div>
                    <div className="grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {story.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {story.role} @ {story.company}
                          </p>
                        </div>
                        {user?._id === story.user?._id && (
                          <div className="flex gap-1">
                            <Link
                              href={`/stories/${story._id}/edit`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                              title="Edit Story"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(story._id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                              title="Delete Story"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-50 opacity-50" />
                    <p className="text-gray-600 leading-relaxed relative z-10 pl-4 border-l-4 border-blue-100">
                      {story.content}
                    </p>
                  </div>

                  {story.linkedinProfile && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <a
                        href={story.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-blue-700 transition flex items-center gap-1"
                      >
                        Connect on LinkedIn &rarr;
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Be the first to share your journey and inspire the next generation
              of students!
            </p>
            <Link
              href="/stories/create"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Share Your Story
            </Link>
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Success Story"
        message="Are you sure you want to remove your success story? This action cannot be undone."
        confirmText="Delete Story"
        isLoading={isDeleting}
      />
    </div>
  );
}
