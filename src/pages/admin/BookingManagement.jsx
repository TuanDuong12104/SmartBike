import { useState, useEffect } from 'react'
import { rentalService } from '../../services/rentalService'
import { adminService } from '../../services/adminService'

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalOrdersChange: '+5.4%',
    pendingOrders: 0,
    pendingOrdersChange: '+2.1%',
    todayRevenue: 0,
    todayRevenueChange: '-1.2%',
  })

  useEffect(() => {
    // Load data khi mount
    loadBookings()
    
    // Auto-refresh khi focus vào window (khi quay lại tab)
    const handleFocus = () => {
      loadBookings()
    }
    window.addEventListener('focus', handleFocus)
    
    // Auto-refresh mỗi 10 giây
    const interval = setInterval(() => {
      loadBookings()
    }, 10000)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    // Reload khi filter thay đổi
    loadBookings()
  }, [searchTerm, selectedStatus])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Loading rentals...')
      const rentals = await rentalService.getAll()
      console.log('Loaded rentals:', rentals.length, rentals)

      // Calculate stats
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayRentals = rentals.filter((r) => {
        const rentalDate = new Date(r.created_at)
        return rentalDate >= todayStart && r.payment_status === 'paid'
      })
      const todayRevenue = todayRentals.reduce((sum, r) => sum + (r.total_price || 0), 0)

      const pendingRentals = rentals.filter((r) => r.status === 'pending')

      setStats({
        totalOrders: rentals.length,
        totalOrdersChange: '+5.4%',
        pendingOrders: pendingRentals.length,
        pendingOrdersChange: '+2.1%',
        todayRevenue: todayRevenue,
        todayRevenueChange: '-1.2%',
      })

      setBookings(rentals)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Có lỗi xảy ra khi tải dữ liệu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      console.log('Loading bookings with filters:', { searchTerm, selectedStatus })
      
      const filters = {}
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus
      }
      if (searchTerm) {
        filters.order_number = searchTerm
      }

      // Always get all rentals for stats
      const allRentals = await rentalService.getAll()
      console.log('All rentals:', allRentals.length, allRentals)
      
      // Apply filters to get filtered rentals
      const filteredRentals = filters.status || filters.order_number 
        ? await rentalService.getAll(filters)
        : allRentals
      
      console.log('Filtered rentals:', filteredRentals.length, filteredRentals)
      setBookings(filteredRentals)
      
      // Update stats from all rentals
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayRentals = allRentals.filter((r) => {
        const rentalDate = new Date(r.created_at)
        return rentalDate >= todayStart && r.payment_status === 'paid'
      })
      const todayRevenue = todayRentals.reduce((sum, r) => sum + (r.total_price || 0), 0)
      const pendingRentals = allRentals.filter((r) => r.status === 'pending')
      
      setStats({
        totalOrders: allRentals.length,
        totalOrdersChange: '+5.4%',
        pendingOrders: pendingRentals.length,
        pendingOrdersChange: '+2.1%',
        todayRevenue: todayRevenue,
        todayRevenueChange: '-1.2%',
      })
    } catch (error) {
      console.error('Error loading bookings:', error)
      alert('Có lỗi xảy ra khi tải dữ liệu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const handleStatusUpdate = async (rentalId, newStatus, currentStatus, paymentStatus) => {
    // Kiểm tra nếu chưa thanh toán thì không cho xác nhận
    if (newStatus === 'confirmed' && paymentStatus !== 'paid') {
      const confirm = window.confirm(
        'Đơn hàng chưa thanh toán. Bạn có muốn xác nhận đơn này không?'
      )
      if (!confirm) return
    }

    // Xác nhận trước khi thay đổi trạng thái
    let confirmMessage = ''
    if (newStatus === 'confirmed') {
      confirmMessage = 'Bạn có chắc chắn muốn xác nhận đơn thuê này không?'
    } else if (newStatus === 'completed') {
      confirmMessage = 'Bạn có chắc chắn muốn hoàn thành đơn thuê này không?'
    } else if (newStatus === 'cancelled') {
      confirmMessage = 'Bạn có chắc chắn muốn hủy đơn thuê này không?'
    }

    if (confirmMessage) {
      const confirmed = window.confirm(confirmMessage)
      if (!confirmed) return
    }

    try {
      setLoading(true)
      
      // Cập nhật status
      await rentalService.update(rentalId, { status: newStatus })
      
      // Reload data
      await loadBookings()
      
      // Thông báo thành công
      alert(`Cập nhật trạng thái thành công! Đơn hàng đã được chuyển sang "${getStatusText(newStatus)}"`)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Đang chờ',
      confirmed: 'Đã xác nhận',
      active: 'Đang thuê',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      overdue: 'Quá hạn',
    }
    return statusMap[status] || status
  }

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Đã xác nhận
        </span>
      ),
      pending: (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Đang chờ
        </span>
      ),
      active: (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Đang thuê
        </span>
      ),
      completed: (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Hoàn thành
        </span>
      ),
      cancelled: (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Đã hủy
        </span>
      ),
      overdue: (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Quá hạn
        </span>
      ),
    }
    return badges[status] || badges.pending
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-normal">
            Tổng đơn trong tháng
          </p>
          <p className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
            {stats.totalOrders}
          </p>
          <p className="text-green-600 text-sm font-medium leading-normal">
            {stats.totalOrdersChange}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-normal">
            Đơn đang chờ
          </p>
          <p className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
            {stats.pendingOrders}
          </p>
          <p className="text-green-600 text-sm font-medium leading-normal">
            {stats.pendingOrdersChange}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-normal">
            Doanh thu hôm nay
          </p>
          <p className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
            {stats.todayRevenue.toLocaleString('vi-VN')}đ
          </p>
          <p className="text-red-600 text-sm font-medium leading-normal">
            {stats.todayRevenueChange}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-grow w-full md:w-auto">
            <label className="flex flex-col min-w-40 h-11 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-500 flex border-none bg-gray-100 dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-gray-800 h-full placeholder:text-gray-500 px-4 pl-2 text-sm font-normal leading-normal"
                  placeholder="Tìm theo tên khách, mã đơn, tên xe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </label>
          </div>
          <div className="flex gap-3 flex-wrap justify-start w-full md:w-auto">
            <button
              onClick={() => loadData()}
              className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white px-4 hover:bg-primary/90 transition-colors"
              title="Làm mới dữ liệu"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              <p className="text-sm font-medium leading-normal">Làm mới</p>
            </button>
            <select
              className="form-select flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal border-none focus:ring-2 focus:ring-primary/50"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="pending">Đang chờ</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="active">Đang thuê</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <button className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal">
                Ngày thuê
              </p>
              <span className="material-symbols-outlined text-gray-500">expand_more</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-4" scope="col">
                  <input
                    className="form-checkbox rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary/50"
                    type="checkbox"
                  />
                </th>
                <th className="px-6 py-3" scope="col">
                  Mã đơn
                </th>
                <th className="px-6 py-3" scope="col">
                  Khách hàng
                </th>
                <th className="px-6 py-3" scope="col">
                  Xe thuê
                </th>
                <th className="px-6 py-3" scope="col">
                  Thời gian
                </th>
                <th className="px-6 py-3" scope="col">
                  Tổng tiền
                </th>
                <th className="px-6 py-3" scope="col">
                  Trạng thái
                </th>
                <th className="px-6 py-3" scope="col">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy đơn thuê nào
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b dark:border-gray-700 ${
                      index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                    }`}
                  >
                    <td className="p-4">
                      <input
                        className="form-checkbox rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary/50"
                        type="checkbox"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {booking.order_number}
                    </td>
                    <td className="px-6 py-4">
                      {booking.user?.full_name || 'N/A'}
                      <br />
                      <span className="text-xs text-gray-500">{booking.user?.phone || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.bike?.name || 'N/A'}
                      <br />
                      <span className="text-xs text-gray-500">{booking.bike?.license_plate || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(booking.pickup_date)} - {formatDate(booking.return_date)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {booking.total_price?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(booking.status)}
                        {booking.payment_status === 'paid' ? (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Đã thanh toán
                          </span>
                        ) : booking.payment_status === 'pending' ? (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            Chưa thanh toán
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed', booking.status, booking.payment_status)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-1"
                            title="Xác nhận đơn"
                            disabled={loading}
                          >
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            Xác nhận
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'active', booking.status, booking.payment_status)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-1"
                            title="Bắt đầu thuê"
                            disabled={loading}
                          >
                            <span className="material-symbols-outlined text-base">play_arrow</span>
                            Bắt đầu
                          </button>
                        )}
                        {booking.status === 'active' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'completed', booking.status, booking.payment_status)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-1"
                            title="Hoàn thành"
                            disabled={loading}
                          >
                            <span className="material-symbols-outlined text-base">done</span>
                            Hoàn thành
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled', booking.status, booking.payment_status)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-1"
                            title="Hủy đơn"
                            disabled={loading}
                          >
                            <span className="material-symbols-outlined text-base">cancel</span>
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <nav aria-label="Table navigation" className="flex items-center justify-between p-4">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Hiển thị <span className="font-semibold text-gray-900 dark:text-white">1-{bookings.length}</span> trên{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{stats.totalOrders}</span>
          </span>
          <ul className="inline-flex -space-x-px text-sm h-8">
            <li>
              <a
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                href="#"
              >
                Trước
              </a>
            </li>
            <li>
              <a
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                href="#"
              >
                1
              </a>
            </li>
            <li>
              <a
                className="flex items-center justify-center px-3 h-8 leading-tight text-primary bg-primary/20 border border-primary hover:bg-primary/30 hover:text-primary dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                href="#"
              >
                2
              </a>
            </li>
            <li>
              <a
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                href="#"
              >
                3
              </a>
            </li>
            <li>
              <a
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                href="#"
              >
                Sau
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default BookingManagement
