import { Principal } from "@dfinity/principal";

export interface Event {
  id: bigint;
  name: string;
  description: string;
  venue: string;
  date: string;
  ticket_price: bigint;
  total_tickets: bigint;
  tickets_sold: bigint;
  image_url: string;
  ar_model_url: string | [];
  organizer: Principal;
}

export interface Ticket {
  id: bigint;
  event_id: bigint;
  owner: Principal;
  purchase_date: bigint;
  qr_code: string;
  is_used: boolean;
}

export interface CreateEventPayload {
  name: string;
  description: string;
  venue: string;
  date: string;
  ticket_price: bigint;
  total_tickets: bigint;
  image_url: string;
  ar_model_url?: string;
}

export enum TicketError {
  EventNotFound = "EventNotFound",
  NoTicketsAvailable = "NoTicketsAvailable",
  Unauthorized = "Unauthorized",
  TicketNotFound = "TicketNotFound",
  TicketAlreadyUsed = "TicketAlreadyUsed",
  InvalidQRCode = "InvalidQRCode",
}

export interface NavbarProps {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface FooterProps {}

export interface HomePageProps {
  isAuthenticated: boolean;
  login: () => Promise<void>;
}

export interface EventDetailsPageProps {
  isAuthenticated: boolean;
}

export interface EventCardProps {
  event: Event;
}

export interface TicketCardProps {
  ticket: Ticket;
  event?: Event;
}

export interface ARModelViewerProps {
  modelUrl: string;
} 