import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const HomePage = () => {
  const location = useLocation()
  const [searchForm, setSearchForm] = useState({
    location: '',
    pickupDate: '',
    pickupTime: ''
  })

  // Handle smooth scroll to section when hash changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location.hash])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search logic
    console.log('Searching with:', searchForm)
  }

  const bikeCategories = [
    {
      name: 'Xe tay ga',
      price: 'Từ 120.000 VNĐ/ngày',
      image: 'https://th.bing.com/th/id/R.f9a02325433276748591bb1b7028049f?rik=wrv9B%2bb8p%2baJcw&pid=ImgRaw&r=0'
    },
    {
      name: 'Xe số',
      price: 'Từ 100.000 VNĐ/ngày',
      image: 'https://th.bing.com/th/id/R.1458fc3922ea05ff361dc2beb504983e?rik=THEhb0lwP50SEQ&riu=http%3a%2f%2fxemaynamtien.com%2fwp-content%2fuploads%2f2025%2f09%2fgioi-thieu-gia-xe-honda-future-2025.jpg&ehk=BxWytEnhZoYlH99VW60URTpMp2sfWSBrbp%2b2hdRxNCY%3d&risl=&pid=ImgRaw&r=0'
    },
    {
      name: 'Xe côn tay',
      price: 'Từ 180.000 VNĐ/ngày',
      image: 'https://taichinh.online/wp-content/uploads/2020/08/yamaha-xsr-115-001.png'
    },
    {
      name: 'Xe phân khối lớn',
      price: 'Từ 500.000 VNĐ/ngày',
      image: 'https://maintenanceschedule.com/wp-content/uploads/2022/02/Black-2012-Suzuki-GSX-R1000-diagonal-front-1024x722.jpg'
    }
  ]

  const testimonials = [
    {
      name: 'Anh Khoa',
      role: 'Phượt thủ',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtoTyOXGTkQMEs9Y6SIsdrMvDTliREDFWvHhw9kMISAw1DLrbAT3kt7hGfoS-5izObtWvj5A4PvSyHdfBeIOl9kgv4H3bsdcuAg3y5m1MLQ8xOZi8QD1Jxx1JDI9-6UbeTFPpcUFEYutIVUZH71apybXC9xT595EEPStA5b27v7lzW3gt4LsVkObA31MgYxPHBOjGR_nAa4scyvANO_2Abxp4Wfsj95WKMqtOhcW3td1JhFWDsEotea5ttd2N4dq7YfSVxJsW1RQU',
      text: '"Dịch vụ tuyệt vời! Xe khỏe, được bảo dưỡng kỹ và thủ tục nhận xe rất nhanh gọn. Chắc chắn tôi sẽ quay lại cho chuyến phượt tới."'
    },
    {
      name: 'Chị Mai Linh',
      role: 'Travel Blogger',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3ZIvxIgA08-w8Nhg-3U6poV9eWIjPZrca-Yl_idLtnpP3NS2qj2QPyQspa9BGDF1mHF4wfSBJ7cjnX7EqPo6IBdnNqderTOPqfFoeUixDeSYxoYi64H8oEMCg4suWQ4a9sNEnP69VIn2HAIqXXGA9SP6QhO-kNffNZzD-d4vwfF1JsjeMEp5TKuWagPer_n2UOzB8ehrXFLTqzoJg2-X3FDCxWPWZs53k1AQLGLTfZVkM101Oxr2J2J5OHhlrVHQHRuVf8vuLtow',
      text: '"Tôi đã thuê một chiếc xe tay ga để khám phá thành phố. Xe mới, dễ đi, giá cả hợp lý. Rất khuyến khích!"'
    },
    {
      name: 'Chú Minh',
      role: 'Khách du lịch',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoKx8kikjDIB9R_4tE8tMIwKWHceGKSe1TZN1oc3dPChN5yZX-OE50JfXrRJvpW6x_SEM0d7UfkfrmnEaqMONE64SIkgcrXggOK9FR5yAnZoOWTgthVll0oekFOyhEmeIXbJCeBKFzdwem3ZIzsjkmNRvz_tP7wX4XvdR9GVsDSRqVTlUA6Uux12Uy6PyZX0v9RCPiBWOrrXXcX1ZDyKRDZVXt1Lp93rQVwQ85nsubeQYhyifu33Zy0P7b84qfFr7yv6SgL5EGB5Q',
      text: '"Đội ngũ hỗ trợ khách hàng rất nhiệt tình, đã giúp tôi chọn được chiếc xe phù hợp cho chuyến đi ngắn ngày. Tôi rất hài lòng."'
    }
  ]

  return (
    <>
      {/* Hero Section with Search */}
      <section className="flex justify-center w-full px-4 pt-10 pb-32 md:pt-20 md:pb-40">
        <div className="w-full max-w-6xl relative">
          <div
            className="relative min-h-[500px] flex flex-col justify-center items-center text-center p-6 rounded-xl overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAY1gWX_Aghx4R1VsRK0Q6D3oV_LuG4KdJewnWKD_BbT6Fj_rxSfevwEc-zHxAET-mWui2J4KbeIdlqG4elNny94BP0LDQ7c1bQhm3V49cHglDO5nnlKuDUhtRXuj-fM0sVPjlPdJ_ufTQNhpLUf5DEQhEvd5xY3AG659VlukBZX2Y46q4XEUX2vEICFppk9sG7yHw70pWxLYpLME57n3TW6ZxbiILQv3RRaE6wHdXeLj8MSh1MfMhfqxoPiVG2fZDzHBzP4hVdJTo")`
            }}
          >
            <div className="flex flex-col gap-4 z-10 relative">
              <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                Thuê Xe Máy - Phượt Thả Ga
              </h1>
              <p className="text-gray-200 text-base md:text-lg font-normal leading-normal max-w-xl mx-auto">
                Khám phá hàng trăm mẫu xe máy, sẵn sàng cho mọi cung đường của bạn.
              </p>
            </div>
          </div>

          {/* Search Bar - Positioned outside hero container to avoid overflow clipping */}
          <div className="absolute bottom-[-80px] md:bottom-[-70px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-4xl z-20">
            <div className="bg-white dark:bg-gray-800 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Địa điểm đón</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">fmd_good</span>
                    <input
                      name="location"
                      value={searchForm.location}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#111318] dark:text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Thành phố, địa chỉ"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Ngày nhận</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">calendar_today</span>
                    <input
                      name="pickupDate"
                      value={searchForm.pickupDate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#111318] dark:text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      type="date"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Giờ nhận</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">schedule</span>
                    <input
                      name="pickupTime"
                      value={searchForm.pickupTime}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#111318] dark:text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      type="time"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg h-[42px] px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0f4bd4] transition-colors duration-200"
                >
                  <span className="material-symbols-outlined mr-2 text-lg">search</span>
                  <span className="truncate">Tìm xe ngay</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Bike Categories Section */}
      <section className="flex justify-center w-full px-4 pt-20 md:pt-16 pb-10 md:pb-16">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">
              Các dòng xe máy phổ biến
            </h2>
            <p className="text-[#616f89] dark:text-gray-400 mt-2 max-w-2xl mx-auto">
              Từ xe tay ga thanh lịch đến xe côn tay mạnh mẽ, chúng tôi có mọi thứ bạn cần cho chuyến đi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bikeCategories.map((category, index) => (
              <div key={index} className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url("${category.image}")` }}
                ></div>
                <div>
                  <p className="text-[#111318] dark:text-white text-lg font-bold leading-normal">{category.name}</p>
                  <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">{category.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="flex justify-center w-full px-4 py-10 md:py-16 bg-white dark:bg-black/20 scroll-mt-20">
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="relative w-full h-[400px] md:h-[500px] mb-16 rounded-xl overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="A group of friends riding SmartBike motorcycles on a scenic coastal road at sunset."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAuEAinb8lLXj2b5D0dDWD4vmvs5D7W-ISfqmUOeFLn9FOIUdstYQU4XKxZXSPszEdy33twQiqvYdoQV2M362giYR_1673w0TW6FsL5nVoBjACaAhV2-t7eGkue_EHroGZsnTeauORGeTNClBxCuyKETBSkC9V2RvmNR2ipW_QSu6dwJ624jmlXcPXbB_OJE1BzsDW_fzdAHrsOOlTy-lFEuDz1fm1dsxU2JWJe9ir0mYX2IDnU2aaJjPBunIS4sEIRC2v9DYYg0M"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
                  Về SmartBike
                </h2>
                <p className="mt-4 text-lg md:text-xl text-gray-200">
                  Kết nối đam mê, chinh phục mọi nẻo đường. Chúng tôi không chỉ cho thuê xe, chúng tôi trao cho bạn sự tự do khám phá.
                </p>
              </div>
            </div>
          </div>

          {/* Vision & Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-[#111318] dark:text-white">
                Tầm nhìn & Sứ mệnh
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Tầm nhìn của SmartBike là trở thành nền tảng cho thuê xe máy hàng đầu tại Việt Nam, mang đến giải pháp di chuyển thông minh, tiện lợi và an toàn cho du khách và người dân địa phương. Sứ mệnh của chúng tôi là tạo ra những trải nghiệm du lịch đáng nhớ, giúp mọi người dễ dàng khám phá vẻ đẹp đất nước một cách tự do và linh hoạt nhất.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-background-light dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-primary text-3xl">
                  rocket_launch
                </span>
                <h4 className="mt-3 text-lg font-bold">Tầm nhìn</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Dẫn đầu thị trường cho thuê xe máy thông minh.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background-light dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-primary text-3xl">flag</span>
                <h4 className="mt-3 text-lg font-bold">Sứ mệnh</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Mang lại sự tự do và những hành trình đáng nhớ.
                </p>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#111318] dark:text-white">
              Giá trị cốt lõi của chúng tôi
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Những nguyên tắc định hình văn hóa và phương châm hoạt động của SmartBike.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold">An toàn là trên hết</h4>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Toàn bộ xe đều được kiểm tra và bảo dưỡng định kỳ nghiêm ngặt, đảm bảo an toàn tuyệt đối trên mọi hành trình.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Khách hàng là trọng tâm</h4>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Chúng tôi lắng nghe và nỗ lực mang đến dịch vụ vượt trội, đáp ứng mọi nhu cầu của khách hàng.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Chất lượng & Minh bạch</h4>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Cung cấp những dòng xe chất lượng cao với mức giá cạnh tranh và hợp đồng rõ ràng, không chi phí ẩn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="flex justify-center w-full px-4 py-10 md:py-20">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">
              Phượt thủ nói gì về chúng tôi?
            </h2>
            <p className="text-[#616f89] dark:text-gray-400 mt-2">
              Những trải nghiệm tuyệt vời từ những người đã tin tưởng SmartBike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    alt={`Avatar of customer ${testimonial.name}`}
                    className="w-12 h-12 rounded-full object-cover"
                    src={testimonial.avatar}
                  />
                  <div>
                    <p className="font-bold text-[#111318] dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-[#616f89] dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#344054] dark:text-gray-300 text-sm">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full px-4 py-12 md:py-20 bg-white dark:bg-black/20 scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              Liên hệ với chúng tôi
            </h2>
            <p className="mt-4 text-[#616f89] dark:text-gray-300 text-lg">
              Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy gửi thắc mắc của bạn cho chúng tôi.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <h3 className="text-xl font-bold text-[#111318] dark:text-white">Thông tin liên hệ</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#111318] dark:text-white">Hotline</h4>
                    <p className="text-[#616f89] dark:text-gray-400">1900 1234</p>
                    <p className="text-sm text-[#616f89] dark:text-gray-400">Hoạt động 24/7 để hỗ trợ bạn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">email</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#111318] dark:text-white">Email hỗ trợ</h4>
                    <p className="text-[#616f89] dark:text-gray-400">hotro@smartbike.vn</p>
                    <p className="text-sm text-[#616f89] dark:text-gray-400">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#111318] dark:text-white">Văn phòng</h4>
                    <p className="text-[#616f89] dark:text-gray-400">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                    <p className="text-sm text-[#616f89] dark:text-gray-400">Giờ làm việc: 8:00 - 17:00, T2 - T6</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 rounded-xl bg-background-light dark:bg-gray-800/50 p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-6">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#344054] dark:text-gray-300 mb-1" htmlFor="name">
                      Họ và tên
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      id="name"
                      placeholder="Nhập họ và tên của bạn"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#344054] dark:text-gray-300 mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#344054] dark:text-gray-300 mb-1" htmlFor="subject">
                    Chủ đề
                  </label>
                  <input
                    className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    id="subject"
                    placeholder="Vấn đề bạn cần hỗ trợ"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#344054] dark:text-gray-300 mb-1" htmlFor="message">
                    Nội dung tin nhắn
                  </label>
                  <textarea
                    className="form-textarea w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    id="message"
                    placeholder="Nhập nội dung chi tiết..."
                    rows="5"
                  ></textarea>
                </div>
                <div>
                  <button
                    className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                    type="submit"
                  >
                    <span className="truncate">Gửi tin nhắn</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage

