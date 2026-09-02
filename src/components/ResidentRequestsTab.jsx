import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  FileCheck2, 
  FileSpreadsheet, 
  ShieldCheck, 
  Briefcase,
  XCircle,
  ClipboardList,
  Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const REQUEST_TABS = [
  { id: 'all', label: 'All Requests' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Processing', label: 'Processing' },
  { id: 'Ready for Release', label: 'Ready for Release' },
  { id: 'Claimed', label: 'Claimed' },
  { id: 'Rejected', label: 'Rejected' },
];

function getDocIcon(docType) {
  switch (docType) {
    case 'Barangay Clearance': return FileCheck2;
    case 'Certificate of Residency': return FileSpreadsheet;
    case 'Indigency Certificate': return ShieldCheck;
    case 'Business Permit': return Briefcase;
    default: return FileText;
  }
}

function getBadgeVariant(status) {
  switch (status) {
    case 'Pending': return 'warning';
    case 'Processing': return 'info';
    case 'Ready for Release': return 'success';
    case 'Claimed': return 'secondary';
    case 'Rejected': return 'destructive';
    default: return 'outline';
  }
}

export default function ResidentRequestsTab({ requests = [], onRequestClick, onNewRequest, onDeleteRequest }) {
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = activeStatus === 'all' || req.status === activeStatus;
    const matchesSearch = 
      req.documentType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.remarks && req.remarks.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Control Panel Card: Search, Action & Filters */}
      <Card className="overflow-hidden border-slate-200/80 bg-white shadow-sm">
        {/* Top gradient accent line */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Top Control Bar: Search Input & Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search requests by type, purpose, or remarks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* New Request Action Button */}
            <Button
              onClick={onNewRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 shadow-sm transition-all hover:shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </Button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-2 border-t border-slate-100">
            {REQUEST_TABS.map((tab) => {
              const count = tab.id === 'all' 
                ? requests.length 
                : requests.filter(r => r.status === tab.id).length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatus(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200",
                    activeStatus === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  )}
                >
                  <span>{tab.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.2 text-[10px] rounded-full font-bold",
                    activeStatus === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grid of Request Cards */}
      {filteredRequests.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200/80 bg-white">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {searchQuery || activeStatus !== 'all' ? 'No matching requests' : 'No document requests yet'}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              {searchQuery || activeStatus !== 'all'
                ? 'Try adjusting your search query or filter criteria.'
                : 'Need a Barangay Clearance, Certificate of Residency, or Indigency? Create your first request now.'}
            </p>
            {onNewRequest && !searchQuery && activeStatus === 'all' && (
              <Button
                onClick={onNewRequest}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 py-2.5 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Request
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredRequests.map((request) => {
            const DocIcon = getDocIcon(request.documentType);
            const badgeVariant = getBadgeVariant(request.status);

            return (
              <Card
                key={request.id}
                className="group hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  onClick={() => onRequestClick?.(request)}
                  className="cursor-pointer flex-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                          <DocIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-colors truncate">
                            {request.documentType}
                          </CardTitle>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ID: #{request.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={badgeVariant} className="font-bold capitalize text-[10px] sm:text-xs">
                          {request.status}
                        </Badge>
                        
                        {/* Delete Button (always visible for Pending requests) */}
                        {request.status === 'Pending' && onDeleteRequest && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              if (window.confirm(`Are you sure you want to delete this request for "${request.documentType}"?\n\nThis action cannot be undone.`)) {
                                onDeleteRequest(request.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 active:bg-red-200 transition-all touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Delete request"
                            aria-label="Delete request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-sm">
                    {/* Purpose */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Purpose
                      </span>
                      <p className="text-slate-800 font-medium line-clamp-2">
                        {request.purpose}
                      </p>
                    </div>

                    {/* Remarks */}
                    {request.remarks && (
                      <div className="text-xs text-slate-500 bg-amber-50/50 border border-amber-100 rounded-lg p-2.5">
                        <span className="font-semibold text-amber-900">Remarks:</span> {request.remarks}
                      </div>
                    )}

                    {/* Pending Status Notice - Mobile Friendly */}
                    {request.status === 'Pending' && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>You can delete this request anytime before it's processed</span>
                      </div>
                    )}

                    {/* Footer metadata */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>

                      <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
