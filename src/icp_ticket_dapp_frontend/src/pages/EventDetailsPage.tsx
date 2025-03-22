import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { icp_ticket_dapp_backend } from "../../../declarations/icp_ticket_dapp_backend";
import { Event, EventDetailsPageProps } from "../types";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaVrCardboard } from "react-icons/fa";

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ isAuthenticated }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        const result = await icp_ticket_dapp_backend.get_event(BigInt(eventId));
        
        if ("Err" in result) {
          setError("Event not found");
        } else if ("Ok" in result) {
          setEvent(result.Ok);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const purchaseTicket = async () => {
    if (!eventId || !isAuthenticated) return;
    
    setPurchaseLoading(true);
    setPurchaseError(null);
    
    try {
      const result = await icp_ticket_dapp_backend.mint_ticket(BigInt(eventId));
      
      if ("Err" in result) {
        setPurchaseError(result.Err);
      } else if ("Ok" in result) {
        setPurchaseSuccess(true);
        // Update the event tickets sold count
        if (event) {
          setEvent({
            ...event,
            tickets_sold: event.tickets_sold + BigInt(1)
          });
        }
        
        // Navigate to the ticket details page after a short delay
        setTimeout(() => {
          navigate(`/tickets/${result.Ok.id}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Error purchasing ticket:", err);
      setPurchaseError("Failed to purchase ticket. Please try again.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-surface rounded-xl p-8 text-center my-12">
        <h2 className="text-2xl font-display font-semibold text-error mb-4">Error</h2>
        <p className="text-gray-300 mb-6">{error || "Event not found"}</p>
        <button
          onClick={() => navigate("/events")}
          className="btn btn-primary"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const soldOut = event.tickets_sold >= event.total_tickets;
  const remainingTickets = Number(event.total_tickets - event.tickets_sold);

  return (
    <div className="py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/events")}
          className="text-gray-400 hover:text-white flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={event.image_url}
              alt={event.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {event.name}
              </h1>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 mt-8">
            <h2 className="text-xl font-display font-semibold mb-4">Event Description</h2>
            <p className="text-gray-300 whitespace-pre-line">{event.description}</p>

            {event.ar_model_url && typeof event.ar_model_url === "string" && (
              <div className="mt-8">
                <h2 className="text-xl font-display font-semibold mb-4 flex items-center">
                  <FaVrCardboard className="mr-2 text-accent" />
                  AR Experience
                </h2>
                <p className="text-gray-300 mb-4">
                  This event includes an AR experience. Purchase a ticket to view it!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-surface rounded-xl p-6 sticky top-8">
            <h2 className="text-xl font-display font-semibold mb-6">Event Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-300">
                <FaCalendarAlt className="mr-3 text-primary w-5 h-5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="mr-3 text-primary w-5 h-5" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaTicketAlt className="mr-3 text-primary w-5 h-5" />
                <span>
                  {Number(event.tickets_sold)}/{Number(event.total_tickets)} Tickets Sold
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Price per Ticket:</span>
                <span className="text-xl font-semibold text-primary">
                  {Number(event.ticket_price)} ICP
                </span>
              </div>
              
              {!soldOut && (
                <div className="text-sm text-accent mb-6">
                  Only {remainingTickets} tickets remaining!
                </div>
              )}
            </div>
            
            {purchaseSuccess ? (
              <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-center mb-6">
                <div className="text-green-500 font-semibold mb-1">Ticket purchased successfully!</div>
                <div className="text-sm text-gray-300">Redirecting to your ticket...</div>
              </div>
            ) : purchaseError ? (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center mb-6">
                <div className="text-red-500 font-semibold">Purchase failed</div>
                <div className="text-sm text-gray-300">{purchaseError}</div>
              </div>
            ) : null}
            
            <button
              onClick={purchaseTicket}
              disabled={!isAuthenticated || soldOut || purchaseLoading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                !isAuthenticated
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : soldOut
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-600 text-white"
              }`}
            >
              {purchaseLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : !isAuthenticated ? (
                "Login to Purchase"
              ) : soldOut ? (
                "Sold Out"
              ) : (
                "Purchase Ticket"
              )}
            </button>
            
            {!isAuthenticated && (
              <div className="text-sm text-center mt-4 text-gray-400">
                You need to login with Internet Identity to purchase tickets
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailsPage; 