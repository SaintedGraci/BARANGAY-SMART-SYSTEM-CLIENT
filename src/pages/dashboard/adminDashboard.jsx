import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  Megaphone,
  Activity,
  BarChart3,
  Menu,
  LogOut,
  Search,
  Plus,
  RefreshCw,
  ChevronRight,
  Filter,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  FileCheck,
  UserCheck,
  UserPlus,
  BadgeCheck,
  ClipboardList,
  Info,
  Send,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { requestsAPI, residentsAPI, announcementsAPI, logsAPI, complaintsAPI } from '../../services/api';
import bakilidLogo from '../../assets/bakilidlogo.png';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Ready for Release', 'Claimed', 'Rejected'];

const COMPLAINT_STATUS_OPTIONS = ['Pending', 'Investigating', 'Resolved'];

const STATUS_CLASSES = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/15 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200',
  'Ready for Release': 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 border-emerald-200',
  Claimed: 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-600/15 border-rose-200',
};

const COMPLAINT_STATUS_CLASSES = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/15 border-amber-200',
  Investigating: 'bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 border-emerald-200',
};

const ANNOUNCEMENT_STATUS_CLASSES = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200',
  Archived: 'bg-amber-50 text-amber-700 ring-amber-600/15 border-amber-200',
};

const PRIORITY_CLASSES = {
  Low: 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200',
  Medium: 'bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200',
  High: 'bg-orange-50 text-orange-700 ring-orange-600/15 border-orange-200',
  Urgent: 'bg-rose-50 text-rose-700 ring-rose-600/15 border-rose-200',
};

const LOG_LEVEL_CLASSES = {
  error: 'bg-rose-50 text-rose-700 ring-rose-600/15 border-rose-200',
  warn: 'bg-amber-50 text-amber-700 ring-amber-600/15 border-amber-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200',
  debug: 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200',
};

const TAB_DESCRIPTIONS = {
  overview: 'Monitor daily barangay operations, requests, residents, and service activity.',
  requests: 'Review and update document requests submitted by residents.',
  complaints: 'Review and manage complaints filed by residents.',
  residents: 'Manage registered residents and account access.',
  verifications: 'Approve or reject new resident registrations with supporting documents.',
  announcements: 'Publish, edit, archive, or remove announcements for residents.',
  logs: 'Inspect system logs, errors, warnings, and security events.',
  reports: 'View service analytics and administrative reporting summaries.',
};

function formatDateTime(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
}

function residentName(resident) {
  if (!resident) return 'N/A';
  const middle = resident.middleName ? `${resident.middleName} ` : '';
  return `${resident.firstName || ''} ${middle}${resident.lastName || ''}`.trim() || 'N/A';
}

function residentInitials(resident) {
  const firstName = resident?.firstName?.charAt(0) || '';
  const lastName = resident?.lastName?.charAt(0) || '';
  return `${firstName}${lastName}`.toUpperCase() || 'R';
}

function fullAddress(resident) {
  if (!resident) return 'N/A';
  const purok = resident.purok ? `, Purok ${resident.purok}` : '';
  return `${resident.address || 'N/A'}${purok}`;
}

function getStatusBadgeClass(status) {
  return STATUS_CLASSES[status] || 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200';
}

function getAnnouncementStatusBadgeClass(status) {
  return ANNOUNCEMENT_STATUS_CLASSES[status] || 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200';
}

function getComplaintStatusBadgeClass(status) {
  return COMPLAINT_STATUS_CLASSES[status] || 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200';
}

function getPriorityBadgeClass(priority) {
  return PRIORITY_CLASSES[priority] || 'bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200';
}

function getResidentStatusBadgeClass(isVerified) {
  return isVerified
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 border-emerald-200'
    : 'bg-amber-50 text-amber-700 ring-amber-600/15 border-amber-200';
}

function getLogBadgeClass(level) {
  return LOG_LEVEL_CLASSES[level] || 'bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200';
}

function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>
      {children}
    </span>
  );
}

function IconCircle({ icon: Icon, className = 'bg-blue-50 text-blue-700', children }) {
  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${className}`}>
      {children || <Icon className="h-5 w-5" />}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>}
        <h3 className="mt-2 text-lg font-bold text-slate-950">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="mt-4 text-base font-bold text-slate-900">{title}</h4>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Modal({ isOpen, onClose, title, subtitle, icon: Icon, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onClick={onClose}>
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-start gap-3">
            {Icon && <IconCircle icon={Icon} className="bg-blue-600 text-white" />}
            <div>
              <h3 className="text-lg font-bold text-slate-950">{title}</h3>
              {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(92vh-92px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

function FieldLabel({ icon: Icon, children, hint }) {
  return (
    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      {children}
      {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

function FieldInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${props.className || ''}`}
    />
  );
}

function FieldSelect(props) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
    />
  );
}

function FieldTextarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${props.className || ''}`}
    />
  );
}

function StatusBadge({ status }) {
  return <Badge className={getStatusBadgeClass(status)}>{status}</Badge>;
}

function ComplaintStatusBadge({ status }) {
  return <Badge className={getComplaintStatusBadgeClass(status)}>{status}</Badge>;
}

function ResidentStatusBadge({ isVerified }) {
  return (
    <Badge className={getResidentStatusBadgeClass(isVerified)}>
      {isVerified ? 'Verified' : 'Pending'}
    </Badge>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [residentSearchQuery, setResidentSearchQuery] = useState('');
  const [showCreateResidentModal, setShowCreateResidentModal] = useState(false);
  const [creatingResident, setCreatingResident] = useState(false);
  const [newResidentData, setNewResidentData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    contactNumber: '',
    purok: '',
    address: '',
    citizenship: 'Filipino',
  });
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    status: 'Active',
    priority: 'Medium',
    image: null,
  });
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentToView, setDocumentToView] = useState(null);
  const [loadingVerifications, setLoadingVerifications] = useState(false);

  const [logs, setLogs] = useState([]);
  const [logStats, setLogStats] = useState(null);
  const [logFiles, setLogFiles] = useState([]);
  const [selectedLogFile, setSelectedLogFile] = useState('combined.log');
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logFilter, setLogFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [autoRefreshLogs, setAutoRefreshLogs] = useState(false);

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [complaintSearch, setComplaintSearch] = useState('');
  const [updatingComplaint, setUpdatingComplaint] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    } else if (activeTab === 'verifications') {
      fetchPendingVerifications();
    } else if (activeTab === 'logs') {
      fetchLogs();
      fetchLogStats();
    } else if (activeTab === 'complaints') {
      fetchComplaints();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogFiles();
    }
  }, [activeTab]);

  useEffect(() => {
    let interval;
    if (activeTab === 'logs' && autoRefreshLogs) {
      interval = setInterval(() => {
        fetchLogs();
        fetchLogStats();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, autoRefreshLogs]);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab, selectedLogFile, logFilter, logSearch]);

  const fetchPendingVerifications = async () => {
    setLoadingVerifications(true);
    try {
      const response = await residentsAPI.getPendingVerifications();
      setPendingVerifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
    } finally {
      setLoadingVerifications(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getAll();
      const data = response.data.data || response.data || [];
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchLogs = async () => {
    if (!selectedLogFile) return;

    setLoadingLogs(true);
    try {
      const params = {
        lines: 100,
        ...(logFilter !== 'all' && { level: logFilter }),
        ...(logSearch && { search: logSearch }),
      };

      const response = await logsAPI.getContent(selectedLogFile, params);
      setLogs(response.data.data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchLogStats = async () => {
    try {
      const response = await logsAPI.getStats();
      setLogStats(response.data.data);
    } catch (error) {
      console.error('Error fetching log stats:', error);
      setLogStats(null);
    }
  };

  const fetchLogFiles = async () => {
    try {
      const response = await logsAPI.getFiles();
      setLogFiles(response.data.data.files || []);
    } catch (error) {
      console.error('Error fetching log files:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await complaintsAPI.getAll();
      const data = response.data.data || [];
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, newStatus) => {
    setUpdatingComplaint(true);
    try {
      await complaintsAPI.update(complaintId, { status: newStatus });
      alert('Complaint status updated successfully!');
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert(error.response?.data?.message || 'Failed to update complaint status');
    } finally {
      setUpdatingComplaint(false);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      await complaintsAPI.delete(complaintId);
      alert('Complaint deleted successfully');
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert(error.response?.data?.message || 'Failed to delete complaint');
    }
  };

  const fetchData = async () => {
    try {
      const [requestsRes, residentsRes] = await Promise.all([
        requestsAPI.getAll(),
        residentsAPI.getAll(),
      ]);

      setRequests(requestsRes.data.data || []);
      const residentsData = residentsRes.data.data;
      setResidents(Array.isArray(residentsData) ? residentsData : residentsData?.residents || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResident = async (event) => {
    event.preventDefault();
    setCreatingResident(true);

    try {
      const response = await residentsAPI.createWithAccount(newResidentData);

      if (response.data.success) {
        alert('Resident created successfully!');
        setShowCreateResidentModal(false);
        setNewResidentData({
          username: '',
          email: '',
          password: '',
          firstName: '',
          middleName: '',
          lastName: '',
          gender: '',
          birthDate: '',
          contactNumber: '',
          purok: '',
          address: '',
          citizenship: 'Filipino',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating resident:', error);
      alert(error.response?.data?.message || 'Failed to create resident');
    } finally {
      setCreatingResident(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewResidentData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateAnnouncementModal = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({
      title: '',
      description: '',
      status: 'Active',
      priority: 'Medium',
      image: null,
    });
    setShowAnnouncementModal(true);
  };

  const openEditAnnouncementModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      description: announcement.description,
      status: announcement.status,
      priority: announcement.priority || 'Medium',
      image: null,
    });
    setShowAnnouncementModal(true);
  };

  const handleAnnouncementFormChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'image') {
      setAnnouncementForm((previous) => ({ ...previous, [name]: files[0] }));
    } else {
      setAnnouncementForm((previous) => ({ ...previous, [name]: value }));
    }
  };

  const handleSaveAnnouncement = async (event) => {
    event.preventDefault();
    setSavingAnnouncement(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', announcementForm.title);
      formData.append('description', announcementForm.description);
      formData.append('status', announcementForm.status);
      formData.append('priority', announcementForm.priority);
      
      if (announcementForm.image) {
        formData.append('image', announcementForm.image);
      }

      if (editingAnnouncement) {
        await announcementsAPI.update(editingAnnouncement.id, formData);
        alert('Announcement updated successfully!');
      } else {
        await announcementsAPI.create(formData);
        alert('Announcement published successfully!');
      }

      setShowAnnouncementModal(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert(error.response?.data?.message || 'Failed to save announcement');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement? Residents will no longer see it.')) {
      return;
    }

    try {
      await announcementsAPI.delete(id);
      alert('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert(error.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const handleApproveResident = async (residentId) => {
    if (!window.confirm('Approve this resident registration?')) {
      return;
    }

    try {
      await residentsAPI.approve(residentId);
      alert('Resident approved successfully!');
      fetchPendingVerifications();
      fetchData();
    } catch (error) {
      console.error('Error approving resident:', error);
      alert(error.response?.data?.message || 'Failed to approve resident');
    }
  };

  const handleRejectResident = async (residentId) => {
    const reason = window.prompt('Enter rejection reason (optional):');
    if (reason === null) return;

    try {
      await residentsAPI.reject(residentId, reason);
      alert('Resident verification rejected.');
      fetchPendingVerifications();
      fetchData();
    } catch (error) {
      console.error('Error rejecting resident:', error);
      alert(error.response?.data?.message || 'Failed to reject resident');
    }
  };

  const handleViewDocument = (resident, docType) => {
    const docPath = docType === 'validId' ? resident.validIdPath : resident.proofOfResidencyPath;
    if (docPath) {
      setDocumentToView({
        type: docType,
        path: `http://localhost:5000/${docPath}`,
        resident: residentName(resident),
      });
      setShowDocumentModal(true);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await requestsAPI.update(requestId, { status: newStatus });
      fetchData();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredRequests = Array.isArray(requests)
    ? requests.filter((request) => {
        const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
        const resident = request.Resident || {};
        const matchesSearch =
          searchQuery === '' ||
          request.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resident.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resident.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    : [];

  const filteredResidents = Array.isArray(residents)
    ? residents.filter((resident) => {
        const matchesSearch =
          residentSearchQuery === '' ||
          resident.firstName?.toLowerCase().includes(residentSearchQuery.toLowerCase()) ||
          resident.lastName?.toLowerCase().includes(residentSearchQuery.toLowerCase()) ||
          resident.User?.email?.toLowerCase().includes(residentSearchQuery.toLowerCase()) ||
          resident.contactNumber?.includes(residentSearchQuery);
        return matchesSearch;
      })
    : [];

  const stats = {
    total: Array.isArray(requests) ? requests.length : 0,
    pending: Array.isArray(requests) ? requests.filter((request) => request.status === 'Pending').length : 0,
    processing: Array.isArray(requests) ? requests.filter((request) => request.status === 'Processing').length : 0,
    ready: Array.isArray(requests) ? requests.filter((request) => request.status === 'Ready for Release').length : 0,
    claimed: Array.isArray(requests) ? requests.filter((request) => request.status === 'Claimed').length : 0,
    rejected: Array.isArray(requests) ? requests.filter((request) => request.status === 'Rejected').length : 0,
  };

  const verifiedResidents = Array.isArray(residents)
    ? residents.filter((resident) => resident.User?.isVerified).length
    : 0;

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'requests', name: 'All Requests', icon: FileText },
    { id: 'complaints', name: 'Complaints', icon: AlertCircle, badge: complaints.filter(c => c.status === 'Pending').length },
    { id: 'residents', name: 'Residents', icon: Users },
    {
      id: 'verifications',
      name: 'Verifications',
      icon: ShieldCheck,
      badge: pendingVerifications.length,
    },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'logs', name: 'System Logs', icon: Activity },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
  ];

  const activeMenuItem = menuItems.find((item) => item.id === activeTab);
  const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const overviewStats = [
    {
      label: 'Total Requests',
      value: stats.total,
      description: 'All document requests received',
      icon: FileText,
      className: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      description: 'Awaiting staff action',
      icon: Clock,
      className: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Processing',
      value: stats.processing,
      description: 'Currently being prepared',
      icon: ClipboardList,
      className: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Ready for Release',
      value: stats.ready,
      description: 'Ready for resident pickup',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Verified Residents',
      value: verifiedResidents,
      description: 'Active resident accounts',
      icon: UserCheck,
      className: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Pending Verifications',
      value: pendingVerifications.length,
      description: 'New registrations to review',
      icon: BadgeCheck,
      className: 'bg-violet-50 text-violet-700',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Requests',
      description: 'Review statuses and release approved documents.',
      icon: FileCheck,
      onClick: () => setActiveTab('requests'),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      title: 'Review Verifications',
      description: 'Approve or reject resident registrations.',
      icon: ShieldCheck,
      onClick: () => setActiveTab('verifications'),
      className: 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200',
    },
    {
      title: 'Publish Announcement',
      description: 'Notify residents about barangay updates.',
      icon: Megaphone,
      onClick: openCreateAnnouncementModal,
      className: 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200',
    },
    {
      title: 'Add Resident',
      description: 'Create a resident account and profile.',
      icon: UserPlus,
      onClick: () => setShowCreateResidentModal(true),
      className: 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {isSidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          {isSidebarOpen && (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-slate-950">Barangay Bakilid</h1>
                <p className="text-xs font-medium text-blue-700">Admin Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/10'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge > 0 && (
                      <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-950">{user?.username}</p>
                <p className="text-xs font-medium text-slate-500 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
          <div className="flex flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                <LayoutDashboard className="h-4 w-4" />
                Admin Console
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {activeMenuItem?.name || 'Dashboard'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{TAB_DESCRIPTIONS[activeTab]}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last updated</p>
                <p className="text-sm font-bold text-slate-950">{lastUpdated}</p>
              </div>
              <button
                onClick={fetchData}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/10">
                      <ShieldCheck className="h-4 w-4" />
                      Barangay Operations Control
                    </div>
                    <h3 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-slate-950">
                      A cleaner command center for Bakilid services
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                      Track document requests, verify residents, publish announcements, and monitor system activity from one organized workspace.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700"
                      >
                        <FileText className="h-4 w-4" />
                        Manage Requests
                      </button>
                      <button
                        onClick={() => setActiveTab('verifications')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Review Verifications
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Open Requests', value: stats.pending + stats.processing + stats.ready, icon: Clock },
                      { label: 'Verified Residents', value: verifiedResidents, icon: UserCheck },
                      { label: 'Announcements', value: announcements.length, icon: Megaphone },
                      { label: 'System Logs', value: logs.length, icon: Activity },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <Icon className="h-5 w-5 text-blue-700" />
                          <p className="mt-3 text-2xl font-bold text-slate-950">{item.value}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {overviewStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p>
                          <p className="mt-1 text-xs text-slate-400">{stat.description}</p>
                        </div>
                        <IconCircle icon={Icon} className={stat.className} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">Recent Requests</h3>
                      <p className="mt-1 text-sm text-slate-500">Latest document requests from residents</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                      <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Request</th>
                          <th className="px-5 py-3">Resident</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3">Requested</th>
                          <th className="px-5 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {requests.slice(0, 5).map((request) => (
                          <tr key={request.id} className="hover:bg-slate-50/80">
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-950">{request.documentType}</p>
                              <p className="text-xs text-slate-500">Request #{request.id}</p>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                                  {residentInitials(request.Resident)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-950">{residentName(request.Resident)}</p>
                                  <p className="text-xs text-slate-500">{request.Resident?.User?.email || 'No email'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-500">{formatDate(request.createdAt)}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => setSelectedRequest(request)}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionHeader
                      eyebrow="Quick Actions"
                      title="Common tasks"
                      description="Jump to the work that needs attention."
                    />
                    <div className="mt-5 grid gap-3">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.title}
                            onClick={action.onClick}
                            className={`flex items-center gap-3 rounded-2xl p-4 text-left transition ${action.className}`}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            <div>
                              <p className="text-sm font-bold">{action.title}</p>
                              <p className="mt-0.5 text-xs text-slate-500">{action.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-5 w-5 text-blue-700" />
                      <div>
                        <h4 className="font-bold text-blue-950">Service note</h4>
                        <p className="mt-1 text-sm leading-6 text-blue-800">
                          Keep urgent resident concerns on hotlines and use this portal for document workflows, verification, and official announcements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">All Document Requests</h3>
                    <p className="mt-1 text-sm text-slate-500">Search, filter, and update resident document requests.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search resident or document..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-72"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(event) => setFilterStatus(event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="all">All Status</option>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px]">
                    <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">Resident</th>
                        <th className="px-5 py-3">Contact</th>
                        <th className="px-5 py-3">Document Type</th>
                        <th className="px-5 py-3">Purpose</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-5 py-16">
                            <EmptyState
                              icon={Filter}
                              title="No requests found"
                              description="Try changing the search or status filter."
                            />
                          </td>
                        </tr>
                      ) : (
                        filteredRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-slate-50/80">
                            <td className="px-5 py-4 text-sm font-bold text-slate-950">#{request.id}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                  {residentInitials(request.Resident)}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-950">{residentName(request.Resident)}</p>
                                  <p className="text-xs text-slate-500">{request.Resident?.User?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-500">{request.Resident?.contactNumber || 'N/A'}</td>
                            <td className="px-5 py-4 text-sm font-medium text-slate-900">{request.documentType}</td>
                            <td className="px-5 py-4 text-sm text-slate-500">{request.purpose || 'N/A'}</td>
                            <td className="px-5 py-4">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-500">{formatDate(request.createdAt)}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => setSelectedRequest(request)}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">All Complaints</h3>
                    <p className="mt-1 text-sm text-slate-500">Review and manage complaints filed by residents.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search complaints..."
                        value={complaintSearch}
                        onChange={(event) => setComplaintSearch(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 sm:w-72"
                      />
                    </div>
                    <select
                      value={complaintFilter}
                      onChange={(event) => setComplaintFilter(event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                    >
                      <option value="all">All Status</option>
                      {COMPLAINT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px]">
                    <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">Resident</th>
                        <th className="px-5 py-3">Subject</th>
                        <th className="px-5 py-3">Description</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Filed Date</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {complaints.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-5 py-16">
                            <EmptyState
                              icon={AlertCircle}
                              title="No complaints found"
                              description="No complaints have been filed yet."
                            />
                          </td>
                        </tr>
                      ) : (
                        complaints
                          .filter((complaint) => {
                            const matchesFilter = complaintFilter === 'all' || complaint.status === complaintFilter;
                            const matchesSearch = 
                              complaint.subject?.toLowerCase().includes(complaintSearch.toLowerCase()) ||
                              complaint.description?.toLowerCase().includes(complaintSearch.toLowerCase()) ||
                              residentName(complaint.Resident)?.toLowerCase().includes(complaintSearch.toLowerCase());
                            return matchesFilter && matchesSearch;
                          })
                          .map((complaint) => (
                            <tr key={complaint.id} className="hover:bg-slate-50/80">
                              <td className="px-5 py-4 text-sm font-bold text-slate-950">#{complaint.id}</td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                                    {residentInitials(complaint.Resident)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-950">{residentName(complaint.Resident)}</p>
                                    <p className="text-xs text-slate-500">{complaint.Resident?.contactNumber || 'N/A'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-sm font-medium text-slate-900">{complaint.subject}</td>
                              <td className="px-5 py-4 text-sm text-slate-500">
                                <div className="max-w-xs truncate">{complaint.description}</div>
                              </td>
                              <td className="px-5 py-4">
                                <ComplaintStatusBadge status={complaint.status} />
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">{formatDate(complaint.createdAt)}</td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => setSelectedComplaint(complaint)}
                                  className="rounded-lg px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'residents' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Resident Directory</h3>
                    <p className="mt-1 text-sm text-slate-500">Find residents by name, email, or contact number.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search residents..."
                        value={residentSearchQuery}
                        onChange={(event) => setResidentSearchQuery(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-80"
                      />
                    </div>
                    <button
                      onClick={fetchData}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Registered Residents</h3>
                    <p className="mt-1 text-sm text-slate-500">{filteredResidents.length} residents found</p>
                  </div>
                  <button
                    onClick={() => setShowCreateResidentModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Resident
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Resident</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Contact</th>
                        <th className="px-5 py-3">Address</th>
                        <th className="px-5 py-3">Gender</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Registered</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredResidents.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-5 py-16">
                            <EmptyState
                              icon={Users}
                              title="No residents found"
                              description="Try adjusting your search criteria."
                            />
                          </td>
                        </tr>
                      ) : (
                        filteredResidents.map((resident) => (
                          <tr key={resident.id} className="hover:bg-slate-50/80">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                                  {residentInitials(resident)}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-950">{residentName(resident)}</p>
                                  <p className="text-xs text-slate-500">@{resident.User?.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-500">{resident.User?.email || 'N/A'}</td>
                            <td className="px-5 py-4 text-sm text-slate-500">{resident.contactNumber || 'N/A'}</td>
                            <td className="px-5 py-4 text-sm text-slate-500">{fullAddress(resident)}</td>
                            <td className="px-5 py-4 text-sm text-slate-500">{resident.gender || 'N/A'}</td>
                            <td className="px-5 py-4">
                              <ResidentStatusBadge isVerified={resident.User?.isVerified} />
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-500">{formatDate(resident.createdAt)}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => setSelectedResident(resident)}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Resident Verifications</h3>
                    <p className="mt-1 text-sm text-slate-500">Review submitted documents and approve registrations.</p>
                  </div>
                  <button
                    onClick={fetchPendingVerifications}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>

              {loadingVerifications ? (
                <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-16">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                </div>
              ) : pendingVerifications.length === 0 ? (
                <EmptyState
                  icon={ShieldCheck}
                  title="No pending verifications"
                  description="All resident registrations have been reviewed."
                  action={
                    <button
                      onClick={fetchPendingVerifications}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Check Again
                    </button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.map((resident) => (
                    <div key={resident.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-700">
                              {residentInitials(resident)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="truncate text-lg font-bold text-slate-950">{residentName(resident)}</h4>
                              <p className="text-sm text-slate-500">@{resident.User?.username} • {resident.User?.email}</p>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              { label: 'Birth Date', value: formatDate(resident.birthDate) },
                              { label: 'Contact', value: resident.contactNumber || 'N/A' },
                              { label: 'Purok', value: resident.purok || 'N/A' },
                              { label: 'Registered', value: formatDate(resident.createdAt) },
                            ].map((item) => (
                              <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                                <p className="mt-1 text-sm font-bold text-slate-950">{item.value}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">{fullAddress(resident)}</p>
                          </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:w-64">
                          <button
                            onClick={() => setSelectedVerification(resident)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4" />
                            View Documents
                          </button>
                          <button
                            onClick={() => handleApproveResident(resident.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectResident(resident.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 sm:col-span-2"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Barangay Announcements</h3>
                    <p className="mt-1 text-sm text-slate-500">Publish updates residents can see on their dashboard.</p>
                  </div>
                  <button
                    onClick={openCreateAnnouncementModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    New Announcement
                  </button>
                </div>
              </div>

              {announcements.length === 0 ? (
                <EmptyState
                  icon={Megaphone}
                  title="No announcements yet"
                  description="Create an announcement to notify residents about barangay updates."
                  action={
                    <button
                      onClick={openCreateAnnouncementModal}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Create Announcement
                    </button>
                  }
                />
              ) : (
                <div className="grid gap-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                      {announcement.imagePath && (
                        <img 
                          src={`http://localhost:5000/${announcement.imagePath}`} 
                          alt={announcement.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', announcement.imagePath);
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-lg font-bold text-slate-950">{announcement.title}</h4>
                              <Badge className={getAnnouncementStatusBadgeClass(announcement.status)}>
                                {announcement.status}
                              </Badge>
                              <Badge className={getPriorityBadgeClass(announcement.priority)}>{announcement.priority}</Badge>
                            </div>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{announcement.description}</p>
                            {announcement.imagePath && (
                              <p className="mt-2 text-xs text-slate-400">📷 Image: {announcement.imagePath}</p>
                            )}
                            <p className="mt-3 text-xs font-medium text-slate-400">Posted: {formatDateTime(announcement.createdAt)}</p>
                          </div>
                          <div className="flex gap-2 sm:flex-none">
                            <button
                              onClick={() => openEditAnnouncementModal(announcement)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              {logStats && (
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      label: 'Total Errors',
                      value: logStats.totalErrors || 0,
                      icon: AlertCircle,
                      className: 'bg-rose-50 text-rose-700',
                    },
                    {
                      label: 'Security Events',
                      value: logStats.totalWarnings || 0,
                      icon: ShieldCheck,
                      className: 'bg-amber-50 text-amber-700',
                    },
                    {
                      label: 'Info Logs',
                      value: logStats.totalInfo || 0,
                      icon: Activity,
                      className: 'bg-blue-50 text-blue-700',
                    },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p>
                          </div>
                          <IconCircle icon={Icon} className={stat.className} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Log Explorer</h3>
                    <p className="mt-1 text-sm text-slate-500">Filter logs by file, level, and keyword.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => {
                        fetchLogs();
                        fetchLogStats();
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </button>
                    <button
                      onClick={() => setAutoRefreshLogs(!autoRefreshLogs)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        autoRefreshLogs
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Activity className="h-4 w-4" />
                      {autoRefreshLogs ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <select
                    value={selectedLogFile}
                    onChange={(event) => setSelectedLogFile(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="combined.log">Combined Logs</option>
                    <option value="error.log">Errors Only</option>
                    <option value="security.log">Security Events</option>
                  </select>

                  <select
                    value={logFilter}
                    onChange={(event) => setLogFilter(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="all">All Levels</option>
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={logSearch}
                      onChange={(event) => setLogSearch(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Log Entries</h3>
                    <p className="mt-1 text-sm text-slate-500">{logs.length} entries loaded</p>
                  </div>
                  {autoRefreshLogs && (
                    <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/15 border-emerald-200">Live refresh</Badge>
                  )}
                </div>

                {loadingLogs ? (
                  <div className="flex items-center justify-center p-16">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="p-10">
                    <EmptyState
                      icon={Activity}
                      title="No logs found"
                      description="Adjust your filters or choose another log file."
                    />
                  </div>
                ) : (
                  <div className="max-h-[640px] overflow-auto">
                    <table className="w-full min-w-[760px]">
                      <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Time</th>
                          <th className="px-5 py-3">Level</th>
                          <th className="px-5 py-3">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {logs.map((log, index) => (
                          <tr key={`${log.timestamp || 'log'}-${index}`} className="hover:bg-slate-50/80">
                            <td className="px-5 py-3 text-sm text-slate-500">{formatDateTime(log.timestamp)}</td>
                            <td className="px-5 py-3">
                              <Badge className={getLogBadgeClass(log.level)}>{log.level?.toUpperCase() || 'UNKNOWN'}</Badge>
                            </td>
                            <td className="px-5 py-3 text-sm font-mono text-slate-700">{log.message || log.raw}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-600/10">
                      <BarChart3 className="h-4 w-4" />
                      Reports & Analytics
                    </div>
                    <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Administrative reporting workspace</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                      This module is prepared for future analytics such as monthly document volume, resident verification turnaround, announcement reach, and system activity summaries.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Requests', value: stats.total, icon: FileText },
                      { label: 'Residents', value: residents.length, icon: Users },
                      { label: 'Verifications', value: pendingVerifications.length, icon: ShieldCheck },
                      { label: 'Announcements', value: announcements.length, icon: Megaphone },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <Icon className="h-5 w-5 text-indigo-700" />
                          <p className="mt-3 text-2xl font-bold text-slate-950">{item.value}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
                <h4 className="mt-4 text-lg font-bold text-slate-950">Reports module coming soon</h4>
                <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                  Use the overview, requests, residents, verifications, announcements, and logs pages for day-to-day barangay administration.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
        subtitle={editingAnnouncement ? 'Update announcement details for residents.' : 'Publish a new announcement to the resident dashboard.'}
        icon={Megaphone}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveAnnouncement} className="space-y-5">
          <div>
            <FieldLabel>Title</FieldLabel>
            <FieldInput
              type="text"
              name="title"
              value={announcementForm.title}
              onChange={handleAnnouncementFormChange}
              required
              placeholder="Community meeting this Saturday"
            />
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <FieldTextarea
              name="description"
              value={announcementForm.description}
              onChange={handleAnnouncementFormChange}
              required
              rows={5}
              placeholder="Write the full announcement details for residents..."
            />
          </div>

          <div>
            <FieldLabel>Image (Optional)</FieldLabel>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleAnnouncementFormChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            {editingAnnouncement?.imagePath && !announcementForm.image && (
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-2">Current image:</p>
                <img 
                  src={`http://localhost:5000/${editingAnnouncement.imagePath}`} 
                  alt="Current announcement" 
                  className="h-32 w-full rounded-lg object-cover"
                />
              </div>
            )}
            {announcementForm.image && (
              <p className="mt-2 text-xs text-emerald-600">New image selected: {announcementForm.image.name}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Status</FieldLabel>
              <FieldSelect
                name="status"
                value={announcementForm.status}
                onChange={handleAnnouncementFormChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </FieldSelect>
            </div>
            <div>
              <FieldLabel>Priority</FieldLabel>
              <FieldSelect
                name="priority"
                value={announcementForm.priority}
                onChange={handleAnnouncementFormChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </FieldSelect>
            </div>
          </div>

          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowAnnouncementModal(false)}
              disabled={savingAnnouncement}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingAnnouncement}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingAnnouncement && <Loader2 className="h-4 w-4 animate-spin" />}
              {savingAnnouncement ? 'Saving...' : editingAnnouncement ? 'Update Announcement' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showCreateResidentModal}
        onClose={() => setShowCreateResidentModal(false)}
        title="Create New Resident"
        subtitle="Add a resident profile with account credentials."
        icon={UserPlus}
        maxWidth="max-w-5xl"
      >
        <form onSubmit={handleCreateResident} className="space-y-8">
          <section>
            <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
              <Mail className="h-4 w-4 text-blue-700" />
              Account Credentials
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <FieldLabel>Username</FieldLabel>
                <FieldInput
                  type="text"
                  name="username"
                  value={newResidentData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="johndoe"
                />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <FieldInput
                  type="email"
                  name="email"
                  value={newResidentData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <FieldLabel>Password</FieldLabel>
                <FieldInput
                  type="password"
                  name="password"
                  value={newResidentData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
              <Users className="h-4 w-4 text-blue-700" />
              Personal Information
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <FieldLabel>First Name</FieldLabel>
                <FieldInput
                  type="text"
                  name="firstName"
                  value={newResidentData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="John"
                />
              </div>
              <div>
                <FieldLabel>Middle Name</FieldLabel>
                <FieldInput
                  type="text"
                  name="middleName"
                  value={newResidentData.middleName}
                  onChange={handleInputChange}
                  placeholder="Smith"
                />
              </div>
              <div>
                <FieldLabel>Last Name</FieldLabel>
                <FieldInput
                  type="text"
                  name="lastName"
                  value={newResidentData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Doe"
                />
              </div>
              <div>
                <FieldLabel>Gender</FieldLabel>
                <FieldSelect
                  name="gender"
                  value={newResidentData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FieldSelect>
              </div>
              <div>
                <FieldLabel>Birth Date</FieldLabel>
                <FieldInput
                  type="date"
                  name="birthDate"
                  value={newResidentData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <FieldLabel>Citizenship</FieldLabel>
                <FieldInput
                  type="text"
                  name="citizenship"
                  value={newResidentData.citizenship}
                  onChange={handleInputChange}
                  placeholder="Filipino"
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
              <MapPin className="h-4 w-4 text-blue-700" />
              Contact & Address
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Contact Number</FieldLabel>
                <FieldInput
                  type="tel"
                  name="contactNumber"
                  value={newResidentData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="09123456789"
                />
              </div>
              <div>
                <FieldLabel>Purok</FieldLabel>
                <FieldInput
                  type="text"
                  name="purok"
                  value={newResidentData.purok}
                  onChange={handleInputChange}
                  placeholder="Purok 1"
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Full Address</FieldLabel>
                <FieldTextarea
                  name="address"
                  value={newResidentData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Complete address in Barangay Bakilid"
                />
              </div>
            </div>
          </section>

          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateResidentModal(false)}
              disabled={creatingResident}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingResident}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creatingResident && <Loader2 className="h-4 w-4 animate-spin" />}
              {creatingResident ? 'Creating...' : 'Create Resident'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!selectedResident}
        onClose={() => setSelectedResident(null)}
        title="Resident Details"
        subtitle={selectedResident ? `Resident ID: #${selectedResident.id}` : ''}
        icon={Users}
        maxWidth="max-w-3xl"
      >
        {selectedResident && (
          <div className="space-y-6">
            <section>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                <Users className="h-4 w-4 text-blue-700" />
                Personal Information
              </h4>
              <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-2">
                {[
                  ['First Name', selectedResident.firstName],
                  ['Middle Name', selectedResident.middleName || 'N/A'],
                  ['Last Name', selectedResident.lastName],
                  ['Gender', selectedResident.gender || 'N/A'],
                  ['Birth Date', formatDate(selectedResident.birthDate)],
                  ['Citizenship', selectedResident.citizenship || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                <Mail className="h-4 w-4 text-blue-700" />
                Contact Information
              </h4>
              <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
                  <p className="mt-1 font-semibold text-slate-950">{selectedResident.User?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact Number</p>
                  <p className="mt-1 font-semibold text-slate-950">{selectedResident.contactNumber || 'N/A'}</p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                <MapPin className="h-4 w-4 text-blue-700" />
                Address Information
              </h4>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full Address</p>
                <p className="mt-1 font-semibold text-slate-950">{fullAddress(selectedResident)}</p>
              </div>
            </section>

            <section>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Account Information
              </h4>
              <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Username</p>
                  <p className="mt-1 font-semibold text-slate-950">{selectedResident.User?.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</p>
                  <p className="mt-1 font-semibold capitalize text-slate-950">{selectedResident.User?.role || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account Status</p>
                  <div className="mt-1">
                    <ResidentStatusBadge isVerified={selectedResident.User?.isVerified} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Registered Date</p>
                  <p className="mt-1 font-semibold text-slate-950">{formatDateTime(selectedResident.createdAt)}</p>
                </div>
              </div>
            </section>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedResident(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                disabled
                className="flex-1 rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500"
                title="Edit resident functionality coming soon"
              >
                Edit Resident
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Request Details"
        subtitle={selectedRequest ? `Request ID: #${selectedRequest.id}` : ''}
        icon={FileText}
        maxWidth="max-w-2xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <section>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Resident Information</h4>
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                {[
                  ['Name', residentName(selectedRequest.Resident)],
                  ['Email', selectedRequest.Resident?.User?.email || 'N/A'],
                  ['Contact', selectedRequest.Resident?.contactNumber || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Request Information</h4>
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                {[
                  ['Document Type', selectedRequest.documentType],
                  ['Purpose', selectedRequest.purpose],
                  ['Request Date', formatDateTime(selectedRequest.createdAt)],
                  ['Current Status', <StatusBadge status={selectedRequest.status} />],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
                {selectedRequest.remarks && (
                  <div>
                    <span className="text-sm text-slate-500">Remarks</span>
                    <p className="mt-1 rounded-xl border border-slate-100 bg-white p-3 text-sm font-medium text-slate-700">
                      {selectedRequest.remarks}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Update Status</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedRequest.id, status)}
                    disabled={selectedRequest.status === status}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      selectedRequest.status === status
                        ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                        : 'bg-blue-600 text-white shadow-sm shadow-blue-900/10 hover:bg-blue-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">
                Click a status to update. Residents will see the change immediately.
              </p>
            </section>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedVerification}
        onClose={() => setSelectedVerification(null)}
        title="Verification Details"
        subtitle="Review uploaded documents and approve registration."
        icon={ShieldCheck}
        maxWidth="max-w-4xl"
      >
        {selectedVerification && (
          <div className="space-y-6">
            <section>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                <Users className="h-4 w-4 text-blue-700" />
                Personal Information
              </h4>
              <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-3">
                {[
                  ['Full Name', residentName(selectedVerification)],
                  ['Birth Date', formatDate(selectedVerification.birthDate)],
                  ['Gender', selectedVerification.gender || 'N/A'],
                  ['Contact Number', selectedVerification.contactNumber || 'N/A'],
                  ['Email', selectedVerification.User?.email || 'N/A'],
                  ['Username', selectedVerification.User?.username || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
                <div className="md:col-span-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</p>
                  <p className="mt-1 font-semibold text-slate-950">{fullAddress(selectedVerification)}</p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                <FileText className="h-4 w-4 text-blue-700" />
                Verification Documents
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-950">Valid ID</span>
                    <Badge className="bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200">Required</Badge>
                  </div>
                  {selectedVerification.validIdPath ? (
                    <>
                      <img
                        src={`http://localhost:5000/${selectedVerification.validIdPath}`}
                        alt="Valid ID"
                        className="mb-3 h-48 w-full rounded-xl object-cover"
                      />
                      <button
                        onClick={() => handleViewDocument(selectedVerification, 'validId')}
                        className="w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        View Full Size
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">No document uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-950">Proof of Residency</span>
                    <Badge className="bg-blue-50 text-blue-700 ring-blue-600/15 border-blue-200">Required</Badge>
                  </div>
                  {selectedVerification.proofOfResidencyPath ? (
                    <>
                      <img
                        src={`http://localhost:5000/${selectedVerification.proofOfResidencyPath}`}
                        alt="Proof of Residency"
                        className="mb-3 h-48 w-full rounded-xl object-cover"
                      />
                      <button
                        onClick={() => handleViewDocument(selectedVerification, 'proofOfResidency')}
                        className="w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        View Full Size
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">No document uploaded</p>
                  )}
                </div>
              </div>
            </section>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedVerification(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRejectResident(selectedVerification.id);
                  setSelectedVerification(null);
                }}
                className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Reject Registration
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApproveResident(selectedVerification.id);
                  setSelectedVerification(null);
                }}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Approve Registration
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Complaint Details"
        subtitle={selectedComplaint ? `Complaint ID: #${selectedComplaint.id}` : ''}
        icon={AlertCircle}
        maxWidth="max-w-2xl"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <section>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Resident Information</h4>
              <div className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                {[
                  ['Name', residentName(selectedComplaint.Resident)],
                  ['Contact', selectedComplaint.Resident?.contactNumber || 'N/A'],
                  ['Address', selectedComplaint.Resident?.address || 'N/A'],
                  ['Purok', selectedComplaint.Resident?.purok || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Complaint Information</h4>
              <div className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <div>
                  <span className="text-sm text-slate-500">Subject</span>
                  <p className="mt-1 text-base font-bold text-slate-950">{selectedComplaint.subject}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Description</span>
                  <p className="mt-1 rounded-xl border border-amber-100 bg-white p-3 text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedComplaint.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Filed Date</span>
                  <span className="text-sm font-semibold text-slate-950">{formatDateTime(selectedComplaint.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Current Status</span>
                  <ComplaintStatusBadge status={selectedComplaint.status} />
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Update Status</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                {COMPLAINT_STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, status)}
                    disabled={selectedComplaint.status === status || updatingComplaint}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      selectedComplaint.status === status
                        ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                        : 'bg-amber-600 text-white shadow-sm shadow-amber-900/10 hover:bg-amber-700 disabled:opacity-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">
                Click a status to update. Resident will be notified immediately.
              </p>
            </section>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDeleteComplaint(selectedComplaint.id)}
                className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Delete Complaint
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showDocumentModal && !!documentToView}
        onClose={() => {
          setShowDocumentModal(false);
          setDocumentToView(null);
        }}
        title={documentToView?.type === 'validId' ? 'Valid ID' : 'Proof of Residency'}
        subtitle={documentToView?.resident || 'Resident document'}
        icon={Eye}
        maxWidth="max-w-5xl"
      >
        {documentToView && (
          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <img src={documentToView.path} alt={documentToView.type} className="mx-auto h-auto w-full rounded-xl" />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Review the document before approving or rejecting the registration.</p>
              <a
                href={documentToView.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
