import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { userManagementAPI } from '../../services/api';

const ROLES = [
  { value: 'captain', label: 'Barangay Captain' },
  { value: 'secretary', label: 'Barangay Secretary' },
  { value: 'staff', label: 'Barangay Staff' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const ROLE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  ...ROLES,
];

function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onClick={onClose}>
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(92vh-92px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>
      {children}
    </span>
  );
}

export default function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
    status: 'active',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userManagementAPI.getAll({
        search,
        role: roleFilter,
        status: statusFilter,
        page: currentPage,
        limit: 10,
      });
      setUsers(response.data.data.users);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await userManagementAPI.create(formData);
      alert('User created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await userManagementAPI.update(selectedUser.id, formData);
      alert('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await userManagementAPI.resetPassword(selectedUser.id, passwordData.newPassword);
      alert('Password reset successfully');
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} ${user.username}?`)) {
      return;
    }

    try {
      await userManagementAPI.updateStatus(user.id, newStatus);
      alert(`User ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${action} user`);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.username}? This action cannot be undone.`)) {
      return;
    }

    try {
      await userManagementAPI.delete(user.id);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName || '',
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber || '',
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const openResetPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowResetPasswordModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      contactNumber: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
      status: 'active',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'captain':
        return 'bg-purple-50 text-purple-700 ring-purple-600/15 border-purple-200';
      case 'secretary':
        return 'bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200';
      case 'staff':
        return 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200';
      case 'admin':
        return 'bg-rose-50 text-rose-700 ring-rose-600/15 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 border-emerald-200'
      : 'bg-amber-50 text-amber-700 ring-amber-600/15 border-amber-200';
  };

  const getRoleLabel = (role) => {
    const found = ROLES.find(r => r.value === role);
    return found ? found.label : role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="mt-1 text-sm text-slate-500">Manage administrative users and their permissions</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create User
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                {ROLE_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchUsers}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-bold text-slate-900">No users found</h3>
            <p className="mt-2 text-sm text-slate-500">Create your first administrative user</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                            {user.fullName?.[0] || user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">{user.fullName || user.username}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getRoleBadgeClass(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusBadgeClass(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.contactNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openResetPasswordModal(user)}
                            className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                            title="Reset Password"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`rounded-lg p-2 transition ${
                              user.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'active' ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                <p className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create User Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Admin User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Contact Number</label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Contact Number</label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update User'}
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={showResetPasswordModal} onClose={() => setShowResetPasswordModal(false)} title="Reset Password" maxWidth="max-w-md">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                Resetting password for <strong>{selectedUser?.username}</strong>
              </p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => setShowResetPasswordModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
