import { useState } from 'react'
import { api } from '../utils/api'
import { hashPasswordToField, computeCommitment, reduceToField } from '../utils/crypto'

function Registration({ onBack, onSuccess }) {
  const [hrId, setHrId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!hrId.trim()) {
      setError('Username cannot be empty')
      return
    }

    if (!password) {
      setError('Password cannot be empty')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      console.log('[Registration] Requesting g0 from server...')
      const { g0 } = await api.getG0()
      console.log('[Registration] Received g0:', g0)

      console.log('[Registration] Hashing password...')
      const secretX = await hashPasswordToField(password)
      console.log('[Registration] Password hashed to field element')

      console.log('[Registration] Computing commitment...')
      const Y = computeCommitment(g0, secretX)
      console.log('[Registration] Commitment computed:', Y.toString())

      console.log('[Registration] Registering user...')
      const result = await api.register(hrId, Y.toString(), g0)
      
      setSuccess(`Registration successful! User '${hrId}' has been registered.`)
      console.log('[Registration] Success:', result)
      
      setTimeout(() => {
        onSuccess()
      }, 2000)
      
    } catch (err) {
      console.error('[Registration] Error:', err)
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Register</h2>
        <p className="text-gray-400">Create a new account with zero-knowledge authentication</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-300">
          {success}
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

        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Confirm password"
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
                Processing...
              </span>
            ) : (
              'Register'
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
          Your password is hashed in the browser and never sent to the server. 
          Only a cryptographic commitment is stored.
        </p>
      </div>
    </div>
  )
}

export default Registration

