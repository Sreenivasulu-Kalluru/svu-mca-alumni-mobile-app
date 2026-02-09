'use client';

import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import AuthTransition from '@/components/AuthTransition';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get('role') === 'alumni' ? 'alumni' : 'student';
  const [role, setRole] = useState(initialRole);
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    batch: '',
    // Student specific
    rollNumber: '',
    // Alumni specific
    company: '',
    designation: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, ...formData }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        register(data);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-white/50">
      <div className="text-center">
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Join the SVU MCA Community to connect and grow.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-center justify-center">
          {error}
        </div>
      )}

      <div className="flex p-1 bg-gray-100/80 rounded-xl relative">
        <div
          className={`absolute h-[calc(100%-8px)] top-1 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out ${
            role === 'student'
              ? 'left-1 w-[calc(50%-4px)]'
              : 'left-[calc(50%+4px)] w-[calc(50%-8px)]'
          }`}
        ></div>
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
            role === 'student'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          I am a Student
        </button>
        <button
          type="button"
          onClick={() => setRole('alumni')}
          className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
            role === 'alumni'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          I am an Alumni
        </button>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col xl:grid xl:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all pr-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all pr-10"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Batch (Year)
            </label>
            <input
              name="batch"
              type="text"
              placeholder="e.g. 2023-2025"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
              value={formData.batch}
              onChange={handleChange}
            />
          </div>

          {role === 'student' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Roll Number
              </label>
              <input
                name="rollNumber"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="e.g. 123456"
                value={formData.rollNumber}
                onChange={handleChange}
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Current Company
                </label>
                <input
                  name="company"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Designation
                </label>
                <input
                  name="designation"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition shadow-lg disabled:bg-gray-400"
        >
          {loading
            ? 'Creating Account...'
            : `Create ${role === 'student' ? 'Student' : 'Alumni'} Account`}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-900 hover:text-amber-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-amber-50 flex flex-col font-sans">
      <Header />
      <div className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-2xl w-full relative z-10">
          <Suspense
            fallback={<div className="flex justify-center p-8">Loading...</div>}
          >
            <AuthTransition>
              <RegisterForm />
            </AuthTransition>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
