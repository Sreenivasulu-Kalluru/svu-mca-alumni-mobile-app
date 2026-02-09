'use client';

import Header from '@/components/Header';
import { UserCard } from '@/components/UserCard';
import { FilterDropdown } from '@/components/FilterDropdown';
import { Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

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
}

export default function DirectoryPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const userRoles = [
    { value: 'alumni', label: 'Alumni' },
    { value: 'student', label: 'Students' },
  ];

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/users`,
      );
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = users;

    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Hide current user
    if (currentUser) {
      result = result.filter((u) => u._id !== currentUser._id);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.currentCompany?.toLowerCase().includes(term) ||
          user.skills?.some((skill) => skill.toLowerCase().includes(term)),
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Alumni Directory
            </h1>
            <p className="text-gray-600 mt-1">
              Connect with{' '}
              {users.length > 0
                ? users.filter((u) => u._id !== currentUser?._id).length
                : '...'}{' '}
              members of our community
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/register"
              className="bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition shadow-sm text-sm"
            >
              Join Directory
            </Link>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative grow w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, company, or skills..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 bg-white focus:ring-amber-500 focus:border-amber-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Filter className="text-gray-400 w-5 h-5 shrink-0" />
            <FilterDropdown
              label="All Roles"
              value={roleFilter}
              options={userRoles}
              onChange={setRoleFilter}
            />
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <LoadingSpinner message="Searching the directory..." />
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No members found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </main>

      {/* Import Link since it's used in the header actions */}
    </div>
  );
}
