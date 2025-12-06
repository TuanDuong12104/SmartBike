import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { rentalService } from '../services/rentalService'

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')
  const transactionId = searchParams.get('transactionId')
  const [rental, setRental] = useState(null)

  useEffect(() => {
    if (orderId) {
      loadRental()
    }
  }, [orderId])

  const loadRental = async () => {
    try {
      const rentalData = await rentalService.getByOrderNumber(orderId)
      setRental(rentalData)
    } catch (error) {
      console.error('Error loading rental:', error)
    }
  }

  return (
    <main className="flex-1">
      <section className="container mx-auto px-4 py-12 sm:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">
                check_circle
              </span>
            </div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Cảm ơn bạn đã sử dụng dịch vụ của SmartBike
            </p>

            {rental && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold text-[#111318] dark:text-white mb-4">
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mã đơn:</span>
                    <span className="font-semibold text-[#111318] dark:text-white">{rental.order_number}</span>
                  </div>
                  {transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Mã giao dịch:</span>
                      <span className="font-semibold text-[#111318] dark:text-white">{transactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Xe thuê:</span>
                    <span className="font-semibold text-[#111318] dark:text-white">{rental.bike?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                    <span className="font-semibold text-primary">
                      {rental.total_price?.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/profile/history')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Xem lịch sử đơn hàng
              </button>
              <button
                onClick={() => navigate('/rent')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Thuê xe khác
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PaymentSuccessPage

