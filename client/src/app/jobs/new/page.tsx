'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { FilterDropdown } from '@/components/FilterDropdown';

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    applicationLink: '',
    contactEmail: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to post a job.');
      setLoading(false);
      return;
    }

    try {
      const requirementsArray = formData.requirements
        .split(',')
        .map((req) => req.trim());

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/jobs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...formData,
            requirements: requirementsArray,
          }),
        }
      );

      if (res.ok) {
        router.push('/jobs');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to post job');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Post a New Opportunity
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  required
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g. Tech Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g. Bangalore, Remote"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <FilterDropdown
                  value={formData.type}
                  options={['Full-time', 'Part-time', 'Internship', 'Remote']}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  showDefaultOption={false}
                  width="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Describe the role, responsibilities, and perks..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (comma separated)
              </label>
              <input
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="React, Node.js, TypeScript..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Link (Optional)
                </label>
                <input
                  required
                  name="applicationLink"
                  value={formData.applicationLink}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email (Optional)
                </label>
                <input
                  required
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="hr@company.com"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-md disabled:bg-gray-400"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
