import { useState } from 'react'
import Registration from './components/Registration'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [view, setView] = useState('home')
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    setUser(null)
    setView('home')
  }

  const handleLoginSuccess = (username) => {
    setUser(username)
    setView('dashboard')
  }

  if (view === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
            zkSNARK Authentication
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Passwordless Authentication with Zero-Knowledge Proofs
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Your password never leaves your browser. We use zkSNARKs to prove you know your password without revealing it.
          </p>
        </div>

        {view === 'home' && (
          <div className="card p-8 max-w-md mx-auto">
            <div className="space-y-4">
              <button
                onClick={() => setView('register')}
                className="w-full btn-primary"
              >
                Register New Account
              </button>
              <button
                onClick={() => setView('login')}
                className="w-full btn-secondary"
              >
                Login to Existing Account
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="font-semibold text-primary-400 mb-3">How it works:</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">1.</span>
                  <span>Server generates a random field element (g0)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">2.</span>
                  <span>Your browser computes a commitment using your password</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">3.</span>
                  <span>Only the commitment is stored, never your password</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">4.</span>
                  <span>Login generates a zkSNARK proof without revealing your password</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {view === 'register' && (
          <Registration
            onBack={() => setView('home')}
            onSuccess={() => {
              setView('login')
            }}
          />
        )}

        {view === 'login' && (
          <Login
            onBack={() => setView('home')}
            onSuccess={handleLoginSuccess}
          />
        )}
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Built with zkSNARKs, Chaos Theory, and Modern Cryptography</p>
        <p className="mt-2">BN254 Curve • Groth16 • 6D Hyper-Chaotic Systems</p>
      </footer>
    </div>
  )
}

export default App

