'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'amber';
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  message,
  fullPage = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-8',
  };

  const colorClasses = {
    primary: 'border-blue-900 border-t-transparent',
    white: 'border-white border-t-transparent',
    amber: 'border-amber-500 border-t-transparent',
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center py-12 w-full';

  return (
    <div className={containerClasses}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full shadow-sm`}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 font-medium ${
            color === 'white' ? 'text-white' : 'text-gray-600'
          }`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
