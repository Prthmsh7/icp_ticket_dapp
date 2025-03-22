import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { icp_ticket_dapp_backend } from "../../../declarations/icp_ticket_dapp_backend";
import { Event, Ticket } from "../types";
import { FaCalendarAlt, FaMapMarkerAlt, FaVrCardboard } from "react-icons/fa";
import QRCode from 'react-qr-code';

const TicketDetailsPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketAndEvent = async () => {
      if (!ticketId) {
        setError("Invalid ticket ID");
        setLoading(false);
        return;
      }

      try {
        // Get ticket details
        const ticketResult = await icp_ticket_dapp_backend.get_ticket(BigInt(ticketId));
        
        if ('Err' in ticketResult) {
          setError(`Could not find ticket: ${ticketResult.Err}`);
          setLoading(false);
          return;
        }
        
        const ticketData = ticketResult.Ok;
        setTicket(ticketData);
        
        // Get event details for this ticket
        const eventResult = await icp_ticket_dapp_backend.get_event(ticketData.event_id);
        
        if ('Ok' in eventResult) {
          setEvent(eventResult.Ok);
        }
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to load ticket details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketAndEvent();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="bg-surface rounded-xl p-8 text-center my-12">
        <h2 className="text-2xl font-display font-semibold text-error mb-4">Error</h2>
        <p className="text-gray-300 mb-6">{error || "Ticket not found"}</p>
        <button
          onClick={() => window.history.back()}
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-surface rounded-xl overflow-hidden">
          {event && (
            <div className="relative h-48 md:h-64">
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{event.name}</h1>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-display font-semibold mb-4">Ticket Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Ticket ID</div>
                    <div className="font-medium">#{Number(ticket.id)}</div>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Purchase Date</div>
                    <div className="font-medium">
                      {new Date(Number(ticket.purchase_date) / 1000000).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Status</div>
                    <div className={`font-medium ${ticket.is_used ? 'text-gray-400' : 'text-green-400'}`}>
                      {ticket.is_used ? 'Used' : 'Valid'}
                    </div>
                  </div>
                </div>
              </div>
              
              {event && (
                <div>
                  <h2 className="text-xl font-display font-semibold mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaCalendarAlt className="mr-3 mt-1 text-primary" />
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Date & Time</div>
                        <div className="font-medium">{event.date}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="mr-3 mt-1 text-primary" />
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Venue</div>
                        <div className="font-medium">{event.venue}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Description</div>
                      <p className="text-gray-300">{event.description}</p>
                    </div>
                    
                    {event.ar_model_url && typeof event.ar_model_url === 'string' && (
                      <button className="flex items-center text-accent">
                        <FaVrCardboard className="mr-2" />
                        <span>View AR Experience</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-lg mb-4 w-full max-w-[240px]">
                <QRCode
                  value={ticket.qr_code}
                  size={200}
                  level="H"
                  className="w-full h-auto"
                />
              </div>
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-400">Present this QR code at the venue</div>
                <div className="text-xs text-gray-500">This ticket is non-transferable</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketDetailsPage; 