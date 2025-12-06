import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bikeService } from '../services/bikeService'
import { rentalService } from '../services/rentalService'
import { useAuth } from '../contexts/AuthContext'

const BookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bike, setBike] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form states
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [returnLocation, setReturnLocation] = useState('')

  useEffect(() => {
    if (!user) {
      alert('Vui lòng đăng nhập để đặt xe')
      navigate('/login')
      return
    }
    loadBike()
  }, [id])

  const loadBike = async () => {
    try {
      setLoading(true)
      const bikeData = await bikeService.getById(id)
      if (!bikeData) {
        navigate('/rent')
        return
      }
      setBike(bikeData)
      
      // Set default pickup location
      if (bikeData.location) {
        setPickupLocation(bikeData.location)
      }
    } catch (error) {
      console.error('Error loading bike:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate rental days
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1 // Minimum 1 day
  }

  // Calculate costs
  const calculateCosts = () => {
    if (!bike) return { dailyPrice: 0, days: 0, serviceFee: 0, discount: 0, discountAmount: 0, subtotal: 0, total: 0 }
    
    const dailyPrice = bike.price_per_day || 0
    const days = calculateDays()
    let discount = 0
    let discountAmount = 0
    let discountDescription = ''

    const serviceFee = 50000 // Fixed service fee
    const subtotal = dailyPrice * days + serviceFee

    // Apply discounts
    if (days > 30) {
      // Thuê trên 30 ngày: giảm 15% tổng số tiền
      discount = 0.15
      discountDescription = 'Giảm 15% (thuê trên 30 ngày)'
    } else if (days > 7) {
      // Thuê trên 7 ngày: giảm 8% tổng số tiền
      discount = 0.08
      discountDescription = 'Giảm 8% (thuê trên 7 ngày)'
    }
    
    if (discount > 0) {
      discountAmount = subtotal * discount
    }

    const total = subtotal - discountAmount

    return {
      dailyPrice,
      days,
      serviceFee,
      discount,
      discountAmount,
      discountDescription,
      subtotal,
      total,
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!pickupDate || !returnDate) {
      alert('Vui lòng chọn ngày nhận và ngày trả xe')
      return
    }

    if (new Date(pickupDate) >= new Date(returnDate)) {
      alert('Ngày trả xe phải sau ngày nhận xe')
      return
    }

    if (new Date(pickupDate) < new Date().setHours(0, 0, 0, 0)) {
      alert('Ngày nhận xe không thể là ngày trong quá khứ')
      return
    }

    if (!pickupLocation.trim()) {
      alert('Vui lòng nhập địa điểm nhận xe')
      return
    }

    try {
      setSubmitting(true)
      const costs = calculateCosts()
      
      console.log('Creating rental with data:', {
        user_id: user.id,
        bike_id: bike.id,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_location: pickupLocation,
        return_location: returnLocation || pickupLocation,
        total_price: costs.total,
        status: 'pending',
        payment_status: 'pending',
      })
      
      // Tạo đơn thuê trước
      const rental = await rentalService.create({
        user_id: user.id,
        bike_id: bike.id,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_location: pickupLocation,
        return_location: returnLocation || pickupLocation,
        total_price: costs.total,
        status: 'pending',
        payment_status: 'pending',
      })

      console.log('Rental created successfully:', rental)

      // Redirect đến trang thanh toán
      navigate(`/payment?orderId=${rental.order_number}`)
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.')
      setSubmitting(false)
    }
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

  if (!bike) {
    return (
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 sm:py-24">
          <div className="max-w-6xl mx-auto text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy xe</p>
          </div>
        </section>
      </main>
    )
  }

  const costs = calculateCosts()

  return (
    <main className="flex-1">
      <section className="container mx-auto px-4 py-12 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-8 @container">
            <div className="grid grid-cols-1 @[800px]:grid-cols-3 gap-6">
              {/* Left Column - Booking Form */}
              <div className="flex flex-col gap-6 @[800px]:col-span-2">
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h1 className="text-2xl font-bold text-[#111318] dark:text-white">Thông tin thuê xe</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Vui lòng điền đầy đủ thông tin để tiến hành đặt xe.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 @[480px]:grid-cols-2 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                        Ngày nhận xe
                      </p>
                      <div className="relative">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 h-14 placeholder:text-[#616f89] dark:placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal"
                          placeholder="Chọn ngày"
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] dark:text-gray-400">
                          calendar_today
                        </span>
                      </div>
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                        Ngày trả xe
                      </p>
                      <div className="relative">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 h-14 placeholder:text-[#616f89] dark:placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal"
                          placeholder="Chọn ngày"
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          min={pickupDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] dark:text-gray-400">
                          calendar_today
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 @[480px]:grid-cols-2 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                        Địa điểm nhận xe
                      </p>
                      <div className="relative">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 h-14 placeholder:text-[#616f89] dark:placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal"
                          placeholder="Nhập địa điểm"
                          type="text"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          required
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] dark:text-gray-400">
                          location_on
                        </span>
                      </div>
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                        Địa điểm trả xe
                      </p>
                      <div className="relative">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 h-14 placeholder:text-[#616f89] dark:placeholder:text-gray-400 pl-12 pr-4 text-base font-normal leading-normal"
                          placeholder="Nhập địa điểm"
                          type="text"
                          value={returnLocation}
                          onChange={(e) => setReturnLocation(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] dark:text-gray-400">
                          location_on
                        </span>
                      </div>
                    </label>
                  </div>
                </form>
              </div>

              {/* Right Column - Cost Summary */}
              <div className="flex flex-col justify-between bg-background-light dark:bg-background-dark rounded-lg p-6">
                <div>
                  <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-4">Tóm tắt chi phí</h3>
                  
                  {/* Basic Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">Giá thuê / ngày</span>
                      <span className="font-medium text-[#111318] dark:text-gray-200">
                        {costs.dailyPrice.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">Thời gian thuê</span>
                      <span className="font-medium text-[#111318] dark:text-gray-200">
                        {costs.days} ngày
                      </span>
                    </div>
                  </div>

                  {/* Calculation */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">
                        Tiền thuê xe
                        <span className="text-xs ml-1">({costs.days} ngày × {costs.dailyPrice.toLocaleString('vi-VN')})</span>
                      </span>
                      <span className="font-medium text-[#111318] dark:text-gray-200">
                        {(costs.dailyPrice * costs.days).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">Phí dịch vụ</span>
                      <span className="font-medium text-[#111318] dark:text-gray-200">
                        {costs.serviceFee.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-[#111318] dark:text-gray-200 font-medium">Tạm tính</span>
                      <span className="text-[#111318] dark:text-gray-200 font-medium">
                        {costs.subtotal.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>

                    {/* Discount */}
                    {costs.discountAmount > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mt-3">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            {costs.discountDescription}
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            -{costs.discountAmount.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Total and Button */}
                <div>
                  <div className="mt-6 pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-lg font-bold text-[#111318] dark:text-white">Tổng cộng</span>
                      <span className="text-2xl font-bold text-primary">
                        {costs.total.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <p className="text-xs text-[#616f89] dark:text-gray-400">
                      Chi phí ước tính, chưa bao gồm phụ phí.
                    </p>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting || !pickupDate || !returnDate || !pickupLocation}
                    className="w-full mt-6 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">
                      {submitting ? 'Đang xử lý...' : 'Tiếp tục đặt xe'}
                    </span>
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

export default BookingPage

