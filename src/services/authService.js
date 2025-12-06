// Auth Service - Xử lý đăng nhập, đăng ký, và quản lý authentication
import { userService } from './userService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Lưu token vào localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token)
}

// Lấy token từ localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

// Xóa token
export const removeAuthToken = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

// Lưu thông tin user
export const setUser = (user) => {
  try {
    // Đảm bảo không lưu password_hash
    const { password_hash: _, ...safeUser } = user
    localStorage.setItem('user', JSON.stringify(safeUser))
  } catch (error) {
    console.error('Error saving user to localStorage:', error)
  }
}

// Lấy thông tin user
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    // Nếu parse lỗi, xóa data cũ
    localStorage.removeItem('user')
    return null
  }
}

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Đăng ký thất bại')
    }

    // Lưu token và user info
    if (data.token) {
      setAuthToken(data.token)
    }
    if (data.user) {
      setUser(data.user)
    }

    return data
  } catch (error) {
    // Nếu không có API, sử dụng mock data
    if (error.message.includes('fetch')) {
      return mockRegister(userData)
    }
    throw error
  }
}

// Đăng nhập
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Đăng nhập thất bại')
    }

    // Lưu token và user info
    if (data.token) {
      setAuthToken(data.token)
    }
    if (data.user) {
      setUser(data.user)
    }

    return data
  } catch (error) {
    // Nếu không có API, sử dụng mock data
    if (error.message.includes('fetch')) {
      return mockLogin(email, password)
    }
    throw error
  }
}

// Đăng xuất
export const logout = () => {
  removeAuthToken()
}

// Kiểm tra đã đăng nhập
export const isAuthenticated = () => {
  return !!getAuthToken()
}

// Mock Register (khi chưa có backend)
const mockRegister = async (userData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Validate
  if (!userData.fullName || !userData.email || !userData.password) {
    throw new Error('Vui lòng điền đầy đủ thông tin')
  }

  if (userData.password !== userData.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không khớp')
  }

  if (userData.password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
  }

  // Create user in database
  try {
    const newUser = await userService.create({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone || '',
      password: userData.password, // In production, this should be hashed
      role: 'customer',
      is_verified: false,
    })

    // Generate mock token
    const token = `mock_token_${Date.now()}`

    // Remove password_hash from user object before saving
    const { password_hash: _, ...userWithoutPassword } = newUser

    // Lưu token và user vào localStorage
    setAuthToken(token)
    setUser(userWithoutPassword)

    return {
      user: userWithoutPassword,
      token,
      message: 'Đăng ký thành công!',
    }
  } catch (error) {
    throw new Error(error.message || 'Đăng ký thất bại')
  }
}

// Mock Login (khi chưa có backend)
const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Normalize email (support both email and username)
  let normalizedEmail = email
  if (email === 'demo') {
    normalizedEmail = 'demo@smartbike.vn'
  }

  // Get user from database
  try {
    const user = await userService.getByEmail(normalizedEmail)

    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng')
    }

    // Check password (in production, this should use bcrypt)
    if (user.password_hash !== password) {
      throw new Error('Email hoặc mật khẩu không đúng')
    }

    // Return user without password_hash
    const { password_hash: _, ...userWithoutPassword } = user

    // Generate mock token
    const token = `mock_token_${Date.now()}`

    // Lưu token và user vào localStorage
    setAuthToken(token)
    setUser(userWithoutPassword)

    return {
      user: userWithoutPassword,
      token,
      message: 'Đăng nhập thành công!',
    }
  } catch (error) {
    throw new Error(error.message || 'Đăng nhập thất bại')
  }
}

