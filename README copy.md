# ICP Ticket DApp - Non-Transferable NFT Tickets

A decentralized application for creating and managing non-transferable NFT tickets built on the Internet Computer Protocol (ICP).

## Overview

This DApp combats ticket scalping by issuing non-transferable NFT tickets on ICP. Tickets are minted in Rust and tied to a buyer's Internet Identity, preventing resales and ensuring fair access. The React.js frontend features AR ticket visualization and QR code validation for secure entry. Leveraging ICP's tamper-proof blockchain and low transaction costs, the platform ensures transparency, affordability, and fraud prevention, creating a fair and engaging ticketing experience.

## Features

- 🎟️ **Non-Transferable NFT Tickets**: Tickets are minted as NFTs and tied to the buyer's Internet Identity
- 🔒 **Secure Authentication**: Login with Internet Identity ensures only legitimate ticket holders can access events
- 🧾 **QR Code Validation**: Each ticket has a unique QR code for easy validation at event venues
- 🥽 **AR Ticket Visualization**: View your tickets in augmented reality
- 💸 **Anti-Scalping Measures**: Tickets cannot be transferred or resold, preventing scalping
- 🏢 **Event Creation**: Organizers can create events with customizable details

## Technology Stack

- **Backend**: Rust canisters on the Internet Computer Protocol
- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Internet Identity
- **AR Visualization**: Three.js and React Three Fiber
- **QR Code**: QRCode.react for ticket validation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) (v0.15.0 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [CMake](https://cmake.org/download/)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/icp_ticket_dapp.git
   cd icp_ticket_dapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start a local Internet Computer replica:
   ```
   dfx start --clean --background
   ```

4. Deploy the canisters:
   ```
   dfx deploy
   ```

5. Start the frontend development server:
   ```
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Quick Start

To get everything up and running with one command:

```
npm run start
```

This will start the local replica, deploy the canisters, and start the frontend server.

## Project Structure

```
icp_ticket_dapp/
├── src/
│   ├── icp_ticket_dapp_backend/      # Rust canister code
│   │   ├── src/                      # Rust source files
│   │   └── Cargo.toml                # Rust dependencies
│   └── icp_ticket_dapp_frontend/     # React.js frontend
│       ├── src/                      # TypeScript/React source files
│       ├── assets/                   # Static assets
│       └── package.json              # Frontend dependencies
├── dfx.json                          # DFX configuration
└── package.json                      # Project scripts
```

## Usage

### For Event Organizers

1. Login with Internet Identity
2. Navigate to "Create Event"
3. Fill in event details, including name, description, venue, date, ticket price, etc.
4. Optionally add an AR model URL for immersive ticket experiences
5. Create the event
6. To validate tickets on event day, use the "Scan Ticket" feature

### For Ticket Buyers

1. Login with Internet Identity
2. Browse events on the "Events" page
3. Select an event to view details
4. Purchase a ticket
5. Access your tickets on the "My Tickets" page
6. Use the QR code at the event for entry
7. Optionally view your ticket in AR mode

## Deployment

### Local Deployment

For local development:

```
npm run deploy:local
```

### Internet Computer Mainnet Deployment

To deploy to the IC mainnet:

```
npm run deploy:ic
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Internet Computer Protocol for providing the blockchain infrastructure
- Dfinity Foundation for their development tools and resources
- The React and Rust communities for their excellent libraries and frameworks

---

🎟️ Happy Ticketing! 🎟️

Welcome to your new `icp_ticket_dapp`