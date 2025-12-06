import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, User, Shield, History, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notificationsRef = useRef(null)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  const handleNotificationToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    setIsDropdownOpen(false) // Close user dropdown when opening notifications
  }

  const handleUserDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
    setIsNotificationsOpen(false) // Close notifications when opening user dropdown
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    if (isDropdownOpen || isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, isNotificationsOpen])

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-[#111318] dark:text-white">
              <span className="material-symbols-outlined text-primary text-3xl">electric_moped</span>
              <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">SmartBike</h2>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/')
                  ? 'text-primary dark:text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-300 dark:hover:text-white hover:text-primary'
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/rent"
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/rent')
                  ? 'text-primary dark:text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-300 dark:hover:text-white hover:text-primary'
              }`}
            >
              Thuê xe
            </Link>
            <Link
              to="/#about"
              className={`text-sm font-medium leading-normal transition-colors ${
                location.pathname === '/' && location.hash === '#about'
                  ? 'text-primary dark:text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-300 dark:hover:text-white hover:text-primary'
              }`}
            >
              Về chúng tôi
            </Link>
            <Link
              to="/#contact"
              className={`text-sm font-medium leading-normal transition-colors ${
                location.pathname === '/' && location.hash === '#contact'
                  ? 'text-primary dark:text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-300 dark:hover:text-white hover:text-primary'
              }`}
            >
              Liên hệ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-[#111318] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="truncate">Dashboard</span>
                  </Link>
                )}
                
                {/* Notification Icon with Popover */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isNotificationsOpen ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Notification Popover */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-[1140px] max-w-[90vw] bg-white dark:bg-background-dark shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[650px] overflow-y-auto">
                      {/* Header */}
                      <div className="sticky top-0 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Thông báo
                          </h3>
                          <button
                            onClick={() => setIsNotificationsOpen(false)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            <span className="material-symbols-outlined text-xl">close</span>
                          </button>
                        </div>
                      </div>

                      {/* Toolbar & Filters */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white px-4">
                            <p className="text-sm font-medium leading-normal">Tất cả</p>
                          </button>
                          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark dark:hover:bg-gray-700 hover:bg-gray-100 px-4">
                            <p className="text-[#111318] dark:text-white text-sm font-medium leading-normal">
                              Khuyến mãi
                            </p>
                          </button>
                          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark dark:hover:bg-gray-700 hover:bg-gray-100 px-4">
                            <p className="text-[#111318] dark:text-white text-sm font-medium leading-normal">
                              Bảo trì
                            </p>
                          </button>
                          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark dark:hover:bg-gray-700 hover:bg-gray-100 px-4">
                            <p className="text-[#111318] dark:text-white text-sm font-medium leading-normal">
                              Tài khoản
                            </p>
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-[#616f89] dark:text-gray-400 hover:text-primary dark:hover:text-primary rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20">
                            <span className="material-symbols-outlined">sort</span>
                          </button>
                          <button className="p-2 text-[#616f89] dark:text-gray-400 hover:text-primary dark:hover:text-primary rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20">
                            <span className="material-symbols-outlined">done_all</span>
                          </button>
                        </div>
                      </div>

                      {/* Notification List */}
                      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Unread Notification: Promotion */}
                        <div className="flex gap-4 bg-primary/10 dark:bg-primary/20 px-4 py-5 justify-between hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors duration-200 cursor-pointer">
                          <div className="flex items-start gap-4 w-full">
                            <div className="text-primary flex items-center justify-center rounded-lg bg-white dark:bg-background-dark shrink-0 size-12">
                              <span className="material-symbols-outlined">local_offer</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center gap-1">
                              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">
                                Flash Sale cuối tuần - Giảm 50%!
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                                2 giờ trước
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal mt-1">
                                Ưu đãi đặc biệt cuối tuần, giảm giá 50% cho tất cả các dòng xe tay ga. Đừng bỏ lỡ!
                              </p>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-2">
                              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal w-fit">
                                <span className="truncate">Sử dụng ngay</span>
                              </button>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <div className="bg-primary size-3 rounded-full"></div>
                          </div>
                        </div>

                        {/* Unread Notification: Security */}
                        <div className="flex gap-4 bg-primary/10 dark:bg-primary/20 px-4 py-5 justify-between hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors duration-200 cursor-pointer">
                          <div className="flex items-start gap-4 w-full">
                            <div className="text-primary flex items-center justify-center rounded-lg bg-white dark:bg-background-dark shrink-0 size-12">
                              <span className="material-symbols-outlined">security</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center gap-1">
                              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">
                                Cập nhật chính sách bảo mật</p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                                15 phút trước
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal mt-1">
                                Chúng tôi đã cập nhật chính sách bảo mật để bảo vệ bạn tốt hơn. Vui lòng xem lại để biết
                                thêm chi tiết.
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <div className="bg-primary size-3 rounded-full"></div>
                          </div>
                        </div>

                        {/* Read Notification: Maintenance */}
                        <div className="flex gap-4 bg-white dark:bg-background-dark px-4 py-5 justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                          <div className="flex items-start gap-4 w-full">
                            <div className="text-[#616f89] dark:text-gray-400 flex items-center justify-center rounded-lg bg-background-light dark:bg-gray-800 shrink-0 size-12">
                              <span className="material-symbols-outlined">build</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center gap-1">
                              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">
                                Thông báo bảo trì hệ thống
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                                Hôm qua, 18:00
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal mt-1">
                                Hệ thống sẽ tạm dừng để bảo trì từ 02:00 đến 04:00 sáng ngày mai để nâng cấp dịch vụ.
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <div className="size-3 rounded-full"></div>
                          </div>
                        </div>

                        {/* Read Notification: Account Update */}
                        <div className="flex gap-4 bg-white dark:bg-background-dark px-4 py-5 justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                          <div className="flex items-start gap-4 w-full">
                            <div className="text-[#616f89] dark:text-gray-400 flex items-center justify-center rounded-lg bg-background-light dark:bg-gray-800 shrink-0 size-12">
                              <span className="material-symbols-outlined">person</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center gap-1">
                              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">
                                Cập nhật thông tin tài khoản thành công
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                                2 ngày trước
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal mt-1">
                                Bạn vừa cập nhật thành công số điện thoại liên kết với tài khoản.
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <div className="size-3 rounded-full"></div>
                          </div>
                        </div>

                        {/* Read Notification: Feature Update */}
                        <div className="flex gap-4 bg-white dark:bg-background-dark px-4 py-5 justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                          <div className="flex items-start gap-4 w-full">
                            <div className="text-[#616f89] dark:text-gray-400 flex items-center justify-center rounded-lg bg-background-light dark:bg-gray-800 shrink-0 size-12">
                              <span className="material-symbols-outlined">new_releases</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center gap-1">
                              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">
                                Tính năng mới: Đặt xe theo giờ
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                                5 ngày trước
                              </p>
                              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal mt-1">
                                Trải nghiệm tính năng mới cho phép bạn thuê xe linh hoạt hơn với gói theo giờ siêu tiết
                                kiệm.
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <div className="size-3 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Pagination */}
                      <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#616f89] dark:text-gray-400">
                          <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg bg-primary text-white text-sm font-medium">
                          1
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111318] dark:text-white text-sm font-medium">
                          2
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111318] dark:text-white text-sm font-medium">
                          3
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#616f89] dark:text-gray-400">
                          <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleUserDropdownToggle}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm font-semibold">
                        {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Username */}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                      {user?.full_name || user?.email || 'votuanduong'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                      <div className="py-1">
                        <Link
                          to="/profile/info"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Thông tin cá nhân</span>
                        </Link>
                        <Link
                          to="/profile/security"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Mật khẩu</span>
                        </Link>
                        <Link
                          to="/profile/history"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <History className="w-4 h-4" />
                          <span>Lịch sử thuê xe</span>
                        </Link>
                        <Link
                          to="/profile/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Cài đặt thông báo</span>
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-[#111318] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="truncate">Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Đăng ký</span>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-[#111318] dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

