'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { JobCard } from '@/components/JobCard';
import { FilterDropdown } from '@/components/FilterDropdown';
import { Search, MapPin, Briefcase, Plus } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  };
}

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Remote'];

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (typeFilter !== 'all') {
      result = result.filter((job) => job.type === typeFilter);
    }

    if (locationFilter) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.requirements.some((req) => req.toLowerCase().includes(term)),
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, typeFilter, locationFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`,
      );
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <p className="text-gray-600 mt-1">
              Explore career opportunities shared by alumni
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/jobs/new"
              className="bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition shadow-sm text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search title, company..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 bg-white focus:ring-amber-500 focus:border-amber-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by location..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 bg-white focus:ring-amber-500 focus:border-amber-500 outline-none"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <FilterDropdown
            label="All Job Types"
            value={typeFilter}
            options={jobTypes}
            onChange={setTypeFilter}
            icon={Briefcase}
            width="w-full"
          />
        </div>

        {/* Job List */}
        {loading ? (
          <LoadingSpinner message="Searching for opportunities..." />
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No jobs found
            </h3>
            <p className="text-gray-500">
              Be the first to post an opportunity!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
