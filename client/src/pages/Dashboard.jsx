import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Fetch user reports
    axios.get('/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReports(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <span>Welcome, {user?.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                navigate('/')
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/report')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer text-left"
          >
            <h3 className="text-xl font-bold mb-2">📝 Report Incident</h3>
            <p className="text-gray-600">Report a cyber threat or scam</p>
          </button>
          <button
            onClick={() => navigate('/knowledge-hub')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer text-left"
          >
            <h3 className="text-xl font-bold mb-2">📚 Knowledge Hub</h3>
            <p className="text-gray-600">Learn about cyber threats</p>
          </button>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">📊 Statistics</h3>
            <p className="text-gray-600">Your reports: {reports.length}</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Reports</h2>
          {reports.length === 0 ? (
            <p className="text-gray-600">No reports yet. Start by reporting an incident!</p>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report._id} className="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 rounded">
                  <h3 className="font-bold">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {report.category}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
