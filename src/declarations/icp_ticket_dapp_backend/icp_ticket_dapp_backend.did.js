export const idlFactory = ({ IDL }) => {
  const TicketError = IDL.Variant({
    'NoTicketsAvailable' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'EventNotFound' : IDL.Null,
    'TicketNotFound' : IDL.Null,
    'InvalidQRCode' : IDL.Null,
    'TicketAlreadyUsed' : IDL.Null,
  });
  const CreateEventResult = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : TicketError,
  });
  const Event = IDL.Record({
    'id' : IDL.Nat64,
    'organizer' : IDL.Principal,
    'venue' : IDL.Text,
    'image_url' : IDL.Text,
    'date' : IDL.Text,
    'name' : IDL.Text,
    'ar_model_url' : IDL.Opt(IDL.Text),
    'ticket_price' : IDL.Nat64,
    'description' : IDL.Text,
    'tickets_sold' : IDL.Nat64,
    'total_tickets' : IDL.Nat64,
  });
  const GetEventResult = IDL.Variant({ 'Ok' : Event, 'Err' : TicketError });
  const Ticket = IDL.Record({
    'id' : IDL.Nat64,
    'is_used' : IDL.Bool,
    'owner' : IDL.Principal,
    'purchase_date' : IDL.Nat64,
    'event_id' : IDL.Nat64,
    'qr_code' : IDL.Text,
  });
  const GetTicketResult = IDL.Variant({ 'Ok' : Ticket, 'Err' : TicketError });
  const MintTicketResult = IDL.Variant({ 'Ok' : Ticket, 'Err' : TicketError });
  const ValidateTicketResult = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : TicketError,
  });
  return IDL.Service({
    'create_event' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Nat64,
          IDL.Nat64,
          IDL.Text,
          IDL.Opt(IDL.Text),
        ],
        [CreateEventResult],
        [],
      ),
    'get_all_events' : IDL.Func([], [IDL.Vec(Event)], ['query']),
    'get_event' : IDL.Func([IDL.Nat64], [GetEventResult], ['query']),
    'get_my_tickets' : IDL.Func([], [IDL.Vec(Ticket)], ['query']),
    'get_ticket' : IDL.Func([IDL.Nat64], [GetTicketResult], ['query']),
    'mint_ticket' : IDL.Func([IDL.Nat64], [MintTicketResult], []),
    'validate_ticket' : IDL.Func(
        [IDL.Nat64, IDL.Text],
        [ValidateTicketResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
