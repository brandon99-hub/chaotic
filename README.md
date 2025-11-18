# Passwordless zkSNARK Authentication System

A novel authentication system that combines **Zero-Knowledge Proofs (zkSNARKs)**, **6D Hyper-Chaotic Systems**, and **Field Arithmetic** to enable secure, passwordless authentication without storing or transmitting passwords.

## 🌟 Key Features

- **True Zero-Knowledge Authentication**: Users prove they know their password without revealing it
- **No Password Storage**: Server stores only cryptographic commitments, not passwords
- **zkSNARK Proofs**: Uses Groth16 zkSNARKs for succinct, non-interactive verification
- **Chaotic Number Generation**: Employs 6D hyper-chaotic systems for secure random number generation
- **Interactive CLI**: User-friendly command-line interface for registration and login
- **Mathematically Secure**: Built on elliptic curve cryptography (BN254 curve)

## 🔐 How It Works

### Registration Phase
1. Server generates a random field element `g0` using the 6D hyper-chaotic system
2. Client hashes their password to get secret `X` (reduced to BN254 field)
3. Client computes commitment `Y = g0 × X mod p` (where p is the BN254 field modulus)
4. Server stores only `{HR_ID, g0, Y}` — **never the password**

### Authentication Phase
1. Client retrieves their stored `g0` and `Y` from the server
2. Client generates a zkSNARK proof that they know secret `X` such that `g0 × X = Y`
3. Server verifies the proof cryptographically
4. Authentication succeeds if the proof is valid — **password never transmitted**

### Zero-Knowledge Property
The zkSNARK circuit enforces the constraint `g0 × X === Y` where:
- **Public inputs**: `g0`, `Y` (known to both parties)
- **Private input**: `X` (known only to the client)

The proof reveals nothing about `X` beyond the fact that the prover knows a value satisfying the equation.

## 🛠️ Technologies Used

### Backend
- **Python 3.x**: Core application logic
- **NumPy**: Numerical computations for chaotic systems
- **FastAPI**: Modern web API framework
- **Uvicorn**: ASGI web server
- **SHA-256**: Cryptographic hashing for password derivation

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **snarkjs**: Browser-based zkSNARK proof generation

### Cryptography
- **Circom**: Circuit definition language for zkSNARKs
- **snarkjs**: zkSNARK proof generation/verification toolkit
- **Groth16**: zkSNARK proving system
- **BN254 Curve**: Elliptic curve for finite field arithmetic

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm
- PowerShell (for setup scripts on Windows)
- Modern web browser (for web interface)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chaotic
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Install zkSNARK Tools
```bash
# Install circom (circuit compiler)
npm install -g circom

# Install snarkjs (proof generation/verification)
npm install -g snarkjs
```

### 4. Run zkSNARK Trusted Setup
```bash
pwsh scripts/setup_snark.ps1
```

This will:
- Compile the authentication circuit
- Run the Powers of Tau ceremony (generates CRS)
- Generate proving and verification keys
- Store artifacts in `build/` and `keys/` directories

**Note**: When prompted for entropy during the ceremony, type any random text and press Enter.

### 5. Setup Frontend (for Web Interface)
```bash
cd frontend
npm install
cd ..
```

The zkSNARK artifacts are already copied to the `static/` directory for web access.

## 💻 Usage

### Option 1: Web Interface (Recommended)

**Start the Backend API:**
```bash
python api_server.py
```
Server runs on `http://localhost:8000` with API docs at `/docs`

**Start the Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```
Frontend runs on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173` to use the web interface.

### Option 2: Command-Line Interface

**Start the CLI Application:**
```bash
python main.py
```

### Register a New User
1. Select option `1` from the menu
2. Enter a unique username (HR_ID)
3. Enter and confirm your password
4. Registration completes — your commitment is stored on the server

### Login
1. Select option `2` from the menu
2. Enter your username
3. Enter your password
4. The system generates a zkSNARK proof and verifies it
5. Login succeeds if the proof is valid

### Example Session
```
============================================================
    Passwordless zkSNARK Authentication System
============================================================

Welcome! Choose an option:
1. Register New User
2. Login
3. Exit

Enter your choice (1-3): 1

Enter your HR_ID/Username: alice
Enter your password: ********
Confirm your password: ********

[SUCCESS] Registration successful!
User 'alice' has been registered.

Enter your choice (1-3): 2

Enter your HR_ID/Username: alice
Enter your password: ********

[SUCCESS] Authentication verified!
Welcome back, alice!
Your identity was proven without revealing your password.
```

## 📁 Project Structure

```
chaotic/
├── circuits/
│   └── auth.circom              # zkSNARK circuit definition
├── scripts/
│   └── setup_snark.ps1          # Trusted setup script
├── build/                        # Compiled circuit artifacts
│   ├── auth.r1cs                # Rank-1 Constraint System
│   ├── auth.wasm                # WebAssembly witness generator
│   └── auth.sym                 # Symbol mapping
├── keys/                         # Cryptographic keys
│   ├── auth_proving_key.zkey    # Proving key
│   └── auth_verification_key.json # Verification key
├── static/                       # Web-accessible zkSNARK artifacts
│   ├── auth.wasm                # WASM for browser
│   ├── auth_proving_key.zkey    # Proving key for browser
│   └── auth_verification_key.json # Verification key
├── frontend/                     # React web interface
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── utils/               # API and crypto utilities
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json             # Node dependencies
│   └── vite.config.js           # Vite configuration
├── chaotic_generator.py         # 6D hyper-chaotic RNG
├── hash_utils.py                # Hashing and field arithmetic
├── zksnark_utils.py             # zkSNARK proof generation/verification
├── zkp_protocol.py              # Client/Server protocol logic
├── api_server.py                # FastAPI REST API server
├── main.py                      # Interactive CLI application
├── requirements.txt             # Python dependencies
├── README.md                    # This file
├── QUICKSTART.md                # Quick start guide
└── frontend/README.md           # Frontend documentation
```

## 🔬 Technical Details

### 6D Hyper-Chaotic System
The system uses a 6-dimensional hyper-chaotic attractor based on the equations:

```
dx/dt = a(y - x) + w
dy/dt = cx - y - xz
dz/dt = xy - bz
dw/dt = -yz + rw
du/dt = s(x - v)
dv/dt = u - v
```

This provides high-quality pseudorandom numbers with extreme sensitivity to initial conditions.

### Field Arithmetic
All computations use modular arithmetic over the BN254 field:
```
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
```

### zkSNARK Circuit
The authentication circuit (`circuits/auth.circom`) enforces:
```circom
template Auth() {
    signal input g0;
    signal input Y;
    signal private input X;
    
    g0 * X === Y;
}
```

This simple yet powerful constraint proves knowledge of `X` without revealing it.

## 🔒 Security Considerations

### Strengths
- ✅ **No password transmission**: Passwords never leave the client
- ✅ **No password storage**: Server stores only commitments
- ✅ **Cryptographically secure**: Based on elliptic curve hardness assumptions
- ✅ **Zero-knowledge**: Proof reveals nothing about the password
- ✅ **Replay protection**: Each proof is generated fresh with new witnesses

### Limitations
- ⚠️ **Trusted setup required**: The Powers of Tau ceremony must be performed honestly
- ⚠️ **Client-side security**: Client must protect their password and witness generation
- ⚠️ **Weak password vulnerability**: System doesn't prevent weak passwords (can add strength checks)
- ⚠️ **Session management not included**: This is an authentication proof-of-concept

### Recommended Enhancements for Production
1. Add password strength validation
2. Implement secure session management after authentication
3. Use multi-party computation (MPC) for trusted setup
4. Add rate limiting and brute-force protection
5. Implement secure key storage (hardware security modules)
6. Add audit logging for authentication attempts

## 🧪 Testing

The system has been tested with:
- Multiple user registrations
- Successful authentication with correct credentials
- Failed authentication with incorrect passwords
- Field arithmetic boundary conditions
- zkSNARK proof generation and verification

## 📚 References

- [Groth16: On the Size of Pairing-based Non-interactive Arguments](https://eprint.iacr.org/2016/260.pdf)
- [Circom Documentation](https://docs.circom.io/)
- [snarkjs GitHub](https://github.com/iden3/snarkjs)
- [Zero-Knowledge Proofs: An Introduction](https://zkp.science/)

## 🤝 Contributing

This is a research/educational project demonstrating zkSNARK-based authentication. Contributions, improvements, and security reviews are welcome!

## 📄 License

This project is for educational and research purposes. Please review and test thoroughly before any production use.

## 🙏 Acknowledgments

- Circom and snarkjs teams for excellent zkSNARK tooling
- The cryptography research community for zero-knowledge proof innovations
- NumPy community for scientific computing tools

---

**⚠️ Disclaimer**: This is a proof-of-concept system for educational purposes. Do not use in production without extensive security review and enhancements.

**Built with ❤️ using zkSNARKs, Chaos Theory, and Modern Cryptography**

