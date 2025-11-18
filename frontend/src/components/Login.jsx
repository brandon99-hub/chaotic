import { useState } from 'react'
import { api } from '../utils/api'
import { hashPasswordToField } from '../utils/crypto'
import { generateProof } from '../utils/snarkProof'

function Login({ onBack, onSuccess }) {
  const [hrId, setHrId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stage, setStage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStage('')

    if (!hrId.trim()) {
      setError('Username cannot be empty')
      return
    }

    if (!password) {
      setError('Password cannot be empty')
      return
    }

    setLoading(true)

    try {
      setStage('Fetching user data...')
      console.log('[Login] Fetching user data for:', hrId)
      const userData = await api.getUserData(hrId)
      console.log('[Login] Received user data')

      setStage('Hashing password...')
      console.log('[Login] Hashing password...')
      const secretX = await hashPasswordToField(password)
      console.log('[Login] Password hashed')

      setStage('Generating zkSNARK proof... (this may take 10-30 seconds)')
      console.log('[Login] Generating zkSNARK proof...')
      console.log('[Login] g0:', userData.g0)
      console.log('[Login] Y:', userData.Y)
      
      const { proof, publicSignals } = await generateProof(
        BigInt(userData.g0),
        secretX,
        BigInt(userData.Y)
      )
      
      console.log('[Login] Proof generated successfully')

      setStage('Verifying proof with server...')
      console.log('[Login] Sending proof to server...')
      const result = await api.login(hrId, proof, publicSignals)
      
      console.log('[Login] Authentication successful:', result)
      onSuccess(hrId)
      
    } catch (err) {
      console.error('[Login] Error:', err)
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
      setStage('')
    }
  }

  return (
    <div className="card p-8 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
        <p className="text-gray-400">Authenticate with zero-knowledge proof</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {stage && (
        <div className="mb-4 p-4 bg-primary-500 bg-opacity-20 border border-primary-500 rounded-lg text-primary-300">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {stage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Username (HR_ID)</label>
          <input
            type="text"
            value={hrId}
            onChange={(e) => setHrId(e.target.value)}
            className="input-field"
            placeholder="Enter username"
            disabled={loading}
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Enter password"
            disabled={loading}
          />
        </div>

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="w-full btn-secondary"
          >
            Back
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Your browser will generate a zkSNARK proof that you know the password 
          without revealing it. The proof generation may take 10-30 seconds.
        </p>
      </div>
    </div>
  )
}

export default Login

