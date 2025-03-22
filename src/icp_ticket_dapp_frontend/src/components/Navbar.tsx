import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavbarProps } from "../types";
import { FaTicketAlt, FaPlus, FaQrcode, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, login, logout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Events", path: "/events", icon: <FaTicketAlt />, requiresAuth: false },
    { name: "My Tickets", path: "/my-tickets", icon: <FaTicketAlt />, requiresAuth: true },
    { name: "Create Event", path: "/create-event", icon: <FaPlus />, requiresAuth: true },
    { name: "Scan Ticket", path: "/scan", icon: <FaQrcode />, requiresAuth: true },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-surface shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <FaTicketAlt className="h-6 w-6 text-accent" />
                <span className="text-xl font-display font-semibold">ICP Tickets</span>
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks
              .filter((link) => !link.requiresAuth || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.name}
                </Link>
              ))}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <FaSignOutAlt className="mr-1.5" />
                Logout
              </button>
            ) : (
              <button
                onClick={login}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-accent text-white hover:bg-purple-600 transition-colors"
              >
                <FaSignInAlt className="mr-1.5" />
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks
              .filter((link) => !link.requiresAuth || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  login();
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium bg-accent text-white hover:bg-purple-600"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 