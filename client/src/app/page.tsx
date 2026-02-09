'use client';

import Header from '@/components/Header';
import { Users, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useState, useEffect } from 'react';
import { getImageUrl } from '@/utils/imageHelper';

interface IStory {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

export default function Home() {
  const [jobCount, setJobCount] = useState<number>(0);
  const [storyCount, setStoryCount] = useState<number>(0);
  const [featuredStories, setFeaturedStories] = useState<IStory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, storiesRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`,
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/stories`,
          ),
        ]);

        const jobsData = await jobsRes.json();
        const storiesData = await storiesRes.json();

        setJobCount(jobsData.length);
        setStoryCount(storiesData.length);
        // Get the 2 newest stories for the spotlight
        setFeaturedStories(storiesData.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-sm"
          >
            Connect. Mentor. Grow.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            The official portal for{' '}
            <span className="text-amber-400 font-semibold">
              SV University MCA
            </span>{' '}
            Alumni and Students. Bridging the gap between generations of tech
            excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register?role=alumni"
              className="px-8 py-4 bg-amber-600 text-white rounded-lg font-bold text-lg hover:bg-amber-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              I am an Alumni
            </Link>
            <Link
              href="/register?role=student"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-lg font-bold text-lg hover:bg-white/20 transition"
            >
              I am a Student
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Join the Network?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Empowering our community through connection and opportunity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FeatureCard
                icon={<Briefcase className="w-10 h-10 text-blue-600" />}
                title="Job Opportunities"
                description="Access exclusive job listings and internships posted by alumni in top tech companies like Google, Microsoft, and Infosys."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FeatureCard
                icon={<Users className="w-10 h-10 text-amber-600" />}
                title="Mentorship"
                description="Connect with seniors for guidance on career paths, resume reviews, and mock interviews."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FeatureCard
                icon={<Calendar className="w-10 h-10 text-purple-600" />}
                title="Events & Reunions"
                description="Never miss a meetup. Stay updated on department events, tech workshops, and alumni reunions."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alumni Spotlight */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Alumni Spotlight
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Celebrating the achievements of our distinguished graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
              <Link key={story._id} href="/stories" className="group">
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition h-full flex flex-col">
                  <div className="h-64 bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-4xl font-bold opacity-20">
                        {new Date(story.createdAt).getFullYear()}
                      </span>
                    </div>
                    {story.image && (
                      <div className="absolute inset-0">
                        <Image
                          src={getImageUrl(story.image) || ''}
                          alt={story.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                      <h3 className="text-xl font-bold">{story.name}</h3>
                      <p className="opacity-90">
                        {story.role} @ {story.company}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 grow">
                    <p className="text-gray-600 line-clamp-3">
                      &quot;{story.content}&quot;
                    </p>
                    <span className="inline-block mt-4 text-blue-600 font-medium group-hover:underline">
                      Read Story &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* If zero or one story, we can show placeholders or just the "Share Your Story" card */}
            {featuredStories.length < 2 && featuredStories.length === 0 && (
              <>
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-gray-400">
                    Inspiring stories coming soon...
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-gray-400">Join our wall of fame!</p>
                </div>
              </>
            )}
            {featuredStories.length === 1 && (
              <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                <p className="text-gray-400">Be the next spotlight!</p>
              </div>
            )}

            <Link href="/stories" className="group">
              <div className="bg-blue-900 rounded-2xl overflow-hidden border border-blue-800 hover:shadow-lg transition h-full flex flex-col items-center justify-center text-center p-8 text-white relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">
                  Have an inspiring journey?
                </h3>
                <p className="text-blue-100 mb-8 relative z-10">
                  Share your success story and inspire the next generation of
                  students.
                </p>
                <span className="bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition shadow-lg relative z-10">
                  Share Your Story
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat number="1500+" label="Alumni" delay={0.1} />
          <Stat number={`${storyCount}+`} label="Success Stories" delay={0.2} />
          <Stat number={`${jobCount}+`} label="Jobs Posted" delay={0.3} />
          <Stat number="1995" label="Est. Year" delay={0.4} />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({
  number,
  label,
  delay = 0,
}: {
  number: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-4xl md:text-5xl font-black text-amber-500 mb-2">
        <AnimatedCounter
          value={parseInt(number.replace(/\D/g, ''))}
          suffix={
            number.replace(/[0-9]/g, '') || (number.includes('+') ? '+' : '')
          }
        />
      </div>
      <div className="text-blue-200 font-medium">{label}</div>
    </motion.div>
  );
}
