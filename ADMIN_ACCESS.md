# Hướng dẫn truy cập Admin Dashboard

## Cách 1: Truy cập trực tiếp (Dễ nhất)

Vì `AdminRoute` đã được hardcode `isAdmin = true` để test, bạn có thể:

1. **Mở trình duyệt** và truy cập:
   ```
   http://localhost:5173/admin
   ```

2. Bạn sẽ thấy Admin Dashboard ngay lập tức (không cần đăng nhập)

## Cách 2: Đăng nhập với tài khoản Admin

Nếu muốn test với authentication:

1. **Truy cập trang đăng nhập:**
   ```
   http://localhost:5173/login
   ```

2. **Đăng nhập với tài khoản admin mẫu:**
   - Email: `admin@smartbike.vn`
   - Password: `admin123`

3. Sau khi đăng nhập, bạn sẽ được redirect đến `/admin` (dashboard)

4. Hoặc click vào button **"Dashboard"** trong Header (góc phải)

## Các trang Admin có sẵn:

- **Dashboard**: `http://localhost:5173/admin`
  - Overview với stats cards và revenue chart

- **Bike Management**: `http://localhost:5173/admin/bikes`
  - Quản lý danh sách xe

- **Booking Management**: `http://localhost:5173/admin/bookings`
  - Quản lý đơn thuê

- **Settings**: `http://localhost:5173/admin/settings`
  - Cài đặt (placeholder)

## Lưu ý:

- Sidebar navigation sẽ highlight trang hiện tại
- Click vào logo "SmartBike Admin" để quay về Dashboard
- Click "Đăng xuất" ở cuối sidebar để logout
- Click "Về trang chủ" ở top header để quay về trang chủ user

## Troubleshooting:

Nếu không thấy giao diện:
1. Đảm bảo dev server đang chạy: `npm run dev`
2. Kiểm tra console browser có lỗi không
3. Thử refresh trang (Ctrl+F5 hoặc Cmd+Shift+R)

