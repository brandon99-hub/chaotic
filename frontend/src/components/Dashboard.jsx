function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="card p-8 relative overflow-hidden">
          {/* Success gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
          <div className="text-center mb-8">
            <div className="inline-block relative mb-4">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative p-4 bg-green-500 bg-opacity-20 rounded-full border-4 border-green-500 border-opacity-30">
                <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Welcome back, {user}!
            </h1>
            <div className="inline-block px-4 py-2 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-full">
              <p className="text-sm text-green-300 font-medium">
                ✓ Authentication Successful
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Zero-Knowledge</h3>
              </div>
              <p className="text-sm text-gray-400">
                Your password was never transmitted to the server. We verified your identity using a zkSNARK proof.
              </p>
            </div>

            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Cryptographically Secure</h3>
              </div>
              <p className="text-sm text-gray-400">
                Built on BN254 elliptic curve cryptography and Groth16 zkSNARKs for maximum security.
              </p>
            </div>

            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Chaotic Generation</h3>
              </div>
              <p className="text-sm text-gray-400">
                Random numbers generated using a 6D hyper-chaotic system for enhanced entropy.
              </p>
            </div>

            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">No Password Storage</h3>
              </div>
              <p className="text-sm text-gray-400">
                The server only stores a cryptographic commitment, never your actual password.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-500 border-opacity-30 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Authentication Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-900 bg-opacity-30 rounded-lg">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-mono font-semibold">{user}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-900 bg-opacity-30 rounded-lg">
                <span className="text-gray-400">Authentication Method:</span>
                <span className="text-primary-300 font-semibold">Groth16 zkSNARK</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-900 bg-opacity-30 rounded-lg">
                <span className="text-gray-400">Elliptic Curve:</span>
                <span className="text-purple-300 font-semibold">BN254</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-500 bg-opacity-20 rounded-lg border border-green-500 border-opacity-30">
                <span className="text-gray-300">Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold">Authenticated</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

