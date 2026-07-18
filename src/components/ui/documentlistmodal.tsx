import React, { useState } from 'react';
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DocumentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (documentType: string) => void;
}

interface Document {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  requirements: string[];
  processingTime: string;
}

export const DocumentListModal: React.FC<DocumentListModalProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const documents: Document[] = [
    {
      id: 'barangay-clearance',
      name: 'Barangay Clearance',
      description: 'Required for employment, business permits, and other legal purposes',
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
      requirements: ['Valid ID', 'Proof of Residency', 'Cedula (Community Tax Certificate)'],
      processingTime: '3-5 business days',
    },
    {
      id: 'certificate-of-residency',
      name: 'Certificate of Residency',
      description: 'Proof of residence for various transactions and applications',
      icon: Home,
      color: 'from-indigo-500 to-purple-500',
      requirements: ['Valid ID', 'Proof of Address', 'Recent Utility Bill'],
      processingTime: '2-3 business days',
    },
    {
      id: 'indigency-certificate',
      name: 'Indigency Certificate',
      description: 'For financial assistance and medical purposes',
      icon: BadgeDollarSign,
      color: 'from-pink-500 to-rose-500',
      requirements: ['Valid ID', 'Proof of Income', 'Medical Certificate (if applicable)'],
      processingTime: '3-5 business days',
    },
    {
      id: 'business-permit',
      name: 'Business Permit',
      description: 'Required to operate a business within the barangay',
      icon: Building2,
      color: 'from-green-500 to-emerald-500',
      requirements: ['Business Registration', 'Valid ID', 'Barangay Clearance', 'Location Map'],
      processingTime: '5-7 business days',
    },
    {
      id: 'good-moral',
      name: 'Certificate of Good Moral',
      description: 'Character reference for employment or school requirements',
      icon: ScrollText,
      color: 'from-amber-500 to-orange-500',
      requirements: ['Valid ID', 'Barangay Clearance', 'Police Clearance (optional)'],
      processingTime: '3-5 business days',
    },
    {
      id: 'cedula',
      name: 'Community Tax Certificate (Cedula)',
      description: 'Annual tax certificate for residents',
      icon: FileText,
      color: 'from-violet-500 to-purple-500',
      requirements: ['Valid ID', 'Proof of Income', 'Previous Cedula (if renewal)'],
      processingTime: '1-2 business days',
    },
  ];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200/80 bg-slate-50/90 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Request a Document</h2>
              <p className="mt-0.5 text-sm text-slate-500">Choose the document you need</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-88px)] flex-col lg:flex-row">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {documents.map((doc) => {
                const Icon = doc.icon;
                const isSelected = selectedDoc?.id === doc.id;

                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleDocumentClick(doc)}
                    className={`group relative rounded-2xl border-2 p-5 text-left transition-all ${
                      isSelected
                        ? 'scale-[1.01] border-blue-500 bg-blue-50/70 shadow-md'
                        : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${doc.color} text-white shadow-md transition group-hover:scale-105`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-lg font-bold text-slate-900 transition group-hover:text-blue-700">
                          {doc.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-slate-500">{doc.description}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span>{doc.processingTime}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-y-auto border-t border-slate-200 bg-slate-50/80 p-6 lg:w-96 lg:border-l lg:border-t-0">
            {selectedDoc ? (
              <div className="space-y-5">
                <div>
                  {(() => {
                    const Icon = selectedDoc.icon;
                    return (
                      <div
                        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedDoc.color} text-white shadow-lg`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                    );
                  })()}
                  <h3 className="text-2xl font-bold text-slate-900">{selectedDoc.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{selectedDoc.description}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-semibold">Processing Time</span>
                  </div>
                  <p className="font-medium text-slate-800">{selectedDoc.processingTime}</p>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-slate-900">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold">Requirements</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedDoc.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleProceed}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  Proceed with Request
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>

                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold">Important note</p>
                      <p className="mt-1">
                        Please ensure all requirements are ready before submitting your request to avoid delays.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                  <FileText className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Select a Document</h3>
                <p className="mt-2 max-w-xs text-sm text-slate-500">
                  Choose a document from the list to view details and requirements
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
