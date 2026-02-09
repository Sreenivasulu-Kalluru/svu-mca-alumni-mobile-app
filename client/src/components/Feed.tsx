import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import ConfirmationModal from './ConfirmationModal';
import LoadingSpinner from './LoadingSpinner';

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    role: string;
    profilePicture?: string;
  };
  likes: string[];
  createdAt: string;
}

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          }/api/posts`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (id: string) => {
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
        }/api/posts/${deletingId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== deletingId));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading community feed..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost onPostCreated={handlePostCreated} />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
        ))}

        {posts.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-500">
              No posts yet. Be the first to share something!
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete Post"
        isLoading={isDeleting}
      />
    </div>
  );
}
