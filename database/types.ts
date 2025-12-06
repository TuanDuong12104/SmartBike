// TypeScript types cho SmartBike Database
// Có thể dùng với TypeORM, Prisma, hoặc các ORM khác

export interface User {
  id: number
  full_name: string
  email: string
  phone?: string
  password_hash: string
  role: 'customer' | 'admin'
  avatar_url?: string
  is_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Brand {
  id: number
  name: string
  logo_url?: string
  created_at: Date
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at: Date
}

export interface Bike {
  id: number
  name: string
  brand_id: number
  category_id: number
  engine_capacity?: string
  transmission?: string
  fuel_consumption?: string
  storage_info?: string
  price_per_day: number
  status: 'available' | 'rented' | 'maintenance' | 'ready'
  location?: string
  description?: string
  created_at: Date
  updated_at: Date
  // Relations
  brand?: Brand
  category?: Category
  images?: BikeImage[]
}

export interface BikeImage {
  id: number
  bike_id: number
  image_url: string
  is_primary: boolean
  display_order: number
  created_at: Date
}

export interface Rental {
  id: number
  user_id: number
  bike_id: number
  order_number: string
  pickup_date: Date
  return_date: Date
  pickup_time?: string
  return_time?: string
  pickup_location?: string
  total_price: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'overdue'
  payment_status: 'pending' | 'paid' | 'refunded'
  notes?: string
  created_at: Date
  updated_at: Date
  // Relations
  user?: User
  bike?: Bike
}

export interface Review {
  id: number
  rental_id: number
  user_id: number
  bike_id: number
  rating: number
  comment?: string
  created_at: Date
  // Relations
  user?: User
  bike?: Bike
  rental?: Rental
}

export interface Location {
  id: number
  name: string
  address?: string
  city?: string
  district?: string
  latitude?: number
  longitude?: number
  is_active: boolean
  created_at: Date
}

// DTOs cho API
export interface CreateBikeDTO {
  name: string
  brand_id: number
  category_id: number
  engine_capacity?: string
  transmission?: string
  fuel_consumption?: string
  storage_info?: string
  price_per_day: number
  location?: string
  description?: string
}

export interface CreateRentalDTO {
  user_id: number
  bike_id: number
  pickup_date: string
  return_date: string
  pickup_time?: string
  return_time?: string
  pickup_location?: string
}

export interface CreateReviewDTO {
  rental_id: number
  user_id: number
  bike_id: number
  rating: number
  comment?: string
}

