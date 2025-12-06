import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { bikeService } from '../../services/bikeService'

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7 ngày qua')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    {
      label: 'Tổng doanh thu (tháng)',
      value: '56,8Tr',
      change: '+5.4%',
      changeType: 'positive',
    },
    {
      label: 'Đơn thuê mới (hôm nay)',
      value: '125',
      change: '+12%',
      changeType: 'positive',
    },
    {
      label: 'Người dùng mới (tháng)',
      value: '82',
      change: '+2.1%',
      changeType: 'positive',
    },
    {
      label: 'Xe đang hoạt động',
      value: '350',
      change: '-1.5%',
      changeType: 'negative',
    },
  ])
  const [fleetStatus, setFleetStatus] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    ready: 0,
  })
  const [quickActions, setQuickActions] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    loadDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardStats, orders, actions] = await Promise.all([
        adminService.getDashboardStats(timeRange),
        adminService.getRecentOrders(5),
        adminService.getQuickActions(),
      ])

      // Format stats
      const formattedStats = [
        {
          label: 'Tổng doanh thu',
          value: `${(dashboardStats.totalRevenue / 1000000).toFixed(1)}Tr`,
          change: '+5.4%',
          changeType: 'positive',
        },
        {
          label: 'Đơn thuê mới (hôm nay)',
          value: dashboardStats.todayRentals.toString(),
          change: '+12%',
          changeType: 'positive',
        },
        {
          label: 'Người dùng mới (tháng)',
          value: dashboardStats.newUsers.toString(),
          change: '+2.1%',
          changeType: 'positive',
        },
        {
          label: 'Xe đang hoạt động',
          value: dashboardStats.fleetStatus.active.toString(),
          change: '-1.5%',
          changeType: 'negative',
        },
      ]

      setStats(formattedStats)
      setRecentOrders(orders)
      setFleetStatus(dashboardStats.fleetStatus)
      setQuickActions(actions)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
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

  const getStatusBadgeClass = (status) => {
    const classes = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      active: 'bg-primary/20 text-primary',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return classes[status] || classes.pending
  }

  const getActionIconClass = (color) => {
    const classes = {
      yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500',
      red: 'bg-red-100 dark:bg-red-900/50 text-red-500',
      blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-500',
    }
    return classes[color] || classes.blue
  }

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-4 items-center mb-8">
        <div className="flex min-w-72 flex-col gap-1">
          <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-[-0.033em]">
            Dashboard
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
            Chào mừng trở lại, Admin! Đây là tổng quan hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:ring-primary focus:border-primary px-3 py-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>Hôm nay</option>
            <option>7 ngày qua</option>
            <option>Tháng này</option>
            <option>Năm nay</option>
          </select>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="truncate">Thêm Xe Mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal">
              {stat.label}
            </p>
            <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
              {stat.value}
            </p>
            <p
              className={`text-sm font-medium leading-normal flex items-center gap-1 ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {stat.changeType === 'positive' ? 'arrow_upward' : 'arrow_downward'}
              </span>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Revenue Chart */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
            <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
              Doanh thu 7 ngày qua
            </p>
            <p className="text-slate-900 dark:text-white tracking-tight text-4xl font-bold leading-tight truncate">
              15,200,000 VNĐ
            </p>
            <div className="flex gap-1 items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                So với tuần trước
              </p>
              <p className="text-green-600 text-sm font-medium leading-normal flex items-center gap-1">
                <span className="material-symbols-outlined text-base">arrow_upward</span>
                +8.2%
              </p>
            </div>
            <div className="flex min-h-[220px] flex-1 flex-col gap-8 py-4">
              <svg
                fill="none"
                height="100%"
                preserveAspectRatio="none"
                viewBox="0 0 475 150"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="#135bec"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                  fill="url(#paint0_linear_chart)"
                ></path>
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint0_linear_chart"
                    x1="236"
                    x2="236"
                    y1="1"
                    y2="149"
                  >
                    <stop stopColor="#135bec" stopOpacity="0.2"></stop>
                    <stop offset="1" stopColor="#135bec" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex justify-around">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
                  <p key={index} className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                    {day}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Các đơn thuê gần đây
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Xem các đơn thuê xe mới nhất trong hệ thống.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      ID Đơn Hàng
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Khách Hàng
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Ngày Thuê
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Chưa có đơn thuê nào
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4">{order.user?.full_name || 'N/A'}</td>
                        <td className="px-6 py-4">{formatDate(order.pickup_date)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/admin/bookings`} className="font-medium text-primary hover:underline">
                            Xem
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Fleet Status Donut Chart */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
            <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
              Tình trạng fleet xe
            </p>
            <div className="relative flex items-center justify-center h-48 w-48 mx-auto">
              <svg
                className="size-full"
                height="36"
                viewBox="0 0 36 36"
                width="36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="stroke-slate-200 dark:stroke-slate-700"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9154943092"
                  strokeWidth="3"
                ></circle>
                <circle
                  className="stroke-primary"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9154943092"
                  strokeDasharray="70, 30"
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></circle>
                <circle
                  className="stroke-yellow-400"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9154943092"
                  strokeDasharray="20, 80"
                  strokeDashoffset="-45"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></circle>
                <circle
                  className="stroke-green-500"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9154943092"
                  strokeDasharray="10, 90"
                  strokeDashoffset="-65"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {fleetStatus.total}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Tổng số xe</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-slate-600 dark:text-slate-300">Đang hoạt động</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {loading ? '...' : fleetStatus.active}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-slate-600 dark:text-slate-300">Đang bảo dưỡng</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {loading ? '...' : fleetStatus.maintenance}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600 dark:text-slate-300">Sẵn sàng</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {loading ? '...' : fleetStatus.ready}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Hoạt động cần chú ý
            </h3>
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : quickActions.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  Không có hoạt động cần chú ý
                </p>
              ) : (
                quickActions.map((action, index) => {
                const iconColorClass = {
                  yellow: 'text-yellow-500',
                  red: 'text-red-500',
                  blue: 'text-blue-500',
                }[action.color] || 'text-blue-500'

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 size-8 rounded-full flex items-center justify-center ${getActionIconClass(
                        action.color
                      )}`}
                    >
                      <span className={`material-symbols-outlined text-lg ${iconColorClass}`}>
                        {action.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {action.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {action.subtitle}
                      </p>
                    </div>
                  </div>
                )
              }))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard

