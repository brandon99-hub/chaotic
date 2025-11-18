function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-500 bg-opacity-20 rounded-full mb-4">
              <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user}!
            </h1>
            <p className="text-xl text-gray-400">
              Authentication Successful
            </p>
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

          <div className="bg-primary-500 bg-opacity-10 border border-primary-500 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Authentication Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-mono">{user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Authentication Method:</span>
                <span className="text-white">Groth16 zkSNARK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Curve:</span>
                <span className="text-white">BN254</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">Authenticated</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

