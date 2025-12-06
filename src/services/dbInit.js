// Database Initialization - Seed data vào database
import dbService from './database'

// Seed data
const seedData = {
  brands: [
    { name: 'Honda', logo_url: 'https://example.com/logos/honda.png' },
    { name: 'Yamaha', logo_url: 'https://example.com/logos/yamaha.png' },
    { name: 'Suzuki', logo_url: 'https://example.com/logos/suzuki.png' },
    { name: 'Vespa', logo_url: 'https://example.com/logos/vespa.png' },
    { name: 'VinFast', logo_url: 'https://example.com/logos/vinfast.png' },
  ],

  categories: [
    { name: 'Xe số', description: 'Xe số tay, phù hợp cho người mới bắt đầu' },
    { name: 'Xe tay ga', description: 'Xe tự động, dễ sử dụng, tiết kiệm nhiên liệu' },
    { name: 'Xe côn tay', description: 'Xe thể thao, mạnh mẽ, phù hợp cho phượt' },
    { name: 'Xe phân khối lớn', description: 'Xe công suất lớn, chuyên nghiệp' },
    { name: 'Xe điện', description: 'Xe điện, thân thiện môi trường' },
  ],

  bikes: [
    {
      name: 'Honda Air Blade 125cc',
      brand_id: 1,
      category_id: 2,
      engine_capacity: '125cc',
      transmission: 'Tự động',
      fuel_consumption: '3L/100km',
      storage_info: 'Cốp rộng',
      price_per_day: 150000,
      status: 'available',
      location: 'Quận 1, TP.HCM',
      description: 'Dòng xe tay ga thể thao, mạnh mẽ và tiết kiệm nhiên liệu',
      license_plate: '29-A1 123.45',
    },
    {
      name: 'Yamaha Grande',
      brand_id: 2,
      category_id: 2,
      engine_capacity: '125cc',
      transmission: 'Tự động',
      fuel_consumption: '2.8L/100km',
      storage_info: 'Cốp rộng',
      price_per_day: 140000,
      status: 'available',
      location: 'Quận 1, TP.HCM',
      description: 'Xe tay ga hiện đại, thiết kế thanh lịch',
      license_plate: '30-B2 678.90',
    },
    {
      name: 'Honda Wave Alpha',
      brand_id: 1,
      category_id: 1,
      engine_capacity: '110cc',
      transmission: 'Số tay',
      fuel_consumption: '2.5L/100km',
      storage_info: 'Giỏ xe',
      price_per_day: 100000,
      status: 'available',
      location: 'Quận 3, TP.HCM',
      description: 'Xe số kinh tế, bền bỉ',
      license_plate: '29-H1 123.45',
    },
    {
      name: 'Suzuki GSX-R150',
      brand_id: 3,
      category_id: 3,
      engine_capacity: '150cc',
      transmission: 'Số tay',
      fuel_consumption: '3.5L/100km',
      storage_info: 'Không có',
      price_per_day: 250000,
      status: 'available',
      location: 'Quận Tân Bình, TP.HCM',
      description: 'Xe côn tay thể thao, hiệu suất cao',
      license_plate: '30-K2 543.21',
    },
    {
      name: 'Vespa Primavera',
      brand_id: 4,
      category_id: 2,
      engine_capacity: '150cc',
      transmission: 'Tự động',
      fuel_consumption: '3.2L/100km',
      storage_info: 'Cốp rộng',
      price_per_day: 200000,
      status: 'available',
      location: 'Quận 1, TP.HCM',
      description: 'Xe tay ga cổ điển, sang trọng',
      license_plate: '29-C1 987.65',
    },
    {
      name: 'Yamaha Exciter 150',
      brand_id: 2,
      category_id: 3,
      engine_capacity: '150cc',
      transmission: 'Số tay',
      fuel_consumption: '3.3L/100km',
      storage_info: 'Không có',
      price_per_day: 180000,
      status: 'available',
      location: 'Quận 1, TP.HCM',
      description: 'Xe côn tay thể thao, trẻ trung',
      license_plate: '34-B2 456.78',
    },
    {
      name: 'Yamaha NVX 155cc',
      brand_id: 2,
      category_id: 2,
      engine_capacity: '155cc',
      transmission: 'Tự động',
      fuel_consumption: '3.1L/100km',
      storage_info: 'Cốp rộng',
      price_per_day: 180000,
      status: 'available',
      location: 'Quận 1, TP.HCM',
      description: 'Xe tay ga thể thao, hiện đại',
      license_plate: '31-D4 456.78',
    },
    {
      name: 'Honda Vision',
      brand_id: 1,
      category_id: 2,
      engine_capacity: '110cc',
      transmission: 'Tự động',
      fuel_consumption: '2.7L/100km',
      storage_info: 'Cốp rộng',
      price_per_day: 120000,
      status: 'available',
      location: 'Quận 3, TP.HCM',
      description: 'Xe tay ga kinh tế, phổ biến',
      license_plate: '29-C3 112.23',
    },
    {
      name: 'VinFast Feliz S',
      brand_id: 5,
      category_id: 5,
      engine_capacity: 'Điện',
      transmission: 'Tự động',
      fuel_consumption: 'Điện',
      storage_info: 'Cốp rộng',
      price_per_day: 150000,
      status: 'maintenance',
      location: 'Quận 1, TP.HCM',
      description: 'Xe điện thân thiện môi trường',
      license_plate: '29-C3 112.23',
    },
  ],

  bike_images: [
    {
      bike_id: 1,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlAraExJhRV_KqdkswZGpVEDr73uUTpKIvYpcNA9bwBAswyfB32RFfGjGzmF4TKzFT8ugnD7ZFHyPig0dy337D1zj4r8TEUmaGwwK5ncXxnkJseAjyZR69_XbyKwFmuzuBU5E3UODYwDly2lXXokHXDLmN0SUu9dgNKthSaQ-SxBDtyOaZgz4cHQEmNKYF8PgFdt1IjZPdRHtDhAo5WYQ6Kw5oAbcEDmOcYO6BFkG_u7d5aM1WMixRsryGULVWls_SR6yXQGpKJ-Y',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 2,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCop5xgbUJoAzJuJDyWG7Vyi9_zJR84GgrxuMFVDpTlNf6ofjEa1a5RWGsepLwGtvjbABjO-7gwKpGGItmwq0uG0uE2Otnu7CemJb4Bqb5tgZkhXSzyuTP-aLM1_WQ0URTbiWI3YrBwoMPIPOWU4EoGE1pEk3WZhFkZgN2Ri2k4vB75XSbQG8C2rhAHhg2RNiUSSGO-6f2fYCT5fLjT6O_i0e6Tdykafftxd5ynBpreV2fDOe6XX7lWPVV4cF75dG6affbVRBYFX58',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 3,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuChf_lc7RqOG9x8DDNjeWb0qyakIqyfGUaeE85hbvRjM1CjrQFTwegYWOBo56-74SfREryqHRzFwT4vDzQtph-twjT9wHlhgRjPeO0MjMBoEkaZt7UNGS9Kw30rZdz6h_BB19O_Urx0qda00B0Ha7Nz8t7o83xoCUG0MnLKOBZbw3lqtQYmS0gyP-fmoKkk22OyVEpVQ6-lZvDhjPaYSRg0z4gTSizpYFNmKeksonIH1PvU2GjPP-Le3EgygJ0x_Z4_BYHNDUNKys4',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 4,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBaCMpfNOYPqimH37OEi09EXvxcsJf8GEitmoD_8Im-iB9atzhRHcb5Cq8P9JMxDdIet4an0_tiZ23PKbLt_6Ba691VhBdSsIK4_xgnw2VSf1lNJmG-bFA-Zl5vIggYkKh_keOLCSMUmjgzNGREFFFVn3GaK1X2uGx7bTsbQDfnYjJBq7w17MsxKZY64mQvZ-6aUvzfOWcbDfFsUtBCkZ7HwDCRcQ1GNSW7hwU4977qHXL9QJbAsdg6CcLX0EzjxgyC_5XpInu5AYA',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 5,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBThkLbYtUIBssFtEndzEkXzkEjSCfEJdWF8bJc4nhllke_tjVe3NGQHsfY465I5Y_X9ytXLOYQfPkt-XVqNnSZX8dmj4hW3_qtggysYrkd8EEEurN9U8ecTDeBFyeH2led7wFvjnukiD1Sw74-YeLq19cK2lAYP7jnBqS71gGAJfmRahmNPpFIVb35LbvqmPWr-3DjXOd9_bAkcsuCJ6T4FQ5RcFC7WcOeMWYCp9nd8H-8npOu4asF7BBaorb01uR5tGmjs5z95ps',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 6,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCFAEksnp7g1xfFVNNG6jNDAS2-xJfL0QAOPXmlcyMmWW7IPE_TtloF7UicuMHjyp_2O6SDCDiAVTg4dQHgW0rXc0FfTcKWW91AqIlUxLfW5hgL-7FtSmvKL2GGez_XTbdbtGHsallFXGO9m83HXlPYh_lsqtONuAWde-xVfCMCHwGjfz-B33IcD0iVwbNJH53ps-u8SHd2tUF7eSQUWhxsyJNvOH7OGMner1Z_IECbcN9GKSfs6v5_JEm6BKuH7DtyG8723hswSzw',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 7,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCFi9CMztJKIJiNBMgdW0Sm-OeOi10GP1gvDv53tOh6LhXhrBXtsfluYEDsHCzbS678jY_Qyx2DC2CKZbefVH8OeFq5xc9dGxJMJK9wBj3SmUCICvfUecgroRZDYGKwoFa_Scjn8x3Ixa3m3kSCZYa7M4pTrq5wsDHfdW6DHjaDtY9ZYlNZFxa1hPd4s80ZI5Fc7AUFIzZAclEdZQ958x2MfKykjoA4tzvq7IJSewYgGmz4ZRJsqdm3kolD9kOX8AIe2opt4fLol1k',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 8,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBewPQdgGocKUBANyZAUjAkei0R3ZrrzfTVrbDajI8LesTrFXsPsGr1TV-PyPg4jDwmmVR-HlnjW2poH4CELsC7o4ppMUGXjYMrS_Og5YNCZUYp5SFIu8Sny-8CQnvrQbFQqoHhYLrVUFQSo36RxSE8SdfjPciShKeMhUk1_xWQT4yeJmuQabJmx0cJhhs-yk6sYNeL10JoaL6AA4mUo11ZFRD6EVF2d-hh8DBHEV3wR_NxPlvk0MMMFVyK9dc-QRcCzFVgpVq6iqw',
      is_primary: 1,
      display_order: 1,
    },
    {
      bike_id: 9,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAmI8imh9KDf_O-KJ3hRN_bqwA7Mwj9hfXadx85Da8CXepDv-RiVLMAtXPls_R4-V9qxoJQfu8YEtuIUMz_cmhr6hnatELZW-gcdzUEvlSVGpxqLahpC0VGhltktKPjezGZUUr5FFXLMrPKmsUP_dK5fxp10ERqf7vJjucCYedIVNCZL5bI28aj18evjd_m37K15PT5-he6UQwo2zqBAIM67JFUxOxkM_2HoanmnoseYzm97nwGcA_f4PHhLN-KWNkD2O586ZBfdP0',
      is_primary: 1,
      display_order: 1,
    },
  ],

  locations: [
    { name: 'Quận 1', address: '123 Đường Phượt, Quận 1', city: 'TP.HCM', district: 'Quận 1', is_active: 1 },
    { name: 'Quận 3', address: '456 Đường ABC, Quận 3', city: 'TP.HCM', district: 'Quận 3', is_active: 1 },
    { name: 'Quận Tân Bình', address: '789 Đường XYZ, Quận Tân Bình', city: 'TP.HCM', district: 'Quận Tân Bình', is_active: 1 },
  ],
}

// Check if database is already seeded
const isSeeded = () => {
  return localStorage.getItem('smartbike_db_seeded') === 'true'
}

// Mark database as seeded
const markSeeded = () => {
  localStorage.setItem('smartbike_db_seeded', 'true')
}

// Ensure admin user exists
const ensureAdminUser = async () => {
  try {
    const { userService } = await import('./userService')
    const adminUser = await userService.getByEmail('admin@smartbike.vn')
    
    if (!adminUser) {
      // Create admin user if doesn't exist
      await dbService.create('users', {
        full_name: 'Admin SmartBike',
        email: 'admin@smartbike.vn',
        phone: '0123456789',
        password_hash: 'admin123', // In production, this should be hashed
        role: 'admin',
        is_verified: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      console.log('Admin user created')
    } else {
      // Ensure admin user has admin role
      if (adminUser.role !== 'admin') {
        await dbService.update('users', adminUser.id, {
          role: 'admin',
          updated_at: new Date().toISOString(),
        })
        console.log('Admin user role updated')
      }
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error)
  }
}

// Initialize and seed database
export const initializeDatabase = async () => {
  try {
    // Always ensure admin user exists
    await ensureAdminUser()

    // Check if already seeded
    if (isSeeded()) {
      console.log('Database already seeded')
      return
    }

    // Seed brands
    for (const brand of seedData.brands) {
      await dbService.create('brands', brand)
    }

    // Seed categories
    for (const category of seedData.categories) {
      await dbService.create('categories', category)
    }

    // Seed bikes
    for (const bike of seedData.bikes) {
      await dbService.create('bikes', bike)
    }

    // Seed bike images
    for (const image of seedData.bike_images) {
      await dbService.create('bike_images', image)
    }

    // Seed locations
    for (const location of seedData.locations) {
      await dbService.create('locations', location)
    }

    // Create demo user (only if doesn't exist)
    try {
      const { userService } = await import('./userService')
      const demoUser = await userService.getByEmail('demo@smartbike.vn')
      if (!demoUser) {
        await dbService.create('users', {
          full_name: 'Demo User',
          email: 'demo@smartbike.vn',
          phone: '0987654321',
          password_hash: '123', // In production, this should be hashed
          role: 'customer',
          is_verified: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error creating demo user:', error)
    }

    // Mark as seeded
    markSeeded()
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Reset database (for development)
export const resetDatabase = async () => {
  localStorage.removeItem('smartbike_db_seeded')
  if (typeof indexedDB !== 'undefined') {
    indexedDB.deleteDatabase(DB_NAME)
    console.log('Database reset. Please refresh the page.')
  }
}

