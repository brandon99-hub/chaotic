const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  async getG0() {
    const response = await fetch(`${API_BASE_URL}/api/register/g0`)
    if (!response.ok) {
      throw new Error('Failed to get g0 from server')
    }
    return await response.json()
  },

  async register(hrId, Y, g0) {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hr_id: hrId,
        Y: Y,
        g0: g0,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }
    
    return await response.json()
  },

  async getUserData(hrId) {
    const response = await fetch(`${API_BASE_URL}/api/users/${hrId}/data`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'User not found')
    }
    return await response.json()
  },

  async login(hrId, proof, publicSignals) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hr_id: hrId,
        proof: proof,
        public_signals: publicSignals,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Authentication failed')
    }
    
    return await response.json()
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    return await response.json()
  },
}

