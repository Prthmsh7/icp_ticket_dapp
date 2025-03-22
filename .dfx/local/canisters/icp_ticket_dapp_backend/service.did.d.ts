import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type CreateEventResult = { 'Ok' : bigint } |
  { 'Err' : TicketError };
export interface Event {
  'id' : bigint,
  'organizer' : Principal,
  'venue' : string,
  'image_url' : string,
  'date' : string,
  'name' : string,
  'ar_model_url' : [] | [string],
  'ticket_price' : bigint,
  'description' : string,
  'tickets_sold' : bigint,
  'total_tickets' : bigint,
}
export type GetEventResult = { 'Ok' : Event } |
  { 'Err' : TicketError };
export type GetTicketResult = { 'Ok' : Ticket } |
  { 'Err' : TicketError };
export type MintTicketResult = { 'Ok' : Ticket } |
  { 'Err' : TicketError };
export interface Ticket {
  'id' : bigint,
  'is_used' : boolean,
  'owner' : Principal,
  'purchase_date' : bigint,
  'event_id' : bigint,
  'qr_code' : string,
}
export type TicketError = { 'NoTicketsAvailable' : null } |
  { 'Unauthorized' : null } |
  { 'EventNotFound' : null } |
  { 'TicketNotFound' : null } |
  { 'InvalidQRCode' : null } |
  { 'TicketAlreadyUsed' : null };
export type ValidateTicketResult = { 'Ok' : boolean } |
  { 'Err' : TicketError };
export interface _SERVICE {
  'create_event' : ActorMethod<
    [string, string, string, string, bigint, bigint, string, [] | [string]],
    CreateEventResult
  >,
  'get_all_events' : ActorMethod<[], Array<Event>>,
  'get_event' : ActorMethod<[bigint], GetEventResult>,
  'get_my_tickets' : ActorMethod<[], Array<Ticket>>,
  'get_ticket' : ActorMethod<[bigint], GetTicketResult>,
  'mint_ticket' : ActorMethod<[bigint], MintTicketResult>,
  'validate_ticket' : ActorMethod<[bigint, string], ValidateTicketResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
