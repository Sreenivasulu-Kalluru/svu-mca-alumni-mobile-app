'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { FilterDropdown } from '@/components/FilterDropdown';
import { ChevronLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs/${id}`,
        );
        if (!res.ok) {
          throw new Error('Job not found');
        }
        const data = await res.json();

        // Populate form
        setFormData({
          title: data.title,
          company: data.company,
          location: data.location,
          type: data.type,
          description: data.description,
          requirements: (data.requirements || []).join(', '),
          applicationLink: data.applicationLink || '',
          contactEmail: data.contactEmail || '',
        });

        // Check if user is owner
        if (
          user &&
          data.postedBy?.email !== user.email &&
          user.role !== 'admin'
        ) {
          setError('You are not authorized to edit this job.');
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch job details',
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJob();
    } else if (!loading && !user) {
      setError('You must be logged in to edit a job.');
      setLoading(false);
    }
  }, [id, user, loading]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!user) {
      setError('You must be logged in to update a job.');
      setSaving(false);
      return;
    }

    try {
      const requirementsArray = formData.requirements
        .split(',')
        .map((req) => req.trim())
        .filter((req) => req !== '');

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/jobs/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...formData,
            requirements: requirementsArray,
          }),
        },
      );

      if (res.ok) {
        router.push(`/jobs/${id}`);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update job');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <main className="grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading job details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-900 transition mb-6 font-medium group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Job Details
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-900" />
            Edit Opportunity
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          {!error || error === '' || (user && user.role === 'admin') ? (
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
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="hr@company.com"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/10 disabled:bg-gray-400"
                >
                  {saving ? 'Updating...' : 'Update Job Posting'}
                </button>
                <Link
                  href={`/jobs/${id}`}
                  className="px-8 py-4 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <Link
                href="/jobs"
                className="bg-blue-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Back to Jobs
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
