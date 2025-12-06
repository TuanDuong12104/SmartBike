import { useState, useEffect } from 'react'
import { bikeService } from '../../services/bikeService'

const BikeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [bikes, setBikes] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    ready: 0,
    rented: 0,
    maintenance: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadBikes()
  }, [searchTerm, selectedBrand, selectedType, selectedStatus])

  const loadData = async () => {
    try {
      setLoading(true)
      const [bikesData, brandsData, categoriesData] = await Promise.all([
        bikeService.getAll(),
        bikeService.getBrands(),
        bikeService.getCategories(),
      ])

      setBikes(bikesData)
      setBrands(brandsData)
      setCategories(categoriesData)

      // Calculate stats
      const newStats = {
        total: bikesData.length,
        ready: bikesData.filter((b) => b.status === 'available' || b.status === 'ready').length,
        rented: bikesData.filter((b) => b.status === 'rented').length,
        maintenance: bikesData.filter((b) => b.status === 'maintenance').length,
      }
      setStats(newStats)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBikes = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus === 'ready' ? 'available' : selectedStatus
      }
      if (selectedBrand !== 'all') {
        const brand = brands.find((b) => b.name.toLowerCase() === selectedBrand)
        if (brand) filters.brand_id = brand.id
      }
      if (selectedType !== 'all') {
        const categoryMap = {
          so: 'Xe số',
          ga: 'Xe tay ga',
          dien: 'Xe điện',
        }
        const categoryName = categoryMap[selectedType]
        const category = categories.find((c) => c.name === categoryName)
        if (category) filters.category_id = category.id
      }
      if (searchTerm) {
        filters.search = searchTerm
      }

      const bikesData = await bikeService.getAll(filters)
      setBikes(bikesData)

      // Recalculate stats
      const allBikes = await bikeService.getAll()
      const newStats = {
        total: allBikes.length,
        ready: allBikes.filter((b) => b.status === 'available' || b.status === 'ready').length,
        rented: allBikes.filter((b) => b.status === 'rented').length,
        maintenance: allBikes.filter((b) => b.status === 'maintenance').length,
      }
      setStats(newStats)
    } catch (error) {
      console.error('Error loading bikes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bikeId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return

    try {
      await bikeService.delete(bikeId)
      await loadBikes()
      alert('Xóa xe thành công!')
    } catch (error) {
      console.error('Error deleting bike:', error)
      alert('Có lỗi xảy ra khi xóa xe. Vui lòng thử lại.')
    }
  }


  const getStatusBadge = (status) => {
    const badges = {
      available: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Sẵn sàng
        </span>
      ),
      ready: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Sẵn sàng
        </span>
      ),
      rented: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Đang thuê
        </span>
      ),
      maintenance: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Bảo dưỡng
        </span>
      ),
    }
    return badges[status] || badges.available
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Quản lý Xe
          </h1>
          <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
            Xem, thêm, sửa và xóa thông tin xe máy trong hệ thống.
          </p>
        </div>
        <div className="flex items-center">
          <button className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-wide min-w-0 px-4 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-xl fill">add</span>
            <span className="truncate">Thêm xe mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
          <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">
            Tổng số xe
          </p>
          <p className="tracking-tight text-3xl font-bold leading-tight text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
          <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">
            Sẵn sàng
          </p>
          <p className="tracking-tight text-3xl font-bold leading-tight text-green-600 dark:text-green-400">
            {stats.ready}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
          <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">
            Đang thuê
          </p>
          <p className="tracking-tight text-3xl font-bold leading-tight text-yellow-600 dark:text-yellow-400">
            {stats.rented}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
          <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">
            Bảo dưỡng
          </p>
          <p className="tracking-tight text-3xl font-bold leading-tight text-red-600 dark:text-red-400">
            {stats.maintenance}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
              </div>
              <input
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-10 h-10 text-sm focus:border-primary focus:ring-primary"
                placeholder="Tìm tên xe, biển số..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="block rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 h-10 text-sm focus:border-primary focus:ring-primary px-3"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name.toLowerCase()}>
                  {brand.name}
                </option>
              ))}
            </select>
            <select
              className="block rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 h-10 text-sm focus:border-primary focus:ring-primary px-3"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Tất cả loại xe</option>
              {categories
                .filter((cat) => ['Xe số', 'Xe tay ga', 'Xe điện'].includes(cat.name))
                .map((category) => {
                  const valueMap = {
                    'Xe số': 'so',
                    'Xe tay ga': 'ga',
                    'Xe điện': 'dien',
                  }
                  return (
                    <option key={category.id} value={valueMap[category.name] || category.name.toLowerCase()}>
                      {category.name}
                    </option>
                  )
                })}
            </select>
            <select
              className="block rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 h-10 text-sm focus:border-primary focus:ring-primary px-3"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả tình trạng</option>
              <option value="available">Sẵn sàng</option>
              <option value="rented">Đang thuê</option>
              <option value="maintenance">Bảo dưỡng</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3" scope="col">
                  Thông tin xe
                </th>
                <th className="px-6 py-3" scope="col">
                  Thương hiệu
                </th>
                <th className="px-6 py-3" scope="col">
                  Loại xe
                </th>
                <th className="px-6 py-3" scope="col">
                  Tình trạng
                </th>
                <th className="px-6 py-3" scope="col">
                  Giá thuê/ngày
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
              ) : bikes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy xe nào
                  </td>
                </tr>
              ) : (
                bikes.map((bike) => {
                  const primaryImage = bike.images?.find((img) => img.is_primary) || bike.images?.[0]
                  const imageUrl = primaryImage?.image_url || 'https://via.placeholder.com/400x300'
                  return (
                    <tr
                      key={bike.id}
                      className="bg-white dark:bg-background-dark border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="bg-center bg-no-repeat aspect-video bg-cover rounded-md w-24 shrink-0"
                            style={{ backgroundImage: `url("${imageUrl}")` }}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {bike.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {bike.license_plate || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{bike.brand?.name || 'N/A'}</td>
                      <td className="px-6 py-4">{bike.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4">{getStatusBadge(bike.status)}</td>
                      <td className="px-6 py-4 font-medium">
                        {bike.price_per_day?.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-500 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(bike.id)}
                            className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Hiển thị <span className="font-semibold text-gray-900 dark:text-white">1-{bikes.length}</span> của{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span>
          </span>
          <div className="inline-flex -space-x-px text-sm h-8">
            <a
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              href="#"
            >
              Trước
            </a>
            <a
              aria-current="page"
              className="flex items-center justify-center px-3 h-8 text-primary border border-primary/50 bg-primary/10 hover:bg-primary/20 hover:text-primary dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              href="#"
            >
              1
            </a>
            <a
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              href="#"
            >
              2
            </a>
            <a
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              href="#"
            >
              3
            </a>
            <a
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              href="#"
            >
              Sau
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BikeManagement

