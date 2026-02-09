'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { Briefcase, Calendar, Users, User, ArrowRight } from 'lucide-react';
import Feed from '@/components/Feed';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Preparing your dashboard..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            {welcomeMessage()}, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to your alumni portal dashboard. Here&apos;s what&apos;s
            happening today.
          </p>
        </motion.div>

        {/* Quick Stats / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Jobs Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/jobs"
              className="group block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 ease-in-out h-full"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Job Board
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Explore career opportunities and network with companies.
              </p>
              <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all duration-300 ease-in-out">
                Browse Jobs <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>

          {/* Events Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/events"
              className="group block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-100 transition-all duration-300 ease-in-out h-full"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                Events & Meetups
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Join upcoming reunions, workshops, and webinars.
              </p>
              <div className="flex items-center text-amber-600 font-medium text-sm group-hover:gap-2 transition-all duration-300 ease-in-out">
                Find Events <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>

          {/* Directory Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/directory"
              className="group block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 ease-in-out h-full"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                Alumni Directory
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Connect with fellow students and alumni from your batch.
              </p>
              <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all duration-300 ease-in-out">
                Search Directory <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/profile"
              className="group block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-300 ease-in-out h-full"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                My Profile
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Update your professional details and manage your account.
              </p>
              <div className="flex items-center text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all duration-300 ease-in-out">
                View Profile <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Community Feed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <Feed />
        </motion.div>
      </main>
    </div>
  );
}
