// Test Database Page - Để test các database operations
import { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import { bikeService } from '../services/bikeService'
import { rentalService } from '../services/rentalService'
import dbService from '../services/database'

const TestDatabasePage = () => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)

  const testUsers = async () => {
    setLoading(true)
    try {
      const users = await userService.getAll()
      setResults((prev) => ({ ...prev, users }))
      console.log('Users:', users)
    } catch (error) {
      console.error('Error testing users:', error)
      setResults((prev) => ({ ...prev, users: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testBikes = async () => {
    setLoading(true)
    try {
      const bikes = await bikeService.getAll()
      setResults((prev) => ({ ...prev, bikes }))
      console.log('Bikes:', bikes)
    } catch (error) {
      console.error('Error testing bikes:', error)
      setResults((prev) => ({ ...prev, bikes: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testRentals = async () => {
    setLoading(true)
    try {
      const rentals = await rentalService.getAll()
      setResults((prev) => ({ ...prev, rentals }))
      console.log('Rentals:', rentals)
    } catch (error) {
      console.error('Error testing rentals:', error)
      setResults((prev) => ({ ...prev, rentals: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testGetUserByEmail = async () => {
    setLoading(true)
    try {
      const user = await userService.getByEmail('demo@smartbike.vn')
      setResults((prev) => ({ ...prev, userByEmail: user }))
      console.log('User by email:', user)
    } catch (error) {
      console.error('Error getting user by email:', error)
      setResults((prev) => ({ ...prev, userByEmail: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testGetBikeById = async () => {
    setLoading(true)
    try {
      const bike = await bikeService.getById(1)
      setResults((prev) => ({ ...prev, bikeById: bike }))
      console.log('Bike by ID:', bike)
    } catch (error) {
      console.error('Error getting bike by ID:', error)
      setResults((prev) => ({ ...prev, bikeById: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testCreateUser = async () => {
    setLoading(true)
    try {
      const newUser = await userService.create({
        fullName: 'Test User',
        email: `test${Date.now()}@test.com`,
        phone: '0123456789',
        password: 'test123',
        role: 'customer',
      })
      setResults((prev) => ({ ...prev, createdUser: newUser }))
      console.log('Created user:', newUser)
    } catch (error) {
      console.error('Error creating user:', error)
      setResults((prev) => ({ ...prev, createdUser: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testDatabaseStats = async () => {
    setLoading(true)
    try {
      const [usersCount, bikesCount, rentalsCount, brandsCount, categoriesCount] = await Promise.all([
        dbService.count('users'),
        dbService.count('bikes'),
        dbService.count('rentals'),
        dbService.count('brands'),
        dbService.count('categories'),
      ])

      setResults((prev) => ({
        ...prev,
        stats: {
          users: usersCount,
          bikes: bikesCount,
          rentals: rentalsCount,
          brands: brandsCount,
          categories: categoriesCount,
        },
      }))
      console.log('Database stats:', { usersCount, bikesCount, rentalsCount, brandsCount, categoriesCount })
    } catch (error) {
      console.error('Error getting stats:', error)
      setResults((prev) => ({ ...prev, stats: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111318] dark:text-white mb-6">Database Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testDatabaseStats}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            Test Database Stats
          </button>
          <button
            onClick={testUsers}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            Test Get All Users
          </button>
          <button
            onClick={testBikes}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            Test Get All Bikes
          </button>
          <button
            onClick={testRentals}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            Test Get All Rentals
          </button>
          <button
            onClick={testGetUserByEmail}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            Test Get User By Email
          </button>
          <button
            onClick={testGetBikeById}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            Test Get Bike By ID
          </button>
          <button
            onClick={testCreateUser}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Test Create User
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        )}

        <div className="space-y-6">
          {results.stats && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">Database Stats</h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(results.stats, null, 2)}
              </pre>
            </div>
          )}

          {results.users && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">Users ({Array.isArray(results.users) ? results.users.length : 'Error'})</h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm max-h-96">
                {JSON.stringify(results.users, null, 2)}
              </pre>
            </div>
          )}

          {results.bikes && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">Bikes ({Array.isArray(results.bikes) ? results.bikes.length : 'Error'})</h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm max-h-96">
                {JSON.stringify(results.bikes, null, 2)}
              </pre>
            </div>
          )}

          {results.rentals && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">Rentals ({Array.isArray(results.rentals) ? results.rentals.length : 'Error'})</h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm max-h-96">
                {JSON.stringify(results.rentals, null, 2)}
              </pre>
            </div>
          )}

          {results.userByEmail && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">User By Email</h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(results.userByEmail, null, 2)}
              </pre>
            </div>
          )}

          {results.bikeById && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">Bike By ID</h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(results.bikeById, null, 2)}
              </pre>
            </div>
          )}

          {results.createdUser && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">Created User</h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(results.createdUser, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestDatabasePage

