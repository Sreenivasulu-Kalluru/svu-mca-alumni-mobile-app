import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export function JobCard({ job }: { job: Job }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition flex flex-col items-start gap-4"
    >
      <div className="w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
            <p className="font-medium text-amber-600">{job.company}</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
            {job.type}
          </span>
        </div>

        <div className="flex gap-4 mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

      <div className="flex gap-2 mt-auto w-full pt-4 border-t border-gray-50">
        {job.applicationLink && (
          <Link
            href={job.applicationLink}
            target="_blank"
            className="flex-1 bg-blue-900 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
          >
            Apply Now
          </Link>
        )}
        {job.contactEmail && !job.applicationLink && (
          <a
            href={`mailto:${job.contactEmail}`}
            className="flex-1 bg-blue-900 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
          >
            Email Contact
          </a>
        )}
        <Link
          href={`/jobs/detail?id=${job._id}`}
          className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Details
        </Link>
      </div>
    </motion.div>
  );
}
