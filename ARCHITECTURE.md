# Architecture Documentation

## System Overview

The zkSNARK Authentication System provides **two modes of operation**:

1. **CLI Mode** - Command-line interface (original implementation)
2. **Web Mode** - React frontend + FastAPI backend (new implementation)

Both modes share the same core cryptographic logic, ensuring consistency and security.

## Core Components

### Shared Backend Logic

#### `zkp_protocol.py`
- **Server Class**: Manages user storage and authentication
  - `get_random_g0()`: Generates chaotic random field elements
  - `register_user()`: Stores commitment for new users
  - `authenticate_user()`: Verifies zkSNARK proofs
  
- **Client Class**: Handles user-side operations
  - `register()`: Computes commitment from password
  - `login()`: Generates zkSNARK proof

#### `chaotic_generator.py`
- 6D hyper-chaotic system implementation
- Runge-Kutta 4th order ODE solver
- High-entropy random number generation
- Used for generating field element `g0`

#### `hash_utils.py`
- Password hashing to field elements (SHA-256)
- Field arithmetic modulo BN254 prime
- Commitment computation: `Y = g0 × X mod p`

#### `zksnark_utils.py`
- CLI-based zkSNARK operations
- Uses subprocess to call snarkjs CLI
- Generates and verifies Groth16 proofs

## CLI Mode Architecture

```
┌──────────────────┐
│    main.py       │  Interactive CLI
│                  │
│  ┌────────────┐  │
│  │  Server    │  │  In-memory user storage
│  └────────────┘  │
│                  │
│  ┌────────────┐  │
│  │  Client    │  │  Proof generation
│  └────────────┘  │
└──────────────────┘
         │
         ↓
    zksnark_utils.py
         │
         ↓
    snarkjs (CLI)
```

### Data Flow - CLI Registration

1. User enters username and password in CLI
2. Server generates `g0` using chaotic system
3. Client hashes password → `X`
4. Client computes `Y = g0 × X mod p`
5. Server stores `{username, g0, Y}`

### Data Flow - CLI Login

1. User enters username and password
2. Client retrieves `g0` and `Y` from server (in-memory)
3. Client hashes password → `X`
4. Client generates zkSNARK proof via CLI tools
5. Server verifies proof using CLI tools
6. Authentication succeeds/fails

## Web Mode Architecture

```
┌─────────────────────────────────────┐
│          Browser                    │
│                                     │
│  ┌──────────────────────────────┐  │
│  │      React Frontend          │  │
│  │                              │  │
│  │  - Registration.jsx          │  │
│  │  - Login.jsx                 │  │
│  │  - Dashboard.jsx             │  │
│  │                              │  │
│  │  Utils:                      │  │
│  │  - crypto.js (hash, commit)  │  │
│  │  - snarkProof.js (generate)  │  │
│  │  - api.js (REST client)      │  │
│  └──────────────┬───────────────┘  │
│                 │                   │
│         Uses snarkjs.js             │
│         (browser version)           │
└─────────────────┼───────────────────┘
                  │ HTTP/JSON
                  │ (no password!)
                  ↓
┌─────────────────────────────────────┐
│     FastAPI Backend Server          │
│                                     │
│  ┌──────────────────────────────┐  │
│  │      api_server.py           │  │
│  │                              │  │
│  │  GET  /api/register/g0       │  │
│  │  POST /api/register          │  │
│  │  GET  /api/users/:id/data    │  │
│  │  POST /api/login             │  │
│  │  GET  /api/health            │  │
│  │                              │  │
│  │  Wraps:                      │  │
│  │  - Server (zkp_protocol.py)  │  │
│  └──────────────────────────────┘  │
│                                     │
│  Static Files:                      │
│  - auth.wasm                        │
│  - auth_proving_key.zkey            │
│  - auth_verification_key.json       │
└─────────────────────────────────────┘
```

### Data Flow - Web Registration

1. Frontend: User enters username and password
2. Frontend → Backend: GET `/api/register/g0`
3. Backend: Generates `g0` using chaotic system
4. Backend → Frontend: Returns `{g0}`
5. Frontend: Hashes password → `X` (in browser)
6. Frontend: Computes `Y = g0 × X mod p` (in browser)
7. Frontend → Backend: POST `/api/register` with `{username, g0, Y}`
8. Backend: Stores user data
9. Backend → Frontend: Returns success

**Key Point**: Password never leaves the browser!

### Data Flow - Web Login

1. Frontend: User enters username and password
2. Frontend → Backend: GET `/api/users/:username/data`
3. Backend → Frontend: Returns `{g0, Y}`
4. Frontend: Hashes password → `X` (in browser)
5. Frontend: Loads WASM and zkey files
6. Frontend: Generates zkSNARK proof using snarkjs.js (10-30 seconds)
7. Frontend → Backend: POST `/api/login` with `{username, proof, publicSignals}`
8. Backend: Verifies proof using zksnark_utils.py
9. Backend → Frontend: Returns authentication result

**Key Point**: Proof is generated entirely in browser!

## zkSNARK Circuit

### Circuit Definition (`circuits/auth.circom`)

```circom
template Auth() {
    signal input g0;
    signal input Y;
    signal private input X;
    
    g0 * X === Y;
}
```

### Public Inputs
- `g0`: Random field element from server
- `Y`: Commitment computed as `g0 × X mod p`

### Private Input
- `X`: Hashed password (known only to user)

### Constraint
The circuit enforces that `g0 × X = Y` in the field.

### Zero-Knowledge Property
The proof reveals nothing about `X` except that the prover knows a value satisfying the equation.

## Cryptographic Primitives

### BN254 Elliptic Curve
- Field modulus: `p = 21888242871839275222246405745257275088548364400416034343698204186575808495617`
- 254-bit prime field
- Pairing-friendly curve used by Groth16

### Groth16 zkSNARK
- Proving system with succinct proofs (~200 bytes)
- Non-interactive proof generation
- Efficient verification (~5ms)
- Requires trusted setup

### SHA-256 Hashing
- Converts password string to 256-bit hash
- Hash reduced modulo field prime
- Deterministic: same password → same field element

## Security Model

### Threat Model

**Protected Against:**
- Eavesdropping: Password never transmitted
- Server compromise: Only commitments stored
- Replay attacks: Fresh proofs generated each login
- Password guessing: Requires brute-forcing field elements

**NOT Protected Against:**
- Weak passwords: User can still choose "123456"
- Client compromise: Malicious code in browser can steal password
- Trusted setup compromise: Toxic waste from ceremony
- Quantum computers: BN254 not post-quantum secure

### Trust Assumptions

1. **User trusts their own device**: Password entered safely
2. **Trusted setup performed honestly**: No toxic waste retained
3. **Browser executes code correctly**: No malicious JS injection
4. **Server implements verification correctly**: Doesn't accept invalid proofs

## Performance Characteristics

### CLI Mode
- Registration: < 100ms (excluding user input)
- Login proof generation: 5-15 seconds
- Login proof verification: < 100ms

### Web Mode
- Registration: < 500ms (excluding network)
- Login proof generation: 10-30 seconds (browser)
- Login proof verification: < 100ms
- Artifact loading (first time): 5-10 MB download

### Bottlenecks
- **Proof generation**: CPU-intensive, runs in browser main thread
- **Artifact size**: 8-12 MB initial download
- **Memory**: ~200-300 MB during proof generation

## Scalability Considerations

### Current Limitations
- In-memory user storage (not persistent)
- Single-server deployment
- No session management
- No rate limiting

### Production Improvements Needed
1. **Database**: PostgreSQL/MongoDB for user storage
2. **Caching**: Redis for g0 values and session tokens
3. **Load Balancing**: Multiple API servers
4. **CDN**: Static artifact distribution
5. **Worker Threads**: Offload proof verification
6. **Rate Limiting**: Prevent brute-force attempts
7. **Session Management**: JWT tokens after authentication
8. **Monitoring**: Prometheus + Grafana

## Deployment

### Development
- CLI: `python main.py`
- Web Backend: `python api_server.py`
- Web Frontend: `cd frontend && npm run dev`

### Production (Example)

**Backend:**
```bash
gunicorn api_server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve dist/ with nginx or similar
```

**Artifacts:**
Serve `static/` directory via CDN or nginx.

## File Size Reference

```
auth.wasm                   ~500 KB
auth_proving_key.zkey       ~5-8 MB
auth_verification_key.json  ~2 KB
auth.r1cs                   ~50 KB
```

## Comparison: CLI vs Web

| Feature | CLI Mode | Web Mode |
|---------|----------|----------|
| Interface | Terminal | Browser |
| Proof Location | Server-side | Client-side |
| snarkjs | CLI subprocess | JS library |
| User Storage | In-memory | In-memory + API |
| Proof Time | 5-15s | 10-30s |
| Setup | Simpler | More complex |
| UX | Text-based | Visual |
| Scalability | Single machine | Horizontally scalable |
| Platform | Cross-platform | Browser-dependent |

## Future Enhancements

1. **Persistent Storage**: Database integration
2. **Session Management**: JWT-based authentication
3. **Password Strength**: Enforce minimum requirements
4. **2FA Option**: Additional authentication factor
5. **Account Recovery**: zkSNARK-based recovery mechanism
6. **WebWorkers**: Offload proof generation from main thread
7. **Progressive Web App**: Offline capability
8. **Mobile Apps**: React Native implementation
9. **Hardware Wallets**: Hardware-based key storage
10. **Multi-Signature**: Multiple proof requirements

## Conclusion

The architecture maintains security properties across both CLI and web modes while providing flexibility in deployment and user experience. The core cryptographic operations remain identical, ensuring consistent security guarantees.

