import UserAvatar from './UserAvatar';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  name: string;
  role: 'student' | 'alumni' | 'admin';
  batch: string;
  currentCompany?: string;
  designation?: string;
  skills: string[];
  linkedinProfile?: string;
  githubProfile?: string;
  email: string;
  profilePicture?: string; // Ensure this is included
}

export function UserCard({ user }: { user: User }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} className="w-12 h-12" size={48} />
          <div>
            <h3 className="font-bold text-gray-900">{user.name}</h3>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                user.role === 'alumni'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {user.role === 'alumni' ? 'Alumni' : 'Student'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {user.role === 'alumni' && user.currentCompany && (
          <p className="text-sm text-gray-600">
            {user.designation} at{' '}
            <span className="font-semibold text-gray-800">
              {user.currentCompany}
            </span>
          </p>
        )}
        <p className="text-sm text-gray-500">Batch of {user.batch}</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {user.skills?.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-200"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        {user.linkedinProfile && (
          <Link
            href={user.linkedinProfile}
            target="_blank"
            className="text-gray-400 hover:text-[#0077b5]"
          >
            <Linkedin className="w-5 h-5" />
          </Link>
        )}
        {user.githubProfile && (
          <Link
            href={user.githubProfile}
            target="_blank"
            className="text-gray-400 hover:text-[#333]"
          >
            <Github className="w-5 h-5" />
          </Link>
        )}
        <Link
          href={`mailto:${user.email}`}
          className="text-gray-400 hover:text-red-500"
        >
          <Mail className="w-5 h-5" />
        </Link>
        <Link
          href={`/chat?userId=${user._id}`}
          className="text-gray-400 hover:text-indigo-500"
          title="Message"
        >
          <MessageCircle className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}
