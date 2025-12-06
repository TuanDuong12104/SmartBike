import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'

const ProfileInfoPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      const updatedUser = await userService.update(user.id, {
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      })

      // Update auth context
      if (updateUser) {
        updateUser(updatedUser)
      }

      alert('Cập nhật thông tin thành công!')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
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
                    {isActive('/profile/info') ? 'person' : 'person'}
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
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3 pb-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-[#111318] dark:text-gray-100 text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                Thông tin cá nhân
              </p>
            </div>

            {/* ProfileHeader */}
            <div className="flex pt-6 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex gap-4 items-center">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 w-24"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDF3Uw9lMC0Mpx56Ags2B7O7O_X_hih2Xfi-c7G_fSDF5JFRwuGwBejp_E_S6_qYslgS93JzTyvl4nYHmkb1r5g7L5RmVa5veigy_OwTj7GqJ36mu31RAFEo9KgcYwzICMGc8ldA87hhPPaNYmkkWLLwBflHk4L2yWbfU55rS73FLzm9kNG39jXsowN_IL2dvCZccZ4SsEEVtC3hXtiMIo_v1aGB8x4jcvwcECICZT5L9VFvZrFf_tUYwE4pD_OCV_2RnFhdzW31g")`
                    }}
                  ></div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111318] dark:text-gray-100 text-lg font-bold leading-tight">
                      Ảnh đại diện
                    </p>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                      PNG hoặc JPG, không quá 5MB.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] dark:bg-gray-700 text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal tracking-[0.015em] w-full max-w-[480px] sm:w-auto hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="truncate">Thay đổi ảnh</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form className="flex flex-col gap-6 pt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Họ và tên
                  </p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-12 placeholder:text-[#616f89] dark:placeholder:text-gray-500 px-3.5 py-2.5 text-base font-normal leading-normal"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Số điện thoại
                  </p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-12 placeholder:text-[#616f89] dark:placeholder:text-gray-500 px-3.5 py-2.5 text-base font-normal leading-normal"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Email
                  </p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#616f89] dark:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-gray-50 dark:bg-gray-900 h-12 placeholder:text-[#616f89] dark:placeholder:text-gray-500 px-3.5 py-2.5 text-base font-normal leading-normal"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Địa chỉ
                  </p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-12 placeholder:text-[#616f89] dark:placeholder:text-gray-500 px-3.5 py-2.5 text-base font-normal leading-normal"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] dark:bg-gray-700 text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="truncate">Hủy</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold leading-normal tracking-[0.015em] hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="truncate">{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfileInfoPage

