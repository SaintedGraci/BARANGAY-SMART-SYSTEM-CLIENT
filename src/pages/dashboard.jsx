import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Building2,
  ChevronRight,
  FileText,
  Flame,
  HeartPulse,
  Home,
  LogOut,
  Megaphone,
  Menu,
  Phone,
  Shield,
  Siren,
  User,
  Plus,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  Info,
  Download,
  Check,
  ClipboardList,
  Send,
  MessageSquare,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { requestsAPI, announcementsAPI, complaintsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { DocumentListModal } from '../components/ui/documentlistmodal';
import bakilidLogo from '../assets/bakilidlogo.png';

function DashboardModal({ isOpen, onClose, title, subtitle, icon: Icon, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200/80 bg-slate-50/90 px-6 py-5">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">{title}</h3>
              {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-88px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

function ModalSection({ icon: Icon, title, children }) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        <Icon className="h-4 w-4 text-blue-600" />
        {title}
      </h4>
      {children}
    </div>
  );
}

const ESSENTIAL_HOTLINES = [
  {
    id: '911',
    name: 'National Emergency Hotline',
    number: '911',
    description: 'Police, fire, ambulance, and disaster response nationwide.',
    available: '24/7',
    accent: 'from-red-500 to-orange-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: Siren,
    priority: true,
  },
  {
    id: 'barangay',
    name: 'Barangay Bakilid Hall',
    number: '(032) 345-1234',
    description: 'Tanod, local concerns, barangay certificates, and community assistance.',
    available: 'Mon–Sat, 8AM–5PM',
    accent: 'from-blue-600 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: Building2,
  },
  {
    id: 'police',
    name: 'PNP / Police Station',
    number: '(032) 345-4022',
    description: 'Crime reporting, traffic incidents, and police assistance.',
    available: '24/7',
    accent: 'from-slate-700 to-slate-900',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    icon: Shield,
  },
  {
    id: 'fire',
    name: 'Bureau of Fire Protection',
    number: '160',
    altNumber: '(032) 345-6789',
    description: 'Fire emergencies, rescue operations, and fire safety concerns.',
    available: '24/7',
    accent: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: Flame,
  },
  {
    id: 'hospital',
    name: 'Hospital / Medical Emergency',
    number: '(032) 348-2999',
    description: 'Medical emergencies, ambulance requests, and urgent health concerns.',
    available: '24/7',
    accent: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: HeartPulse,
  },
  {
    id: 'mdrrmo',
    name: 'MDRRMO (Disaster Response)',
    number: '(032) 345-9090',
    description: 'Floods, earthquakes, typhoon response, and evacuation assistance.',
    available: '24/7 during alerts',
    accent: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    icon: Siren,
  },
  {
    id: 'redcross',
    name: 'Philippine Red Cross',
    number: '143',
    description: 'Ambulance, blood bank, and humanitarian emergency support.',
    available: '24/7',
    accent: 'from-rose-500 to-red-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    icon: HeartPulse,
  },
  {
    id: 'health',
    name: 'Barangay Health Center',
    number: '(032) 345-5678',
    description: 'First aid, maternal health, vaccinations, and barangay health programs.',
    available: 'Mon–Fri, 8AM–4PM',
    accent: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    icon: HeartPulse,
  },
];

function HotlineCard({ hotline, compact = false }) {
  const Icon = hotline.icon;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border ${hotline.border} ${hotline.bg} p-3`}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${hotline.accent} text-white shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{hotline.name}</p>
          <p className={`text-sm font-bold ${hotline.text}`}>{hotline.number}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${hotline.border} bg-white p-5 shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${hotline.accent} text-white shadow-md`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{hotline.name}</h3>
            {hotline.priority && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">
                Priority
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">{hotline.description}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{hotline.number}</p>
          {hotline.altNumber && (
            <p className="mt-1 text-sm text-slate-500">
              Local line: <span className="font-semibold text-slate-700">{hotline.altNumber}</span>
            </p>
          )}
          <p className="mt-2 text-xs font-medium text-slate-400">{hotline.available}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isRequestDetailOpen, setIsRequestDetailOpen] = useState(false);
  const [isComplaintDetailOpen, setIsComplaintDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [requestForm, setRequestForm] = useState({
    documentType: 'Barangay Clearance',
    purpose: '',
    remarks: ''
  });
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh requests when notification is received
  useEffect(() => {
    if (notifications.length > 0) {
      fetchData();
    }
  }, [notifications]);

  const fetchData = async () => {
    try {
      const [requestsRes, complaintsRes, announcementsRes] = await Promise.all([
        requestsAPI.getAll(),
        complaintsAPI.getMy(),
        announcementsAPI.getAll()
      ]);
      
      setRequests(requestsRes.data.data || []);
      setComplaints(complaintsRes.data.data || []);
      const allAnnouncements = announcementsRes.data.data || announcementsRes.data || [];
      setAnnouncements(
        allAnnouncements.filter((item) => item.status === 'Active')
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDocumentSelect = (documentType) => {
    setRequestForm({
      ...requestForm,
      documentType: documentType
    });
    setIsRequestModalOpen(true);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestsAPI.create(requestForm);
      setIsRequestModalOpen(false);
      setRequestForm({
        documentType: 'Barangay Clearance',
        purpose: '',
        remarks: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating request:', error);
      alert(error.response?.data?.message || 'Failed to create request');
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setIsRequestDetailOpen(true);
  };

  const handleCloseRequestDetail = () => {
    setIsRequestDetailOpen(false);
    setSelectedRequest(null);
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsComplaintDetailOpen(true);
  };

  const handleCloseComplaintDetail = () => {
    setIsComplaintDetailOpen(false);
    setSelectedComplaint(null);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaintsAPI.create(complaintForm);
      setIsComplaintModalOpen(false);
      setComplaintForm({
        subject: '',
        description: ''
      });
      fetchData();
      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error creating complaint:', error);
      alert(error.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Investigating': 'bg-blue-100 text-blue-800',
      'Ready for Release': 'bg-green-100 text-green-800',
      'Claimed': 'bg-gray-100 text-gray-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'requests', name: 'My Requests', icon: FileText },
    { id: 'complaints', name: 'My Complaints', icon: AlertCircle },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'hotline', name: 'Hotline', icon: Phone },
    { id: 'profile', name: 'My Profile', icon: User },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafbfc]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const completedCount = requests.filter((r) => r.status === 'Claimed').length;
  const readyCount = requests.filter((r) => r.status === 'Ready for Release').length;

  return (
    <div className="relative flex min-h-screen bg-[#fafbfc] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 border-r border-slate-200/70 bg-white/80 backdrop-blur-xl transition-all duration-300 lg:static ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200/70 p-4">
            {isSidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                  <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Barangay Bakilid</span>
                  <p className="text-xs font-medium text-blue-600">Resident Portal</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-200/70 p-4">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
              <div cl assName="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              {isSidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{user?.username}</p>
                  <p className="text-xs font-medium capitalize text-blue-600">{user?.role}</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {menuItems.find((item) => item.id === activeTab)?.name}
              </h1>
              <p className="text-sm text-slate-500">
                {activeTab === 'dashboard' && 'Overview of your barangay services'}
                {activeTab === 'requests' && 'Track and manage document requests'}
                {activeTab === 'complaints' && 'View and file complaints'}
                {activeTab === 'announcements' && 'Latest updates from your barangay'}
                {activeTab === 'hotline' && 'Emergency and essential contact numbers'}
                {activeTab === 'profile' && 'Your account information'}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl p-2.5 text-slate-600 transition-colors hover:bg-slate-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markAsRead(notif.id);
                            setShowNotifications(false);
                            setActiveTab('requests');
                          }}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {notif.documentType}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <p className="text-sm font-medium text-blue-200">Welcome back</p>
                  <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{user?.username}!</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">
                    Manage document requests, stay updated with announcements, and access emergency hotlines anytime.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsDocumentListOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4" />
                      New Request
                    </button>
                    <button
                      onClick={() => setActiveTab('hotline')}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      <Phone className="h-4 w-4" />
                      Emergency Hotlines
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Total Requests', value: requests.length, icon: FileText, tone: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Pending', value: pendingCount, icon: Clock, tone: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Ready for Release', value: readyCount, icon: CheckCircle2, tone: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Completed', value: completedCount, icon: CheckCircle2, tone: 'text-slate-700', bg: 'bg-slate-100' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">{stat.label}</p>
                          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                          <Icon className={`h-5 w-5 ${stat.tone}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-1">
                  <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                  <p className="mt-1 text-sm text-slate-500">Common tasks for residents</p>
                  <div className="mt-5 space-y-3">
                    <button
                      onClick={() => setIsDocumentListOpen(true)}
                      className="flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-left transition hover:bg-blue-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">New Document Request</p>
                        <p className="text-sm text-slate-500">Request barangay documents online</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setIsComplaintModalOpen(true)}
                      className="flex w-full items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4 text-left transition hover:bg-amber-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600 text-white">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">File a Complaint</p>
                        <p className="text-sm text-slate-500">Report issues to the barangay</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-left transition hover:bg-emerald-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">View My Requests</p>
                        <p className="text-sm text-slate-500">Track document status in real time</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-1">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Essential Hotlines</h3>
                      <p className="text-sm text-slate-500">Reference contact numbers</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('hotline')}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {ESSENTIAL_HOTLINES.slice(0, 4).map((hotline) => (
                      <HotlineCard key={hotline.id} hotline={hotline} compact />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-1">
                  <h3 className="text-lg font-bold text-slate-900">Recent Announcements</h3>
                  <p className="mt-1 text-sm text-slate-500">Latest from Barangay Bakilid</p>
                  {announcements.length === 0 ? (
                    <p className="mt-6 text-sm text-slate-500">No announcements yet.</p>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {announcements.slice(0, 3).map((announcement) => (
                        <div key={announcement.id} className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                          <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{announcement.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Document Requests</h2>
                <Button onClick={() => setIsDocumentListOpen(true)}>
                  + New Request
                </Button>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No requests yet. Create your first request!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {requests.map((request) => (
                    <button
                      key={request.id}
                      onClick={() => handleRequestClick(request)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-300 text-left"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{request.documentType}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Purpose: {request.purpose}</p>
                      {request.remarks && (
                        <p className="text-sm text-gray-500">Remarks: {request.remarks}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          Requested: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <span className="text-blue-600 text-xs font-medium flex items-center gap-1">
                          View Details
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Complaints</h2>
                <Button onClick={() => setIsComplaintModalOpen(true)}>
                  + File Complaint
                </Button>
              </div>

              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No complaints filed yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {complaints.map((complaint) => (
                    <button
                      key={complaint.id}
                      onClick={() => handleComplaintClick(complaint)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-amber-300 text-left"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{complaint.subject}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{complaint.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          Filed: {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                        <span className="text-amber-600 text-xs font-medium flex items-center gap-1">
                          View Details
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Barangay Announcements</h2>
              
              {announcements.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No announcements available</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {announcement.imagePath && (
                        <img 
                          src={`http://localhost:5000/${announcement.imagePath}`} 
                          alt={announcement.title}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', announcement.imagePath);
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{announcement.title}</h3>
                            <p className="text-gray-600 mb-3">{announcement.description}</p>
                            <p className="text-xs text-gray-400">
                              Posted: {new Date(announcement.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
              <div className="max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{user?.username}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <label className="text-sm font-semibold text-gray-500">Username</label>
                    <p className="text-gray-900 mt-1">{user?.username}</p>
                  </div>
                  <div className="border-b pb-4">
                    <label className="text-sm font-semibold text-gray-500">Email Address</label>
                    <p className="text-gray-900 mt-1">{user?.email}</p>
                  </div>
                  <div className="border-b pb-4">
                    <label className="text-sm font-semibold text-gray-500">Account Type</label>
                    <p className="text-gray-900 mt-1 capitalize">{user?.role}</p>
                  </div>
                  <div className="border-b pb-4">
                    <label className="text-sm font-semibold text-gray-500">Verification Status</label>
                    <p className="text-gray-900 mt-1">
                      {user?.isVerified ? (
                        <span className="text-green-600 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="text-yellow-600">Pending Verification</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hotline' && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white shadow-lg sm:p-8">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Siren className="h-4 w-4" />
                    Emergency Directory
                  </div>
                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Essential Hotline Numbers</h2>
                  <p className="mt-2 max-w-2xl text-sm text-red-50">
                    Save these numbers for emergencies. Contact barangay, police, hospital, fire, and other essential services using the numbers listed below.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {ESSENTIAL_HOTLINES.map((hotline) => (
                  <HotlineCard key={hotline.id} hotline={hotline} />
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <h3 className="font-bold text-blue-900">When to call</h3>
                  <ul className="mt-3 space-y-2 text-sm text-blue-800">
                    <li>• Life-threatening medical or fire emergencies</li>
                    <li>• Crime, theft, or public safety incidents</li>
                    <li>• Barangay tanod and local community concerns</li>
                    <li>• Flood, typhoon, or disaster-related assistance</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="font-bold text-amber-900">Important reminder</h3>
                  <p className="mt-3 text-sm text-amber-800">
                    For document requests and non-urgent inquiries, use the online request system or visit the barangay office during regular hours. Reserve hotlines for emergencies and urgent matters.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Document List Modal */}
      <DocumentListModal 
        isOpen={isDocumentListOpen}
        onClose={() => setIsDocumentListOpen(false)}
        onSelectDocument={handleDocumentSelect}
      />

      {/* Request Modal */}
      <DashboardModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="New Document Request"
        subtitle="Fill in the details for your barangay document"
        icon={FileText}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleRequestSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="h-4 w-4 text-slate-400" />
              Document Type
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              value={requestForm.documentType}
              onChange={(e) => setRequestForm({ ...requestForm, documentType: e.target.value })}
            >
              <option>Barangay Clearance</option>
              <option>Certificate of Residency</option>
              <option>Indigency Certificate</option>
              <option>Business Permit</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ClipboardList className="h-4 w-4 text-slate-400" />
              Purpose
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Employment, Business, etc."
              value={requestForm.purpose}
              onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              Additional Remarks
              <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <textarea
              rows={4}
              placeholder="Any additional information..."
              value={requestForm.remarks}
              onChange={(e) => setRequestForm({ ...requestForm, remarks: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-sm text-blue-800">
                Your request will be reviewed by barangay staff. You can track the status from My Requests.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
          >
            <Send className="h-4 w-4" />
            Submit Request
          </button>
        </form>
      </DashboardModal>

      {/* Request Detail Modal */}
      <DashboardModal
        isOpen={isRequestDetailOpen && !!selectedRequest}
        onClose={handleCloseRequestDetail}
        title="Request Details"
        subtitle={selectedRequest ? `Request ID: #${selectedRequest.id}` : ''}
        icon={FileText}
        maxWidth="max-w-2xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <ModalSection icon={FileText} title="Document Information">
              <div className="space-y-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Document Type</span>
                    <p className="mt-1 text-lg font-bold text-slate-900">{selectedRequest.documentType}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div className="border-t border-blue-100 pt-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Purpose</span>
                  <p className="mt-1 font-medium text-slate-900">{selectedRequest.purpose}</p>
                </div>
                {selectedRequest.remarks && (
                  <div className="border-t border-blue-100 pt-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Additional Remarks</span>
                    <p className="mt-1 font-medium text-slate-900">{selectedRequest.remarks}</p>
                  </div>
                )}
              </div>
            </ModalSection>

            <ModalSection icon={ClipboardList} title="Request Status">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                {[
                  {
                    label: 'Request Submitted',
                    hint: 'Your request has been received',
                    done: ['Pending', 'Processing', 'Ready for Release', 'Claimed'].includes(selectedRequest.status),
                    active: false,
                  },
                  {
                    label: 'Processing',
                    hint: 'Document is being prepared',
                    done: ['Processing', 'Ready for Release', 'Claimed'].includes(selectedRequest.status),
                    active: selectedRequest.status === 'Pending',
                  },
                  {
                    label: 'Ready for Release',
                    hint: 'Document is ready for pickup',
                    done: ['Ready for Release', 'Claimed'].includes(selectedRequest.status),
                    active: selectedRequest.status === 'Processing',
                  },
                  {
                    label: 'Claimed',
                    hint: 'Document has been received',
                    done: selectedRequest.status === 'Claimed',
                    active: selectedRequest.status === 'Ready for Release',
                  },
                ].map((step, index) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        step.done
                          ? 'bg-emerald-500 text-white'
                          : step.active
                          ? 'animate-pulse bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.done ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{step.label}</p>
                      <p className="text-xs text-slate-500">{step.hint}</p>
                    </div>
                  </div>
                ))}

                {selectedRequest.status === 'Rejected' && (
                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-900">Request Rejected</p>
                      <p className="text-xs text-red-700">Please contact the barangay office for details</p>
                    </div>
                  </div>
                )}
              </div>
            </ModalSection>

            <ModalSection icon={Calendar} title="Important Dates">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Request Date</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Last Updated</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {new Date(selectedRequest.updatedAt).toLocaleString()}
                  </span>
                </div>
                {selectedRequest.releaseDate && (
                  <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                    <span className="text-sm text-slate-500">Release Date</span>
                    <span className="text-sm font-semibold text-emerald-700">
                      {new Date(selectedRequest.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </ModalSection>

            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">Need help?</p>
                  <p className="mt-1">
                    Visit the barangay office or check the Hotline tab for contact numbers during office hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={handleCloseRequestDetail}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
              {selectedRequest.status === 'Ready for Release' && (
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Ready to Claim
                </button>
              )}
            </div>
          </div>
        )}
      </DashboardModal>

      {/* Complaint Modal */}
      <DashboardModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        title="File a Complaint"
        subtitle="Report an issue or concern to the barangay"
        icon={AlertCircle}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleComplaintSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ClipboardList className="h-4 w-4 text-slate-400" />
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="Brief description of the issue"
              value={complaintForm.subject}
              onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              Description
            </label>
            <textarea
              rows={6}
              required
              placeholder="Provide detailed information about your complaint..."
              value={complaintForm.description}
              onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            />
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Your complaint will be reviewed by barangay officials. You'll be notified when there are updates.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/15 transition hover:bg-amber-700"
          >
            <Send className="h-4 w-4" />
            Submit Complaint
          </button>
        </form>
      </DashboardModal>

      {/* Complaint Detail Modal */}
      <DashboardModal
        isOpen={isComplaintDetailOpen && !!selectedComplaint}
        onClose={handleCloseComplaintDetail}
        title="Complaint Details"
        subtitle={selectedComplaint ? `Complaint ID: #${selectedComplaint.id}` : ''}
        icon={AlertCircle}
        maxWidth="max-w-2xl"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <ModalSection icon={AlertCircle} title="Complaint Information">
              <div className="space-y-3 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject</span>
                    <p className="mt-1 text-lg font-bold text-slate-900">{selectedComplaint.subject}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <div className="border-t border-amber-100 pt-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Description</span>
                  <p className="mt-1 text-slate-900 whitespace-pre-wrap">{selectedComplaint.description}</p>
                </div>
              </div>
            </ModalSection>

            <ModalSection icon={ClipboardList} title="Complaint Status">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                {[
                  {
                    label: 'Complaint Filed',
                    hint: 'Your complaint has been received',
                    done: ['Pending', 'Investigating', 'Resolved'].includes(selectedComplaint.status),
                    active: false,
                  },
                  {
                    label: 'Under Investigation',
                    hint: 'Barangay officials are reviewing your complaint',
                    done: ['Investigating', 'Resolved'].includes(selectedComplaint.status),
                    active: selectedComplaint.status === 'Pending',
                  },
                  {
                    label: 'Resolved',
                    hint: 'Complaint has been addressed',
                    done: selectedComplaint.status === 'Resolved',
                    active: selectedComplaint.status === 'Investigating',
                  },
                ].map((step, index) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        step.done
                          ? 'bg-emerald-500 text-white'
                          : step.active
                          ? 'animate-pulse bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.done ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{step.label}</p>
                      <p className="text-xs text-slate-500">{step.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ModalSection>

            <ModalSection icon={Calendar} title="Important Dates">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Filed Date</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Last Updated</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {new Date(selectedComplaint.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </ModalSection>

            <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div className="text-sm text-amber-900">
                  <p className="font-semibold">Need assistance?</p>
                  <p className="mt-1">
                    For urgent matters, visit the barangay office or check the Hotline tab for contact numbers.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseComplaintDetail}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        )}
      </DashboardModal>
    </div>
  );
}
