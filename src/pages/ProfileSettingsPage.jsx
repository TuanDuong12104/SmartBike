import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProfileSettingsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderStatusUpdate: true,
    returnReminder: false,
    promotions: true,
  })

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
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
          <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-[#111318] dark:text-gray-100 text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                Cài đặt thông báo
              </p>
              <p className="mt-1 text-base text-[#616f89] dark:text-gray-400">
                Quản lý các thông báo bạn muốn nhận từ SmartBike.
              </p>
            </div>

            {/* Notification Settings */}
            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
              {/* Order Confirmation */}
              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#111318] dark:text-gray-200">
                    Xác nhận đơn hàng
                  </h3>
                  <p className="mt-1 text-sm text-[#616f89] dark:text-gray-400">
                    Nhận thông báo khi đơn thuê xe của bạn được xác nhận.
                  </p>
                </div>
                <button
                  aria-checked={notifications.orderConfirmation}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-background-dark ${
                    notifications.orderConfirmation
                      ? 'bg-primary'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                  role="switch"
                  type="button"
                  onClick={() => handleToggle('orderConfirmation')}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications.orderConfirmation ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Order Status Update */}
              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#111318] dark:text-gray-200">
                    Cập nhật trạng thái đơn hàng
                  </h3>
                  <p className="mt-1 text-sm text-[#616f89] dark:text-gray-400">
                    Thông báo khi có thay đổi về trạng thái đơn thuê của bạn.
                  </p>
                </div>
                <button
                  aria-checked={notifications.orderStatusUpdate}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-background-dark ${
                    notifications.orderStatusUpdate
                      ? 'bg-primary'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                  role="switch"
                  type="button"
                  onClick={() => handleToggle('orderStatusUpdate')}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications.orderStatusUpdate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Return Reminder */}
              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#111318] dark:text-gray-200">
                    Nhắc nhở trả xe
                  </h3>
                  <p className="mt-1 text-sm text-[#616f89] dark:text-gray-400">
                    Gửi nhắc nhở khi sắp đến hạn trả xe.
                  </p>
                </div>
                <button
                  aria-checked={notifications.returnReminder}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-background-dark ${
                    notifications.returnReminder
                      ? 'bg-primary'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                  role="switch"
                  type="button"
                  onClick={() => handleToggle('returnReminder')}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications.returnReminder ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Promotions */}
              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#111318] dark:text-gray-200">
                    Thông báo khuyến mãi
                  </h3>
                  <p className="mt-1 text-sm text-[#616f89] dark:text-gray-400">
                    Nhận thông tin về các chương trình ưu đãi và mã giảm giá.
                  </p>
                </div>
                <button
                  aria-checked={notifications.promotions}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-background-dark ${
                    notifications.promotions
                      ? 'bg-primary'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                  role="switch"
                  type="button"
                  onClick={() => handleToggle('promotions')}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications.promotions ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfileSettingsPage

