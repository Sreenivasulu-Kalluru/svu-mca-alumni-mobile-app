'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { FilterDropdown } from '@/components/FilterDropdown';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Meetup',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/events/${id}`,
        );
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();

        // Authorization check
        if (user && data.organizer._id !== user._id) {
          router.push('/events');
          return;
        }

        const eventDate = new Date(data.date);
        setFormData({
          title: data.title,
          description: data.description,
          date: eventDate.toISOString().split('T')[0],
          time: eventDate.toTimeString().slice(0, 5),
          location: data.location,
          type: data.type,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchEvent();
    }
  }, [id, user, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!user) return;

    try {
      const eventDateTime = new Date(`${formData.date}T${formData.time}`);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/events/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...formData,
            date: eventDateTime,
          }),
        },
      );

      if (res.ok) {
        router.push(`/events/${id}`);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update event');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching event details..." />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl mb-6">
          <Link
            href={`/events/${id}`}
            className="text-gray-500 hover:text-gray-900 mb-6 inline-flex items-center gap-1 transition"
          >
            <ChevronLeft size={16} /> Back to Event
          </Link>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Event Title
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="e.g. Alumni Meetup 2024"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Date
                </label>
                <input
                  required
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Time
                </label>
                <input
                  required
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  type="time"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Location
                </label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g. Main Auditorium or Virtual Link"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Event Type
                </label>
                <FilterDropdown
                  value={formData.type}
                  options={['Meetup', 'Reunion', 'Workshop', 'Webinar']}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  showDefaultOption={false}
                  width="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Details about the event agenda..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={20} className="animate-spin" />}
                {submitting ? 'Updating Event...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
