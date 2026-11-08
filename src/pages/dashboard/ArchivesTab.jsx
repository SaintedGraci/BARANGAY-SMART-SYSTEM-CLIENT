import { useState, useEffect } from 'react';
import {
  Archive,
  Search,
  Filter,
  Calendar,
  RotateCcw,
  FileText,
  User,
  Clock,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle,
  Package,
} from 'lucide-react';
import { requestsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>
      {children}
    </span>
  );
}

function IconCircle({ icon: Icon, className = 'bg-blue-50 text-blue-700' }) {
  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${className}`}>
      <Icon className="h-5 w-5" />
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
            {Icon && <IconCircle icon={Icon} className="bg-slate-600 text-white" />}
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

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="mt-4 text-base font-bold text-slate-900">{title}</h4>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}

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

export default function ArchivesTab() {
  const { user } = useAuth();
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [unarchiving, setUnarchiving] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchArchives();
  }, [currentPage, searchQuery, documentTypeFilter, dateFrom, dateTo]);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (searchQuery) params.search = searchQuery;
      if (documentTypeFilter !== 'all') params.documentType = documentTypeFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response = await requestsAPI.getArchived(params);
      const data = response.data;

      setArchives(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRecords(data.pagination?.total || 0);
      setCurrentPage(data.pagination?.page || 1);
    } catch (error) {
      console.error('Error fetching archives:', error);
      setArchives([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async (archiveId) => {
    if (!confirm('Restore this document from archive? It will appear in active requests again.')) {
      return;
    }

    setUnarchiving(true);
    try {
      await requestsAPI.unarchive(archiveId);
      alert('Document restored successfully!');
      fetchArchives();
      setSelectedArchive(null);
    } catch (error) {
      console.error('Error unarchiving:', error);
      alert(error.response?.data?.message || 'Failed to restore document. Admin permissions required.');
    } finally {
      setUnarchiving(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDocumentTypeFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || documentTypeFilter !== 'all' || dateFrom || dateTo;

  // Check if user can unarchive (admin or captain only)
  const canUnarchive = user?.role === 'admin' || user?.role === 'captain';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">Document Archive</p>
          <h3 className="mt-2 text-lg font-bold text-slate-950">Claimed Documents Archive</h3>
          <p className="mt-1 text-sm text-slate-500">
            Search and view archived documents. {canUnarchive ? 'You can restore documents to active requests.' : 'Contact admin to restore.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Archive className="h-4 w-4" />
          <span className="font-semibold">{totalRecords} archived</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Document Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">All Document Types</option>
              <option value="Barangay Clearance">Barangay Clearance</option>
              <option value="Certificate of Indigency">Certificate of Indigency</option>
              <option value="Certificate of Residency">Certificate of Residency</option>
              <option value="Business Permit">Business Permit</option>
              <option value="Barangay ID">Barangay ID</option>
            </select>
          </div>

          {/* Date From */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Date from"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Date To */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Date to"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-500">Filters active</span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Archives List */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="mt-3 text-sm text-slate-500">Loading archives...</p>
          </div>
        </div>
      ) : archives.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="No archived documents"
          description={hasActiveFilters ? "No documents match your search criteria." : "Claimed documents will appear here once archived."}
        />
      ) : (
        <div className="space-y-3">
          {archives.map((archive) => (
            <button
              key={archive.id}
              onClick={() => setSelectedArchive(archive)}
              className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <IconCircle icon={FileText} className="bg-slate-100 text-slate-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 truncate">{archive.documentType}</h4>
                      <Badge className="bg-slate-100 text-slate-700 ring-slate-600/10 border-slate-200">
                        Archived
                      </Badge>
                    </div>
                    <div className="mt-1.5 space-y-1 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">{residentName(archive.Resident)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-xs">Claimed: {formatDate(archive.claimedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Archive className="h-3.5 w-3.5" />
                          <span className="text-xs">Archived: {formatDate(archive.archivedDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages} ({totalRecords} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Archive Detail Modal */}
      {selectedArchive && (
        <Modal
          isOpen={!!selectedArchive}
          onClose={() => setSelectedArchive(null)}
          title={selectedArchive.documentType}
          subtitle="Archived Document Details"
          icon={Archive}
        >
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-600 text-white">
                  <Archive className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Document Archived</p>
                  <p className="text-xs text-slate-600">This document has been claimed and archived</p>
                </div>
              </div>
            </div>

            {/* Resident Information */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                <User className="h-4 w-4" />
                Resident Information
              </h4>
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Name:</span>
                  <span className="text-sm font-semibold text-slate-900">{residentName(selectedArchive.Resident)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Address:</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedArchive.Resident?.address || 'N/A'}</span>
                </div>
                {selectedArchive.Resident?.purok && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Purok:</span>
                    <span className="text-sm font-semibold text-slate-900">Purok {selectedArchive.Resident.purok}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Document Details */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                <FileText className="h-4 w-4" />
                Document Details
              </h4>
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Document Type:</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedArchive.documentType}</span>
                </div>
                {selectedArchive.purpose && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Purpose:</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedArchive.purpose}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Requested:</span>
                  <span className="text-sm font-semibold text-slate-900">{formatDateTime(selectedArchive.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Archive Timeline */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock className="h-4 w-4" />
                Archive Timeline
              </h4>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Document Claimed</p>
                    <p className="text-xs text-slate-600">{formatDateTime(selectedArchive.claimedDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-white">
                    <Archive className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Document Archived</p>
                    <p className="text-xs text-slate-600">{formatDateTime(selectedArchive.archivedDate)}</p>
                    {selectedArchive.archivedBy && (
                      <p className="text-xs text-slate-500">By: {selectedArchive.archivedBy}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {canUnarchive && (
              <div className="flex gap-3 border-t border-slate-200 pt-6">
                <button
                  onClick={() => handleUnarchive(selectedArchive.id)}
                  disabled={unarchiving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unarchiving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Restoring...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Restore to Active
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedArchive(null)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            )}

            {!canUnarchive && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Admin Permission Required</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Only administrators and barangay captains can restore documents from archive.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
