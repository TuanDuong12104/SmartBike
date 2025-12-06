// Mock Payment Service - Dùng cho đồ án, không cần backend
// Simulate payment gateway giống thật nhưng chỉ xử lý trên frontend

/**
 * Simulate payment processing
 * @param {Object} paymentData - Thông tin thanh toán
 * @returns {Promise<Object>} Kết quả thanh toán
 */
export const mockPaymentService = {
  /**
   * Tạo QR code (mock)
   */
  async createQRCode(paymentData) {
    // Tạo QR code từ order info
    const qrData = JSON.stringify({
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      merchant: 'SmartBike',
    })
    
    // Sử dụng QR code generator online (free)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`
  },

  /**
   * Xử lý thanh toán (mock)
   * @param {Object} paymentData - Thông tin thanh toán
   * @param {string} paymentMethod - Phương thức thanh toán ('card', 'qr', 'ewallet')
   * @param {Object} cardInfo - Thông tin thẻ (nếu thanh toán bằng thẻ)
   * @returns {Promise<Object>} Kết quả thanh toán
   */
  async processPayment(paymentData, paymentMethod = 'card', cardInfo = null) {
    // Simulate API delay (2-3 giây)
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Validate card info nếu thanh toán bằng thẻ
    if (paymentMethod === 'card' && cardInfo) {
      const { cardNumber, expiryDate, cvv, cardName } = cardInfo
      
      // Validate card number (basic check)
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
        return {
          success: false,
          message: 'Số thẻ không hợp lệ',
        }
      }

      // Validate expiry date
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        return {
          success: false,
          message: 'Ngày hết hạn không hợp lệ',
        }
      }

      // Validate CVV
      if (!cvv || cvv.length < 3) {
        return {
          success: false,
          message: 'CVV không hợp lệ',
        }
      }

      // Validate card name
      if (!cardName || cardName.trim().length < 3) {
        return {
          success: false,
          message: 'Tên chủ thẻ không hợp lệ',
        }
      }

      // Simulate 5% chance of failure (giống thật)
      if (Math.random() < 0.05) {
        return {
          success: false,
          message: 'Giao dịch bị từ chối. Vui lòng thử lại hoặc sử dụng thẻ khác.',
        }
      }
    }

    // Simulate 2% chance of failure for other methods
    if (paymentMethod !== 'card' && Math.random() < 0.02) {
      return {
        success: false,
        message: 'Giao dịch thất bại. Vui lòng thử lại.',
      }
    }

    // Generate mock transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`

    return {
      success: true,
      orderId: paymentData.orderId,
      transactionId: transactionId,
      amount: paymentData.amount,
      paymentMethod: paymentMethod,
      paidAt: new Date().toISOString(),
      message: 'Thanh toán thành công!',
    }
  },

  /**
   * Kiểm tra trạng thái thanh toán
   */
  async checkPaymentStatus(orderId) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Trong thực tế, sẽ query database
    // Ở đây chỉ return mock data
    return {
      orderId: orderId,
      status: 'paid',
      transactionId: `TXN${orderId}`,
      paidAt: new Date().toISOString(),
    }
  },
}

export default mockPaymentService

