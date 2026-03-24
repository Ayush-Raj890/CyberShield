import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function KnowledgeHub() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    // Fetch articles
    axios.get('/api/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📚 Knowledge Hub</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-500 rounded"
          >
            Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-6">
        {selectedArticle ? (
          <div className="bg-white rounded-lg shadow p-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              ← Back to Articles
            </button>
            <h2 className="text-3xl font-bold mb-4">{selectedArticle.title}</h2>
            <div className="mb-4">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {selectedArticle.category}
              </span>
            </div>
            <div className="prose max-w-none">
              <p>{selectedArticle.content}</p>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Created on: {new Date(selectedArticle.createdAt).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-8">Educational Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.length === 0 ? (
                <p className="text-gray-600">No articles available yet.</p>
              ) : (
                articles.map(article => (
                  <div
                    key={article._id}
                    onClick={() => setSelectedArticle(article)}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition"
                  >
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
