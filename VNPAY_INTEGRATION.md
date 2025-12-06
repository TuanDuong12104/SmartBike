# Hướng dẫn tích hợp VNPay

## Tổng quan

VNPay đã được tích hợp vào ứng dụng SmartBike. Tuy nhiên, để sử dụng trong production, bạn **BẮT BUỘC** phải có backend server để xử lý thanh toán an toàn.

## Tại sao cần Backend?

- **Bảo mật**: TMN Code và Hash Secret không được lộ ra frontend
- **Xác thực**: Backend cần verify hash từ VNPay để đảm bảo tính toàn vẹn
- **Xử lý callback**: Backend xử lý callback từ VNPay và cập nhật database

## Cấu trúc đã tạo

### Frontend Files:
1. `src/services/vnpayService.js` - Service để gọi API VNPay
2. `src/pages/PaymentCallbackPage.jsx` - Trang xử lý callback từ VNPay
3. `src/pages/BookingPage.jsx` - Đã tích hợp redirect đến VNPay

### Flow thanh toán:
1. User điền form đặt xe → Tạo rental với status `pending`
2. Gọi API backend để tạo VNPay payment URL
3. Redirect user đến VNPay
4. User thanh toán trên VNPay
5. VNPay redirect về `/payment/callback`
6. Backend verify và cập nhật payment_status

## Setup Backend (Node.js/Express)

### 1. Cài đặt dependencies:

```bash
npm install vnpay express cors dotenv
```

### 2. Tạo file `.env`:

```env
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/callback
```

### 3. Tạo API endpoints:

```javascript
// routes/payment.js
const express = require('express');
const router = express.Router();
const vnpay = require('vnpay');
const QRCode = require('qrcode'); // npm install qrcode

const vnpayConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE,
  secretKey: process.env.VNPAY_HASH_SECRET,
  url: process.env.VNPAY_URL,
  returnUrl: process.env.VNPAY_RETURN_URL,
};

// POST /api/payment/vnpay/create
router.post('/vnpay/create', async (req, res) => {
  try {
    const { orderId, amount, orderDescription, returnUrl, customerInfo } = req.body;

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0];

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay yêu cầu amount * 100
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip || '127.0.0.1',
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    // Tạo hash
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', vnpayConfig.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnpayConfig.url + '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({ paymentUrl });
  } catch (error) {
    console.error('Error creating payment URL:', error);
    res.status(500).json({ error: 'Không thể tạo payment URL' });
  }
});

// POST /api/payment/vnpay/callback
router.post('/vnpay/callback', async (req, res) => {
  try {
    const vnp_Params = req.body;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Verify hash
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', vnpayConfig.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];
      const transactionStatus = vnp_Params['vnp_TransactionStatus'];

      if (responseCode === '00' && transactionStatus === '00') {
        // Thanh toán thành công
        // Cập nhật database ở đây
        res.json({
          success: true,
          orderId: orderId,
          transactionId: vnp_Params['vnp_TransactionNo'],
          amount: parseInt(vnp_Params['vnp_Amount']) / 100,
          message: 'Thanh toán thành công',
        });
      } else {
        res.json({
          success: false,
          orderId: orderId,
          message: 'Thanh toán thất bại',
        });
      }
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error handling callback:', error);
    res.status(500).json({ error: 'Lỗi xử lý callback' });
  }
});

// GET /api/payment/vnpay/status/:orderId
router.get('/vnpay/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    // Query database để lấy trạng thái thanh toán
    // const rental = await getRentalByOrderNumber(orderId);
    
    res.json({
      orderId: orderId,
      status: 'paid', // 'pending', 'paid', 'failed', 'cancelled'
      transactionId: 'transaction_id',
      amount: 0,
      paidAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Lỗi kiểm tra trạng thái' });
  }
});

// POST /api/payment/vnpay/qrcode
router.post('/vnpay/qrcode', async (req, res) => {
  try {
    const { orderId, amount, orderDescription, returnUrl, customerInfo } = req.body;

    // Tạo payment URL trước
    const date = new Date();
    const createDate = date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0];

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip || '127.0.0.1',
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    // Tạo hash và payment URL
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', vnpayConfig.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnpayConfig.url + '?' + querystring.stringify(vnp_Params, { encode: false });

    // Tạo QR code từ payment URL
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
      width: 300,
      margin: 2,
    });

    res.json({ qrCodeUrl: qrCodeDataUrl, paymentUrl: paymentUrl });
  } catch (error) {
    console.error('Error creating QR code:', error);
    res.status(500).json({ error: 'Không thể tạo QR code' });
  }
});

module.exports = router;
```

## Environment Variables

Thêm vào file `.env` của frontend:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing với Sandbox

1. Đăng ký tài khoản tại: https://sandbox.vnpayment.vn/
2. Lấy TMN Code và Hash Secret
3. Cấu hình trong backend `.env`
4. Test với các thẻ test của VNPay

## Lưu ý quan trọng

- ⚠️ **KHÔNG BAO GIỜ** đặt TMN Code và Hash Secret trong frontend code
- ⚠️ Luôn verify hash từ VNPay trước khi cập nhật database
- ⚠️ Xử lý timeout và error cases
- ⚠️ Log tất cả transactions để audit

## Tài liệu tham khảo

- VNPay Documentation: https://sandbox.vnpayment.vn/apis/
- VNPay Integration Guide: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-online/

