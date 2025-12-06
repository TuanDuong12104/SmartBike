import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, isAuthenticated, logout as authLogout, setUser as setUserStorage } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      try {
        const savedUser = getUser()
        const hasToken = isAuthenticated()
        
        // Nếu có user trong localStorage, load nó
        if (savedUser) {
          setUser(savedUser)
        } else if (hasToken) {
          // Nếu có token nhưng không có user, xóa token (inconsistent state)
          authLogout()
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        // Nếu có lỗi, clear localStorage
        authLogout()
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  const login = (userData) => {
    setUser(userData)
    // Đảm bảo user được lưu vào localStorage (đã được lưu trong authService, nhưng để chắc chắn)
    setUserStorage(userData)
  }

  const logout = () => {
    authLogout()
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
    // Also update localStorage
    setUserStorage(userData)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

