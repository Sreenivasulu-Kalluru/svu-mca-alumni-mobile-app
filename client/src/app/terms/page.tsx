'use client';

import Header from '@/components/Header';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
          </div>

          <div className="prose prose-amber prose-lg max-w-none text-gray-600 space-y-6">
            <p className="text-xl leading-relaxed">
              By using the SVU MCA Alumni Portal, you agree to the following
              terms and conditions.
            </p>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Community Guidelines
              </h2>
              <p>
                Our portal is a professional space for networking and growth. We
                expect all members to behave respectfully. Harassment, spam, or
                offensive content will not be tolerated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Accurate Information
              </h2>
              <p>
                You agree to provide true and accurate information during
                registration. Impersonation of other alumni or students is
                strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Board Usage
              </h2>
              <p>
                Job posters must provide valid opportunities. The portal is a
                platform for sharing; we do not guarantee employment or vouch
                for the accuracy of external postings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Termination
              </h2>
              <p>
                The SVU MCA Department reserves the right to suspend or
                terminate accounts that violate these terms or the principles of
                the department community.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
