use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk::{caller, query, update};
use ic_stable_structures::{
    memory_manager::VirtualMemory,
    DefaultMemoryImpl,
};
use serde::{Deserialize as SerdeDeserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::BTreeMap;

type Memory = VirtualMemory<DefaultMemoryImpl>;

#[derive(CandidType, SerdeDeserialize, Serialize, Clone)]
pub struct Event {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub venue: String,
    pub date: String,
    pub ticket_price: u64,
    pub total_tickets: u64,
    pub tickets_sold: u64,
    pub image_url: String,
    pub ar_model_url: Option<String>,
    pub organizer: Principal,
}

#[derive(CandidType, SerdeDeserialize, Serialize, Clone)]
pub struct Ticket {
    pub id: u64,
    pub event_id: u64,
    pub owner: Principal,
    pub purchase_date: u64,
    pub qr_code: String,
    pub is_used: bool,
}

#[derive(CandidType, SerdeDeserialize, Serialize, Clone)]
pub enum TicketError {
    EventNotFound,
    NoTicketsAvailable,
    Unauthorized,
    TicketNotFound,
    TicketAlreadyUsed,
    InvalidQRCode,
}

thread_local! {
    static EVENTS: RefCell<BTreeMap<u64, Event>> = RefCell::new(BTreeMap::new());
    static TICKETS: RefCell<BTreeMap<u64, Ticket>> = RefCell::new(BTreeMap::new());
    static NEXT_EVENT_ID: RefCell<u64> = RefCell::new(1);
    static NEXT_TICKET_ID: RefCell<u64> = RefCell::new(1);
    static USER_TICKETS: RefCell<BTreeMap<Principal, Vec<u64>>> = RefCell::new(BTreeMap::new());
}

#[update]
fn create_event(
    name: String,
    description: String,
    venue: String,
    date: String,
    ticket_price: u64,
    total_tickets: u64,
    image_url: String,
    ar_model_url: Option<String>,
) -> Result<u64, TicketError> {
    let caller = caller();
    
    EVENTS.with(|events| {
        NEXT_EVENT_ID.with(|event_id| {
            let id = *event_id.borrow();
            let event = Event {
                id,
                name,
                description,
                venue,
                date,
                ticket_price,
                total_tickets,
                tickets_sold: 0,
                image_url,
                ar_model_url,
                organizer: caller,
            };
            
            events.borrow_mut().insert(id, event);
            *event_id.borrow_mut() += 1;
            Ok(id)
        })
    })
}

#[query]
fn get_all_events() -> Vec<Event> {
    EVENTS.with(|events| {
        events.borrow().values().cloned().collect()
    })
}

#[query]
fn get_event(event_id: u64) -> Result<Event, TicketError> {
    EVENTS.with(|events| {
        events
            .borrow()
            .get(&event_id)
            .cloned()
            .ok_or(TicketError::EventNotFound)
    })
}

#[update]
fn mint_ticket(event_id: u64) -> Result<Ticket, TicketError> {
    let caller = caller();
    
    EVENTS.with(|events| {
        let mut events_mut = events.borrow_mut();
        let event = events_mut
            .get_mut(&event_id)
            .ok_or(TicketError::EventNotFound)?;
        
        if event.tickets_sold >= event.total_tickets {
            return Err(TicketError::NoTicketsAvailable);
        }
        
        event.tickets_sold += 1;
        
        NEXT_TICKET_ID.with(|ticket_id| {
            let id = *ticket_id.borrow();
            let purchase_date = time();
            
            // Generate a QR code based on ticket details
            let qr_data = format!("{}:{}:{}:{}", id, event_id, caller, purchase_date);
            let mut hasher = Sha256::new();
            hasher.update(qr_data.as_bytes());
            let qr_hash = hasher.finalize();
            let qr_code = format!("{:x}", qr_hash);
            
            let ticket = Ticket {
                id,
                event_id,
                owner: caller,
                purchase_date,
                qr_code,
                is_used: false,
            };
            
            TICKETS.with(|tickets| {
                tickets.borrow_mut().insert(id, ticket.clone());
            });
            
            USER_TICKETS.with(|user_tickets| {
                let mut user_tickets_mut = user_tickets.borrow_mut();
                user_tickets_mut
                    .entry(caller)
                    .or_insert_with(Vec::new)
                    .push(id);
            });
            
            *ticket_id.borrow_mut() += 1;
            Ok(ticket)
        })
    })
}

#[query]
fn get_my_tickets() -> Vec<Ticket> {
    let caller = caller();
    
    USER_TICKETS.with(|user_tickets| {
        let tickets_ids = user_tickets
            .borrow()
            .get(&caller)
            .cloned()
            .unwrap_or_default();
        
        TICKETS.with(|tickets| {
            let tickets_borrow = tickets.borrow();
            tickets_ids
                .iter()
                .filter_map(|id| tickets_borrow.get(id).cloned())
                .collect()
        })
    })
}

#[query]
fn get_ticket(ticket_id: u64) -> Result<Ticket, TicketError> {
    let caller = caller();
    
    TICKETS.with(|tickets| {
        let ticket = tickets
            .borrow()
            .get(&ticket_id)
            .cloned()
            .ok_or(TicketError::TicketNotFound)?;
        
        if ticket.owner != caller && EVENTS.with(|events| {
            let events_borrowed = events.borrow();
            events_borrowed
                .get(&ticket.event_id)
                .map_or(false, |event| event.organizer == caller)
        }) {
            return Err(TicketError::Unauthorized);
        }
        
        Ok(ticket)
    })
}

#[update]
fn validate_ticket(ticket_id: u64, qr_code: String) -> Result<bool, TicketError> {
    let caller = caller();
    
    TICKETS.with(|tickets| {
        let mut tickets_mut = tickets.borrow_mut();
        let ticket = tickets_mut
            .get_mut(&ticket_id)
            .ok_or(TicketError::TicketNotFound)?;
        
        // Ensure the validator is the event organizer
        EVENTS.with(|events| {
            let events_borrowed = events.borrow();
            let event = events_borrowed
                .get(&ticket.event_id)
                .ok_or(TicketError::EventNotFound)?;
            
            if event.organizer != caller {
                return Err(TicketError::Unauthorized);
            }
            
            if ticket.is_used {
                return Err(TicketError::TicketAlreadyUsed);
            }
            
            if ticket.qr_code != qr_code {
                return Err(TicketError::InvalidQRCode);
            }
            
            ticket.is_used = true;
            Ok(true)
        })
    })
}

// Generate Candid interface
ic_cdk::export_candid!();

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_candid_interface() {
        let result = ic_cdk::export_candid!();
        println!("{}", result);
    }
}
