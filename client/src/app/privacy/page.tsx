'use client';

import Header from '@/components/Header';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-900">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>

          <div className="prose prose-blue prose-lg max-w-none text-gray-600 space-y-6">
            <p className="text-xl leading-relaxed">
              At SVU MCA Alumni Portal, we are committed to protecting your
              privacy. This policy explains how we collect and handle your
              personal information.
            </p>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Information Collection
              </h2>
              <p>
                We collect information you provide during registration, such as
                your name, email address, graduation year, and professional
                details. This allows us to provide a personalized networking
                experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                How We Use Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  To maintain the alumni directory and facilitate networking.
                </li>
                <li>
                  To send updates about events, jobs, and department news.
                </li>
                <li>To improve our services based on community feedback.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Data Protection
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                data. Your password is encrypted, and sensitive information is
                never shared without your consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Rights
              </h2>
              <p>
                You can update your profile or delete your account at any time
                through your settings. For any data-related requests, please
                contact the department.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
