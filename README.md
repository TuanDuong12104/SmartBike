# SmartBike - Dịch vụ cho thuê xe máy

Ứng dụng web hiện đại cho dịch vụ cho thuê xe máy, được xây dựng với React (Frontend) và Laravel (Backend).

## 🚀 Tính năng

### Khách hàng
- 🔍 Tìm kiếm và lọc xe theo thương hiệu, loại xe, giá, địa điểm
- 📱 Xem chi tiết xe với hình ảnh và thông tin đầy đủ
- 📅 Đặt thuê xe với lựa chọn ngày bắt đầu và kết thúc
- 💳 Thanh toán đơn hàng
- 📋 Xem lịch sử đơn thuê
- 👤 Quản lý thông tin cá nhân

### Admin
- 📊 Dashboard với thống kê tổng quan
- 🚲 Quản lý xe (thêm, sửa, xóa)
- 📦 Quản lý đơn hàng (duyệt, từ chối, hủy)
- 🚚 Quản lý giao/nhận xe
- 👥 Quản lý người dùng
- 📈 Báo cáo và thống kê

## 📋 Yêu cầu hệ thống

### Backend (Laravel)
- PHP >= 8.1
- Composer
- MySQL >= 5.7 hoặc MariaDB >= 10.3
- Extension PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

### Frontend (React)
- Node.js >= 18.0
- npm >= 9.0 hoặc yarn/pnpm

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd SmartBike
```

### 2. Cài đặt Backend (Laravel)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
composer install

# Tạo file .env từ .env.example (nếu chưa có)
cp .env.example .env

# Tạo application key
php artisan key:generate
```

#### Cấu hình Database

Mở file `backend/.env` và cập nhật thông tin database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smartbike
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### Tạo Database

Tạo database MySQL với tên `smartbike`:

```sql
CREATE DATABASE smartbike CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hoặc sử dụng phpMyAdmin hoặc MySQL Workbench để tạo database.

#### Chạy Migrations và Seeders

```bash
# Chạy migrations để tạo bảng
php artisan migrate

# Chạy seeders để thêm dữ liệu mẫu
php artisan db:seed
```

#### Cấu hình CORS và Frontend URL

Trong file `backend/.env`, đảm bảo có:

```env
FRONTEND_URL=http://localhost:5173
```

### 3. Cài đặt Frontend (React)

```bash
# Quay về thư mục gốc
cd ..

# Cài đặt dependencies
npm install
```

#### Cấu hình API URL

Tạo file `.env` ở thư mục gốc (nếu chưa có):

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## ▶️ Chạy chương trình

### Chạy Backend

Mở terminal và chạy:

```bash
cd backend
php artisan serve
```

Backend sẽ chạy tại: `http://localhost:8000`

### Chạy Frontend

Mở terminal mới và chạy:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🔐 Thông tin đăng nhập mặc định

Sau khi chạy seeders, bạn có thể đăng nhập với tài khoản admin:

- **Email**: `admin@smartbike.com`
- **Password**: `password`

Hoặc tài khoản khách hàng:

- **Email**: `customer@example.com`
- **Password**: `password`

> ⚠️ **Lưu ý**: Đây là tài khoản mẫu. Trong môi trường production, hãy đổi mật khẩu ngay!

## 📁 Cấu trúc dự án

```
SmartBike/
├── backend/                 # Laravel Backend API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── Api/     # API Controllers
│   │   │       └── Api/Admin/  # Admin Controllers
│   │   └── Models/          # Eloquent Models
│   ├── database/
│   │   ├── migrations/      # Database migrations
│   │   └── seeders/         # Database seeders
│   ├── routes/
│   │   └── api.php          # API routes
│   └── config/              # Configuration files
│
├── src/                     # React Frontend
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   │   └── admin/           # Admin pages
│   ├── services/            # API services
│   ├── contexts/            # React contexts
│   ├── layouts/             # Layout components
│   └── App.jsx              # Main app component
│
└── README.md
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI library
- **Vite** - Build tool và dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Material Symbols** - Icon font

### Backend
- **Laravel 10** - PHP framework
- **Laravel Sanctum** - API authentication
- **MySQL** - Database
- **Composer** - PHP dependency manager

## 📝 API Endpoints

### Public Endpoints
- `GET /api/bikes` - Lấy danh sách xe
- `GET /api/bikes/{id}` - Lấy chi tiết xe
- `GET /api/brands` - Lấy danh sách thương hiệu
- `GET /api/categories` - Lấy danh sách loại xe
- `POST /api/register` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập

### Protected Endpoints (Yêu cầu authentication)
- `GET /api/rentals` - Lấy danh sách đơn thuê của user
- `POST /api/rentals` - Tạo đơn thuê mới
- `GET /api/rentals/{id}` - Lấy chi tiết đơn thuê
- `PUT /api/rentals/{id}` - Cập nhật đơn thuê
- `POST /api/rentals/{id}/cancel` - Hủy đơn thuê

### Admin Endpoints (Yêu cầu admin role)
- `GET /api/admin/dashboard/stats` - Thống kê dashboard
- `GET /api/admin/rentals` - Lấy tất cả đơn thuê
- `POST /api/admin/rentals/{id}/approve` - Duyệt đơn
- `POST /api/admin/rentals/{id}/reject` - Từ chối đơn
- `POST /api/admin/rentals/{id}/handover` - Xác nhận giao xe
- `POST /api/admin/rentals/{id}/deliver` - Giao xe
- `POST /api/admin/rentals/{id}/pickup` - Nhận xe
- `GET /api/admin/bikes` - Quản lý xe
- `POST /api/admin/bikes` - Tạo xe mới
- `PUT /api/admin/bikes/{id}` - Cập nhật xe
- `DELETE /api/admin/bikes/{id}` - Xóa xe

## 🐛 Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin database trong `backend/.env`
- Đảm bảo database `smartbike` đã được tạo

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trong `backend/.env`
- Kiểm tra `allowed_origins` trong `backend/config/cors.php`

### Frontend không kết nối được API
- Kiểm tra backend đã chạy tại `http://localhost:8000`
- Kiểm tra `VITE_API_BASE_URL` trong file `.env` ở thư mục gốc
- Restart frontend server sau khi thay đổi `.env`

### Lỗi migration
- Chạy `php artisan migrate:fresh` để reset database (⚠️ sẽ xóa dữ liệu)
- Hoặc `php artisan migrate:rollback` để rollback migration cuối

## 📄 License

MIT License

## 👥 Contributors

- SmartBike Team

---

**Lưu ý**: Đây là dự án phát triển. Trong môi trường production, hãy:
- Đổi mật khẩu mặc định
- Cấu hình HTTPS
- Thiết lập environment variables an toàn
- Bật các tính năng bảo mật của Laravel
