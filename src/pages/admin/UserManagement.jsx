import { useState, useEffect } from 'react'
import DataTable from '../../components/admin/DataTable'
import StatusBadge from '../../components/admin/StatusBadge'
import { userService } from '../../services/userService'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await userService.getAll()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const columns = ['Tên', 'Email', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Ngày tham gia']

  const renderRow = (user) => (
    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={user.is_verified ? 'active' : 'completed'}>
          {user.is_verified ? 'Hoạt động' : 'Chưa xác minh'}
        </StatusBadge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.created_at)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-primary hover:text-primary/80">Xem</button>
      </td>
    </tr>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Người dùng</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Quản lý tất cả người dùng trong hệ thống
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={users} renderRow={renderRow} actions />
      )}
    </div>
  )
}

export default UserManagement

