'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/utils/imageHelper';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Briefcase,
  Github,
  Linkedin,
  Edit2,
  Save,
  X,
  Camera,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth(); // updateUser keeps us on the same page
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Local state for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentCompany: '',
    designation: '',
    bio: '',
    githubProfile: '',
    linkedinProfile: '',
    skills: '', // comma separated for input
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    // Initialize form data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      currentCompany: user.currentCompany || '',
      designation: user.designation || '',
      bio: user.bio || '',
      githubProfile: user.githubProfile || '',
      linkedinProfile: user.linkedinProfile || '',
      skills: user.skills ? user.skills.join(', ') : '',
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/users/upload-profile-picture`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Update user context
        if (user) {
          updateUser({ ...user, profilePicture: data.profilePicture });
        }
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload image');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/users/profile`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (res.ok) {
        logout();
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete account');
        setShowDeleteConfirm(false);
      }
    } catch {
      setError('Failed to delete account');
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            ...formData,
            skills: skillsArray,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        updateUser(data); // Update global auth state without redirect
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 bg-linear-to-r from-blue-900 to-indigo-800"></div>

          <div className="px-8 pb-8">
            {/* Profile Header */}
            <div className="relative flex flex-col md:flex-row md:justify-between md:items-end -mt-12 mb-6 gap-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left w-full md:w-auto">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-white shadow-lg overflow-hidden">
                    {user.profilePicture ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={getImageUrl(user.profilePicture) || ''}
                          alt={user.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-900 border border-blue-200">
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() =>
                        document.getElementById('profile-upload')?.click()
                      }
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    >
                      <Camera className="w-8 h-8" />
                    </button>
                  )}
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="mb-1 md:mt-14">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <div className="flex flex-wrapjustify-center md:justify-start items-center gap-2 text-gray-600 text-sm mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                        user.role === 'alumni'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                    {user.batch && <span>• Batch of {user.batch}</span>}
                  </div>
                </div>
              </div>

              {!isEditing && (
                <div className="flex justify-center w-full md:w-auto">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="my-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.form
                  key="edit-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Current Company
                      </label>
                      <input
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Microsoft"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Designation
                      </label>
                      <input
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Senior Developer"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Short bio about yourself..."
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Skills (comma separated)
                      </label>
                      <input
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="React, Node.js, Python..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        LinkedIn URL
                      </label>
                      <input
                        name="linkedinProfile"
                        value={formData.linkedinProfile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        GitHub URL
                      </label>
                      <input
                        name="githubProfile"
                        value={formData.githubProfile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition flex items-center gap-2"
                    >
                      {loading ? (
                        'Saving...'
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="view-profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Info Grid */}
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                        Professional Info
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                          <span>
                            {user.designation
                              ? user.designation
                              : 'Designation not added'}
                            {user.currentCompany && (
                              <span className="text-gray-500">
                                {' '}
                                at {user.currentCompany}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                        Social Links
                      </h3>
                      <div className="space-y-3">
                        {user.linkedinProfile ? (
                          <a
                            href={user.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-blue-700 hover:underline"
                          >
                            <Linkedin className="w-5 h-5" />
                            <span>LinkedIn Profile</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 text-gray-400">
                            <Linkedin className="w-5 h-5" />
                            <span>Not connected</span>
                          </div>
                        )}

                        {user.githubProfile ? (
                          <a
                            href={user.githubProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-gray-900 hover:underline"
                          >
                            <Github className="w-5 h-5" />
                            <span>GitHub Profile</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 text-gray-400">
                            <Github className="w-5 h-5" />
                            <span>Not connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                      About
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {user.bio ||
                        'No bio provided yet. Click edit to add a short bio!'}
                    </p>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                      Skills
                    </h3>
                    {user.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No skills added yet.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Danger Zone */}
        {!isEditing && (
          <div className="mt-8 border border-red-100 rounded-2xl overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-900">Danger Zone</h3>
            </div>
            <div className="p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-500 mt-1">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition text-sm whitespace-nowrap"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Delete Account?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data (posts, events, profile) will be
                permanently removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}
