import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { useAuth } from '../contexts/AuthContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
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
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ và tên')
      return false
    }

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

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }

    if (!agreeToTerms) {
      setError('Vui lòng đồng ý với Điều khoản Dịch vụ')
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
      const result = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })

      // Update auth context
      login(result.user)

      // Redirect to home page
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="A person on a motorcycle on a scenic road, representing freedom and travel."
          className="h-full w-full object-cover opacity-10 dark:opacity-5"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAROIhTV45J6smo6UNJZYpfZwK-h8PUvYdV0qePW1t1jwGbeH16Y-xKLebTzbF3xn_TzEQ2Q36O2gkREU22cZdXSuYcVw5H5QNLn_-D40va-hPbBYLuSyi6bof0eNSm92oqjmsomuzmLHFGGO6_V_ixJjKRIj_o865Ne0itXzM8IjTwJ6pGLdmPLJ1RBy1DpYZt0VEmKrE_DfVhDZRq6pXqWKfeCLk_Z7SWXDx529_u5eJYIEqJrdLLufAbYONZv7ZDLVT8na_CCw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80"></div>
      </div>

      <div className="relative z-10 flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap px-6 sm:px-10 py-5">
          <Link to="/" className="flex items-center gap-3 text-slate-800 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">SmartBike</h2>
          </Link>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link
                to="/login"
                className="text-slate-800 dark:text-slate-200 text-sm font-medium hover:text-primary dark:hover:text-primary"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center py-12 px-4">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black tracking-tighter">
                Tạo tài khoản mới
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Khám phá Việt Nam theo cách của bạn!
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5">
                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium pb-2">Họ và Tên</p>
                    <input
                      className="form-input flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm font-normal"
                      placeholder="Nguyễn Văn A"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium pb-2">Email</p>
                    <input
                      className="form-input flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm font-normal"
                      placeholder="nguyenvana@email.com"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium pb-2">Số điện thoại</p>
                    <input
                      className="form-input flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm font-normal"
                      placeholder="+84 123 456 789"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium pb-2">Mật khẩu</p>
                    <div className="relative">
                      <input
                        className="form-input flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-sm font-normal"
                        placeholder="Nhập mật khẩu của bạn"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </label>

                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium pb-2">Xác nhận mật khẩu</p>
                    <div className="relative">
                      <input
                        className="form-input flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-sm font-normal"
                        placeholder="Nhập lại mật khẩu"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    className="form-checkbox h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary dark:bg-slate-700 dark:checked:bg-primary"
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                  <label className="ml-2 block text-sm text-slate-700 dark:text-slate-300" htmlFor="terms">
                    Tôi đồng ý với{' '}
                    <a className="font-medium text-primary hover:underline" href="#">
                      Điều khoản Dịch vụ
                    </a>
                  </label>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  className="flex w-full items-center justify-center rounded-lg bg-primary h-12 text-sm font-bold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300 dark:border-slate-700"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900/50 px-2 text-slate-500 dark:text-slate-400">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_105_2393)">
                      <path
                        d="M22.4999 12.2454C22.4999 11.3636 22.4249 10.4909 22.2899 9.64545H12.2249V14.5091H18.0999C17.8499 15.9636 17.0649 17.2091 15.8999 18.0273V20.7545H19.5849C21.4999 19.0091 22.4999 15.9 22.4999 12.2454Z"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M12.225 23C15.1409 23 17.6136 22.0182 19.585 20.7545L15.9 18.0273C14.9091 18.7 13.6636 19.1455 12.225 19.1455C9.62273 19.1455 7.4 17.4364 6.64091 15.0545H2.81818V17.8727C4.73182 20.9364 8.16818 23 12.225 23Z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M6.64091 15.0545C6.38182 14.3364 6.22273 13.5545 6.22273 12.75C6.22273 11.9455 6.38182 11.1636 6.64091 10.4455V7.62727H2.81818C1.94091 9.35455 1.5 11.0091 1.5 12.75C1.5 14.4909 1.94091 16.1455 2.81818 17.8727L6.64091 15.0545Z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M12.225 6.35455C13.7318 6.35455 15.2227 6.9 16.3455 7.95909L19.6682 4.64545C17.6091 2.76818 15.1409 1.5 12.225 1.5C8.16818 1.5 4.73182 3.56364 2.81818 6.62727L6.64091 9.44545C7.4 7.06364 9.62273 5.35455 12.225 5.35455Z"
                        fill="#EA4335"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_105_2393">
                        <rect fill="white" height="21" transform="translate(1.5 1.5)" width="21"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 16.99 5.84 21.128 10.5 21.825V14.625H8.05V12H10.5V9.975C10.5 7.525 11.9 6.225 14.2 6.225C15.31 6.225 16.45 6.425 16.45 6.425V8.625H15.25C14.05 8.625 13.5 9.325 13.5 10.2V12H16.2L15.75 14.625H13.5V21.825C18.16 21.128 22 16.99 22 12Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              © 2024 SmartBike. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default RegisterPage

