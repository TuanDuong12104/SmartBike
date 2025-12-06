import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { rentalService } from '../services/rentalService'

const ProfileHistoryPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming', 'active', 'history'
  const [rentals, setRentals] = useState([])
  const [allRentals, setAllRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadRentals()
    }
  }, [user])

  useEffect(() => {
    filterRentalsByTab()
  }, [activeTab, allRentals])

  const loadRentals = async () => {
    if (!user) return

    try {
      setLoading(true)
      const filters = { user_id: user.id }
      const rentalsData = await rentalService.getAll(filters)
      setAllRentals(rentalsData)
    } catch (error) {
      console.error('Error loading rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRentalsByTab = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    let filtered = []

    switch (activeTab) {
      case 'upcoming':
        // Sắp tới: pending, confirmed và chưa đến ngày pickup
        filtered = allRentals.filter((rental) => {
          const pickupDate = new Date(rental.pickup_date)
          pickupDate.setHours(0, 0, 0, 0)
          return (
            (rental.status === 'pending' || rental.status === 'confirmed') &&
            pickupDate >= now
          )
        })
        break

      case 'active':
        // Đang thuê: active
        filtered = allRentals.filter((rental) => rental.status === 'active')
        break

      case 'history':
        // Lịch sử: completed, cancelled, hoặc đã quá hạn
        filtered = allRentals.filter((rental) => {
          const returnDate = new Date(rental.return_date)
          returnDate.setHours(23, 59, 59, 999)
          return (
            rental.status === 'completed' ||
            rental.status === 'cancelled' ||
            (rental.status !== 'active' && returnDate < now)
          )
        })
        break

      default:
        filtered = allRentals
    }

    // Sắp xếp: upcoming và active theo pickup_date tăng dần, history theo return_date giảm dần
    filtered.sort((a, b) => {
      if (activeTab === 'history') {
        const dateA = new Date(b.return_date || b.created_at)
        const dateB = new Date(a.return_date || a.created_at)
        return dateA - dateB
      } else {
        const dateA = new Date(a.pickup_date || a.created_at)
        const dateB = new Date(b.pickup_date || b.created_at)
        return dateA - dateB
      }
    })

    setRentals(filtered)
  }


  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xác nhận', class: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' },
      confirmed: { text: 'Đã xác nhận', class: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' },
      active: { text: 'Đang thuê', class: 'bg-primary/20 text-primary' },
      completed: { text: 'Đã hoàn thành', class: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' },
      cancelled: { text: 'Đã hủy', class: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' },
      overdue: { text: 'Quá hạn', class: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' },
    }

    const statusInfo = statusMap[status] || { text: status, class: 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300' }

    return (
      <div className={`px-2.5 py-0.5 rounded-full ${statusInfo.class}`}>
        <p className="text-xs font-medium">{statusInfo.text}</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate()
    const month = date.getMonth() + 1
    const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']
    
    return `${hours}:${minutes}, ${day} ${monthNames[month - 1]}`
  }

  const getBikeImage = (bike) => {
    if (bike?.images && bike.images.length > 0) {
      const primaryImage = bike.images.find((img) => img.is_primary) || bike.images[0]
      return primaryImage.image_url
    }
    return 'https://via.placeholder.com/400x300?text=No+Image'
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex flex-1 justify-center py-5 sm:px-6 lg:px-8">
      <div className="layout-content-container flex flex-col md:flex-row w-full max-w-6xl gap-8 px-4">
        {/* SideNavBar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="flex h-full min-h-fit flex-col justify-between bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqeADvHD6c2iv7RM4IytHrwZ7KsccB-50v2ecaoBI5vQ-UQa4RhsOqT5_qVcP7Y35-e5oMxDsju24KOxbK5Ziv6_G2ljQuQKHqp7cT0FRBClQmRPkeculay1T4ynzew4EeuF24vQGVmjz-CuO6juHc0DIjaPb3pSx1SWglSHEltie5bZc53XvNh9w7JqxqHuIJoc0Q52plXED3ziRNeQVxjr7Rq97O7cyZCoQg-qGryTrokjtulL05mRKXvNy1jnyzE_QaGO9RsoQ")`
                  }}
                ></div>
                <div className="flex flex-col">
                  <h1 className="text-[#111318] dark:text-gray-200 text-base font-semibold leading-normal">
                    {user?.full_name || 'Nguyễn Văn A'}
                  </h1>
                  <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                    {user?.email || 'nva@email.com'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <Link
                  to="/profile/info"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm leading-normal ${
                    isActive('/profile/info')
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-[#111318] dark:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    person
                  </span>
                  <p className={`${isActive('/profile/info') ? 'font-semibold' : 'font-medium'}`}>
                    Thông tin cá nhân
                  </p>
                </Link>
                <Link
                  to="/profile/security"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm leading-normal ${
                    isActive('/profile/security')
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-[#111318] dark:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    lock
                  </span>
                  <p className={`${isActive('/profile/security') ? 'font-semibold' : 'font-medium'}`}>
                    Đổi mật khẩu
                  </p>
                </Link>
                <Link
                  to="/profile/history"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm leading-normal ${
                    isActive('/profile/history')
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-[#111318] dark:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    history
                  </span>
                  <p className={`${isActive('/profile/history') ? 'font-semibold' : 'font-medium'}`}>
                    Lịch sử thuê xe
                  </p>
                </Link>
                <Link
                  to="/profile/settings"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm leading-normal ${
                    isActive('/profile/settings')
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-[#111318] dark:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    notifications
                  </span>
                  <p className={`${isActive('/profile/settings') ? 'font-semibold' : 'font-medium'}`}>
                    Cài đặt thông báo
                  </p>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-[#111318] dark:text-gray-300 dark:hover:text-red-400 hover:text-red-500 text-sm font-medium leading-normal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  logout
                </span>
                <p>Đăng xuất</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 lg:w-4/5 flex flex-col gap-8">
          <div className="bg-white dark:bg-background-dark p-4 sm:p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3">
              <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Quản lý đơn thuê
              </h1>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gray-200 dark:border-gray-700 gap-4 sm:gap-8">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
                    activeTab === 'upcoming'
                      ? 'border-b-primary text-primary'
                      : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Sắp tới</p>
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
                    activeTab === 'active'
                      ? 'border-b-primary text-primary'
                      : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Đang thuê</p>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-b-primary text-primary'
                      : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Lịch sử</p>
                </button>
              </div>
            </div>

            {/* Rental Cards */}
            <div className="flex flex-col gap-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : rentals.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg">Không có đơn thuê nào</p>
                </div>
              ) : (
                rentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="flex flex-col sm:flex-row items-stretch justify-between gap-6 rounded-lg bg-white dark:bg-gray-800/50 p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    {/* Bike Image */}
                    <div
                      className="w-full sm:w-1/3 h-48 sm:h-auto bg-center bg-no-repeat bg-cover rounded-lg"
                      style={{
                        backgroundImage: `url(${getBikeImage(rental.bike)})`,
                      }}
                    />

                    {/* Rental Info */}
                    <div className="flex flex-[2_2_0px] flex-col justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
                            {rental.bike?.name || 'N/A'}
                          </p>
                          {getStatusBadge(rental.status)}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                          Từ {formatDateTime(rental.pickup_date)} - Đến {formatDateTime(rental.return_date)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                          Tổng chi phí: <strong>{rental.total_price?.toLocaleString('vi-VN')}đ</strong>
                        </p>
                        {rental.order_number && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                            Mã đơn: {rental.order_number}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Link
                          to={`/bike/${rental.bike_id}`}
                          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal w-full sm:w-fit hover:bg-primary/90 transition-colors"
                        >
                          <span className="truncate">Xem chi tiết</span>
                        </Link>
                        
                        {/* Cancel button for upcoming rentals */}
                        {(rental.status === 'pending' || rental.status === 'confirmed') && activeTab === 'upcoming' && (
                          <button
                            onClick={async (e) => {
                              e.preventDefault()
                              const confirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn thuê này không?')
                              if (confirmed) {
                                try {
                                  setLoading(true)
                                  await rentalService.update(rental.id, { status: 'cancelled' })
                                  await loadRentals()
                                  alert('Đơn thuê đã được hủy thành công!')
                                } catch (error) {
                                  console.error('Error cancelling rental:', error)
                                  alert('Có lỗi xảy ra khi hủy đơn. Vui lòng thử lại.')
                                } finally {
                                  setLoading(false)
                                }
                              }
                            }}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal w-full sm:w-fit hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            disabled={loading}
                          >
                            <span className="truncate">Huỷ đơn</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfileHistoryPage

