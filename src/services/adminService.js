// Admin Service - Tính toán stats và data cho admin dashboard
import dbService from './database'
import { bikeService } from './bikeService'
import { rentalService } from './rentalService'
import { userService } from './userService'

export const adminService = {
  // Get dashboard stats
  async getDashboardStats(timeRange = '7 ngày qua') {
    try {
      const [bikes, rentals, users] = await Promise.all([
        bikeService.getAll(),
        rentalService.getAll(),
        userService.getAll(),
      ])

      // Calculate date range
      const now = new Date()
      let startDate = new Date()
      
      switch (timeRange) {
        case 'Hôm nay':
          startDate.setHours(0, 0, 0, 0)
          break
        case '7 ngày qua':
          startDate.setDate(now.getDate() - 7)
          break
        case 'Tháng này':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'Năm nay':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate.setDate(now.getDate() - 7)
      }

      // Filter rentals by date range
      const filteredRentals = rentals.filter((rental) => {
        const rentalDate = new Date(rental.created_at)
        return rentalDate >= startDate
      })

      // Calculate revenue
      const totalRevenue = filteredRentals
        .filter((r) => r.payment_status === 'paid')
        .reduce((sum, r) => sum + (r.total_price || 0), 0)

      // Today's rentals
      const todayStart = new Date(now)
      todayStart.setHours(0, 0, 0, 0)
      const todayRentals = rentals.filter((r) => {
        const rentalDate = new Date(r.created_at)
        return rentalDate >= todayStart
      })

      // New users this month
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const newUsers = users.filter((u) => {
        const userDate = new Date(u.created_at)
        return userDate >= monthStart
      })

      // Fleet status
      const fleetStatus = {
        total: bikes.length,
        active: bikes.filter((b) => b.status === 'available' || b.status === 'rented').length,
        maintenance: bikes.filter((b) => b.status === 'maintenance').length,
        ready: bikes.filter((b) => b.status === 'available' || b.status === 'ready').length,
      }

      return {
        totalRevenue: totalRevenue,
        todayRentals: todayRentals.length,
        newUsers: newUsers.length,
        fleetStatus,
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      throw error
    }
  },

  // Get recent orders
  async getRecentOrders(limit = 10) {
    try {
      const rentals = await rentalService.getAll()
      // Sort by created_at descending and limit
      const sorted = rentals
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit)

      return sorted
    } catch (error) {
      console.error('Error getting recent orders:', error)
      throw error
    }
  },

  // Get quick actions (alerts)
  async getQuickActions() {
    try {
      const [rentals, bikes] = await Promise.all([
        rentalService.getAll(),
        bikeService.getAll(),
      ])

      const actions = []

      // Check for overdue rentals
      const now = new Date()
      const overdueRentals = rentals.filter((r) => {
        if (r.status !== 'active') return false
        const returnDate = new Date(r.return_date)
        return returnDate < now
      })

      if (overdueRentals.length > 0) {
        actions.push({
          type: 'overdue',
          icon: 'error',
          title: `${overdueRentals.length} đơn thuê đã quá hạn trả`,
          subtitle: 'Cần xử lý ngay',
          color: 'red',
        })
      }

      // Check for maintenance bikes
      const maintenanceBikes = bikes.filter((b) => b.status === 'maintenance')
      if (maintenanceBikes.length > 0) {
        actions.push({
          type: 'maintenance',
          icon: 'build',
          title: `${maintenanceBikes.length} xe đang bảo dưỡng`,
          subtitle: 'Cần kiểm tra',
          color: 'yellow',
        })
      }

      // Check for pending rentals
      const pendingRentals = rentals.filter((r) => r.status === 'pending')
      if (pendingRentals.length > 0) {
        actions.push({
          type: 'verification',
          icon: 'person_add',
          title: `${pendingRentals.length} đơn thuê đang chờ xác nhận`,
          subtitle: 'Cần xử lý',
          color: 'blue',
        })
      }

      return actions.slice(0, 3) // Return max 3 actions
    } catch (error) {
      console.error('Error getting quick actions:', error)
      throw error
    }
  },
}

