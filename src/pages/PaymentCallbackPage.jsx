import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { vnpayService } from '../services/vnpayService'
import { rentalService } from '../services/rentalService'

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // 'processing', 'success', 'failed'
  const [message, setMessage] = useState('Đang xử lý thanh toán...')

  useEffect(() => {
    handlePaymentCallback()
  }, [])

  const handlePaymentCallback = async () => {
    try {
      // Lấy các tham số từ VNPay callback
      const vnpResponseCode = searchParams.get('vnp_ResponseCode')
      const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus')
      const orderId = searchParams.get('vnp_TxnRef') || searchParams.get('orderId')
      const amount = searchParams.get('vnp_Amount')
      const transactionId = searchParams.get('vnp_TransactionNo')

      if (!orderId) {
        setStatus('failed')
        setMessage('Không tìm thấy mã đơn hàng')
        return
      }

      // Xử lý callback từ VNPay
      const callbackParams = {}
      searchParams.forEach((value, key) => {
        callbackParams[key] = value
      })

      const result = await vnpayService.handlePaymentCallback(callbackParams)

      if (result.success) {
        // Cập nhật trạng thái thanh toán trong database
        const rental = await rentalService.getByOrderNumber(orderId)
        if (rental) {
          await rentalService.update(rental.id, {
            payment_status: 'paid',
            status: 'confirmed', // Chuyển sang confirmed sau khi thanh toán thành công
          })
        }

        setStatus('success')
        setMessage('Thanh toán thành công!')
        
        // Redirect sau 3 giây
        setTimeout(() => {
          navigate('/profile/history')
        }, 3000)
      } else {
        setStatus('failed')
        setMessage(result.message || 'Thanh toán thất bại')
      }
    } catch (error) {
      console.error('Error handling payment callback:', error)
      setStatus('failed')
      setMessage('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.')
    }
  }

  return (
    <main className="flex-1">
      <section className="container mx-auto px-4 py-12 sm:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            {status === 'processing' && (
              <>
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                <h2 className="text-2xl font-bold text-[#111318] dark:text-white mb-2">
                  Đang xử lý thanh toán...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">
                    check_circle
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Thanh toán thành công!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bạn sẽ được chuyển đến trang lịch sử đơn thuê...
                </p>
              </>
            )}

            {status === 'failed' && (
              <>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">
                    cancel
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Thanh toán thất bại
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate('/profile/history')}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Xem lịch sử
                  </button>
                  <button
                    onClick={() => navigate('/rent')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Thuê xe khác
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default PaymentCallbackPage

