import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">🛡️ CyberShield</h1>
          <nav className="flex gap-4">
            {token ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/report')}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded"
                >
                  Report
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    navigate('/')
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto py-20 px-6 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">Cybersecurity Threat Reporting Platform</h2>
        <p className="text-xl mb-8">
          Report phishing, scams, and cyber threats. Help protect the community.
        </p>
        <div className="flex gap-4 justify-center">
          {token ? (
            <>
              <button
                onClick={() => navigate('/report')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-lg"
              >
                Report Incident
              </button>
              <button
                onClick={() => navigate('/knowledge-hub')}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded text-lg"
              >
                Knowledge Hub
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/knowledge-hub')}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded text-lg"
              >
                Learn More
              </button>
            </>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-blue-600 py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="bg-blue-700 p-6 rounded">
              <h4 className="text-xl font-bold mb-2">📝 Easy Reporting</h4>
              <p>Report threats quickly and securely</p>
            </div>
            <div className="bg-blue-700 p-6 rounded">
              <h4 className="text-xl font-bold mb-2">🧠 AI Detection</h4>
              <p>AI-powered scam and threat detection</p>
            </div>
            <div className="bg-blue-700 p-6 rounded">
              <h4 className="text-xl font-bold mb-2">📚 Knowledge Base</h4>
              <p>Stay informed about cyber threats</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
