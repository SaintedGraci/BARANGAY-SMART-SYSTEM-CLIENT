import { useState } from 'react';
import { 
  AlertCircle, 
  Plus, 
  Search, 
  Clock, 
  ChevronRight, 
  MessageSquareWarning,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const COMPLAINT_TABS = [
  { id: 'all', label: 'All Complaints' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Investigating', label: 'Investigating' },
  { id: 'Resolved', label: 'Resolved' },
];

function getBadgeVariant(status) {
  switch (status) {
    case 'Pending': return 'warning';
    case 'Investigating': return 'info';
    case 'Resolved': return 'success';
    default: return 'outline';
  }
}

export default function ResidentComplaintsTab({ complaints = [], onComplaintClick, onNewComplaint }) {
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints
  const filteredComplaints = complaints.filter((comp) => {
    const matchesStatus = activeStatus === 'all' || comp.status === activeStatus;
    const matchesSearch = 
      comp.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Control Panel Card: Search, Action & Filters */}
      <Card className="overflow-hidden border-slate-200/80 bg-white shadow-sm">
        {/* Top gradient accent line */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
        
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Top Control Bar: Search Input & Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search complaints by subject or description…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* File Complaint Action Button */}
            <Button
              onClick={onNewComplaint}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-4 py-2.5 shadow-sm transition-all hover:shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>File Complaint</span>
            </Button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-2 border-t border-slate-100">
            {COMPLAINT_TABS.map((tab) => {
              const count = tab.id === 'all' 
                ? complaints.length 
                : complaints.filter(c => c.status === tab.id).length;
              
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

      {/* Grid of Complaint Cards */}
      {filteredComplaints.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200/80 bg-white">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {searchQuery || activeStatus !== 'all' ? 'No matching complaints' : 'No complaints filed yet'}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              {searchQuery || activeStatus !== 'all'
                ? 'Try adjusting your search query or filter criteria.'
                : 'Have a community concern or issue to report? File a complaint with the barangay.'}
            </p>
            {onNewComplaint && !searchQuery && activeStatus === 'all' && (
              <Button
                onClick={onNewComplaint}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-5 py-2.5 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                File First Complaint
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredComplaints.map((complaint) => {
            const badgeVariant = getBadgeVariant(complaint.status);

            return (
              <Card
                key={complaint.id}
                onClick={() => onComplaintClick?.(complaint)}
                className="group cursor-pointer hover:border-amber-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg group-hover:text-amber-700 transition-colors line-clamp-1">
                          {complaint.subject}
                        </CardTitle>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Complaint ID: #{complaint.id}
                        </p>
                      </div>
                    </div>

                    <Badge variant={badgeVariant} className="shrink-0 font-bold capitalize">
                      {complaint.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-sm">
                  {/* Description Box */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                    <p className="text-slate-700 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Filed: {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>

                    <span className="text-amber-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
