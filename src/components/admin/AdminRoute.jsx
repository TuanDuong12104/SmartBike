import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Check authentication and admin role
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute

