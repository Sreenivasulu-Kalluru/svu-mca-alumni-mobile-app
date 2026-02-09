'use client';

import Header from '@/components/Header';
import { BookOpen, Users, Trophy, Target } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow">
        {/* Hero Section */}
        <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Department of Computer Science
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
            >
              Empowering students with advanced technical skills and specialized
              knowledge to become leaders in the IT industry since 1993.
            </motion.p>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.svuniversity.edu.in/images/svu-campus.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        </div>

        {/* Vision & Mission */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To be a center of excellence in Computer Science education and
                research, producing globally competent professionals with strong
                ethical values and a commitment to social responsibility.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To provide quality education through innovative
                teaching-learning methodologies, promote research and
                development, and foster industry-institute interaction to
                prepare students for dynamic career challenges.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-16 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-900 mb-2">
                  <AnimatedCounter value={30} suffix="+" />
                </div>
                <div className="text-gray-500 font-medium">
                  Years of Excellence
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-900 mb-2">
                  <AnimatedCounter value={1500} suffix="+" />
                </div>
                <div className="text-gray-500 font-medium">Alumni Network</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-900 mb-2">
                  <AnimatedCounter value={15} suffix="+" />
                </div>
                <div className="text-gray-500 font-medium">Expert Faculty</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-900 mb-2">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <div className="text-gray-500 font-medium">
                  Placement Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty & Resources */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                World-Class Faculty & Infrastructure
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our department boasts a team of highly qualified and experienced
                faculty members dedicated to student success. We provide
                state-of-the-art computer labs, a well-stocked library, and
                modern classrooms to facilitate an optimal learning environment.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  Specialized Research Labs
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Users className="w-3 h-3" />
                  </div>
                  Guest Lectures from Industry Experts
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Trophy className="w-3 h-3" />
                  </div>
                  Regular Technical Symposiums
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-blue-100 to-amber-100 rounded-2xl transform rotate-3"></div>
              <div className="bg-white p-8 rounded-2xl shadow-lg relative border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Us
                </h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    <strong className="block text-gray-900">Address:</strong>
                    Department of Computer Science,
                    <br />
                    Sri Venkateswara University,
                    <br />
                    Tirupati, Andhra Pradesh - 517502
                  </p>
                  <p>
                    <strong className="block text-gray-900">Email:</strong>
                    head.mca@svuniversity.edu.in
                  </p>
                  <p>
                    <strong className="block text-gray-900">Phone:</strong>
                    +91 877 228 9xxx
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
