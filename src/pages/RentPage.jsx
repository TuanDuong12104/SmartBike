import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bikeService } from '../services/bikeService'

const RentPage = () => {
  const [bikes, setBikes] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    bikeTypes: {
      'xe-so': false,
      'xe-tay-ga': false,
      'xe-con-tay': false
    },
    priceRange: 500000,
    brands: {},
    location: 'all',
    search: ''
  })

  // Category mapping: filter key -> category name
  const categoryMap = {
    'xe-so': 'Xe số',
    'xe-tay-ga': 'Xe tay ga',
    'xe-con-tay': 'Xe côn tay',
  }

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Load bikes when filters change
  useEffect(() => {
    loadBikes()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const [bikesData, brandsData, categoriesData] = await Promise.all([
        bikeService.getAll({ status: 'available' }),
        bikeService.getBrands(),
        bikeService.getCategories(),
      ])

      setBikes(bikesData)
      setBrands(brandsData)
      setCategories(categoriesData)

      // Initialize brand filters
      const brandFilters = {}
      brandsData.forEach((brand) => {
        brandFilters[brand.name.toLowerCase()] = false
      })
      setFilters((prev) => ({ ...prev, brands: brandFilters }))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBikes = async () => {
    try {
      setLoading(true)
      const filterParams = {
        status: 'available',
      }

      // Category filter
      const selectedCategories = Object.entries(filters.bikeTypes)
        .filter(([_, selected]) => selected)
        .map(([key]) => {
          const categoryName = categoryMap[key]
          const category = categories.find((c) => c.name === categoryName)
          return category?.id
        })
        .filter(Boolean)

      if (selectedCategories.length > 0) {
        // If multiple categories selected, we'll filter in frontend
        // For now, use first selected category
        filterParams.category_id = selectedCategories[0]
      }

      // Brand filter
      const selectedBrands = Object.entries(filters.brands)
        .filter(([_, selected]) => selected)
        .map(([name]) => {
          const brand = brands.find((b) => b.name.toLowerCase() === name)
          return brand?.id
        })
        .filter(Boolean)

      if (selectedBrands.length > 0) {
        filterParams.brand_id = selectedBrands[0]
      }

      // Price filter
      filterParams.maxPrice = filters.priceRange

      // Location filter
      if (filters.location !== 'all') {
        filterParams.location = filters.location
      }

      // Search filter
      if (filters.search) {
        filterParams.search = filters.search
      }

      const bikesData = await bikeService.getAll(filterParams)
      setBikes(bikesData)
    } catch (error) {
      console.error('Error loading bikes:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleBikeTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      bikeTypes: {
        ...prev.bikeTypes,
        [type]: !prev.bikeTypes[type]
      }
    }))
  }

  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: {
        ...prev.brands,
        [brand]: !prev.brands[brand]
      }
    }))
  }

  const handlePriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      priceRange: parseInt(e.target.value)
    }))
  }

  const handleLocationChange = (e) => {
    setFilters(prev => ({
      ...prev,
      location: e.target.value
    }))
  }

  const handleApplyFilters = () => {
    loadBikes()
  }

  const handleClearFilters = () => {
    const brandFilters = {}
    brands.forEach((brand) => {
      brandFilters[brand.name.toLowerCase()] = false
    })
    setFilters({
      bikeTypes: {
        'xe-so': false,
        'xe-tay-ga': false,
        'xe-con-tay': false
      },
      priceRange: 500000,
      brands: brandFilters,
      location: 'all',
      search: ''
    })
  }

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  // Filter bikes in frontend for multiple category/brand selection
  const filteredBikes = bikes.filter((bike) => {
    // Category filter
    const selectedCategoryKeys = Object.entries(filters.bikeTypes)
      .filter(([_, selected]) => selected)
      .map(([key]) => key)

    if (selectedCategoryKeys.length > 0) {
      const categoryMatch = selectedCategoryKeys.some((key) => {
        const categoryName = categoryMap[key]
        return bike.category?.name === categoryName
      })
      if (!categoryMatch) return false
    }

    // Brand filter
    const selectedBrandNames = Object.entries(filters.brands)
      .filter(([_, selected]) => selected)
      .map(([name]) => name)

    if (selectedBrandNames.length > 0) {
      const brandMatch = selectedBrandNames.some((name) => {
        return bike.brand?.name.toLowerCase() === name
      })
      if (!brandMatch) return false
    }

    // Price filter
    if (bike.price_per_day > filters.priceRange) return false

    // Location filter
    if (filters.location !== 'all') {
      const locationMap = {
        'quan-1': 'Quận 1',
        'quan-3': 'Quận 3',
        'tan-binh': 'Tân Bình',
      }
      const locationName = locationMap[filters.location]
      if (locationName && !bike.location?.includes(locationName)) return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = bike.name.toLowerCase().includes(searchLower)
      const matchesDescription = bike.description?.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesDescription) return false
    }

    return true
  })

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-8">
        <div className="flex flex-col gap-4 text-center items-center">
          <p className="text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Danh sách xe
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
            Khám phá các loại xe máy có sẵn và lựa chọn chiếc xe phù hợp nhất với bạn.
          </p>
          {/* Search Bar */}
          <div className="w-full max-w-2xl mt-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm xe..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-[#111318] dark:text-white">Bộ lọc</h3>
            <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              {/* Bike Type Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Loại xe</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.bikeTypes['xe-so']}
                      onChange={() => handleBikeTypeChange('xe-so')}
                      className="h-4 w-4 rounded text-primary focus:ring-primary/50 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                    />
                    <span className="text-sm">Xe số</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.bikeTypes['xe-tay-ga']}
                      onChange={() => handleBikeTypeChange('xe-tay-ga')}
                      className="h-4 w-4 rounded text-primary focus:ring-primary/50 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                    />
                    <span className="text-sm">Xe tay ga</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.bikeTypes['xe-con-tay']}
                      onChange={() => handleBikeTypeChange('xe-con-tay')}
                      className="h-4 w-4 rounded text-primary focus:ring-primary/50 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                    />
                    <span className="text-sm">Xe côn tay</span>
                  </label>
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Mức giá (/ngày)</h4>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  value={filters.priceRange}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>50.000đ</span>
                  <span>500.000đ</span>
                </div>
                <div className="text-center text-sm text-primary font-semibold mt-2">
                  {filters.priceRange.toLocaleString('vi-VN')}đ
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Thương hiệu</h4>
                <div className="space-y-2">
                  {brands.map((brand) => {
                    const brandKey = brand.name.toLowerCase()
                    return (
                      <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brands[brandKey] || false}
                          onChange={() => handleBrandChange(brandKey)}
                          className="h-4 w-4 rounded text-primary focus:ring-primary/50 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                        />
                        <span className="text-sm">{brand.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Địa điểm</h4>
                <select
                  value={filters.location}
                  onChange={handleLocationChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 focus:ring-primary/50 focus:border-primary text-[#111318] dark:text-white px-3 py-2"
                >
                  <option value="all">Tất cả địa điểm</option>
                  <option value="quan-1">Quận 1</option>
                  <option value="quan-3">Quận 3</option>
                  <option value="tan-binh">Quận Tân Bình</option>
                </select>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleApplyFilters}
                  className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 transition-colors"
                >
                  Áp dụng
                </button>
                <button
                  onClick={handleClearFilters}
                  className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-[#111318] dark:text-white text-sm font-bold leading-normal hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Xoá bộ lọc
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Bike Grid */}
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredBikes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy xe nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBikes.map((bike) => {
                const primaryImage = bike.images?.find((img) => img.is_primary) || bike.images?.[0]
                const imageUrl = primaryImage?.image_url || 'https://via.placeholder.com/400x300'
                return (
                  <div
                    key={bike.id}
                    className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <img
                      className="w-full h-48 object-cover"
                      alt={bike.name}
                      src={imageUrl}
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-[#111318] dark:text-white">{bike.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {bike.brand?.name} • {bike.category?.name}
                      </p>
                      <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Giá thuê/ngày</p>
                        <p className="text-primary font-bold text-xl">
                          {bike.price_per_day?.toLocaleString('vi-VN')} VNĐ
                        </p>
                        <Link
                          to={`/bike/${bike.id}`}
                          className="mt-4 w-full flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          <nav aria-label="Pagination" className="mt-8 flex justify-center">
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <a
                  href="#"
                  className="px-3 py-2 ml-0 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-outlined">chevron_left</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="px-3 py-2 text-primary bg-primary/20 border border-gray-300 dark:border-gray-700 hover:bg-primary/30 dark:hover:bg-primary/40"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="px-3 py-2 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="px-3 py-2 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="px-3 py-2 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  )
}

export default RentPage

