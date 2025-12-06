import { useState, useEffect } from 'react'
import { rentalService } from '../../services/rentalService'

const DeliveryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [deliveryType, setDeliveryType] = useState('delivery') // 'delivery' or 'pickup'
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [deliveryType, searchTerm])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]

      let filters = {}

      if (deliveryType === 'delivery') {
        // Cần giao: rentals với status confirmed/active và pickup_date là hôm nay
        filters.status = 'confirmed' // Hoặc có thể filter trong frontend
      } else {
        // Cần nhận: rentals với status active và return_date là hôm nay
        filters.status = 'active'
      }

      const allRentals = await rentalService.getAll(filters)

      // Filter by date
      const filteredRentals = allRentals.filter((rental) => {
        if (deliveryType === 'delivery') {
          const pickupDate = rental.pickup_date?.split('T')[0]
          return pickupDate === todayStr && (rental.status === 'confirmed' || rental.status === 'pending')
        } else {
          const returnDate = rental.return_date?.split('T')[0]
          return returnDate === todayStr && rental.status === 'active'
        }
      })

      // Filter by search term
      const searchedRentals = searchTerm
        ? filteredRentals.filter(
            (r) =>
              r.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.bike?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : filteredRentals

      setOrders(searchedRentals)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const time = timeString || '00:00'
    return `${time} - ${date.toLocaleDateString('vi-VN')}`
  }

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return

    try {
      // Map delivery status to rental status
      const statusMap = {
        pending: 'pending',
        delivering: 'active',
        delivered: 'completed',
        cancelled: 'cancelled',
      }

      const rentalStatus = statusMap[status] || status

      await rentalService.update(selectedOrder.id, {
        status: rentalStatus,
        notes: notes || selectedOrder.notes,
      })

      await loadOrders()
      handleClosePanel()
      alert('Cập nhật trạng thái thành công!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.')
    }
  }


  const getStatusBadge = (rentalStatus) => {
    // Map rental status to delivery status
    const statusMap = {
      pending: 'pending',
      confirmed: 'pending',
      active: 'delivering',
      completed: 'delivered',
      cancelled: 'cancelled',
    }

    const deliveryStatus = statusMap[rentalStatus] || 'pending'

    const badges = {
      pending: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Chờ xử lý
        </span>
      ),
      delivering: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Đang giao
        </span>
      ),
      delivered: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Đã giao
        </span>
      ),
      cancelled: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Đã hủy
        </span>
      ),
    }
    return badges[deliveryStatus] || badges.pending
  }

  const getDeliveryStatusFromRental = (rentalStatus) => {
    const statusMap = {
      pending: 'pending',
      confirmed: 'pending',
      active: 'delivering',
      completed: 'delivered',
      cancelled: 'cancelled',
    }
    return statusMap[rentalStatus] || 'pending'
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setStatus(getDeliveryStatusFromRental(order.status))
    setNotes(order.notes || '')
  }

  const handleClosePanel = () => {
    setSelectedOrder(null)
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <p className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
              Quản lý Giao/Nhận Xe
            </p>
            <button className="flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                add_circle
              </span>
              <span>Tạo đơn mới</span>
            </button>
          </header>

          {/* Controls: SegmentedButtons, SearchBar, ToolBar */}
          <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex h-12 w-full max-w-sm items-center justify-center rounded-lg bg-background-light dark:bg-background-dark p-1">
                  <label
                    className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-white dark:bg-gray-800 shadow-sm text-primary dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <span className="truncate">Đơn Cần Giao Hôm Nay</span>
                    <input
                      checked={deliveryType === 'delivery'}
                      className="invisible w-0"
                      name="delivery-status"
                      type="radio"
                      value="delivery"
                      onChange={() => setDeliveryType('delivery')}
                    />
                  </label>
                  <label
                    className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${
                      deliveryType === 'pickup'
                        ? 'bg-white dark:bg-gray-800 shadow-sm text-primary dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <span className="truncate">Đơn Cần Nhận Hôm Nay</span>
                    <input
                      checked={deliveryType === 'pickup'}
                      className="invisible w-0"
                      name="delivery-status"
                      type="radio"
                      value="pickup"
                      onChange={() => setDeliveryType('pickup')}
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-gray-500 dark:text-gray-400 flex bg-background-light dark:bg-background-dark items-center justify-center pl-4 rounded-l-lg">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-background-light dark:bg-background-dark h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-sm font-normal leading-normal"
                      placeholder="Tìm theo mã đơn, khách hàng, biển số..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </label>
                <div className="flex gap-1">
                  <button className="h-12 w-12 flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 bg-background-light dark:bg-background-dark rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button className="h-12 w-12 flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 bg-background-light dark:bg-background-dark rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order List Table */}
          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      Mã Đơn Hàng
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Khách Hàng
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Xe (Biển số)
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Thời gian Giao
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right" scope="col">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Không có đơn nào {deliveryType === 'delivery' ? 'cần giao' : 'cần nhận'} hôm nay
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const deliveryStatus = getDeliveryStatusFromRental(order.status)
                      const timeStr =
                        deliveryType === 'delivery'
                          ? formatDateTime(order.pickup_date, order.pickup_time)
                          : formatDateTime(order.return_date, order.return_time)
                      return (
                        <tr
                          key={order.id}
                          className="bg-white dark:bg-gray-900/50 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                          onClick={() => handleOrderClick(order)}
                        >
                          <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {order.user?.full_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {order.bike?.name || 'N/A'} ({order.bike?.license_plate || 'N/A'})
                          </td>
                          <td className="px-6 py-4">{timeStr}</td>
                          <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                          <td className="px-6 py-4 text-right">
                            {deliveryStatus === 'delivered' || deliveryStatus === 'cancelled' ? (
                              <button
                                className="font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                disabled
                              >
                                Đã xong
                              </button>
                            ) : (
                              <button
                                className="font-medium text-primary dark:text-primary-400 hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOrderClick(order)
                                }}
                              >
                                Cập nhật
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <aside className="w-96 flex-shrink-0 bg-white dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col overflow-y-auto">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết Đơn hàng</h2>
              <button
                className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={handleClosePanel}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Mã đơn hàng
                </h3>
                <p className="font-semibold font-mono text-gray-800 dark:text-gray-200">
                  {selectedOrder.order_number}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Thông tin khách hàng
                </h3>
                <div className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
                  <p>
                    <strong className="font-medium">Tên:</strong> {selectedOrder.user?.full_name || 'N/A'}
                  </p>
                  <p>
                    <strong className="font-medium">SĐT:</strong> {selectedOrder.user?.phone || 'N/A'}
                  </p>
                  <p>
                    <strong className="font-medium">Địa chỉ:</strong> {selectedOrder.pickup_location || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Thông tin xe
                </h3>
                <div className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
                  <p>
                    <strong className="font-medium">Tên xe:</strong> {selectedOrder.bike?.name || 'N/A'}
                  </p>
                  <p>
                    <strong className="font-medium">Biển số:</strong> {selectedOrder.bike?.license_plate || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="status-update"
                >
                  Cập nhật trạng thái
                </label>
                <select
                  className="form-select block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-sm focus:border-primary focus:ring-primary text-sm"
                  id="status-update"
                  name="status-update"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="delivering">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="notes"
                >
                  Ghi chú tình trạng xe
                </label>
                <textarea
                  className="form-textarea block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-sm focus:border-primary focus:ring-primary text-sm"
                  id="notes"
                  name="notes"
                  placeholder="Ví dụ: Trầy xước nhẹ ở gương trái, thiếu mũ bảo hiểm..."
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              className="flex-1 h-10 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={handleClosePanel}
            >
              Hủy
            </button>
            <button
              className="flex-1 h-10 px-4 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              onClick={handleStatusUpdate}
            >
              Xác nhận Cập nhật
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}

export default DeliveryManagement


