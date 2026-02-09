'use client';

import { motion } from 'framer-motion';

export default function AuthTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}
