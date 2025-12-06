# Hướng dẫn đăng nhập Admin

## Thông tin đăng nhập Admin

Tài khoản admin đã được tạo tự động trong database với thông tin sau:

- **Email**: `admin@smartbike.vn`
- **Mật khẩu**: `admin123`
- **Role**: `admin`

## Cách đăng nhập

1. Truy cập trang đăng nhập:
   ```
   http://localhost:5173/login
   ```

2. Nhập thông tin:
   - Email: `admin@smartbike.vn`
   - Password: `admin123`

3. Sau khi đăng nhập thành công, bạn sẽ được tự động chuyển đến trang Admin Dashboard:
   ```
   http://localhost:5173/admin
   ```

## Các trang Admin có sẵn

- **Dashboard**: `/admin` - Tổng quan thống kê
- **Quản lý đơn thuê**: `/admin/bookings` - Quản lý các đơn thuê xe
- **Quản lý giao hàng**: `/admin/delivery` - Quản lý giao/nhận xe
- **Quản lý xe**: `/admin/bikes` - Quản lý danh sách xe
- **Quản lý người dùng**: `/admin/users` - Quản lý người dùng
- **Báo cáo**: `/admin/reports` - Xem báo cáo
- **Cài đặt**: `/admin/settings` - Cài đặt hệ thống

## Lưu ý

- Tài khoản admin được tự động tạo khi khởi động ứng dụng lần đầu
- Nếu tài khoản admin chưa tồn tại, hệ thống sẽ tự động tạo khi bạn truy cập
- Trong môi trường production, bạn nên thay đổi mật khẩu mặc định
- Mật khẩu hiện tại chưa được hash (chỉ dùng cho development)

## Bảo mật

⚠️ **Quan trọng**: Trong môi trường production, bạn cần:
1. Hash mật khẩu bằng bcrypt hoặc tương tự
2. Thay đổi mật khẩu mặc định
3. Sử dụng HTTPS
4. Thêm xác thực 2 lớp (2FA) nếu cần

