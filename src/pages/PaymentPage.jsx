import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { rentalService } from '../services/rentalService'
import { mockPaymentService } from '../services/mockPaymentService'

const PaymentPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')
  
  const [rental, setRental] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('qr') // 'qr', 'card', 'ewallet'
  const [processing, setProcessing] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [error, setError] = useState('')
  
  // Card payment form state
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  })

  useEffect(() => {
    if (orderId) {
      loadRental()
    } else {
      navigate('/rent')
    }
  }, [orderId])

  const loadRental = async () => {
    try {
      const rentalData = await rentalService.getByOrderNumber(orderId)
      if (!rentalData) {
        alert('Không tìm thấy đơn hàng')
        navigate('/rent')
        return
      }
      setRental(rentalData)
    } catch (error) {
      console.error('Error loading rental:', error)
      alert('Có lỗi xảy ra khi tải thông tin đơn hàng')
      navigate('/rent')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async () => {
    if (!rental) return
    
    try {
      const qrCode = await mockPaymentService.createQRCode({
        orderId: orderId,
        amount: rental.total_price,
      })
      setQrCodeUrl(qrCode)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  useEffect(() => {
    if (rental && paymentMethod === 'qr') {
      generateQRCode()
    }
  }, [rental, paymentMethod])

  const handlePaymentSuccess = async (result) => {
    try {
      // Cập nhật rental status
      await rentalService.update(rental.id, {
        payment_status: 'paid',
        status: 'confirmed',
      })

      // Redirect đến trang thành công
      navigate(`/payment/success?orderId=${orderId}&transactionId=${result.transactionId}`)
    } catch (error) {
      console.error('Error updating rental:', error)
      alert('Có lỗi xảy ra khi cập nhật đơn hàng')
    }
  }

  const handleCardPayment = async (e) => {
    e.preventDefault()
    if (!rental) return
    
    setError('')
    setProcessing(true)

    try {
      // Validate form
      if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.cardName) {
        setError('Vui lòng điền đầy đủ thông tin thẻ')
        setProcessing(false)
        return
      }

      // Process payment
      const result = await mockPaymentService.processPayment(
        {
          orderId: orderId,
          amount: rental.total_price,
        },
        'card',
        cardInfo
      )

      if (result.success) {
        await handlePaymentSuccess(result)
      } else {
        setError(result.message || 'Thanh toán thất bại')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Error processing card payment:', error)
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.')
      setProcessing(false)
    }
  }

  const handleEwalletPayment = async (walletType) => {
    if (!rental) return
    
    setError('')
    setProcessing(true)

    try {
      const result = await mockPaymentService.processPayment(
        {
          orderId: orderId,
          amount: rental.total_price,
        },
        walletType
      )

      if (result.success) {
        await handlePaymentSuccess(result)
      } else {
        setError(result.message || 'Thanh toán thất bại')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Error processing ewallet payment:', error)
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.')
      setProcessing(false)
    }
  }

  const handleQRPayment = async () => {
    if (!rental) return
    
    setError('')
    setProcessing(true)

    try {
      const result = await mockPaymentService.processPayment(
        {
          orderId: orderId,
          amount: rental.total_price,
        },
        'qr'
      )

      if (result.success) {
        await handlePaymentSuccess(result)
      } else {
        setError(result.message || 'Thanh toán thất bại')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Error processing QR payment:', error)
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.')
      setProcessing(false)
    }
  }

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  if (loading) {
    return (
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 sm:py-24">
          <div className="max-w-6xl mx-auto flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </section>
      </main>
    )
  }

  if (!rental) {
    return (
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 sm:py-24">
          <div className="max-w-6xl mx-auto text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy đơn hàng</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <section className="container mx-auto px-4 py-12 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Payment Methods */}
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#111318] dark:text-white mb-2">
                    Thanh toán đơn hàng
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mã đơn: <span className="font-mono font-semibold">{rental.order_number}</span>
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Payment Method Tabs */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setPaymentMethod('qr')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      paymentMethod === 'qr'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                    }`}
                  >
                    QR Code
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      paymentMethod === 'card'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                    }`}
                  >
                    Thẻ tín dụng/Ghi nợ
                  </button>
                  <button
                    onClick={() => setPaymentMethod('ewallet')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      paymentMethod === 'ewallet'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                    }`}
                  >
                    Ví điện tử
                  </button>
                </div>

                {/* QR Code Payment */}
                {paymentMethod === 'qr' && (
                  <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#111318] dark:text-white">
                      Quét mã QR để thanh toán
                    </h3>
                    {qrCodeUrl && (
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                      </div>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR và thanh toán
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        VNPay
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        Momo
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        ZaloPay
                      </span>
                    </div>
                    <button
                      onClick={handleQRPayment}
                      disabled={processing}
                      className="w-full mt-4 flex items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                    </button>
                  </div>
                )}

                {/* Card Payment */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handleCardPayment} className="flex flex-col gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#111318] dark:text-white">
                      Thanh toán bằng thẻ tín dụng/Ghi nợ
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Số thẻ
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value)
                            setCardInfo(prev => ({ ...prev, cardNumber: formatted }))
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ngày hết hạn
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '')
                              if (value.length >= 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2, 4)
                              }
                              setCardInfo(prev => ({ ...prev, expiryDate: value }))
                            }}
                            placeholder="MM/YY"
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardInputChange}
                            placeholder="123"
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tên chủ thẻ
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardInfo.cardName}
                          onChange={handleCardInputChange}
                          placeholder="NGUYEN VAN A"
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-4 flex items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {processing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        💡 Đây là hệ thống thanh toán mô phỏng cho đồ án. Bạn có thể nhập bất kỳ thông tin nào.
                      </p>
                    </div>
                  </form>
                )}

                {/* E-Wallet Payment */}
                {paymentMethod === 'ewallet' && (
                  <div className="flex flex-col gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#111318] dark:text-white">
                      Thanh toán bằng ví điện tử
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleEwalletPayment('vnpay')}
                        disabled={processing}
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                      >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">VN</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">VNPay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEwalletPayment('momo')}
                        disabled={processing}
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                      >
                        <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-2xl">💳</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">MoMo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEwalletPayment('zalopay')}
                        disabled={processing}
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                      >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-2xl">Z</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ZaloPay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEwalletPayment('shopee')}
                        disabled={processing}
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                      >
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-2xl">🛒</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ShopeePay</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="flex flex-col gap-6 bg-background-light dark:bg-background-dark rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#111318] dark:text-white">Thông tin đơn hàng</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Xe thuê</h3>
                    <p className="text-base font-semibold text-[#111318] dark:text-white">
                      {rental.bike?.name || 'N/A'}
                    </p>
                    {rental.bike?.license_plate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Biển số: {rental.bike.license_plate}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Thời gian thuê</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Nhận xe:</span> {formatDate(rental.pickup_date)}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Trả xe:</span> {formatDate(rental.return_date)}
                      </p>
                    </div>
                  </div>

                  {rental.pickup_location && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Địa điểm nhận xe</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{rental.pickup_location}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tổng tiền</span>
                      <span className="text-2xl font-bold text-primary">
                        {rental.total_price?.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Đã bao gồm phí dịch vụ
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => navigate('/profile/history')}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Xem lịch sử đơn hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PaymentPage
