// Bike Service - Quản lý bikes từ database
import dbService from './database'

export const bikeService = {
  // Get all bikes
  async getAll(filters = {}) {
    try {
      let bikes = await dbService.getAll('bikes')

      // Apply filters
      if (filters.category_id) {
        bikes = bikes.filter((b) => b.category_id === parseInt(filters.category_id))
      }
      if (filters.brand_id) {
        bikes = bikes.filter((b) => b.brand_id === parseInt(filters.brand_id))
      }
      if (filters.status) {
        bikes = bikes.filter((b) => b.status === filters.status)
      }
      if (filters.location) {
        bikes = bikes.filter((b) => b.location?.includes(filters.location))
      }
      if (filters.minPrice) {
        bikes = bikes.filter((b) => b.price_per_day >= parseFloat(filters.minPrice))
      }
      if (filters.maxPrice) {
        bikes = bikes.filter((b) => b.price_per_day <= parseFloat(filters.maxPrice))
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        bikes = bikes.filter(
          (b) =>
            b.name.toLowerCase().includes(searchLower) ||
            b.description?.toLowerCase().includes(searchLower)
        )
      }

      // Get related data
      const bikesWithDetails = await Promise.all(
        bikes.map(async (bike) => {
          const [brand, category, images] = await Promise.all([
            dbService.getById('brands', bike.brand_id),
            dbService.getById('categories', bike.category_id),
            dbService.getAllByIndex('bike_images', 'bike_id', bike.id),
          ])

          return {
            ...bike,
            brand: brand || null,
            category: category || null,
            images: images || [],
          }
        })
      )

      return bikesWithDetails
    } catch (error) {
      console.error('Error getting bikes:', error)
      throw error
    }
  },

  // Get bike by ID
  async getById(id) {
    try {
      const bike = await dbService.getById('bikes', parseInt(id))
      if (!bike) return null

      // Get related data
      const [brand, category, images] = await Promise.all([
        dbService.getById('brands', bike.brand_id),
        dbService.getById('categories', bike.category_id),
        dbService.getAllByIndex('bike_images', 'bike_id', bike.id),
      ])

      return {
        ...bike,
        brand: brand || null,
        category: category || null,
        images: images || [],
      }
    } catch (error) {
      console.error('Error getting bike by ID:', error)
      throw error
    }
  },

  // Create new bike
  async create(bikeData) {
    try {
      const newBike = {
        name: bikeData.name,
        brand_id: bikeData.brand_id,
        category_id: bikeData.category_id,
        engine_capacity: bikeData.engine_capacity || null,
        transmission: bikeData.transmission || null,
        fuel_consumption: bikeData.fuel_consumption || null,
        storage_info: bikeData.storage_info || null,
        price_per_day: bikeData.price_per_day,
        status: bikeData.status || 'available',
        location: bikeData.location || null,
        description: bikeData.description || null,
        license_plate: bikeData.license_plate || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const id = await dbService.create('bikes', newBike)

      // Add images if provided
      if (bikeData.images && bikeData.images.length > 0) {
        for (const image of bikeData.images) {
          await dbService.create('bike_images', {
            bike_id: id,
            image_url: image.url || image,
            is_primary: image.is_primary || false,
            display_order: image.display_order || 0,
            created_at: new Date().toISOString(),
          })
        }
      }

      return await this.getById(id)
    } catch (error) {
      console.error('Error creating bike:', error)
      throw error
    }
  },

  // Update bike
  async update(id, bikeData) {
    try {
      const updateData = {
        ...bikeData,
        updated_at: new Date().toISOString(),
      }
      return await dbService.update('bikes', parseInt(id), updateData)
    } catch (error) {
      console.error('Error updating bike:', error)
      throw error
    }
  },

  // Delete bike
  async delete(id) {
    try {
      // Delete associated images first
      const images = await dbService.getAllByIndex('bike_images', 'bike_id', parseInt(id))
      for (const image of images) {
        await dbService.delete('bike_images', image.id)
      }

      return await dbService.delete('bikes', parseInt(id))
    } catch (error) {
      console.error('Error deleting bike:', error)
      throw error
    }
  },

  // Get brands
  async getBrands() {
    try {
      return await dbService.getAll('brands')
    } catch (error) {
      console.error('Error getting brands:', error)
      throw error
    }
  },

  // Get categories
  async getCategories() {
    try {
      return await dbService.getAll('categories')
    } catch (error) {
      console.error('Error getting categories:', error)
      throw error
    }
  },
}

