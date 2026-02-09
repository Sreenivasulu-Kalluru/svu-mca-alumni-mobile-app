'use client';

import { useState, useEffect, use } from 'react';
import Header from '@/components/Header';
import {
  MapPin,
  Briefcase,
  ChevronLeft,
  Building2,
  Mail,
  ExternalLink,
  Clock,
  User,
  Edit,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Linkify } from '@/components/Linkify';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Remote';
  description: string;
  requirements: string[];
  applicationLink?: string;
  contactEmail?: string;
  createdAt: string;
  postedBy?: {
    name: string;
    email: string;
  };
}

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

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
        setJob(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch job details';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );

      if (res.ok) {
        router.push('/jobs');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Delete job error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = user && job?.postedBy?.email === user.email;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <main className="grow flex items-center justify-center">
          <LoadingSpinner message="Loading job details..." />
        </main>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <main className="grow flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Job Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "The job opportunity you're looking for might have been removed or doesn't exist."}
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-blue-900 font-semibold hover:underline"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Job Board
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="grow container mx-auto px-4 py-8 lg:py-12">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-900 transition mb-8 font-medium group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Career Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      {job.type}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        Posted on{' '}
                        {new Date(job.createdAt).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 font-medium mt-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-600" />
                      <span className="text-lg">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${id}/edit`}
                      className="p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition border border-blue-100 flex items-center gap-2 font-semibold text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-100 flex items-center gap-2 font-semibold text-sm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-900" />
                Job Description
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                <Linkify text={job.description} />
              </div>
            </motion.div>

            {/* Requirements Section */}
            {job.requirements && job.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-900 text-white text-xs">
                    ★
                  </span>
                  Key Requirements
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                      <span className="text-gray-700 font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-blue-900 rounded-2xl p-8 text-white shadow-xl sticky top-24"
            >
              <h3 className="text-xl font-bold mb-6">Ready to apply?</h3>

              <div className="space-y-4">
                {job.applicationLink && (
                  <a
                    href={job.applicationLink}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold py-4 px-6 rounded-xl transition shadow-lg group"
                  >
                    <span>Apply on Company Site</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                )}

                {job.contactEmail && (
                  <a
                    href={`mailto:${job.contactEmail}?subject=Application for ${job.title} at ${job.company}`}
                    className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 font-bold py-4 px-6 rounded-xl transition"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email for Details</span>
                  </a>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-blue-200 text-sm mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Opportunity shared by:
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg">
                    {job.postedBy?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">
                      {job.postedBy?.name || 'Anonymous Alumni'}
                    </h4>
                    <p className="text-xs text-blue-300">
                      SVU MCA Alumni Network
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Safety Tip */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm">
                <span className="flex items-center justify-center w-5 h-5 bg-amber-200 rounded-full text-amber-900 text-[10px]">
                  !
                </span>
                Application Tip
              </h4>
              <p className="text-amber-800 text-xs leading-relaxed">
                Mention that you found this through the SVU MCA Alumni Portal to
                leverage your network connections!
              </p>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job opportunity? This action cannot be undone."
        confirmText="Delete Job"
        isLoading={isDeleting}
      />
    </div>
  );
}
