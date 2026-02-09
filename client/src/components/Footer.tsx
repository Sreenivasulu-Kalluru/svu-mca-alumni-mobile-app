'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 flex-none ring-2 ring-white/50">
            <Image
              src="/svu logo.jpeg"
              alt="SVU Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <span className="text-xl font-bold text-gray-900">
            SVU MCA Department
          </span>
        </div>
        <p className="mb-4">
          © {new Date().getFullYear()} SV University. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Link
            href="/privacy"
            className="hover:text-blue-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
