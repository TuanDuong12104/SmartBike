const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="text-primary size-8">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.33 4.25c-1.3-1.3-3.08-2.1-5.02-2.18C12.37 2 10.38 2.5 8.66 3.58 6.95 4.66 5.62 6.2 4.88 8.01 4.14 9.82 4 11.83 4 12c.02 1.95.42 3.86 1.18 5.61.76 1.75 1.86 3.26 3.22 4.45l.23.2c.28.24.58.44.89.61.32.17.65.3.99.39.26.06.52.1.78.1s.52-.04.78-.1c.34-.09.67-.22.99-.39.31-.17.61-.37.89-.61l.23-.2c1.36-1.19 2.46-2.7 3.22-4.45.76-1.75 1.16-3.66 1.18-5.61v-.17c-.02-1.95-.42-3.86-1.18-5.61-.43-.99-.99-1.9-1.67-2.74zm-3.1 8.24c-.21.21-.48.31-.75.31s-.54-.1-.75-.31l-1.42-1.42-1.42 1.42c-.21.21-.48.31-.75.31s-.54-.1-.75-.31c-.42-.42-.42-1.09 0-1.51l1.42-1.42-1.42-1.42c-.42-.42-.42-1.09 0-1.51.42-.42 1.09-.42 1.51 0l1.42 1.42 1.42-1.42c.42-.42 1.09-.42 1.51 0 .42.42.42 1.09 0 1.51l-1.42 1.42 1.42 1.42c.42.41.42 1.09 0 1.51z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#111318] dark:text-white">SmartBike</h2>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Dịch vụ cho thuê xe máy hàng đầu tại Việt Nam.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dịch vụ</h3>
            <ul className="mt-4 space-y-2" role="list">
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Thuê xe theo ngày
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Thuê xe theo tháng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Công ty</h3>
            <ul className="mt-4 space-y-2" role="list">
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Hỗ trợ</h3>
            <ul className="mt-4 space-y-2" role="list">
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pháp lý</h3>
            <ul className="mt-4 space-y-2" role="list">
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 SmartBike. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

