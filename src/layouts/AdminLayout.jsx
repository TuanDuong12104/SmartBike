import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AdminLayout = () => {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Quản lý Đơn thuê', href: '/admin/bookings', icon: 'receipt_long' },
    { name: 'Quản lý Giao/Nhận Xe', href: '/admin/delivery', icon: 'list_alt' },
    { name: 'Quản lý Xe', href: '/admin/bikes', icon: 'two_wheeler' },
    { name: 'Quản lý Người dùng', href: '/admin/users', icon: 'group' },
    { name: 'Báo cáo & Thống kê', href: '/admin/reports', icon: 'bar_chart' },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-white dark:bg-background-dark dark:border-r dark:border-slate-800 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-3 text-primary px-3 py-2 mb-4">
          <span className="material-symbols-outlined text-3xl">electric_moped</span>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">
            SmartBike
          </h2>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium leading-normal transition-colors ${
                    active
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p>{item.name}</p>
                </Link>
              )
            })}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium leading-normal transition-colors ${
                location.pathname === '/admin/settings'
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined">settings</span>
              <p>Cài đặt</p>
            </Link>

            <div className="flex gap-3 items-center border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgcKIRwoQW_jDQ6OvY-ybN_tTYe2jkIQ6E3ofDYg0QI_2SapPlbwr7GCyD8mb4Hj60-zt3Pa_8Fx7_S_5X1DTHd75fp9UlHrth2xGeHFBGUibi3xaB-p4Bnx7C4rUQizcNA9NBSUgBEv5vd92F2CH4VZpePszshorysTNx3kaAA74jF6V8h_l1xJ2d4i2DcYZUk458Q0E2gY8ucd5TSkPkBcY9PY8Gmio-9D0f_6JbQrWoXetjwoaBvFci1lr6RNcd1wK1d4oj54I")`
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                  {user?.full_name || 'Admin Name'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-4 bg-white dark:bg-background-dark sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">
              {location.pathname === '/admin' && 'Bảng điều khiển'}
              {location.pathname === '/admin/bookings' && 'Quản lý Đơn thuê'}
              {location.pathname === '/admin/delivery' && 'Quản lý Giao/Nhận Xe'}
              {location.pathname === '/admin/bikes' && 'Quản lý Xe'}
              {location.pathname === '/admin/users' && 'Quản lý Người dùng'}
              {location.pathname === '/admin/reports' && 'Báo cáo & Thống kê'}
              {location.pathname === '/admin/settings' && 'Cài đặt'}
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-4 items-center">
            <div className="flex gap-2">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </button>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
              </button>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCfF1Ax7xkwQMV2JLE-tHLTLOJCZWHjKLIFT-O03YARDFse1uB971b0_7HXG-thFv-xBQk8vcqlykukdb85zjXNjsWEWBBfRmSHpHO5ikrk6xKrkqRUgBADxAMgp0sGF8KShKD42CCQ9tfdqKkrh0v9vZXwRvZg7PKQaRKV53DgzB9aBsiTZgyPbaMnxmttUWhRpjkD8Uys-3YQC-qTzgWr_S6l95YEgwJuMDNyFtqNr8UACgp9jHUfWyY187MpNxYk9ZOYNA522k4")`
              }}
            ></div>
          </div>
        </header>

        {/* Page Content */}
        <div
          className={`flex-1 overflow-y-auto ${
            location.pathname === '/admin/delivery' ? '' : 'p-8'
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

