'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Upload, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
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
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

function EditStoryContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    linkedinProfile: '',
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/stories`,
        );
        const stories: IStory[] = await res.json();
        const story = stories.find((s) => s._id === id);

        if (!story) {
          setError('Story not found');
          setLoading(false);
          return;
        }

        // Authorization check
        if (user && story.user._id !== user._id) {
          router.push('/stories');
          return;
        }

        setFormData({
          name: story.name,
          role: story.role,
          company: story.company,
          content: story.content,
          linkedinProfile: story.linkedinProfile || '',
        });

        if (story.image) {
          setPreview(story.image);
        }
      } catch (err) {
        console.error('Failed to fetch story:', err);
        setError('Failed to load story data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStory();
  }, [id, user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('company', formData.company);
      data.append('content', formData.content);
      data.append('linkedinProfile', formData.linkedinProfile);
      if (image) {
        data.append('image', image);
      }

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/stories/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: data,
        },
      );

      if (res.ok) {
        router.push('/stories');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to update story');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your journey..." />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/stories"
            className="text-gray-500 hover:text-gray-900 mb-6 inline-flex items-center gap-1 transition"
          >
            <ChevronLeft size={16} /> Back to Stories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Your Story
            </h1>
            <p className="text-gray-600 mb-8">
              Update your career path and share new insights with the community.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Current Role
                  </label>
                  <input
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Company
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Story
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tell us about your journey, challenges, and advice for students..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photo
                </label>
                <div className="flex items-center gap-6">
                  {preview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden relative border border-gray-200 bg-gray-50">
                      <Image
                        src={
                          preview.startsWith('blob:')
                            ? preview
                            : getImageUrl(preview) || ''
                        }
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700 text-sm font-medium">
                    <Upload size={16} />
                    {preview ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={20} className="animate-spin" />}
                  {submitting ? 'Updating Story...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function EditStoryPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <EditStoryContent />
    </Suspense>
  );
}
