# Running the ICP Ticket DApp

This guide provides a simple step-by-step approach to running the ICP Ticket DApp locally.

## Prerequisites

- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (version 0.15.0+)
- [Node.js](https://nodejs.org/) (version 16+)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)

## Quick Start

### 1. Install Dependencies

```bash
# In the project root
npm install

# Install additional packages required for the project
npm install vite-plugin-environment dotenv lit-html --save-dev

# Install frontend dependencies
cd src/icp_ticket_dapp_frontend
npm install
cd ../..
```

### 2. Start the Local Replica

Open a new terminal and run:

```bash
dfx start --clean
```

Keep this terminal open while you work with the application.

### 3. Deploy the Canisters 

In a different terminal:

```bash
dfx deploy
```

### 4. Start the Frontend

```bash
cd src/icp_ticket_dapp_frontend
npx vite --port 3000
```

### 5. Access the Application

Open your browser and go to:
```
http://localhost:3000/
```

## Troubleshooting

### Fix Backend Compilation Issues

If you encounter issues with the Rust canister:

```bash
cd src/icp_ticket_dapp_backend
cargo build --target wasm32-unknown-unknown --release
cd ../..
dfx deploy
```

### Regenerate Type Declarations

If you see TypeScript errors:

```bash
dfx generate
```

### Clear DFX Cache

If you experience unexpected behavior:

```bash
dfx stop
rm -rf .dfx
dfx start --clean
dfx deploy
```

## Working with the Application

1. **Authentication**: Click "Connect" to authenticate with Internet Identity
2. **Browse Events**: Navigate to the Events page to see all available events
3. **Create Events**: As an authenticated user, you can create new events
4. **Buy Tickets**: Purchase tickets for events using the "Buy Ticket" button
5. **View Your Tickets**: Access your tickets in the "My Tickets" section
6. **Validate Tickets**: Use the "Scan Ticket" page to validate tickets at the venue 