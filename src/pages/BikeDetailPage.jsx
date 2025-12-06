import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { bikeService } from '../services/bikeService'
import { useAuth } from '../contexts/AuthContext'

const BikeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bike, setBike] = useState(null)
  const [similarBikes, setSimilarBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    loadBike()
  }, [id])

  const loadBike = async () => {
    try {
      setLoading(true)
      const bikeData = await bikeService.getById(id)
      if (!bikeData) {
        navigate('/rent')
        return
      }
      setBike(bikeData)

      // Load similar bikes (same category, different bike)
      const similar = await bikeService.getAll({
        category_id: bikeData.category_id,
        status: 'available',
      })
      setSimilarBikes(similar.filter((b) => b.id !== bikeData.id).slice(0, 4))
    } catch (error) {
      console.error('Error loading bike:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRent = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thuê xe')
      navigate('/login')
      return
    }

    if (bike.status !== 'available') {
      alert('Xe hiện không khả dụng')
      return
    }

    // Navigate to booking page
    navigate(`/booking/${bike.id}`)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-xl ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))
  }

  if (loading) {
    return (
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-20 py-10">
        <div className="mx-auto max-w-6xl flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  if (!bike) {
    return (
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-20 py-10">
        <div className="mx-auto max-w-6xl text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy xe</p>
        </div>
      </main>
    )
  }

  const bikeImages = bike.images?.map((img) => img.image_url) || []
  const primaryImage = bikeImages[selectedImage] || bikeImages[0] || 'https://via.placeholder.com/800x600'

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-20 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link to="/" className="text-[#616f89] dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary">
            Trang chủ
          </Link>
          <span className="text-[#616f89] dark:text-gray-400 text-sm font-medium leading-normal">/</span>
          <Link to="/rent" className="text-[#616f89] dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary">
            {bike.category?.name || 'Danh sách xe'}
          </Link>
          <span className="text-[#616f89] dark:text-gray-400 text-sm font-medium leading-normal">/</span>
          <span className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal">{bike.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full grow bg-white dark:bg-background-dark">
              <div className="w-full gap-1 overflow-hidden bg-white dark:bg-background-dark aspect-[4/3] rounded-xl flex">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-xl flex-1 shadow-md"
                  style={{ backgroundImage: `url("${primaryImage}")` }}
                ></div>
              </div>
            </div>
            {bikeImages.length > 1 && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-3">
                {bikeImages.map((image, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <div
                      className={`w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg cursor-pointer transition-opacity ${
                        index === selectedImage
                          ? 'border-2 border-primary opacity-100'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setSelectedImage(index)}
                      style={{ backgroundImage: `url("${image}")` }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bike Info */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  {bike.name}
                </h1>
                {bike.status === 'available' && (
                  <span className="inline-flex items-center rounded-md bg-green-100 dark:bg-green-900 px-2.5 py-1 text-xs font-semibold text-green-800 dark:text-green-200">
                    Còn xe
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Dòng xe tay ga thể thao, mạnh mẽ và tiết kiệm nhiên liệu, lựa chọn hoàn hảo cho di chuyển trong thành phố.
              </p>
            </div>

            {/* Price and Specs */}
            <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
              <div className="flex items-baseline gap-2">
                <p className="text-primary text-3xl font-bold">{bike.price_per_day?.toLocaleString('vi-VN')}đ</p>
                <span className="text-gray-500 dark:text-gray-400">/ ngày</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">speed</span>
                  <span className="text-gray-700 dark:text-gray-300">Dung tích: {bike.engine_capacity || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">auto_transmission</span>
                  <span className="text-gray-700 dark:text-gray-300">Hộp số: {bike.transmission || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">local_gas_station</span>
                  <span className="text-gray-700 dark:text-gray-300">Nhiên liệu: {bike.fuel_consumption || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">luggage</span>
                  <span className="text-gray-700 dark:text-gray-300">{bike.storage_info || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Booking Button */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleRent}
                disabled={bike.status !== 'available'}
                className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span className="truncate">
                  {bike.status !== 'available' ? 'Xe không khả dụng' : 'Thuê Ngay'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Description and Reviews */}
        <div className="mt-12 lg:mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#111318] dark:text-white mb-4">Mô tả chi tiết</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{bike.description || 'Chưa có mô tả'}</p>
            </div>
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-[#111318] dark:text-white mb-4">Đánh giá từ khách hàng</h2>
              <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Tuyệt vời</span>
                  <div className="flex items-center">
                    {renderStars(bike.rating)}
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {bike.rating} ({bike.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-start gap-3">
                    <img
                      alt="Avatar of An Nguyen"
                      className="w-10 h-10 rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8d4vs37XaaOF9RlawBXQwhYvZv8twi7kE98wzvoMKTgQa23A4OdsB0mDyFH9VY1nOSDcOaGfT8ky-1qCAQ7EIFLQ66Vat07SZTgVcnngRZNJLaKaIdp9rJ2IW9_-jEq-OM2OYyYJajmKJs-di-GTvu0Ux3tX7G9QwUEyrPfKs9jLLBtoSONmh1mub6BzcGTWWXubzuqBlXZX19QQVhod1PZh99k1IXMjtHbEUc5zz4Z2v3gU5-093YqFBGKGxRcgAnLstd6PeE94"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-[#111318] dark:text-white">An Nguyen</p>
                        <div className="flex items-center">
                          {renderStars(5)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        "Xe rất mới, chạy êm và tiết kiệm xăng. Thủ tục thuê xe nhanh gọn. Rất hài lòng!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Bikes */}
        <div className="mt-12 lg:mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
          <h2 className="text-2xl font-bold text-center text-[#111318] dark:text-white mb-8">Các loại xe tương tự</h2>
          {similarBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarBikes.map((similarBike) => {
                const similarImage = similarBike.images?.find((img) => img.is_primary) || similarBike.images?.[0]
                const similarImageUrl = similarImage?.image_url || 'https://via.placeholder.com/400x300'
                return (
                  <Link
                    key={similarBike.id}
                    to={`/bike/${similarBike.id}`}
                    className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                      style={{ backgroundImage: `url("${similarImageUrl}")` }}
                    ></div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-[#111318] dark:text-white">{similarBike.name}</h3>
                      <p className="text-primary font-semibold mt-1">
                        {similarBike.price_per_day?.toLocaleString('vi-VN')}đ / ngày
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Không có xe tương tự</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default BikeDetailPage

