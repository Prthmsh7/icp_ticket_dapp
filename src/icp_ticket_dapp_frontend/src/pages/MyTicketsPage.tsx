import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { icp_ticket_dapp_backend } from "../../../declarations/icp_ticket_dapp_backend";
import { Event, Ticket } from "../types";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaQrcode } from "react-icons/fa";

const MyTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<Map<string, Event>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketsAndEvents = async () => {
      try {
        // Get all tickets for the current user
        const ticketsList = await icp_ticket_dapp_backend.get_my_tickets();
        setTickets(ticketsList);

        // Extract unique event IDs from tickets
        const eventIds = new Set(ticketsList.map((ticket: Ticket) => ticket.event_id.toString()));
        
        // Fetch event details for each event ID
        const eventMap = new Map<string, Event>();
        
        // Convert Set to Array and ensure all elements are strings
        const eventIdArray = Array.from(eventIds).map(id => String(id));
        
        for (const eventId of eventIdArray) {
          try {
            const result = await icp_ticket_dapp_backend.get_event(BigInt(eventId));
            if ('Ok' in result) {
              eventMap.set(eventId, result.Ok);
            }
          } catch (err) {
            console.error(`Error fetching event ${eventId}:`, err);
          }
        }
        
        setEvents(eventMap);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load your tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsAndEvents();
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

  if (tickets.length === 0) {
    return (
      <div className="py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-12">
          My Tickets
        </h1>
        <div className="bg-surface rounded-xl p-8 text-center">
          <h2 className="text-2xl font-display font-semibold mb-4">No Tickets Found</h2>
          <p className="text-gray-300 mb-6">
            You haven't purchased any tickets yet. Browse events to find something you'd like to attend!
          </p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-12">
        My Tickets
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tickets.map((ticket, index) => {
          const event = events.get(ticket.event_id.toString());
          
          return (
            <motion.div
              key={Number(ticket.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={`/tickets/${ticket.id}`} className="block h-full">
                <div className="card h-full hover:shadow-xl transition-shadow">
                  {event && (
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
                  )}
                  <div className="p-6">
                    {event ? (
                      <>
                        <div className="flex items-center text-sm text-gray-300 mb-2">
                          <FaCalendarAlt className="mr-2 text-primary" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300 mb-4">
                          <FaMapMarkerAlt className="mr-2 text-primary" />
                          <span>{event.venue}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 mb-4">Event details not available</p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center text-sm text-gray-300">
                        <FaTicketAlt className="mr-2 text-accent" />
                        <span>Ticket #{Number(ticket.id)}</span>
                      </div>
                      <div className="flex items-center text-sm text-primary">
                        <FaQrcode className="mr-2" />
                        <span>View Pass</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTicketsPage; 