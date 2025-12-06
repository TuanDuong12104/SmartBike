import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../services/authService'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await authLogin(formData.email.trim(), formData.password)

      // Update auth context (user đã được lưu vào localStorage trong authService)
      login(result.user)

      // Redirect based on user role or previous page
      const redirectTo = result.user.role === 'admin' ? '/admin' : '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-6xl flex-1 flex-row-reverse overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg m-4">
            {/* Login Form */}
            <div className="w-full flex-col justify-center bg-white p-8 dark:bg-gray-800 md:flex md:w-1/2 lg:p-12">
              <div className="mx-auto flex w-full max-w-sm flex-col items-start gap-8">
                <div className="flex flex-col gap-2 text-left w-full">
                  <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#111318] dark:text-white">
                    <span className="material-symbols-outlined text-primary text-3xl">two_wheeler</span>
                    <span>SmartBike</span>
                  </Link>
                  <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    Đăng nhập vào tài khoản
                  </h1>
                  <p className="text-[#616f89] dark:text-gray-300 text-base font-normal leading-normal">
                    Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
                  </p>
                </div>

                <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-[#111318] dark:text-gray-200 text-base font-medium leading-normal pb-2">
                        Email
                      </p>
                      <div className="flex w-full flex-1 items-stretch rounded-lg">
                        <div className="text-[#616f89] flex border border-r-0 border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 items-center justify-center pl-4 rounded-l-lg">
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            mail
                          </span>
                        </div>
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-0 border border-l-0 border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-[#dbdfe6] dark:focus:border-gray-500 h-14 placeholder:text-[#616f89] dark:placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                          placeholder="Nhập email của bạn"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </label>

                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-[#111318] dark:text-gray-200 text-base font-medium leading-normal pb-2">
                        Mật khẩu
                      </p>
                      <div className="flex w-full flex-1 items-stretch rounded-lg">
                        <div className="text-[#616f89] flex border border-r-0 border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 items-center justify-center pl-4 rounded-l-lg">
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            lock
                          </span>
                        </div>
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#111318] dark:text-white focus:outline-0 focus:ring-0 border border-l-0 border-r-0 border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-[#dbdfe6] dark:focus:border-gray-500 h-14 placeholder:text-[#616f89] dark:placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                          placeholder="Nhập mật khẩu"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          className="text-[#616f89] flex border border-l-0 border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 items-center justify-center px-4 rounded-r-lg hover:text-primary dark:hover:text-primary transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal text-right underline hover:text-primary dark:hover:text-primary/80"
                  >
                    Quên mật khẩu?
                  </Link>

                  {error && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <span className="truncate">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
                  </button>
                </form>

                <div className="flex w-full flex-col gap-4 items-center">
                  <div className="flex w-full items-center gap-2">
                    <hr className="w-full border-t border-[#dbdfe6] dark:border-gray-600" />
                    <p className="text-sm text-center text-[#616f89] dark:text-gray-400 shrink-0">
                      Hoặc đăng nhập với
                    </p>
                    <hr className="w-full border-t border-[#dbdfe6] dark:border-gray-600" />
                  </div>

                  <div className="flex w-full gap-4">
                    <button
                      type="button"
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_105_22)">
                          <path
                            d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.26H18.06C17.82 15.63 17.11 16.83 16.07 17.58V20.18H19.92C21.62 18.45 22.56 15.63 22.56 12.25Z"
                            fill="#4285F4"
                          ></path>
                          <path
                            d="M12 23C14.97 23 17.45 22.04 19.26 20.18L15.41 17.58C14.41 18.25 13.21 18.66 12 18.66C9.43 18.66 7.27 16.99 6.48 14.63H2.49V17.22C4.3 20.72 7.89 23 12 23Z"
                            fill="#34A853"
                          ></path>
                          <path
                            d="M6.48 14.63C6.23 13.89 6.11 13.11 6.11 12.31C6.11 11.51 6.23 10.73 6.48 9.99V7.4H2.49C1.71 8.96 1.25 10.58 1.25 12.31C1.25 14.04 1.71 15.66 2.49 17.22L6.48 14.63Z"
                            fill="#FBBC05"
                          ></path>
                          <path
                            d="M12 5.94C13.56 5.94 14.88 6.48 15.81 7.36L19.33 3.84C17.45 2.14 14.97 1 12 1C7.89 1 4.3 3.28 2.49 6.78L6.48 9.37C7.27 7.01 9.43 5.94 12 5.94Z"
                            fill="#EA4335"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_105_22">
                            <rect fill="white" height="24" width="24"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="text-sm font-medium">Google</span>
                    </button>

                    <button
                      type="button"
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 text-[#1877F2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                      </svg>
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div>
                </div>

                <p className="text-center text-sm text-[#616f89] dark:text-gray-400 w-full">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="font-bold text-primary hover:underline">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side Image */}
            <div className="relative hidden w-1/2 md:block">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 p-12 text-white z-20">
                <h2 className="text-3xl font-bold leading-tight">
                  Khám phá tự do, trải nghiệm phiêu lưu.
                </h2>
                <p className="mt-2 max-w-md">
                  Bắt đầu hành trình của bạn với dịch vụ cho thuê xe máy đáng tin cậy nhất.
                </p>
              </div>
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDavOw7E-axH8gKvBE5b8Ws2gtABvYgORBELTvziDVwCl4YCmkb1jZpPWZr-wyd2JkPko9lFm9bGcMQHxHXMmatYGHnmlBIN_3pTf5qSGZ3lzakYVY0uUv2SCXVTDZoDqCbNykmyHcHUwySJPKb8pRN3C1KYZ5k_QHmYwTcQhOjx5YoFHGSjnuBs5tT1xtUOUWdTvJ6PHxT7oPHJwQ29IKMiWI4d6HxRPZOyYIgCH9QVMxreixoU4XvQQA4sOvEhy5tuHWpwYtnc4A")`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

