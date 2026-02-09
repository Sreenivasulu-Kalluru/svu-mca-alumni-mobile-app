'use client';

import Header from '@/components/Header';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Edit2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ConfirmationModal from '@/components/ConfirmationModal';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'Reunion' | 'Workshop' | 'Webinar' | 'Meetup';
  organizer: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          }/api/events/${params.id}`,
        );
        if (!res.ok) {
          throw new Error('Event not found');
        }
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!user || !event) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/events/${event._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (res.ok) {
        router.push('/events');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <div className="grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <div className="grow flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/events"
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/events"
          className="inline-flex items-center text-gray-600 hover:text-blue-900 transition mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="h-48 md:h-64 bg-linear-to-r from-blue-900 to-indigo-800 relative p-8 flex items-end">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30">
                {event.type}
              </span>
            </div>
            <div className="relative z-10 w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {event.title}
              </h1>
            </div>
            {user?._id === event.organizer._id && (
              <div className="absolute top-4 left-4 flex gap-2">
                <Link
                  href={`/events/${event._id}/edit`}
                  className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition border border-white/30"
                  title="Edit Event"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-red-500/50 transition border border-white/30"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Content */}
              <div className="grow space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                    About Event
                  </h3>
                  <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                    Organizer
                  </h3>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xl">
                      {(event.organizer.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {event.organizer.name}
                      </p>
                      <p className="text-sm text-gray-500">Event Coordinator</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="md:w-80 shrink-0 space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(event.date).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="font-semibold text-gray-900">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <button className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-900 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition shadow-sm">
                    <Share2 className="w-4 h-4" />
                    Share Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
    </div>
  );
}
