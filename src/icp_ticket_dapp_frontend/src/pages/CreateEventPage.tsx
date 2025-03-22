import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icp_ticket_dapp_backend } from "../../../declarations/icp_ticket_dapp_backend";
import { CreateEventPayload } from "../types";
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaImage, FaVrCardboard, FaInfoCircle } from "react-icons/fa";

// Sample locations for the dropdown
const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Other"
];

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateEventPayload>({
    name: "",
    description: "",
    venue: "",
    date: "",
    ticket_price: BigInt(0),
    total_tickets: BigInt(0),
    image_url: "",
    ar_model_url: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState<string>("");
  const [showCustomLocation, setShowCustomLocation] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "ticket_price" || name === "total_tickets") {
      try {
        const bigIntValue = value === "" ? BigInt(0) : BigInt(value);
        setFormData((prev) => ({ ...prev, [name]: bigIntValue }));
      } catch (err) {
        // Ignore invalid number inputs
      }
    } else if (name === "venue") {
      if (value === "Other") {
        setShowCustomLocation(true);
      } else {
        setShowCustomLocation(false);
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCustomLocation(value);
    setFormData((prev) => ({ ...prev, venue: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert the AR model URL to an optional type as expected by the backend
      const arModelUrl = formData.ar_model_url && formData.ar_model_url.trim() !== "" 
        ? formData.ar_model_url 
        : [];
        
      const result = await icp_ticket_dapp_backend.create_event(
        formData.name,
        formData.description,
        formData.venue,
        formData.date,
        formData.ticket_price,
        formData.total_tickets,
        formData.image_url,
        arModelUrl
      );
      
      if ("Err" in result) {
        setError("Failed to create event");
      } else if ("Ok" in result) {
        // Redirect to the newly created event
        navigate(`/events/${result.Ok}`);
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setError("An error occurred while creating the event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Event name is required");
      return false;
    }
    
    if (!formData.description.trim()) {
      setError("Event description is required");
      return false;
    }
    
    if (!formData.venue.trim()) {
      setError("Event venue is required");
      return false;
    }
    
    if (!formData.date.trim()) {
      setError("Event date is required");
      return false;
    }
    
    if (formData.ticket_price < BigInt(0)) {
      setError("Ticket price must be a positive number");
      return false;
    }
    
    if (formData.total_tickets <= BigInt(0)) {
      setError("Total tickets must be greater than zero");
      return false;
    }
    
    if (!formData.image_url.trim()) {
      setError("Event image URL is required");
      return false;
    }
    
    return true;
  };

  // Format date string for datetime-local input
  const formatDateForInput = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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

      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Create New Event</h1>

      <div className="bg-surface rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FaInfoCircle className="text-red-500 mr-2" />
              <span className="text-red-500">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Event Name*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaTicketAlt className="text-gray-500" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-800 border border-gray-700 rounded-md w-full pl-10 px-4 py-2 text-white focus:ring-primary focus:border-primary"
                placeholder="Enter event name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="bg-gray-800 border border-gray-700 rounded-md w-full px-4 py-2 text-white focus:ring-primary focus:border-primary"
              placeholder="Describe your event"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">
                Venue*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-500" />
                </div>
                <select
                  id="venue"
                  name="venue"
                  value={showCustomLocation ? "Other" : formData.venue}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-md w-full pl-10 px-4 py-2 text-white focus:ring-primary focus:border-primary appearance-none"
                >
                  <option value="">Select a location</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {showCustomLocation && (
                <div className="mt-2">
                  <input
                    type="text"
                    id="customLocation"
                    value={customLocation}
                    onChange={handleCustomLocationChange}
                    className="bg-gray-800 border border-gray-700 rounded-md w-full px-4 py-2 text-white focus:ring-primary focus:border-primary"
                    placeholder="Enter custom location"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                Date and Time*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaCalendar className="text-gray-500" />
                </div>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date || formatDateForInput()}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-md w-full pl-10 px-4 py-2 text-white focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ticket_price" className="block text-sm font-medium text-gray-300 mb-1">
                Ticket Price (ICP)*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">ICP</span>
                </div>
                <input
                  type="number"
                  id="ticket_price"
                  name="ticket_price"
                  value={Number(formData.ticket_price)}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="bg-gray-800 border border-gray-700 rounded-md w-full pl-12 px-4 py-2 text-white focus:ring-primary focus:border-primary"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="total_tickets" className="block text-sm font-medium text-gray-300 mb-1">
                Total Tickets*
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="total_tickets"
                  name="total_tickets"
                  value={Number(formData.total_tickets)}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  className="bg-gray-800 border border-gray-700 rounded-md w-full px-4 py-2 text-white focus:ring-primary focus:border-primary"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-300 mb-1">
              Event Image URL*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaImage className="text-gray-500" />
              </div>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="bg-gray-800 border border-gray-700 rounded-md w-full pl-10 px-4 py-2 text-white focus:ring-primary focus:border-primary"
                placeholder="Enter URL for event image"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ar_model_url" className="block text-sm font-medium text-gray-300 mb-1">
              AR Model URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaVrCardboard className="text-gray-500" />
              </div>
              <input
                type="text"
                id="ar_model_url"
                name="ar_model_url"
                value={formData.ar_model_url}
                onChange={handleInputChange}
                className="bg-gray-800 border border-gray-700 rounded-md w-full pl-10 px-4 py-2 text-white focus:ring-primary focus:border-primary"
                placeholder="Enter URL for AR model (optional)"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-medium ${
                isSubmitting
                  ? "bg-indigo-900 text-indigo-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-indigo-600 transition-colors"
              }`}
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage; 