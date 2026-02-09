import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface CreatePostProps {
  onPostCreated: (post: {
    _id: string;
    content: string;
    image?: string;
    author: {
      _id: string;
      name: string;
      role: string;
      profilePicture?: string;
    };
    likes: string[];
    createdAt: string;
  }) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !image) || !user) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/posts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        const newPost = await res.json();
        onPostCreated(newPost);
        setContent('');
        clearImage();
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Share with the Community
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening? Share a job, an achievement, or ask a question..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-400"
          />
        </div>

        {preview && (
          <div className="relative mt-3 rounded-xl overflow-hidden bg-gray-100 max-h-64 inline-block">
            <Image
              src={preview}
              alt="Preview"
              width={500}
              height={300}
              className="object-contain max-h-64 w-auto"
              unoptimized
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Add Image</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || (!content.trim() && !image)}
            className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Posting...'
            ) : (
              <>
                <Send className="w-4 h-4" /> Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
