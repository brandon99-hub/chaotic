# zkSNARK Authentication - Frontend

React-based web interface for passwordless zkSNARK authentication.

## Features

- Zero-knowledge authentication in the browser
- zkSNARK proof generation using snarkjs
- Modern UI with Tailwind CSS
- Real-time feedback during proof generation
- No password transmission to server

## Setup

### Prerequisites

- Node.js 16+ and npm
- Backend API server running (see parent directory)
- zkSNARK artifacts in `/static` directory

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Architecture

### Components

- **App.jsx** - Main application with routing logic
- **Registration.jsx** - New user registration
- **Login.jsx** - User authentication with zkSNARK proof
- **Dashboard.jsx** - Post-authentication view

### Utilities

- **api.js** - REST API client for backend communication
- **crypto.js** - Browser-based cryptographic operations
- **snarkProof.js** - zkSNARK proof generation using snarkjs

## How It Works

### Registration Flow

1. User enters username and password
2. Frontend requests random field element `g0` from server
3. Password is hashed to field element `X` in browser
4. Commitment `Y = g0 × X mod p` is computed locally
5. Only `{username, g0, Y}` is sent to server
6. Password never leaves the browser

### Login Flow

1. User enters username and password
2. Frontend fetches user's `g0` and `Y` from server
3. Password is hashed to field element `X` in browser
4. zkSNARK proof is generated proving knowledge of `X`
5. Proof is sent to server for verification
6. Server verifies proof without learning password

## Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## Security

- All cryptographic operations happen in the browser
- Password is never transmitted to the server
- zkSNARK proofs are generated client-side
- Only the proof and public signals are sent to server
- Server verifies proofs without learning the password

## Browser Compatibility

Requires modern browsers with:
- WebAssembly support
- Web Crypto API
- ES6+ JavaScript

Tested on:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Performance

- Proof generation takes 10-30 seconds
- WASM and zkey files are cached after first load
- Total artifact size: ~8-12 MB

## Development

```bash
# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

