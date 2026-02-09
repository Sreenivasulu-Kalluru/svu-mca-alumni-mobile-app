'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageHelper';
import {
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-900"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 flex-none ring-2 ring-white/50">
            <Image
              src="/svu logo.jpeg"
              alt="SVU Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="hidden md:block">SVU MCA Alumni</span>
          <span className="items-center md:hidden">SVU MCA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-700">
          <Link href="/jobs" className="hover:text-amber-600 transition">
            Job Board
          </Link>
          <Link href="/directory" className="hover:text-amber-600 transition">
            Alumni Directory
          </Link>
          <Link href="/events" className="hover:text-amber-600 transition">
            Events
          </Link>
          <Link href="/about" className="hover:text-amber-600 transition">
            About Department
          </Link>
          <Link href="/stories" className="hover:text-amber-600 transition">
            Success Stories
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-900 focus:outline-none"
              >
                {user.profilePicture ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-200">
                    <Image
                      src={getImageUrl(user.profilePicture) || ''}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold border border-blue-200">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block">{user.name || 'User'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animation-fade-in-down origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/stories"
                className="text-sm font-medium text-gray-700 hover:text-amber-600 transition"
              >
                Success Stories
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-black hover:underline"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition shadow-sm hover:shadow"
              >
                Join Network
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg animate-slide-down z-50">
          <nav className="flex flex-col gap-4">
            <Link
              href="/jobs"
              className="text-base font-medium text-gray-700 hover:text-blue-900 py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Job Board
            </Link>
            <Link
              href="/directory"
              className="text-base font-medium text-gray-700 hover:text-blue-900 py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alumni Directory
            </Link>
            <Link
              href="/events"
              className="text-base font-medium text-gray-700 hover:text-blue-900 py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-gray-700 hover:text-blue-900 py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Department
            </Link>
            <Link
              href="/stories"
              className="text-base font-medium text-gray-700 hover:text-blue-900 py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Success Stories
            </Link>
            {!user && (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Network
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
