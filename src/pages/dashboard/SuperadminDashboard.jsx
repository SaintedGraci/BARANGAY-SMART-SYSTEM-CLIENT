import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ToggleLeft,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Clock,
  RefreshCw,
  Loader2,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { superadminAPI } from '../../services/api';
import UserManagementTab from './UserManagementTab';

const SuperadminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for each section
  const [dashboardStats, setDashboardStats] = useState(null);
  const [permissionMatrix, setPermissionMatrix] = useState([]);
  const [documentServices, setDocumentServices] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  const [featureFlags, setFeatureFlags] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  
  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingSettings, setEditingSettings] = useState({});

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // Load data based on active tab
  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  // TASK16: Socket.IO listeners for real-time superadmin updates
  useEffect(() => {
    if (!socket) return;

    const handlePermissionUpdate = (data) => {
      console.log('🔄 Permission updated:', data);
      if (activeTab === 'permissions') {
        loadTabData(); // Refresh permission matrix
      }
    };

    const handleRolePermissionChange = (data) => {
      console.log('🔄 Role permissions changed:', data);
      if (activeTab === 'permissions') {
        loadTabData(); // Refresh permission matrix
      }
    };

    const handleDocumentServiceUpdate = (data) => {
      console.log('🔄 Document service updated:', data);
      if (activeTab === 'services') {
        loadTabData(); // Refresh services list
      }
    };

    const handleSystemSettingsUpdate = (data) => {
      console.log('🔄 System settings updated:', data);
      if (activeTab === 'settings') {
        loadTabData(); // Refresh settings
      }
    };

    const handleFeatureFlagUpdate = (data) => {
      console.log('🔄 Feature flag updated:', data);
      if (activeTab === 'features') {
        loadTabData(); // Refresh feature flags
      }
    };

    const handleUIRefresh = (data) => {
      console.log('🔄 UI refresh required:', data.component);
      // Refresh current tab data
      loadTabData();
    };

    // Register all listeners
    socket.on('permission_updated', handlePermissionUpdate);
    socket.on('role_permissions_changed', handleRolePermissionChange);
    socket.on('document_service_updated', handleDocumentServiceUpdate);
    socket.on('system_settings_updated', handleSystemSettingsUpdate);
    socket.on('feature_flag_updated', handleFeatureFlagUpdate);
    socket.on('ui_refresh_required', handleUIRefresh);

    // Cleanup
    return () => {
      socket.off('permission_updated', handlePermissionUpdate);
      socket.off('role_permissions_changed', handleRolePermissionChange);
      socket.off('document_service_updated', handleDocumentServiceUpdate);
      socket.off('system_settings_updated', handleSystemSettingsUpdate);
      socket.off('feature_flag_updated', handleFeatureFlagUpdate);
      socket.off('ui_refresh_required', handleUIRefresh);
    };
  }, [socket, activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    setError('');
    try {
      switch (activeTab) {
        case 'overview':
          const stats = await superadminAPI.getDashboardStats();
          setDashboardStats(stats.data.data);
          break;
        case 'permissions':
          const matrix = await superadminAPI.getPermissionMatrix();
          setPermissionMatrix(matrix.data.data.permissionMatrix);
          break;
        case 'services':
          const services = await superadminAPI.getAllDocumentServices();
          setDocumentServices(services.data.data.services);
          break;
        case 'settings':
          const settings = await superadminAPI.getAllSystemSettings();
          setSystemSettings(settings.data.data.groupedSettings);
          break;
        case 'features':
          const flags = await superadminAPI.getAllFeatureFlags();
          setFeatureFlags(flags.data.data.flags);
          break;
        case 'logs':
          const logs = await superadminAPI.getAuditLogs({ limit: 100 });
          setAuditLogs(logs.data.data.logs);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error loading tab data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async (role, updatedMatrix) => {
    try {
      setLoading(true);
      const permissions = updatedMatrix
        .filter(p => p[role])
        .map(p => ({ permissionKey: p.key, granted: true }));
      
      await superadminAPI.updateRolePermissions(role, permissions);
      setSuccess(`Permissions updated for ${role}`);
      loadTabData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (key, currentStatus) => {
    try {
      await superadminAPI.toggleFeatureFlag(key, !currentStatus);
      setSuccess(`Feature ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      loadTabData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle feature');
    }
  };

  const handleSaveService = async (serviceData) => {
    try {
      setLoading(true);
      if (editingService) {
        await superadminAPI.updateDocumentService(editingService.id, serviceData);
        setSuccess('Document service updated successfully');
      } else {
        await superadminAPI.createDocumentService(serviceData);
        setSuccess('Document service created successfully');
      }
      setShowServiceModal(false);
      setEditingService(null);
      loadTabData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save document service');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this document service?')) return;
    
    try {
      await superadminAPI.deleteDocumentService(id);
      setSuccess('Document service deactivated successfully');
      loadTabData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate service');
    }
  };

  const handleUpdateSettings = async (category) => {
    try {
      setLoading(true);
      const settingsToUpdate = Object.entries(editingSettings)
        .filter(([key]) => key.startsWith(category))
        .map(([key, value]) => ({ key, value }));
      
      await superadminAPI.bulkUpdateSystemSettings(settingsToUpdate);
      setSuccess(`${category} settings updated successfully`);
      setShowSettingsModal(false);
      setEditingSettings({});
      loadTabData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'services', label: 'Document Services', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'features', label: 'Feature Flags', icon: ToggleLeft },
    { id: 'logs', label: 'Audit Logs', icon: Activity },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">System Administrator</h1>
              <p className="text-sm text-slate-600 mt-1">System Control & Configuration</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadTabData}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{user?.username}</div>
                <div className="text-xs text-slate-500">{user?.role}</div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && activeTab !== 'overview' ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab stats={dashboardStats} loading={loading} />
            )}
            {activeTab === 'users' && (
              <UserManagementTab />
            )}
            {activeTab === 'permissions' && (
              <PermissionsTab
                permissionMatrix={permissionMatrix}
                onUpdate={handleUpdatePermissions}
              />
            )}
            {activeTab === 'services' && (
              <DocumentServicesTab
                services={documentServices}
                onAdd={() => {
                  setEditingService(null);
                  setShowServiceModal(true);
                }}
                onEdit={(service) => {
                  setEditingService(service);
                  setShowServiceModal(true);
                }}
                onDelete={handleDeleteService}
              />
            )}
            {activeTab === 'settings' && (
              <SystemSettingsTab
                settings={systemSettings}
                onEdit={(category) => {
                  setEditingSettings({});
                  setShowSettingsModal(category);
                }}
              />
            )}
            {activeTab === 'features' && (
              <FeatureFlagsTab
                flags={featureFlags}
                onToggle={handleToggleFeature}
              />
            )}
            {activeTab === 'logs' && (
              <AuditLogsTab logs={auditLogs} />
            )}
            {activeTab === 'reports' && (
              <ReportsTab stats={dashboardStats} />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showServiceModal && (
        <ServiceModal
          service={editingService}
          onSave={handleSaveService}
          onClose={() => {
            setShowServiceModal(false);
            setEditingService(null);
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          category={showSettingsModal}
          settings={systemSettings[showSettingsModal] || []}
          editingSettings={editingSettings}
          setEditingSettings={setEditingSettings}
          onSave={() => handleUpdateSettings(showSettingsModal)}
          onClose={() => {
            setShowSettingsModal(false);
            setEditingSettings({});
          }}
        />
      )}
    </div>
  );
};

// ============ TAB COMPONENTS ============

const OverviewTab = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Users', value: stats.users?.total || 0, icon: Users, color: 'blue' },
    { label: 'Active Users', value: stats.users?.active || 0, icon: CheckCircle2, color: 'green' },
    { label: 'Verified Residents', value: stats.residents?.verified || 0, icon: Users, color: 'indigo' },
    { label: 'Pending Residents', value: stats.residents?.pending || 0, icon: Clock, color: 'amber' },
    { label: 'Document Services', value: stats.documentServices?.total || 0, icon: FileText, color: 'purple' },
    { label: 'Pending Requests', value: stats.requests?.pending || 0, icon: Clock, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health */}
      {stats.systemHealth && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.systemHealth).map(([key, status]) => (
              <div key={key} className="flex items-center gap-3">
                {status === 'healthy' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900 capitalize">{key}</p>
                  <p className={`text-xs ${status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Audit Logs */}
      {stats.recentAuditLogs && stats.recentAuditLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recentAuditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-sm">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{log.action}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{log.module}</span>
                <span className="text-slate-400 ml-auto">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PermissionsTab = ({ permissionMatrix, onUpdate }) => {
  const [editingRole, setEditingRole] = useState(null);
  const [localMatrix, setLocalMatrix] = useState([]);

  useEffect(() => {
    setLocalMatrix(permissionMatrix);
  }, [permissionMatrix]);

  const handleToggle = (permKey, role) => {
    setLocalMatrix((prev) =>
      prev.map((p) =>
        p.key === permKey ? { ...p, [role]: !p[role] } : p
      )
    );
  };

  const groupedByModule = localMatrix.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Role Permissions Matrix</h3>
            <p className="text-sm text-slate-600 mt-1">Configure what each role can access</p>
          </div>
          {editingRole && (
            <button
              onClick={() => {
                onUpdate(editingRole, localMatrix);
                setEditingRole(null);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save {editingRole} Permissions
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Permission</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900">Captain</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900">Secretary</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900">Staff</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedByModule).map(([module, perms]) => (
                <>
                  <tr key={`module-${module}`} className="bg-slate-50">
                    <td colSpan="4" className="py-2 px-4 text-sm font-semibold text-slate-700">
                      {module}
                    </td>
                  </tr>
                  {perms.map((perm) => (
                    <tr key={perm.key} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-700">{perm.label}</td>
                      {['captain', 'secretary', 'staff'].map((role) => (
                        <td key={role} className="text-center py-3 px-4">
                          <input
                            type="checkbox"
                            checked={perm[role] || false}
                            onChange={() => {
                              setEditingRole(role);
                              handleToggle(perm.key, role);
                            }}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DocumentServicesTab = ({ services, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Document Services</h3>
            <p className="text-sm text-slate-600 mt-1">Manage available document types and fees</p>
          </div>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Service Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Fee</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Processing Days</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{service.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{service.category || 'General'}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {service.isFree ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `₱${service.processingFee}`
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{service.processingDays} days</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.isAvailable
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {service.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(service)}
                        className="p-1 text-slate-600 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(service.id)}
                        className="p-1 text-slate-600 hover:text-red-600"
                        title="Deactivate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SystemSettingsTab = ({ settings, onEdit }) => {
  return (
    <div className="space-y-6">
      {Object.entries(settings).map(([category, categorySettings]) => (
        <div key={category} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 capitalize">{category} Settings</h3>
            <button
              onClick={() => onEdit(category)}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorySettings.map((setting) => (
              <div key={setting.key} className="border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-900">{setting.label}</p>
                <p className="text-sm text-slate-600 mt-1">{setting.value}</p>
                {setting.description && (
                  <p className="text-xs text-slate-500 mt-2">{setting.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const FeatureFlagsTab = ({ flags, onToggle }) => {
  return (
    <div className="space-y-4">
      {flags.map((flag) => (
        <div
          key={flag.key}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-between"
        >
          <div className="flex-1">
            <h4 className="text-base font-semibold text-slate-900">{flag.label}</h4>
            <p className="text-sm text-slate-600 mt-1">{flag.description}</p>
          </div>
          <button
            onClick={() => onToggle(flag.key, flag.isEnabled)}
            className={`ml-6 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              flag.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                flag.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

const AuditLogsTab = ({ logs }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Audit Logs</h3>
        <p className="text-sm text-slate-600 mt-1">System activity and security events</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Timestamp</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">User</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Action</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Module</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Description</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-xs text-slate-600">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-slate-700">{log.userId || 'System'}</td>
                <td className="py-3 px-4 text-sm font-medium text-slate-900">{log.action}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{log.module}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{log.description}</td>
                <td className="text-center py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      log.status === 'success'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsTab = ({ stats }) => {
  if (!stats) return <div className="text-center py-12 text-slate-600">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Usage Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">User Statistics</h4>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-slate-600">Total Users:</dt>
                <dd className="font-medium text-slate-900">{stats.users?.total || 0}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-slate-600">Active Users:</dt>
                <dd className="font-medium text-slate-900">{stats.users?.active || 0}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Request Statistics</h4>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-slate-600">Total Requests:</dt>
                <dd className="font-medium text-slate-900">{stats.requests?.total || 0}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-slate-600">Pending:</dt>
                <dd className="font-medium text-slate-900">{stats.requests?.pending || 0}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MODAL COMPONENTS ============

const ServiceModal = ({ service, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    service || {
      name: '',
      description: '',
      category: '',
      processingFee: 0,
      isFree: false,
      processingDays: 1,
      requirements: '',
      isAvailable: true
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {service ? 'Edit Service' : 'Add Service'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Service Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Processing Fee</label>
            <input
              type="number"
              min="0"
              value={formData.processingFee}
              onChange={(e) => setFormData(prev => ({ ...prev, processingFee: parseFloat(e.target.value) }))}
              disabled={formData.isFree}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFree"
              checked={formData.isFree}
              onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked, processingFee: e.target.checked ? 0 : prev.processingFee }))}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <label htmlFor="isFree" className="ml-2 text-sm text-slate-700">Free Service</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Processing Days</label>
            <input
              type="number"
              min="1"
              required
              value={formData.processingDays}
              onChange={(e) => setFormData(prev => ({ ...prev, processingDays: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <label htmlFor="isAvailable" className="ml-2 text-sm text-slate-700">Service Available</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {service ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SettingsModal = ({ category, settings, editingSettings, setEditingSettings, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 capitalize">
            Edit {category} Settings
          </h3>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {setting.label}
                </label>
                <input
                  type="text"
                  value={editingSettings[setting.key] || setting.value}
                  onChange={(e) => setEditingSettings(prev => ({ 
                    ...prev, 
                    [setting.key]: e.target.value 
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {setting.description && (
                  <p className="text-xs text-slate-500 mt-1">{setting.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
