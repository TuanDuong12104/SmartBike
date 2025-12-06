-- SmartBike Database Seed Data
-- Dữ liệu mẫu để test ứng dụng

-- Thêm thương hiệu
INSERT INTO brands (name, logo_url) VALUES
('Honda', 'https://example.com/logos/honda.png'),
('Yamaha', 'https://example.com/logos/yamaha.png'),
('Suzuki', 'https://example.com/logos/suzuki.png'),
('Vespa', 'https://example.com/logos/vespa.png');

-- Thêm loại xe
INSERT INTO categories (name, description) VALUES
('Xe số', 'Xe số tay, phù hợp cho người mới bắt đầu'),
('Xe tay ga', 'Xe tự động, dễ sử dụng, tiết kiệm nhiên liệu'),
('Xe côn tay', 'Xe thể thao, mạnh mẽ, phù hợp cho phượt'),
('Xe phân khối lớn', 'Xe công suất lớn, chuyên nghiệp');

-- Thêm xe máy
INSERT INTO bikes (name, brand_id, category_id, engine_capacity, transmission, fuel_consumption, storage_info, price_per_day, status, location, description) VALUES
('Honda Air Blade 125cc', 1, 2, '125cc', 'Tự động', '3L/100km', 'Cốp rộng', 150000, 'available', 'Quận 1, TP.HCM', 'Dòng xe tay ga thể thao, mạnh mẽ và tiết kiệm nhiên liệu'),
('Yamaha Grande', 2, 2, '125cc', 'Tự động', '2.8L/100km', 'Cốp rộng', 140000, 'available', 'Quận 1, TP.HCM', 'Xe tay ga hiện đại, thiết kế thanh lịch'),
('Honda Wave Alpha', 1, 1, '110cc', 'Số tay', '2.5L/100km', 'Giỏ xe', 100000, 'available', 'Quận 3, TP.HCM', 'Xe số kinh tế, bền bỉ'),
('Suzuki GSX-R150', 3, 3, '150cc', 'Số tay', '3.5L/100km', 'Không có', 250000, 'available', 'Quận Tân Bình, TP.HCM', 'Xe côn tay thể thao, hiệu suất cao'),
('Vespa Primavera', 4, 2, '150cc', 'Tự động', '3.2L/100km', 'Cốp rộng', 200000, 'available', 'Quận 1, TP.HCM', 'Xe tay ga cổ điển, sang trọng'),
('Yamaha Exciter 150', 2, 3, '150cc', 'Số tay', '3.3L/100km', 'Không có', 180000, 'available', 'Quận 1, TP.HCM', 'Xe côn tay thể thao, trẻ trung'),
('Yamaha NVX 155cc', 2, 2, '155cc', 'Tự động', '3.1L/100km', 'Cốp rộng', 180000, 'available', 'Quận 1, TP.HCM', 'Xe tay ga thể thao, hiện đại'),
('Honda Vision', 1, 2, '110cc', 'Tự động', '2.7L/100km', 'Cốp rộng', 120000, 'available', 'Quận 3, TP.HCM', 'Xe tay ga kinh tế, phổ biến');

-- Thêm hình ảnh xe
INSERT INTO bike_images (bike_id, image_url, is_primary, display_order) VALUES
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlAraExJhRV_KqdkswZGpVEDr73uUTpKIvYpcNA9bwBAswyfB32RFfGjGzmF4TKzFT8ugnD7ZFHyPig0dy337D1zj4r8TEUmaGwwK5ncXxnkJseAjyZR69_XbyKwFmuzuBU5E3UODYwDly2lXXokHXDLmN0SUu9dgNKthSaQ-SxBDtyOaZgz4cHQEmNKYF8PgFdt1IjZPdRHtDhAo5WYQ6Kw5oAbcEDmOcYO6BFkG_u7d5aM1WMixRsryGULVWls_SR6yXQGpKJ-Y', 1, 1),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTwoA3Ghstf2--d1U7-QOsIxw0GpdJi_ceW1kQBAV1rWlDvBVbk22RJclLmEX4UO2ARRXMVE1PHDY9dBG7EvXjvJRKEqYoEWwnkK3iTC-P8mpsaUC7VXR6OWzYF40aK-C8k7MIc3FRnm2x5y3BmuFYvQVIB5ojhmAfkVYlHi9sEis1azQ-hgC3sUhL5bqzmsERGXTIXx0CYnuzCccafRArnfTHrGbGCOZ4tiUuiG_Zkg0EsAPBlcF3JZVUtsBozAhI4lq9da-E61E', 0, 2),
(2, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCop5xgbUJoAzJuJDyWG7Vyi9_zJR84GgrxuMFVDpTlNf6ofjEa1a5RWGsepLwGtvjbABjO-7gwKpGGItmwq0uG0uE2Otnu7CemJb4Bqb5tgZkhXSzyuTP-aLM1_WQ0URTbiWI3YrBwoMPIPOWU4EoGE1pEk3WZhFkZgN2Ri2k4vB75XSbQG8C2rhAHhg2RNiUSSGO-6f2fYCT5fLjT6O_i0e6Tdykafftxd5ynBpreV2fDOe6XX7lWPVV4cF75dG6affbVRBYFX58', 1, 1),
(3, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDptG-spD0xqf6AMkENARz6QJhW8yNh76-0JUS3uTr10vTAta5YOPQp_2lm6yRTr0t0BMNS1W-AYlnqDTY0SmzjVyyqiDQjp7mJ4B_cnyYLfnt2ZFPuPnsqoGzg5Y96yt6eun42daQSsmCPj9b6KU_TmdxHQoCREkfs_gAqgcQxnkpWqNTu7twlxPOIkv90kERzWgbXhofMfCS3b23mM7guNCFXUkgoRD01l9sgCUBGbWJP54ToW6oUgUcJmBDtOtSxMXdUa6TI4G4', 1, 1),
(4, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaCMpfNOYPqimH37OEi09EXvxcsJf8GEitmoD_8Im-iB9atzhRHcb5Cq8P9JMxDdIet4an0_tiZ23PKbLt_6Ba691VhBdSsIK4_xgnw2VSf1lNJmG-bFA-Zl5vIggYkKh_keOLCSMUmjgzNGREFFFVn3GaK1X2uGx7bTsbQDfnYjJBq7w17MsxKZY64mQvZ-6aUvzfOWcbDfFsUtBCkZ7HwDCRcQ1GNSW7hwU4977qHXL9QJbAsdg6CcLX0EzjxgyC_5XpInu5AYA', 1, 1),
(5, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBThkLbYtUIBssFtEndzEkXzkEjSCfEJdWF8bJc4nhllke_tjVe3NGQHsfY465I5Y_X9ytXLOYQfPkt-XVqNnSZX8dmj4hW3_qtggysYrkd8EEEurN9U8ecTDeBFyeH2led7wFvjnukiD1Sw74-YeLq19cK2lAYP7jnBqS71gGAJfmRahmNPpFIVb35LbvqmPWr-3DjXOd9_bAkcsuCJ6T4FQ5RcFC7WcOeMWYCp9nd8H-8npOu4asF7BBaorb01uR5tGmjs5z95ps', 1, 1),
(6, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFAEksnp7g1xfFVNNG6jNDAS2-xJfL0QAOPXmlcyMmWW7IPE_TtloF7UicuMHjyp_2O6SDCDiAVTg4dQHgW0rXc0FfTcKWW91AqIlUxLfW5hgL-7FtSmvKL2GGez_XTbdbtGHsallFXGO9m83HXlPYh_lsqtONuAWde-xVfCMCHwGjfz-B33IcD0iVwbNJH53ps-u8SHd2tUF7eSQUWhxsyJNvOH7OGMner1Z_IECbcN9GKSfs6v5_JEm6BKuH7DtyG8723hswSzw', 1, 1);

-- Thêm địa điểm
INSERT INTO locations (name, address, city, district, is_active) VALUES
('Quận 1', '123 Đường Phượt, Quận 1', 'TP.HCM', 'Quận 1', 1),
('Quận 3', '456 Đường ABC, Quận 3', 'TP.HCM', 'Quận 3', 1),
('Quận Tân Bình', '789 Đường XYZ, Quận Tân Bình', 'TP.HCM', 'Quận Tân Bình', 1);

-- Thêm admin user (password: admin123 - cần hash trong thực tế)
INSERT INTO users (full_name, email, phone, password_hash, role, is_verified) VALUES
('Admin SmartBike', 'admin@smartbike.vn', '0123456789', '$2b$10$example_hash_here', 'admin', 1);

-- Thêm một số đơn thuê mẫu
INSERT INTO rentals (user_id, bike_id, order_number, pickup_date, return_date, total_price, status, payment_status, pickup_location) VALUES
(1, 1, 'SB1205', '2024-01-25', '2024-01-27', 300000, 'completed', 'paid', 'Quận 1, TP.HCM'),
(1, 2, 'SB1204', '2024-01-25', '2024-01-28', 420000, 'active', 'paid', 'Quận 1, TP.HCM'),
(1, 3, 'SB1203', '2024-01-24', '2024-01-26', 200000, 'cancelled', 'refunded', 'Quận 3, TP.HCM');

-- Thêm đánh giá mẫu
INSERT INTO reviews (rental_id, user_id, bike_id, rating, comment) VALUES
(1, 1, 1, 5, 'Xe rất mới, chạy êm và tiết kiệm xăng. Thủ tục thuê xe nhanh gọn. Rất hài lòng!');

