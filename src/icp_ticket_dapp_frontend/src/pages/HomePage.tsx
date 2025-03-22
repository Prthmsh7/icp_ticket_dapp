import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HomePageProps } from "../types";
import { FaTicketAlt, FaLock, FaQrcode, FaVrCardboard } from "react-icons/fa";

const HomePage: React.FC<HomePageProps> = ({ isAuthenticated, login }) => {
  const features = [
    {
      icon: <FaTicketAlt className="h-8 w-8 text-primary" />,
      title: "Non-Transferable NFT Tickets",
      description:
        "Tickets minted as NFTs on the Internet Computer, tied to your identity to prevent unauthorized transfers and scalping.",
    },
    {
      icon: <FaLock className="h-8 w-8 text-primary" />,
      title: "Secure Authentication",
      description:
        "Authentication via Internet Identity ensures only legitimate ticket holders can access events.",
    },
    {
      icon: <FaQrcode className="h-8 w-8 text-primary" />,
      title: "QR Code Validation",
      description:
        "Each ticket has a unique QR code for easy validation at event venues, with tamper-proof verification.",
    },
    {
      icon: <FaVrCardboard className="h-8 w-8 text-primary" />,
      title: "AR Ticket Visualization",
      description:
        "View your tickets in augmented reality for an immersive and engaging experience.",
    },
  ];

  return (
    <div className="flex flex-col space-y-24 py-8">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 mb-12 lg:mb-0"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">
            The Future of Event Ticketing is Here
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-lg">
            Secure, non-transferable NFT tickets powered by Internet Computer Protocol, preventing scalping and ensuring fair access to events.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
              <Link
                to="/events"
                className="btn btn-primary text-center px-8 py-3 text-base rounded-lg"
              >
                Browse Events
              </Link>
            ) : (
              <button
                onClick={login}
                className="btn bg-accent hover:bg-purple-600 text-white text-center px-8 py-3 text-base rounded-lg transition-colors"
              >
                Sign In with Internet Identity
              </button>
            )}
            <Link
              to="/events"
              className="btn bg-surface hover:bg-gray-700 text-white text-center px-8 py-3 text-base rounded-lg border border-gray-600 transition-colors"
            >
              Explore Events
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-1/2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-20"></div>
            <div className="relative bg-surface rounded-3xl overflow-hidden shadow-xl border border-gray-700">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
                alt="Event tickets"
                className="w-full h-80 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-2xl font-display font-semibold mb-2">ICP Concert Experience</h3>
                <p className="text-gray-400 mb-4">Secure your spot with tamper-proof digital tickets</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold">5 ICP</span>
                  <span className="text-sm text-gray-400">100 tickets available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Why Choose ICP Tickets?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform leverages the Internet Computer Protocol to create a secure, 
            transparent, and user-friendly ticketing experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 bg-gray-800 rounded-full">{feature.icon}</div>
              <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-10"></div>
        <div className="relative bg-surface rounded-2xl p-8 md:p-12 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-display font-semibold mb-4">
                Ready to Experience the Future of Ticketing?
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-lg">
                Join our platform today and say goodbye to scalping, fraud, and ticket issues.
                Secure, transparent, and fair ticketing for all.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/events"
                  className="btn btn-primary text-center px-8 py-3 text-base rounded-lg whitespace-nowrap"
                >
                  Find Events
                </Link>
              ) : (
                <button
                  onClick={login}
                  className="btn bg-accent hover:bg-purple-600 text-white text-center px-8 py-3 text-base rounded-lg whitespace-nowrap transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 