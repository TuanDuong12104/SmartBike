// VNPay Payment Service
// Lưu ý: Trong production, việc tạo payment URL và xử lý callback phải được thực hiện ở backend
// Service này giả định bạn đã có backend API để xử lý VNPay

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Tạo payment URL từ VNPay
 * @param {Object} paymentData - Thông tin thanh toán
 * @param {string} paymentData.orderId - Mã đơn hàng
 * @param {number} paymentData.amount - Số tiền (VNĐ)
 * @param {string} paymentData.orderDescription - Mô tả đơn hàng
 * @param {string} paymentData.returnUrl - URL callback sau khi thanh toán
 * @returns {Promise<string>} Payment URL từ VNPay
 */
export const vnpayService = {
  /**
   * Tạo QR code từ VNPay
   * @param {Object} paymentData - Thông tin thanh toán
   * @returns {Promise<string>} QR code URL hoặc data URL
   */
  async createQRCode(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/vnpay/qrcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          orderDescription: paymentData.orderDescription,
          returnUrl: paymentData.returnUrl,
          customerInfo: paymentData.customerInfo || {},
        }),
      })

      if (!response.ok) {
        throw new Error('Không thể tạo QR code')
      }

      const data = await response.json()
      return data.qrCodeUrl || data.qrCodeData
    } catch (error) {
      console.error('Error creating QR code:', error)
      
      // Fallback: Tạo QR code từ payment URL
      if (import.meta.env.DEV) {
        const paymentUrl = await this.createPaymentUrl(paymentData)
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentUrl)}`
      }
      
      throw error
    }
  },

  /**
   * Tạo payment URL
   */
  async createPaymentUrl(paymentData) {
    try {
      // Trong production, gọi API backend để tạo payment URL
      // Backend sẽ xử lý việc tạo hash và các thông tin bảo mật
      const response = await fetch(`${API_BASE_URL}/payment/vnpay/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          orderDescription: paymentData.orderDescription,
          returnUrl: paymentData.returnUrl,
          paymentMethod: paymentData.paymentMethod || 'card', // 'card', 'vnpay', 'momo', etc.
          customerInfo: paymentData.customerInfo || {},
        }),
      })

      if (!response.ok) {
        throw new Error('Không thể tạo payment URL')
      }

      const data = await response.json()
      return data.paymentUrl
    } catch (error) {
      console.error('Error creating VNPay payment URL:', error)
      
      // Fallback: Mock payment URL cho development
      // Trong production, nên throw error thay vì return mock URL
      if (import.meta.env.DEV) {
        console.warn('Using mock VNPay URL for development')
        return this.createMockPaymentUrl(paymentData)
      }
      
      throw error
    }
  },

  /**
   * Xử lý callback từ VNPay
   * @param {Object} queryParams - Query parameters từ VNPay callback
   * @returns {Promise<Object>} Kết quả thanh toán
   */
  async handlePaymentCallback(queryParams) {
    try {
      // Gọi API backend để verify payment
      const response = await fetch(`${API_BASE_URL}/payment/vnpay/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryParams),
      })

      if (!response.ok) {
        throw new Error('Không thể xác thực thanh toán')
      }

      const data = await response.json()
      return {
        success: data.success,
        orderId: data.orderId,
        transactionId: data.transactionId,
        amount: data.amount,
        message: data.message,
      }
    } catch (error) {
      console.error('Error handling VNPay callback:', error)
      throw error
    }
  },

  /**
   * Kiểm tra trạng thái thanh toán
   * @param {string} orderId - Mã đơn hàng
   * @returns {Promise<Object>} Trạng thái thanh toán
   */
  async checkPaymentStatus(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/vnpay/status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Không thể kiểm tra trạng thái thanh toán')
      }

      const data = await response.json()
      return {
        orderId: data.orderId,
        status: data.status, // 'pending', 'paid', 'failed', 'cancelled'
        transactionId: data.transactionId,
        amount: data.amount,
        paidAt: data.paidAt,
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      throw error
    }
  },

  /**
   * Mock payment URL cho development (KHÔNG dùng trong production)
   */
  createMockPaymentUrl(paymentData) {
    // Tạo mock URL với query params giống VNPay
    const baseUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    const params = new URLSearchParams({
      vnp_Amount: (paymentData.amount * 100).toString(), // VNPay yêu cầu amount * 100
      vnp_Command: 'pay',
      vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: paymentData.orderDescription || 'Thanh toan don hang',
      vnp_OrderType: 'other',
      vnp_ReturnUrl: paymentData.returnUrl || `${window.location.origin}/payment/callback`,
      vnp_TmnCode: 'YOUR_TMN_CODE', // Thay bằng TMN Code thật
      vnp_TxnRef: paymentData.orderId,
      vnp_Version: '2.1.0',
    })

    return `${baseUrl}?${params.toString()}`
  },
}

/**
 * Hướng dẫn tích hợp VNPay:
 * 
 * 1. BACKEND SETUP (Bắt buộc):
 *    - Đăng ký tài khoản VNPay tại https://sandbox.vnpayment.vn/
 *    - Lấy TMN Code và Hash Secret từ VNPay
 *    - Tạo API endpoints:
 *      + POST /api/payment/vnpay/create - Tạo payment URL
 *      + POST /api/payment/vnpay/callback - Xử lý callback từ VNPay
 *      + GET /api/payment/vnpay/status/:orderId - Kiểm tra trạng thái
 * 
 * 2. BACKEND IMPLEMENTATION (Node.js/Express example):
 *    - Sử dụng thư viện: npm install vnpay
 *    - Tạo hash từ các tham số theo hướng dẫn của VNPay
 *    - Verify hash khi nhận callback
 * 
 * 3. FRONTEND:
 *    - Gọi vnpayService.createPaymentUrl() để lấy payment URL
 *    - Redirect user đến payment URL
 *    - Xử lý callback tại /payment/callback
 * 
 * 4. ENVIRONMENT VARIABLES:
 *    - VITE_API_BASE_URL: URL của backend API
 */

export default vnpayService

