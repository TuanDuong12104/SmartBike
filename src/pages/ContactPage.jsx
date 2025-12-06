import { useState } from 'react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Contact form submitted:', formData)
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  return (
    <section className="w-full px-4 py-12 md:py-20 bg-white dark:bg-black/20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-4 text-[#616f89] dark:text-gray-300 text-lg">
            Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy gửi thắc mắc của bạn cho chúng tôi.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <h2 className="text-xl font-bold text-[#111318] dark:text-white">Thông tin liên hệ</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#111318] dark:text-white">Hotline</h3>
                  <p className="text-[#616f89] dark:text-gray-400">1900 1234</p>
                  <p className="text-sm text-[#616f89] dark:text-gray-400">Hoạt động 24/7 để hỗ trợ bạn</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">email</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#111318] dark:text-white">Email hỗ trợ</h3>
                  <p className="text-[#616f89] dark:text-gray-400">hotro@smartbike.vn</p>
                  <p className="text-sm text-[#616f89] dark:text-gray-400">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#111318] dark:text-white">Văn phòng</h3>
                  <p className="text-[#616f89] dark:text-gray-400">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                  <p className="text-sm text-[#616f89] dark:text-gray-400">Giờ làm việc: 8:00 - 17:00, T2 - T6</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 rounded-xl bg-background-light dark:bg-gray-800/50 p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-6">Gửi tin nhắn cho chúng tôi</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#344054] dark:text-gray-300 mb-1" htmlFor="name">
                    Họ và tên
                  </label>
                  <input
                    className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    id="name"
                    name="name"
                    placeholder="Nhập họ và tên của bạn"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#344054] dark:text-gray-300 mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                  name="subject"
                  placeholder="Vấn đề bạn cần hỗ trợ"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#344054] dark:text-gray-300 mb-1" htmlFor="message">
                  Nội dung tin nhắn
                </label>
                <textarea
                  className="form-textarea w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  id="message"
                  name="message"
                  placeholder="Nhập nội dung chi tiết..."
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
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
  )
}

export default ContactPage

