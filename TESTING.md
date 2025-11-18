# Testing Guide

Comprehensive testing guide for the zkSNARK authentication system.

## Prerequisites

Before testing, ensure:
- zkSNARK trusted setup is complete (`pwsh scripts/setup_snark.ps1`)
- Python dependencies installed (`pip install -r requirements.txt`)
- Node dependencies installed (`cd frontend && npm install`)
- zkSNARK artifacts copied to `static/` directory

## Testing the CLI Interface

### Test 1: User Registration

```bash
python main.py
```

1. Select option `1` (Register New User)
2. Enter username: `testuser1`
3. Enter password: `TestPassword123`
4. Confirm password: `TestPassword123`
5. Verify success message appears

**Expected Output:**
```
[SUCCESS] Registration successful!
User 'testuser1' has been registered.
```

### Test 2: User Login

1. Select option `2` (Login)
2. Enter username: `testuser1`
3. Enter password: `TestPassword123`
4. Wait for zkSNARK proof generation (10-30 seconds)
5. Verify authentication success

**Expected Output:**
```
[SUCCESS] Authentication verified!
Welcome back, testuser1!
Your identity was proven without revealing your password.
```

### Test 3: Invalid Credentials

1. Select option `2` (Login)
2. Enter username: `testuser1`
3. Enter wrong password: `WrongPassword`
4. Verify authentication fails

**Expected Output:**
```
[FAILED] Authentication failed: ...
```

## Testing the Web Interface

### Backend Setup

**Terminal 1 - Start Backend:**
```bash
python api_server.py
```

Verify output shows:
```
Server starting on http://0.0.0.0:8000
API Documentation: http://0.0.0.0:8000/docs
```

### Frontend Setup

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Verify output shows:
```
Local: http://localhost:5173
```

### Test 4: API Health Check

Open browser to `http://localhost:8000/api/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "users_registered": 0
}
```

### Test 5: Web Registration Flow

1. Open `http://localhost:5173` in browser
2. Click "Register New Account"
3. Enter username: `webuser1`
4. Enter password: `WebPassword123`
5. Confirm password: `WebPassword123`
6. Click "Register"
7. Watch console for crypto operations
8. Verify success message

**Expected Console Logs:**
```
[Registration] Requesting g0 from server...
[Registration] Received g0: ...
[Registration] Hashing password...
[Registration] Computing commitment...
[Registration] Registering user...
[Registration] Success
```

### Test 6: Web Login Flow

1. Click "Login to Existing Account"
2. Enter username: `webuser1`
3. Enter password: `WebPassword123`
4. Click "Login"
5. Watch for proof generation stages
6. Verify redirect to dashboard

**Expected Stages:**
```
Fetching user data...
Hashing password...
Generating zkSNARK proof... (this may take 10-30 seconds)
Verifying proof with server...
```

### Test 7: Invalid Web Login

1. Click "Login to Existing Account"
2. Enter username: `webuser1`
3. Enter wrong password: `WrongPassword`
4. Click "Login"
5. Wait for proof generation
6. Verify authentication fails

### Test 8: Non-existent User

1. Click "Login to Existing Account"
2. Enter username: `nonexistent`
3. Enter any password
4. Verify immediate error (no proof generation)

**Expected Error:**
```
User not found
```

## Browser Console Testing

### Check zkSNARK Artifacts Loading

Open browser console and check:

```javascript
// These should all return 200 OK
fetch('/static/auth.wasm')
fetch('/static/auth_proving_key.zkey')
fetch('/static/auth_verification_key.json')
```

### Check Crypto Operations

After registration, console should show:
- Hash computation successful
- Commitment computed
- Field arithmetic operations

After login, console should show:
- Proof generation started
- Public signals generated
- Proof sent to server

## API Testing with cURL

### Get g0 for Registration

```bash
curl http://localhost:8000/api/register/g0
```

**Expected Response:**
```json
{"g0": "123456789..."}
```

### Register User

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "hr_id": "curluser",
    "g0": "12345",
    "Y": "67890"
  }'
```

### Get User Data

```bash
curl http://localhost:8000/api/users/curluser/data
```

**Expected Response:**
```json
{
  "g0": "12345",
  "Y": "67890"
}
```

### List All Users

```bash
curl http://localhost:8000/api/users
```

## Performance Testing

### Test 9: Proof Generation Time

Use browser's Performance API:

```javascript
const start = performance.now();
// Login and generate proof
const end = performance.now();
console.log(`Proof generation took ${(end - start) / 1000} seconds`);
```

**Expected:** 10-30 seconds depending on hardware

### Test 10: Multiple Users

Create 5 different users and verify:
- Each gets unique g0
- Each has unique commitment
- No collisions
- All can authenticate independently

## Security Testing

### Test 11: Password Never Transmitted

1. Open browser DevTools Network tab
2. Register a new user
3. Verify POST to `/api/register` contains only `{hr_id, g0, Y}`
4. Verify password is NOT in request payload

### Test 12: Proof Privacy

1. Login as a user
2. Check POST to `/api/login` in Network tab
3. Verify only `{hr_id, proof, public_signals}` is sent
4. Verify password is NOT in request payload
5. Verify proof is a cryptographic object (not readable password)

### Test 13: Wrong Commitment Rejection

1. Register user normally
2. Manually modify `Y` in server storage
3. Try to login
4. Verify authentication fails

## Edge Cases

### Test 14: Empty Credentials

- Try registration with empty username
- Try registration with empty password
- Try login with empty credentials
- Verify proper error messages

### Test 15: Password Mismatch

- Register with different confirm password
- Verify registration is blocked
- Verify clear error message

### Test 16: Duplicate Username

- Register user `dupuser`
- Try to register `dupuser` again
- Verify error: "User already exists"

### Test 17: Browser Compatibility

Test the web interface in:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari (if available)
- Mobile browsers

Verify zkSNARK proof generation works in all.

## Troubleshooting Tests

### If Proof Generation Fails

1. Check browser console for errors
2. Verify files are accessible:
   - `/static/auth.wasm` (should be ~500KB)
   - `/static/auth_proving_key.zkey` (should be ~5-10MB)
3. Try different browser
4. Check CORS headers in Network tab

### If Backend Errors

1. Check Python console for stack traces
2. Verify snarkjs is accessible: `snarkjs --version`
3. Check zkSNARK artifacts exist in `build/` and `keys/`
4. Try CLI mode to isolate frontend issues

### If Frontend Won't Start

1. Check Node version: `node --version` (need 16+)
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check port 5173 is not in use
4. Try `npm run build` to check for build errors

## Success Criteria

All tests pass when:
- ✓ CLI registration and login work
- ✓ Web registration and login work
- ✓ Invalid credentials are rejected
- ✓ Password never appears in network traffic
- ✓ Proof generation completes in < 60 seconds
- ✓ Multiple users can coexist
- ✓ Dashboard displays after successful login
- ✓ No console errors during normal operation

## Automated Testing (Future)

For production, consider adding:
- Unit tests for crypto functions
- Integration tests for API endpoints
- E2E tests with Playwright/Cypress
- zkSNARK circuit constraint tests
- Load testing for multiple concurrent users

Happy testing! 🧪✨

