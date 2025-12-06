// Database Service - Quản lý database operations
// Sử dụng IndexedDB cho client-side storage

const DB_NAME = 'SmartBikeDB'
const DB_VERSION = 1

let db = null

// Initialize IndexedDB
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Database failed to open')
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      console.log('Database opened successfully')
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result

      // Create object stores
      if (!database.objectStoreNames.contains('users')) {
        const usersStore = database.createObjectStore('users', { keyPath: 'id', autoIncrement: true })
        usersStore.createIndex('email', 'email', { unique: true })
        usersStore.createIndex('role', 'role', { unique: false })
      }

      if (!database.objectStoreNames.contains('brands')) {
        const brandsStore = database.createObjectStore('brands', { keyPath: 'id', autoIncrement: true })
        brandsStore.createIndex('name', 'name', { unique: true })
      }

      if (!database.objectStoreNames.contains('categories')) {
        const categoriesStore = database.createObjectStore('categories', { keyPath: 'id', autoIncrement: true })
        categoriesStore.createIndex('name', 'name', { unique: true })
      }

      if (!database.objectStoreNames.contains('bikes')) {
        const bikesStore = database.createObjectStore('bikes', { keyPath: 'id', autoIncrement: true })
        bikesStore.createIndex('brand_id', 'brand_id', { unique: false })
        bikesStore.createIndex('category_id', 'category_id', { unique: false })
        bikesStore.createIndex('status', 'status', { unique: false })
      }

      if (!database.objectStoreNames.contains('bike_images')) {
        const imagesStore = database.createObjectStore('bike_images', { keyPath: 'id', autoIncrement: true })
        imagesStore.createIndex('bike_id', 'bike_id', { unique: false })
      }

      if (!database.objectStoreNames.contains('rentals')) {
        const rentalsStore = database.createObjectStore('rentals', { keyPath: 'id', autoIncrement: true })
        rentalsStore.createIndex('user_id', 'user_id', { unique: false })
        rentalsStore.createIndex('bike_id', 'bike_id', { unique: false })
        rentalsStore.createIndex('order_number', 'order_number', { unique: true })
        rentalsStore.createIndex('status', 'status', { unique: false })
      }

      if (!database.objectStoreNames.contains('reviews')) {
        const reviewsStore = database.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true })
        reviewsStore.createIndex('rental_id', 'rental_id', { unique: false })
        reviewsStore.createIndex('user_id', 'user_id', { unique: false })
        reviewsStore.createIndex('bike_id', 'bike_id', { unique: false })
      }

      if (!database.objectStoreNames.contains('locations')) {
        database.createObjectStore('locations', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

// Generic CRUD operations
export const dbService = {
  // Create
  async create(storeName, data) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // Read all
  async getAll(storeName) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // Read by ID
  async getById(storeName, id) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // Read by index
  async getByIndex(storeName, indexName, value) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.get(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // Read all by index
  async getAllByIndex(storeName, indexName, value) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // Update
  async update(storeName, id, data) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const existing = getRequest.result
        if (!existing) {
          reject(new Error('Record not found'))
          return
        }

        const updated = { ...existing, ...data, id, updated_at: new Date().toISOString() }
        const putRequest = store.put(updated)

        putRequest.onsuccess = () => resolve(updated)
        putRequest.onerror = () => reject(putRequest.error)
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  },

  // Delete
  async delete(storeName, id) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // Count
  async count(storeName) {
    if (!db) await initDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },
}

// Initialize database on import
if (typeof window !== 'undefined') {
  initDatabase().catch(console.error)
}

export default dbService

