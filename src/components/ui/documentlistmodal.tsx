import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Home,
  BadgeDollarSign,
  Building2,
  Award,
  ScrollText,
  Clock,
  Check,
  ArrowRight,
  Info,
  ClipboardList,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { residentsAPI } from '../../services/api';

interface DocumentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (documentType: string) => void;
}

interface Document {
  id: string | number;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  requirements: string[];
  processingTime: string;
  category?: string;
  processingFee?: number;
  isFree?: boolean;
}

export const DocumentListModal: React.FC<DocumentListModalProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  // Map icon names to actual icon components
  const iconMap: Record<string, LucideIcon> = {
    Award,
    Home,
    BadgeDollarSign,
    Building2,
    ScrollText,
    FileText,
  };

  // Map category to color gradients
  const colorMap: Record<string, string> = {
    Certificates: 'from-blue-500 to-cyan-500',
    ID: 'from-indigo-500 to-purple-500',
    Permits: 'from-green-500 to-emerald-500',
    Business: 'from-amber-500 to-orange-500',
    General: 'from-violet-500 to-purple-500',
  };

  // Fetch document services from API
  useEffect(() => {
    if (isOpen) {
      fetchDocumentServices();
    }
  }, [isOpen]);

  const fetchDocumentServices = async () => {
    setLoading(true);
    try {
      const response = await residentsAPI.getActiveDocumentServices();
      const services = response.data.data?.services || [];
      
      // Transform API data to match Document interface
      const transformedDocs: Document[] = services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description || `Required for ${service.name}`,
        icon: iconMap[service.icon || 'FileText'] || FileText,
        color: colorMap[service.category] || 'from-slate-500 to-slate-600',
        requirements: service.requirements ? service.requirements.split(',').map((r: string) => r.trim()) : ['Valid ID', 'Proof of Residency'],
        processingTime: `${service.processingDays || 3}-${(service.processingDays || 3) + 2} business days`,
        category: service.category,
        processingFee: service.processingFee,
        isFree: service.isFree,
      }));

      setDocuments(transformedDocs);
    } catch (error) {
      console.error('Error fetching document services:', error);
      // Fallback to empty array
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleDocumentClick = (doc: Document) => {
    setSelectedDoc(doc);
  };

  const handleProceed = () => {
    if (selectedDoc) {
      onSelectDocument(selectedDoc.name);
      onClose();
      setSelectedDoc(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedDoc(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-200/80 bg-white shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">Request a Document</h2>
              <p className="text-xs text-slate-500 truncate">Choose the document you need</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Grid: Document Options */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                <p className="text-sm text-slate-600">Loading document services...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-700">No document services available</p>
                <p className="text-xs text-slate-500 mt-1">Please contact the administrator</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                {documents.map((doc) => {
                  const Icon = doc.icon;
                  const isSelected = selectedDoc?.id === doc.id;

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleDocumentClick(doc)}
                      className={`group relative rounded-xl sm:rounded-2xl border-2 p-3.5 sm:p-5 text-left transition-all ${
                        isSelected
                          ? 'scale-[1.01] border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${doc.color} text-white shadow-md transition group-hover:scale-105`}
                        >
                          <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 transition group-hover:text-blue-700 truncate">
                              {doc.name}
                            </h3>
                            {doc.isFree ? (
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                Free
                              </span>
                            ) : doc.processingFee && doc.processingFee > 0 ? (
                              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                ₱{doc.processingFee}
                              </span>
                            ) : null}
                          </div>
                          <p className="line-clamp-2 text-xs sm:text-sm text-slate-500">{doc.description}</p>
                          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{doc.processingTime}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Selected Document Details & Proceed Button */}
          {/* Desktop view (always visible) & Mobile view (visible when document selected) */}
          <div className={`overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/90 p-4 sm:p-6 lg:w-96 shrink-0 transition-all ${
            selectedDoc ? 'block' : 'hidden lg:block'
          }`}>
            {selectedDoc ? (
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-3 lg:block">
                  {(() => {
                    const Icon = selectedDoc.icon;
                    return (
                      <div
                        className={`flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedDoc.color} text-white shadow-lg shrink-0 lg:mb-4`}
                      >
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-slate-900">{selectedDoc.name}</h3>
                    <p className="mt-0.5 sm:mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{selectedDoc.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-blue-600">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">Processing Time</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800">{selectedDoc.processingTime}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 lg:hidden">
                    <div className="mb-1 flex items-center gap-1.5 text-emerald-600">
                      <ClipboardList className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">Requirements ({selectedDoc.requirements.length})</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{selectedDoc.requirements.join(', ')}</p>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="mb-3 flex items-center gap-2 text-slate-900">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold">Requirements</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedDoc.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleProceed}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 touch-manipulation min-h-[48px]"
                >
                  <span>Proceed with Request</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>

                <div className="hidden sm:block rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <div className="text-xs text-blue-900">
                      <p className="font-semibold">Important note</p>
                      <p className="mt-0.5">
                        Please ensure all requirements are ready before submitting your request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Select a Document</h3>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  Choose a document from the list to view requirements and proceed
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
