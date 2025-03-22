import React, { useEffect, useState } from "react";
import { icp_ticket_dapp_backend } from "../../../declarations/icp_ticket_dapp_backend";
import { Event } from "../types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsList = await icp_ticket_dapp_backend.get_all_events();
        setEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-xl p-8 text-center my-12">
        <h2 className="text-2xl font-display font-semibold text-error mb-4">Error</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-12">
        Upcoming Events
      </h1>

      {events.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center">
          <h2 className="text-2xl font-display font-semibold mb-4">No Events Found</h2>
          <p className="text-gray-300 mb-6">
            There are no events available at the moment. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={Number(event.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={`/events/${event.id}`} className="block h-full">
                <div className="card h-full flex flex-col hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={event.image_url}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h2 className="text-xl font-display font-semibold text-white">{event.name}</h2>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center text-sm text-gray-300">
                        <FaCalendarAlt className="mr-2 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <FaMapMarkerAlt className="mr-2 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                        <div className="text-primary font-semibold">{Number(event.ticket_price)} ICP</div>
                        <div className="flex items-center text-sm text-gray-300">
                          <FaTicketAlt className="mr-1.5 text-accent" />
                          <span>
                            {Number(event.tickets_sold)}/{Number(event.total_tickets)} Tickets
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage; 