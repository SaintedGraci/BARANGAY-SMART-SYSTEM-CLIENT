import axios from 'axios';

// Use environment variable for API base URL, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and has TOKEN_EXPIRED code
    if (error.response?.status === 401 && 
        error.response?.data?.code === 'TOKEN_EXPIRED' &&
        !originalRequest._retry) {
      
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token available, redirect to login
        isRefreshing = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Preserve admin login path
        const isAdminPath = window.location.pathname.includes('/admin');
        window.location.href = isAdminPath ? '/admin/login' : '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);
        
        isRefreshing = false;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Preserve admin login path
        const isAdminPath = window.location.pathname.includes('/admin');
        window.location.href = isAdminPath ? '/admin/login' : '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // For other 401 errors or if token is revoked/invalid, redirect to login
    // BUT: Don't redirect if this is already a login attempt (to allow error messages to display)
    // ALSO: Don't redirect on 500 errors (server errors should not cause logout)
    if (error.response?.status === 401) {
      const isLoginRequest = originalRequest.url?.includes('/auth/login');
      const isServerError = error.response?.status >= 500;
      
      if (!isLoginRequest && !isServerError) {
        console.warn('401 Unauthorized - logging out user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Preserve admin login path
        const isAdminPath = window.location.pathname.includes('/admin');
        window.location.href = isAdminPath ? '/admin/login' : '/login';
      }
    }

    // Log errors for debugging but don't logout on 500 errors
    if (error.response?.status >= 500) {
      console.error('Server error occurred:', {
        status: error.response.status,
        url: originalRequest.url,
        data: error.response.data,
        message: error.response.data?.message || error.message
      });
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password, turnstileToken) => api.post('/auth/login', { email, password, turnstileToken }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/logout', { refreshToken });
  },
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

// Requests API
export const requestsAPI = {
  getAll: () => api.get('/requests'),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  createRequest: (data) => api.post('/requests', data), // Alias for create
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
};

// Alias for convenience
export const requestAPI = requestsAPI;

// Announcements API
export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => {
    // For FormData, remove the default Content-Type header
    if (data instanceof FormData) {
      return api.post('/announcements', data, {
        headers: {
          'Content-Type': undefined
        }
      });
    }
    return api.post('/announcements', data);
  },
  update: (id, data) => {
    // For FormData, remove the default Content-Type header
    if (data instanceof FormData) {
      return api.put(`/announcements/${id}`, data, {
        headers: {
          'Content-Type': undefined
        }
      });
    }
    return api.put(`/announcements/${id}`, data);
  },
  delete: (id) => api.delete(`/announcements/${id}`),
  togglePin: (id) => api.patch(`/announcements/${id}/pin`),
  archive: (id) => api.patch(`/announcements/${id}/archive`),
  // Reactions
  toggleReaction: (id) => api.post(`/announcements/${id}/react`),
  getReactions: (id) => api.get(`/announcements/${id}/reactions`),
  // Comments
  addComment: (id, comment) => api.post(`/announcements/${id}/comments`, { comment }),
  getComments: (id) => api.get(`/announcements/${id}/comments`),
  deleteComment: (id, commentId) => api.delete(`/announcements/${id}/comments/${commentId}`),
};

// Complaints API
export const complaintsAPI = {
  getAll: () => api.get('/complaints'),
  getMy: () => api.get('/complaints/my'),
  getById: (id) => api.get(`/complaints/${id}`),
  create: (data) => api.post('/complaints', data),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
};

// Residents API
export const residentsAPI = {
  getAll: () => api.get('/residents'),
  getById: (id) => api.get(`/residents/${id}`),
  getMyProfile: () => api.get('/residents/my-profile'),
  updateMyProfile: (data) => api.put('/residents/my-profile', data),
  changePassword: (data) => api.put('/residents/change-password', data),
  create: (data) => api.post('/residents', data),
  createWithAccount: (data) => api.post('/residents/create-with-account', data),
  update: (id, data) => api.put(`/residents/${id}`, data),
  delete: (id) => api.delete(`/residents/${id}`),
  getPendingVerifications: () => api.get('/residents/pending-verifications'),
  approve: (id) => api.put(`/residents/${id}/approve`),
  reject: (id, reason) => api.put(`/residents/${id}/reject`, { reason }),
  getActiveDocumentServices: () => api.get('/residents/document-services'),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Logs API (Admin only)
export const logsAPI = {
  getFiles: () => api.get('/logs/files'),
  getStats: () => api.get('/logs/stats'),
  getContent: (filename, params) => api.get(`/logs/${filename}`, { params }),
  clearLog: (filename) => api.delete(`/logs/${filename}`),
};

// Analytics API
export const analyticsAPI = {
  getKPIs: () => api.get('/analytics/kpis'),
  getRegistrationTrend: () => api.get('/analytics/registration-trend'),
  getDocumentRequests: () => api.get('/analytics/document-requests'),
  getRequestStatus: () => api.get('/analytics/request-status'),
  getComplaints: () => api.get('/analytics/complaints'),
  getDemographics: () => api.get('/analytics/demographics'),
  getMonthlyActivity: () => api.get('/analytics/monthly-activity'),
  getVerificationProgress: () => api.get('/analytics/verification-progress'),
  getQuickStats: () => api.get('/analytics/quick-stats'),
};

// User Management API (Admin only)
export const userManagementAPI = {
  getAll: (params) => api.get('/admin/users', { params }),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
  updateStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  resetPassword: (id, newPassword) => api.patch(`/admin/users/${id}/reset-password`, { newPassword }),
};

// Superadmin API (System Administrator only - TASK15)
export const superadminAPI = {
  // Dashboard & System Health
  getDashboardStats: () => api.get('/superadmin/dashboard'),
  
  // Permissions Management
  getAllPermissions: () => api.get('/superadmin/permissions'),
  getPermissionMatrix: () => api.get('/superadmin/permissions/matrix'),
  getRolePermissions: (role) => api.get(`/superadmin/permissions/${role}`),
  updateRolePermissions: (role, permissions) => api.put(`/superadmin/permissions/${role}`, { permissions }),
  
  // Document Services Management
  getAllDocumentServices: (params) => api.get('/superadmin/document-services', { params }),
  getDocumentService: (id) => api.get(`/superadmin/document-services/${id}`),
  createDocumentService: (data) => api.post('/superadmin/document-services', data),
  updateDocumentService: (id, data) => api.put(`/superadmin/document-services/${id}`, data),
  deleteDocumentService: (id) => api.delete(`/superadmin/document-services/${id}`),
  
  // System Settings Management
  getAllSystemSettings: (params) => api.get('/superadmin/settings', { params }),
  getSystemSetting: (key) => api.get(`/superadmin/settings/${key}`),
  updateSystemSetting: (key, value) => api.put(`/superadmin/settings/${key}`, { value }),
  bulkUpdateSystemSettings: (settings) => api.put('/superadmin/settings-bulk', { settings }),
  
  // Feature Flags Management
  getAllFeatureFlags: () => api.get('/superadmin/feature-flags'),
  getFeatureFlag: (key) => api.get(`/superadmin/feature-flags/${key}`),
  toggleFeatureFlag: (key, isEnabled) => api.patch(`/superadmin/feature-flags/${key}/toggle`, { isEnabled }),
  
  // Audit Logs
  getAuditLogs: (params) => api.get('/superadmin/audit-logs', { params }),
  exportAuditLogs: (params) => api.get('/superadmin/audit-logs/export', { params }),
};

export default api;
