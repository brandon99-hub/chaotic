# Quick Start Guide

Get the zkSNARK authentication system up and running in minutes.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- PowerShell (for Windows setup)

## Step 1: Setup zkSNARK Tooling

### Install Circom and snarkjs

```bash
# Install circom (circuit compiler)
npm install -g circom

# Install snarkjs (proof generation/verification)
npm install -g snarkjs
```

### Run Trusted Setup

```bash
pwsh scripts/setup_snark.ps1
```

This generates the cryptographic keys needed for zkSNARK proofs.

## Step 2: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- numpy (chaotic systems)
- cryptography
- fastapi (web API)
- uvicorn (web server)

## Step 3: Start the Backend API

```bash
python api_server.py
```

The API will start on `http://localhost:8000`

API documentation available at `http://localhost:8000/docs`

## Step 4: Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 5: Use the System

### Register a New User

1. Open `http://localhost:5173`
2. Click "Register New Account"
3. Enter a username and password
4. Click "Register"

Your password is hashed in the browser and only a cryptographic commitment is sent to the server.

### Login

1. Click "Login to Existing Account"
2. Enter your username and password
3. Wait for the zkSNARK proof to generate (10-30 seconds)
4. You'll be authenticated without your password ever leaving your browser!

## CLI Mode (Alternative)

If you prefer the command-line interface:

```bash
python main.py
```

This provides a text-based interface for registration and login.

## Architecture

```
┌─────────────────┐
│  Browser        │
│  (React + Vite) │
│                 │
│  - Generates    │
│    zkSNARK      │
│    proofs       │
│                 │
│  - Password     │
│    never sent   │
└────────┬────────┘
         │ HTTP
         │ (proof only)
         ↓
┌─────────────────┐
│  Backend        │
│  (FastAPI)      │
│                 │
│  - Verifies     │
│    proofs       │
│                 │
│  - Stores only  │
│    commitments  │
└─────────────────┘
```

## Troubleshooting

### zkSNARK artifacts not found

Make sure you ran `pwsh scripts/setup_snark.ps1` and the files exist:
- `build/auth_js/auth.wasm`
- `keys/auth_proving_key.zkey`
- `keys/auth_verification_key.json`
- `static/` directory with copies of above

### Port already in use

Backend (port 8000):
```bash
python api_server.py --port 8001
```

Frontend (port 5173):
Edit `frontend/vite.config.js` and change the port.

### Proof generation fails

1. Check browser console for errors
2. Verify static files are accessible at `/static/auth.wasm` and `/static/auth_proving_key.zkey`
3. Try in a different browser (Chrome/Firefox recommended)

### CORS errors

Make sure both backend and frontend are running, and the backend has CORS properly configured (already set up in `api_server.py`).

## Next Steps

- Read the full README for technical details
- Check out the zkSNARK circuit in `circuits/auth.circom`
- Review the cryptographic implementation in `hash_utils.py`
- Explore the 6D hyper-chaotic system in `chaotic_generator.py`

## Security Notes

This is a proof-of-concept for educational purposes. For production use:

1. Use proper session management after authentication
2. Implement rate limiting and brute-force protection
3. Use HTTPS in production
4. Add password strength requirements
5. Perform security audit
6. Use trusted setup with multi-party computation

Enjoy passwordless authentication! 🔐✨

