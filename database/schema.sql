-- SmartBike Database Schema
-- Tạo database cho ứng dụng cho thuê xe máy

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng thương hiệu xe
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng loại xe
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng xe máy
CREATE TABLE IF NOT EXISTS bikes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    brand_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    engine_capacity VARCHAR(50),
    transmission VARCHAR(50),
    fuel_consumption VARCHAR(50),
    storage_info VARCHAR(255),
    price_per_day DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK(status IN ('available', 'rented', 'maintenance', 'ready')),
    location VARCHAR(255),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Bảng hình ảnh xe
CREATE TABLE IF NOT EXISTS bike_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bike_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
);

-- Bảng đơn thuê
CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bike_id INTEGER NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    pickup_time TIME,
    return_time TIME,
    pickup_location VARCHAR(255),
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'overdue')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bike_id) REFERENCES bikes(id)
);

-- Bảng đánh giá
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rental_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    bike_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bike_id) REFERENCES bikes(id)
);

-- Bảng địa điểm
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes để tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_bikes_brand ON bikes(brand_id);
CREATE INDEX IF NOT EXISTS idx_bikes_category ON bikes(category_id);
CREATE INDEX IF NOT EXISTS idx_bikes_status ON bikes(status);
CREATE INDEX IF NOT EXISTS idx_rentals_user ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_bike ON rentals(bike_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(pickup_date, return_date);
CREATE INDEX IF NOT EXISTS idx_bike_images_bike ON bike_images(bike_id);

