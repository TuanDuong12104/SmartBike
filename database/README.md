# SmartBike Database

Cấu trúc database cho ứng dụng SmartBike - Dịch vụ cho thuê xe máy.

## Cấu trúc Database

### Các bảng chính:

1. **users** - Người dùng (khách hàng và admin)
2. **brands** - Thương hiệu xe
3. **categories** - Loại xe (xe số, xe tay ga, xe côn tay, etc.)
4. **bikes** - Thông tin xe máy
5. **bike_images** - Hình ảnh của xe
6. **rentals** - Đơn thuê xe
7. **reviews** - Đánh giá từ khách hàng
8. **locations** - Địa điểm cho thuê

## Cài đặt

### SQLite (Development)

```bash
# Tạo database
sqlite3 smartbike.db < schema.sql

# Thêm dữ liệu mẫu
sqlite3 smartbike.db < seed.sql
```

### PostgreSQL (Production)

```bash
# Tạo database
psql -U postgres -d smartbike -f schema.sql

# Thêm dữ liệu mẫu
psql -U postgres -d smartbike -f seed.sql
```

### MySQL (Production)

```bash
# Tạo database
mysql -u root -p smartbike < schema.sql

# Thêm dữ liệu mẫu
mysql -u root -p smartbike < seed.sql
```

## Lưu ý

- File `schema.sql` sử dụng SQLite syntax. Nếu dùng PostgreSQL hoặc MySQL, cần điều chỉnh:
  - `AUTOINCREMENT` → `SERIAL` (PostgreSQL) hoặc `AUTO_INCREMENT` (MySQL)
  - `BOOLEAN` → `BOOLEAN` (PostgreSQL) hoặc `TINYINT(1)` (MySQL)
  - `DATETIME` → `TIMESTAMP` (PostgreSQL/MySQL)

- Password hash trong seed data chỉ là ví dụ. Trong thực tế cần hash password thật bằng bcrypt hoặc argon2.

## Các bảng sẽ thêm sau:

- `payments` - Thanh toán
- `maintenance_logs` - Nhật ký bảo dưỡng
- `notifications` - Thông báo
- `coupons` - Mã giảm giá
- `favorites` - Xe yêu thích của người dùng

