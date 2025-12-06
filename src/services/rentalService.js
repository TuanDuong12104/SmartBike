// Rental Service - Quản lý rentals từ database
import dbService from './database'

// Generate order number
const generateOrderNumber = () => {
  const prefix = 'SB'
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${year}${month}${day}${random}`
}

export const rentalService = {
  // Get all rentals
  async getAll(filters = {}) {
    try {
      let rentals = await dbService.getAll('rentals')

      // Apply filters
      if (filters.user_id) {
        rentals = rentals.filter((r) => r.user_id === parseInt(filters.user_id))
      }
      if (filters.bike_id) {
        rentals = rentals.filter((r) => r.bike_id === parseInt(filters.bike_id))
      }
      if (filters.status) {
        rentals = rentals.filter((r) => r.status === filters.status)
      }
      if (filters.payment_status) {
        rentals = rentals.filter((r) => r.payment_status === filters.payment_status)
      }
      if (filters.order_number) {
        rentals = rentals.filter((r) =>
          r.order_number.toLowerCase().includes(filters.order_number.toLowerCase())
        )
      }

      // Sort by created_at descending
      rentals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      // Get related data
      const rentalsWithDetails = await Promise.all(
        rentals.map(async (rental) => {
          const [user, bike] = await Promise.all([
            dbService.getById('users', rental.user_id),
            dbService.getById('bikes', rental.bike_id),
          ])

          return {
            ...rental,
            user: user || null,
            bike: bike || null,
          }
        })
      )

      return rentalsWithDetails
    } catch (error) {
      console.error('Error getting rentals:', error)
      throw error
    }
  },

  // Get rental by ID
  async getById(id) {
    try {
      const rental = await dbService.getById('rentals', parseInt(id))
      if (!rental) return null

      // Get related data
      const [user, bike] = await Promise.all([
        dbService.getById('users', rental.user_id),
        dbService.getById('bikes', rental.bike_id),
      ])

      return {
        ...rental,
        user: user || null,
        bike: bike || null,
      }
    } catch (error) {
      console.error('Error getting rental by ID:', error)
      throw error
    }
  },

  // Get rental by order number
  async getByOrderNumber(orderNumber) {
    try {
      const rental = await dbService.getByIndex('rentals', 'order_number', orderNumber)
      if (!rental) return null

      // Get related data
      const [user, bike] = await Promise.all([
        dbService.getById('users', rental.user_id),
        dbService.getById('bikes', rental.bike_id),
      ])

      return {
        ...rental,
        user: user || null,
        bike: bike || null,
      }
    } catch (error) {
      console.error('Error getting rental by order number:', error)
      throw error
    }
  },

  // Create new rental
  async create(rentalData) {
    try {
      // Validate bike exists
      const bike = await dbService.getById('bikes', rentalData.bike_id)
      if (!bike) {
        throw new Error('Xe không tồn tại')
      }

      // Use provided total_price if available (already calculated with discounts)
      // Otherwise calculate from bike price
      let totalPrice = rentalData.total_price
      if (!totalPrice) {
        const pickupDate = new Date(rentalData.pickup_date)
        const returnDate = new Date(rentalData.return_date)
        const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)) || 1
        totalPrice = bike.price_per_day * days
      }

      const newRental = {
        user_id: rentalData.user_id,
        bike_id: rentalData.bike_id,
        order_number: generateOrderNumber(),
        pickup_date: rentalData.pickup_date,
        return_date: rentalData.return_date,
        pickup_time: rentalData.pickup_time || null,
        return_time: rentalData.return_time || null,
        pickup_location: rentalData.pickup_location || null,
        return_location: rentalData.return_location || null,
        total_price: totalPrice,
        status: rentalData.status || 'pending',
        payment_status: rentalData.payment_status || 'pending',
        notes: rentalData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log('Creating rental:', newRental)
      const id = await dbService.create('rentals', newRental)
      console.log('Rental created with ID:', id)

      // Update bike status if needed
      if (newRental.status === 'confirmed' || newRental.status === 'active') {
        await dbService.update('bikes', rentalData.bike_id, { status: 'rented' })
      }

      const createdRental = await this.getById(id)
      console.log('Created rental:', createdRental)
      return createdRental
    } catch (error) {
      console.error('Error creating rental:', error)
      throw error
    }
  },

  // Update rental
  async update(id, rentalData) {
    try {
      const updateData = {
        ...rentalData,
        updated_at: new Date().toISOString(),
      }

      const updated = await dbService.update('rentals', parseInt(id), updateData)

      // Update bike status based on rental status
      if (rentalData.status) {
        const rental = await this.getById(id)
        if (rental && rental.bike_id) {
          if (rentalData.status === 'completed' || rentalData.status === 'cancelled') {
            // Khi hoàn thành hoặc hủy, trả xe về available
            await dbService.update('bikes', rental.bike_id, { status: 'available' })
            console.log(`Bike ${rental.bike_id} status updated to available`)
          } else if (rentalData.status === 'confirmed' || rentalData.status === 'active') {
            // Khi xác nhận hoặc đang thuê, đánh dấu xe là rented
            await dbService.update('bikes', rental.bike_id, { status: 'rented' })
            console.log(`Bike ${rental.bike_id} status updated to rented`)
          }
        }
      }

      return updated
    } catch (error) {
      console.error('Error updating rental:', error)
      throw error
    }
  },

  // Delete rental
  async delete(id) {
    try {
      return await dbService.delete('rentals', parseInt(id))
    } catch (error) {
      console.error('Error deleting rental:', error)
      throw error
    }
  },
}

