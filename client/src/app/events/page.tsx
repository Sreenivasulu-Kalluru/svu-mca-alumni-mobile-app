'use client';

import { EventCard } from '@/components/EventCard';
import { FilterDropdown } from '@/components/FilterDropdown';
import Header from '@/components/Header';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'Reunion' | 'Workshop' | 'Webinar' | 'Meetup';
  organizer: {
    name: string;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('all');
  const [view, setView] = useState<'upcoming' | 'all'>('upcoming');
  const eventTypes = ['Reunion', 'Workshop', 'Webinar', 'Meetup'];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;

    if (view === 'upcoming') {
      const now = new Date();
      result = result.filter((event) => new Date(event.date) >= now);
    }

    if (typeFilter !== 'all') {
      result = result.filter((event) => event.type === typeFilter);
    }

    setFilteredEvents(result);
  }, [view, typeFilter, events]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/events`,
      );
      const data = await res.json();
      setEvents(data);
      // Automatically filter for upcoming initially
      const now = new Date();
      setFilteredEvents(data.filter((e: Event) => new Date(e.date) >= now));
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Events & Meetups
            </h1>
            <p className="text-gray-600 mt-1">
              Join workshops, reunions, and networking sessions
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/events/new"
              className="bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition shadow-sm text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-[280px] relative">
            <div
              className={`absolute h-[calc(100%-8px)] top-1 rounded-md bg-white shadow-sm transition-all duration-300 ease-in-out ${
                view === 'upcoming'
                  ? 'left-1 w-[calc(50%-4px)]'
                  : 'left-[calc(50%+4px)] w-[calc(50%-8px)]'
              }`}
            ></div>
            <button
              onClick={() => setView('upcoming')}
              className={`flex-1 relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 text-center ${
                view === 'upcoming'
                  ? 'text-blue-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setView('all')}
              className={`flex-1 relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 text-center ${
                view === 'all'
                  ? 'text-blue-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Events
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />

            <FilterDropdown
              label="All Types"
              value={typeFilter}
              options={eventTypes}
              onChange={setTypeFilter}
            />
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <LoadingSpinner message="Finding events..." />
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No events found
            </h3>
            <p className="text-gray-500">
              Check back later or organize one yourself!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
