import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  ChevronRight,
  Check,
  Clock,
  AlertCircle,
  BadgeDollarSign,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { residentsAPI, requestAPI } from '../../services/api';

interface RequestDocumentFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DocumentService {
  id: number;
  name: string;
  description: string;
  category: string;
  processingFee: number;
  isFree: boolean;
  processingDays: number;
}

type FlowStep = 'select' | 'details' | 'review' | 'submitting';

export const RequestDocumentFlow: React.FC<RequestDocumentFlowProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('select');
  const [selectedService, setSelectedService] = useState<DocumentService | null>(null);
  const [services, setServices] = useState<DocumentService[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      // Reset state when opening
      setCurrentStep('select');
      setSelectedService(null);
      setPurpose('');
      setRemarks('');
      setError(null);
    }
  }, [isOpen]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await residentsAPI.getActiveDocumentServices();
      setServices(response.data.data?.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to load document services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: DocumentService) => {
    setSelectedService(service);
    setCurrentStep('details');
  };

  const handleSubmitRequest = async () => {
    if (!selectedService || !purpose.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      const response = await requestAPI.createRequest({
        documentServiceId: selectedService.id,
        purpose: purpose.trim(),
        remarks: remarks.trim() || undefined,
      });

      // Check if response indicates success
      if (response?.data?.success === true || response?.status === 201) {
        // Success - refresh data and close modal
        onSuccess();
        onClose();
        // Show success message after modal closes
        setTimeout(() => {
          alert('Document request submitted successfully!');
        }, 200);
      } else {
        // Unexpected response format
        setError(response?.data?.message || 'Request submitted but received unexpected response');
        setSubmitting(false);
      }
    } catch (error: any) {
      console.error('Error submitting request:', error);
      setSubmitting(false);
      
      // Extract error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit request. Please try again.';
      setError(errorMessage);
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('select');
    } else if (currentStep === 'review') {
      setCurrentStep('details');
    }
  };

  const handleContinue = () => {
    if (!purpose.trim()) {
      alert('Please enter the purpose of your request');
      return;
    }
    setCurrentStep('review');
  };

  if (!isOpen) return null;

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, DocumentService[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            {currentStep !== 'select' && !submitting && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                {currentStep === 'select' && 'Select Document'}
                {currentStep === 'details' && 'Request Details'}
                {currentStep === 'review' && 'Review Request'}
                {currentStep === 'submitting' && 'Submitting...'}
              </h2>
              <p className="text-xs text-slate-500">
                {currentStep === 'select' && 'Choose the document you need'}
                {currentStep === 'details' && 'Provide purpose and additional information'}
                {currentStep === 'review' && 'Confirm your request before submitting'}
                {currentStep === 'submitting' && 'Please wait...'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex border-b border-slate-200/80 bg-slate-50/50 px-6 py-3">
          {(['select', 'details', 'review'] as FlowStep[]).map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition ${
                    currentStep === step
                      ? 'bg-blue-600 text-white'
                      : index < (['select', 'details', 'review'] as FlowStep[]).indexOf(currentStep)
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {index < (['select', 'details', 'review'] as FlowStep[]).indexOf(currentStep) ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    currentStep === step ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {step === 'select' && 'Select'}
                  {step === 'details' && 'Details'}
                  {step === 'review' && 'Review'}
                </span>
              </div>
              {index < 2 && (
                <ChevronRight className="h-4 w-4 text-slate-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Step 1: Select Document */}
          {currentStep === 'select' && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                  <p className="text-sm text-slate-600">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-700">No services available</p>
                </div>
              ) : (
                Object.entries(groupedServices).map(([category, categoryServices]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">{category}</h3>
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                      {categoryServices.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleSelectService(service)}
                          className="group relative rounded-xl border-2 border-slate-200 p-4 text-left transition-all hover:border-blue-200 hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 mb-1 truncate">
                                {service.name}
                              </h4>
                              <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                                {service.description || `Request for ${service.name}`}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{service.processingDays} days</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BadgeDollarSign className="h-3.5 w-3.5" />
                                  <span>
                                    {service.isFree ? 'Free' : `₱${service.processingFee}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Step 2: Request Details */}
          {currentStep === 'details' && selectedService && (
            <div className="space-y-6">
              {/* Selected Document Card */}
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {selectedService.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {selectedService.description || `Request for ${selectedService.name}`}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{selectedService.processingDays} business days</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <BadgeDollarSign className="h-4 w-4 text-blue-600" />
                        <span>
                          {selectedService.isFree
                            ? 'Free'
                            : `₱${selectedService.processingFee}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purpose Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., For employment, For school requirements, For business permit, etc."
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition resize-none"
                  rows={3}
                  required
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Clearly state why you need this document
                </p>
              </div>

              {/* Remarks Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Additional Remarks <span className="text-slate-400">(Optional)</span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any additional information or special instructions..."
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition resize-none"
                  rows={2}
                />
              </div>

              {/* Info Alert */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                  <div className="flex-1 text-sm text-amber-900">
                    <p className="font-semibold mb-1">Important Reminders</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>Ensure all information provided is accurate</li>
                      <li>Have valid ID and proof of residency ready</li>
                      <li>Processing will begin once your request is approved</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && selectedService && (
            <div className="space-y-6">
              <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900">Request Summary</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Document
                    </label>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {selectedService.name}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {selectedService.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Processing Time
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {selectedService.processingDays} business days
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Fee
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {selectedService.isFree
                          ? 'Free'
                          : `₱${selectedService.processingFee}`}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Purpose
                    </label>
                    <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                      {purpose}
                    </p>
                  </div>

                  {remarks && (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Remarks
                      </label>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
                        {remarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                  <div className="flex-1 text-sm text-blue-900">
                    <p className="font-semibold mb-1">Review Before Submitting</p>
                    <p className="text-xs">
                      Please double-check all information. Once submitted, you cannot edit your request.
                      You'll receive notifications about your request status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200/80 bg-slate-50/50 px-6 py-4 shrink-0">
          {/* Error Message Display */}
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-800 flex-1">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:text-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>
            {currentStep === 'details' && (
              <button
                type="button"
                onClick={handleContinue}
                disabled={!purpose.trim()}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue to Review</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            {currentStep === 'review' && (
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
