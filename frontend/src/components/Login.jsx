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
    <div className="card p-8 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-primary-500 to-purple-500"></div>
      
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Login</h2>
        </div>
        <p className="text-gray-400 text-sm">Authenticate with zero-knowledge proof</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {stage && (
        <div className="mb-4 p-4 bg-primary-500 bg-opacity-20 border border-primary-500 border-opacity-50 rounded-lg text-primary-200 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-primary-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">{stage}</span>
          </div>
          {stage.includes('zkSNARK') && (
            <div className="mt-2 pt-2 border-t border-primary-500 border-opacity-30">
              <p className="text-xs text-primary-300 opacity-75">
                ⏱️ This may take 10-30 seconds depending on your device...
              </p>
            </div>
          )}
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

      <div className="mt-6 pt-6 border-t border-gray-700 border-opacity-50">
        <div className="flex items-start gap-3 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-3">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your browser will generate a zkSNARK proof that you know the password 
            without revealing it. The proof generation may take 10-30 seconds.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

