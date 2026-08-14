import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import OptimizedImage from './ui/OptimizedImage';

const PRIORITIES = [
  { value: 'Low', label: 'General' },
  { value: 'Medium', label: 'Advisory' },
  { value: 'High', label: 'Important' },
  { value: 'Urgent', label: 'Emergency' },
];

const STATUSES = [
  { value: 'Active', label: 'Publish Now' },
  { value: 'Inactive', label: 'Save as Draft' },
];

export default function AnnouncementModal({ isOpen, onClose, onSave, announcement, saving }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Active',
    image: null,
  });
  
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const isEditing = !!announcement;

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        description: announcement.description || '',
        priority: announcement.priority || 'Medium',
        status: announcement.status || 'Active',
        image: null,
      });
      setPreview(announcement.imagePath || null);
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Active',
        image: null,
      });
      setPreview(null);
    }
    setErrors({});
  }, [announcement, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const validTypes = [...validImageTypes, ...validVideoTypes];

    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        image: 'Please upload a valid image (JPG, PNG, GIF, WebP) or video (MP4, WebM, OGG)' 
      }));
      return;
    }

    // Validate file size (20MB max)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        image: 'File size must be less than 20MB' 
      }));
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    setErrors(prev => ({ ...prev, image: null }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeMedia = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Content is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('title', formData.title.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('priority', formData.priority);
    submitData.append('status', formData.status);
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    onSave(submitData);
  };

  const isVideo = (src) => {
    if (!src) return false;
    return src.startsWith('data:video/') || /\.(mp4|webm|ogg)$/i.test(src);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Edit Announcement' : 'Create Announcement'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={saving}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Announcement Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Barangay Clean-Up Drive This Saturday"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.title 
                  ? 'border-rose-300 focus:ring-rose-500' 
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
              disabled={saving}
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={saving}
              >
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={saving}
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your announcement message here..."
              rows={6}
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.description 
                  ? 'border-rose-300 focus:ring-rose-500' 
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
              disabled={saving}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Media (Optional)
            </label>
            
            {preview ? (
              <div className="relative">
                {isVideo(preview) ? (
                  <video 
                    src={preview} 
                    controls 
                    className="w-full rounded-xl max-h-80"
                  />
                ) : (
                  <OptimizedImage
                    src={preview}
                    alt="Preview"
                    width="600"
                    height="400"
                    className="w-full rounded-xl max-h-80 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-lg"
                  disabled={saving}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
                  <Upload className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Upload Image or Video
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Drag and drop or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                  disabled={saving}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose File
                </label>
                <p className="text-xs text-slate-400 mt-3">
                  JPG, PNG, GIF, WebP, MP4, WebM (Max 20MB)
                </p>
              </div>
            )}
            
            {errors.image && (
              <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.image}
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditing ? 'Updating...' : 'Publishing...'}
              </>
            ) : (
              isEditing ? 'Update' : 'Publish'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
