import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import RentPage from './pages/RentPage'
import BikeDetailPage from './pages/BikeDetailPage'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import PaymentCallbackPage from './pages/PaymentCallbackPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import BikeManagement from './pages/admin/BikeManagement'
import BookingManagement from './pages/admin/BookingManagement'
import DeliveryManagement from './pages/admin/DeliveryManagement'
import UserManagement from './pages/admin/UserManagement'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'
import AdminRoute from './components/admin/AdminRoute'
import ProfileInfoPage from './pages/ProfileInfoPage'
import ProfileSecurityPage from './pages/ProfileSecurityPage'
import ProfileHistoryPage from './pages/ProfileHistoryPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import ProtectedRoute from './components/ProtectedRoute'
import TestDatabasePage from './pages/TestDatabasePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="delivery" element={<DeliveryManagement />} />
          <Route path="bikes" element={<BikeManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Protected Profile Routes */}
        <Route
          path="/profile/info"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfileInfoPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/security"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfileSecurityPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfileHistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfileSettingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/rent" element={<MainLayout><RentPage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/bike/:id" element={<MainLayout><BikeDetailPage /></MainLayout>} />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BookingPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/callback"
          element={
            <MainLayout>
              <PaymentCallbackPage />
            </MainLayout>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PaymentSuccessPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Test Route - Remove in production */}
        <Route path="/test-db" element={<TestDatabasePage />} />
      </Routes>
    </Router>
  )
}

export default App

