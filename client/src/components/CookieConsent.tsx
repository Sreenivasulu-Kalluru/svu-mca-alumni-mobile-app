'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    // Just close for this session without saving preference if they just X out?
    // Or treat as decline? Let's just close it for now.
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:flex items-center justify-between gap-6">
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full shrink-0 animate-bounce">
                <Cookie size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  We value your privacy
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We use cookies to enhance your experience, analyze site usage,
                  and assist in our marketing efforts. By using our site, you
                  consent to our use of cookies.
                  <Link
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-700 font-medium ml-1 underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={handleDecline}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg shadow-gray-200 transition transform hover:-translate-y-0.5"
              >
                Accept All
              </button>
            </div>

            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 md:hidden"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
