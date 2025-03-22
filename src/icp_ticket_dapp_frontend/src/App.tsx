import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import ScanTicketPage from "./pages/ScanTicketPage";
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        const isLoggedIn = await client.isAuthenticated();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;

    // Get the locally deployed Internet Identity canister ID
    const localCanisterId = 'be2us-64aaa-aaaaa-qaabq-cai';
    
    try {
      await authClient.login({
        identityProvider: process.env.DFX_NETWORK === "ic" 
          ? "https://identity.ic0.app"
          : `http://${localCanisterId}.localhost:4943`,
        onSuccess: () => {
          setIsAuthenticated(true);
        },
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        login={login} 
        logout={logout} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} login={login} />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage isAuthenticated={isAuthenticated} />} />
          <Route path="/my-tickets" element={
            isAuthenticated ? <MyTicketsPage /> : <HomePage isAuthenticated={isAuthenticated} login={login} />
          } />
          <Route path="/tickets/:ticketId" element={
            isAuthenticated ? <TicketDetailsPage /> : <HomePage isAuthenticated={isAuthenticated} login={login} />
          } />
          <Route path="/create-event" element={
            isAuthenticated ? <CreateEventPage /> : <HomePage isAuthenticated={isAuthenticated} login={login} />
          } />
          <Route path="/scan" element={
            isAuthenticated ? <ScanTicketPage /> : <HomePage isAuthenticated={isAuthenticated} login={login} />
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

export default App; 