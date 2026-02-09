import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col"
    >
      <div className="h-32 bg-linear-to-r from-blue-900 to-indigo-800 relative p-6 flex flex-col justify-end">
        <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
          {event.type}
        </span>
        <h3 className="text-xl font-bold text-white leading-tight">
          {event.title}
        </h3>
      </div>

      <div className="p-6 flex flex-col grow gap-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {eventDate.toLocaleDateString()}
            </p>
            <p className="text-xs">
              {eventDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="font-medium">{event.location}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
          {event.description}
        </p>

        <div className="mt-auto pt-4 flex gap-2">
          <Link
            href={`/events/detail?id=${event._id}`}
            className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Details
          </Link>
          <button className="flex-1 bg-blue-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm">
            Register
          </button>
        </div>
      </div>
    </motion.div>
  );
}
