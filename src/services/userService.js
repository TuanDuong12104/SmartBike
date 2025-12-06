// User Service - Quản lý users từ database
import dbService from './database'

export const userService = {
  // Get user by email
  async getByEmail(email) {
    try {
      const users = await dbService.getAll('users')
      return users.find((u) => u.email === email) || null
    } catch (error) {
      console.error('Error getting user by email:', error)
      throw error
    }
  },

  // Get user by ID
  async getById(id) {
    try {
      return await dbService.getById('users', id)
    } catch (error) {
      console.error('Error getting user by ID:', error)
      throw error
    }
  },

  // Create new user
  async create(userData) {
    try {
      // Check if email already exists
      const existing = await this.getByEmail(userData.email)
      if (existing) {
        throw new Error('Email đã được sử dụng')
      }

      const newUser = {
        full_name: userData.fullName || userData.full_name,
        email: userData.email,
        phone: userData.phone || '',
        password_hash: userData.password, // In production, this should be hashed
        role: userData.role || 'customer',
        avatar_url: userData.avatar_url || null,
        is_verified: userData.is_verified || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const id = await dbService.create('users', newUser)
      return { ...newUser, id }
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  // Update user
  async update(id, userData) {
    try {
      const updateData = {
        ...userData,
        updated_at: new Date().toISOString(),
      }
      return await dbService.update('users', id, updateData)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Delete user
  async delete(id) {
    try {
      return await dbService.delete('users', id)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Get all users
  async getAll() {
    try {
      return await dbService.getAll('users')
    } catch (error) {
      console.error('Error getting all users:', error)
      throw error
    }
  },
}

