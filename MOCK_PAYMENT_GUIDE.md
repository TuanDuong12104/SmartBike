# Hướng dẫn Hệ thống Thanh toán Mock

## Tổng quan

Hệ thống thanh toán này là **mock payment system** được thiết kế đặc biệt cho **đồ án**, không cần backend thật hay tích hợp VNPay thực tế. Tất cả được xử lý trên frontend.

## Tính năng

✅ **3 phương thức thanh toán:**
- QR Code
- Thẻ tín dụng/Ghi nợ
- Ví điện tử (VNPay, MoMo, ZaloPay, ShopeePay)

✅ **Xử lý hoàn chỉnh:**
- Validate form thanh toán
- Simulate delay (2-3 giây) giống thật
- Xử lý thành công/thất bại
- Cập nhật database tự động
- Hiển thị kết quả thanh toán

## Cách sử dụng

### 1. Thanh toán bằng QR Code

1. Chọn tab "QR Code"
2. QR code sẽ tự động hiển thị
3. Click "Xác nhận thanh toán"
4. Hệ thống sẽ simulate thanh toán (2-3 giây)
5. Tự động chuyển đến trang thành công

### 2. Thanh toán bằng Thẻ tín dụng/Ghi nợ

1. Chọn tab "Thẻ tín dụng/Ghi nợ"
2. Điền thông tin thẻ:
   - Số thẻ: Bất kỳ (ví dụ: `1234 5678 9012 3456`)
   - Ngày hết hạn: MM/YY (ví dụ: `12/25`)
   - CVV: 3 số (ví dụ: `123`)
   - Tên chủ thẻ: Bất kỳ (ví dụ: `NGUYEN VAN A`)
3. Click "Thanh toán ngay"
4. Hệ thống sẽ validate và xử lý thanh toán
5. Tự động chuyển đến trang thành công

**Lưu ý:** Bạn có thể nhập bất kỳ thông tin nào, hệ thống chỉ validate format, không kiểm tra thẻ thật.

### 3. Thanh toán bằng Ví điện tử

1. Chọn tab "Ví điện tử"
2. Click vào ví muốn sử dụng (VNPay, MoMo, ZaloPay, ShopeePay)
3. Hệ thống sẽ simulate thanh toán (2-3 giây)
4. Tự động chuyển đến trang thành công

## Xử lý lỗi

Hệ thống có simulate một số trường hợp lỗi:

- **5% chance** thanh toán thẻ bị từ chối
- **2% chance** thanh toán ví điện tử thất bại
- Validate form: Nếu thiếu thông tin hoặc format sai sẽ hiển thị lỗi

## Flow thanh toán

```
1. User đặt xe → Tạo rental (status: pending, payment_status: pending)
2. Redirect đến /payment?orderId=XXX
3. User chọn phương thức và thanh toán
4. Mock payment service xử lý (simulate 2-3 giây)
5. Nếu thành công:
   - Cập nhật rental: payment_status = 'paid', status = 'confirmed'
   - Redirect đến /payment/success
6. Nếu thất bại:
   - Hiển thị lỗi trên trang thanh toán
```

## Files liên quan

- `src/services/mockPaymentService.js` - Service xử lý thanh toán mock
- `src/pages/PaymentPage.jsx` - Trang thanh toán
- `src/pages/PaymentSuccessPage.jsx` - Trang thành công
- `src/pages/PaymentCallbackPage.jsx` - Trang callback (giữ lại cho tương thích)

## Ưu điểm cho đồ án

✅ **Không cần backend:** Tất cả xử lý trên frontend
✅ **Không cần API key:** Không cần đăng ký VNPay hay bất kỳ service nào
✅ **Hoàn chỉnh:** Có đầy đủ flow từ đặt hàng đến thanh toán
✅ **Giống thật:** UI/UX giống hệ thống thanh toán thật
✅ **Dễ demo:** Có thể demo ngay mà không cần setup phức tạp

## Lưu ý

⚠️ **Chỉ dùng cho đồ án:** Hệ thống này KHÔNG an toàn cho production
⚠️ **Không có bảo mật thật:** Không có hash, không có verify thật
⚠️ **Mock data:** Tất cả transaction ID và QR code đều là mock

## Demo

Để test hệ thống thanh toán:

1. Đăng nhập/đăng ký tài khoản
2. Chọn xe và đặt thuê
3. Điền thông tin đặt xe
4. Click "Thanh toán"
5. Chọn phương thức thanh toán
6. Thực hiện thanh toán
7. Xem kết quả và kiểm tra lịch sử đơn hàng

## Tips cho báo cáo đồ án

- Có thể giải thích: "Hệ thống sử dụng mock payment để demo, trong production sẽ tích hợp VNPay/MoMo thật"
- Show flow đầy đủ: Đặt hàng → Thanh toán → Xác nhận → Lịch sử
- Highlight tính năng: Nhiều phương thức thanh toán, validate form, xử lý lỗi

