import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Check if admin
    if (parsedUser.role !== 'ADMIN') {
      navigate('/dashboard')
      return
    }

    // Fetch admin data
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      axios.get('/api/admin/stats', { headers }),
      axios.get('/api/admin/users', { headers }),
      axios.get('/api/admin/reports', { headers })
    ])
      .then(([statsRes, usersRes, reportsRes]) => {
        setStats(statsRes.data)
        setUsers(usersRes.data)
        setReports(reportsRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [navigate])

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(users.filter(u => u._id !== userId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/reports/${reportId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(reports.map(r => r._id === reportId ? { ...r, status: newStatus } : r))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report')
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔐 Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              navigate('/')
            }}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mt-6 px-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded ${activeTab === 'stats' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Dashboard Stats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded ${activeTab === 'reports' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto py-8 px-6">
        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 mb-2">Total Reports</h3>
              <p className="text-4xl font-bold text-green-600">{stats.totalReports}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 mb-2">Pending Reports</h3>
              <p className="text-4xl font-bold text-yellow-600">{stats.pendingReports}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 mb-2">Total Articles</h3>
              <p className="text-4xl font-bold text-purple-600">{stats.totalArticles}</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-white ${u.role === 'ADMIN' ? 'bg-red-600' : 'bg-blue-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{report.title}</h3>
                    <p className="text-gray-600 text-sm">By: {report.user?.name} ({report.user?.email})</p>
                  </div>
                  <select
                    value={report.status}
                    onChange={(e) => handleUpdateReportStatus(report._id, e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
                <p className="text-gray-700 mb-3">{report.description}</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {report.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
