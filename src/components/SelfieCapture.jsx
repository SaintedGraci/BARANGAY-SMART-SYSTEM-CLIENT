import { useState, useRef, useEffect } from "react";
import { Camera, RotateCcw, Check, AlertCircle, X } from "lucide-react";

/**
 * SelfieCapture Component - Fullscreen Modal Experience
 * 
 * Modern fullscreen selfie capture with large camera preview.
 * Opens in a modal overlay for better UX, especially on mobile devices.
 * Once photo is captured and confirmed, the button is disabled to prevent retakes.
 * 
 * @param {Function} onCapture - Callback function that receives the captured image file
 * @param {Function} onCancel - Optional callback when user cancels
 * @param {File} existingPhoto - Optional existing photo file to show "captured" state
 */
export default function SelfieCapture({ onCapture, onCancel, existingPhoto }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasConfirmedPhoto, setHasConfirmedPhoto] = useState(!!existingPhoto);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setError("");
    // Auto-start camera when modal opens
    setTimeout(() => startCamera(), 300);
  };

  const closeModal = () => {
    stopCamera();
    if (capturedImage && !hasConfirmedPhoto) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    setIsModalOpen(false);
    setError("");
  };

  const startCamera = async () => {
    setError("");
    setIsLoading(true);

    // Small delay to ensure video element is in DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsLoading(false);
      setError("Camera API is not supported in this browser. Please use a modern browser or enable HTTPS.");
      return;
    }

    try {
      // Request camera access with higher resolution for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Front camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      // Check if component is still mounted
      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop());
        setError("Component state changed. Please try again.");
        setIsLoading(false);
        return;
      }
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraOpen(true);
      
      // Try to play
      try {
        await videoRef.current.play();
        setIsLoading(false);
      } catch (playErr) {
        // Fallback: wait for metadata
        videoRef.current.onloadedmetadata = async () => {
          if (!videoRef.current) return;
          try {
            await videoRef.current.play();
            setIsLoading(false);
          } catch (err) {
            setError("Failed to start video. Please try again.");
            setIsLoading(false);
            stopCamera();
          }
        };
      }
    } catch (err) {
      setIsLoading(false);
      
      // Handle different error types
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera access denied. Please allow camera permissions and try again.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No camera found. Please use a device with a camera.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setError("Camera is in use by another app. Please close other apps and try again.");
      } else {
        setError(`Unable to access camera: ${err.message}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url);
        stopCamera();
      }
    }, "image/jpeg", 0.92);
  };

  const retakePhoto = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    setError("");
    startCamera();
  };

  const confirmPhoto = () => {
    if (!capturedImage) return;

    // Convert to File
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
        setHasConfirmedPhoto(true);
        closeModal();
      })
      .catch(err => {
        setError("Failed to process image. Please try again.");
        console.error("Image processing error:", err);
      });
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={openModal}
        disabled={hasConfirmedPhoto}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
          hasConfirmedPhoto
            ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {hasConfirmedPhoto ? (
          <>
            <Check className="w-6 h-6" />
            Selfie Captured Successfully
          </>
        ) : (
          <>
            <Camera className="w-6 h-6" />
            Open Camera to Take Selfie
          </>
        )}
      </button>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Identity Selfie</h2>
              <p className="text-sm md:text-base text-slate-300">
                Position your face in the circle and capture a clear photo
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-start gap-2 p-4 bg-red-500/20 border border-red-500 rounded-xl backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-100">{error}</p>
              </div>
            )}

            {/* Camera View */}
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl mb-6" style={{ aspectRatio: "16/10" }}>
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Starting camera...</p>
                  </div>
                </div>
              )}

              {/* Idle State */}
              {!isCameraOpen && !capturedImage && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Camera className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p>Camera will appear here</p>
                  </div>
                </div>
              )}

              {/* Video Stream */}
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${!isCameraOpen || capturedImage ? 'hidden' : ''}`}
                autoPlay
                playsInline
                muted
              />
              
              {/* Face Guide Overlay */}
              {isCameraOpen && !capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div className="border-4 border-white/40 rounded-full w-64 h-64 md:w-80 md:h-80"></div>
                    <div className="absolute inset-0 border-4 border-purple-500/60 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              {/* Captured Image */}
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured selfie"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Hidden canvas */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isCameraOpen && !capturedImage && (
                <>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                </>
              )}

              {capturedImage && (
                <>
                  <button
                    type="button"
                    onClick={confirmPhoto}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                  >
                    <Check className="w-5 h-5" />
                    Use This Photo
                  </button>
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition backdrop-blur-sm"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition backdrop-blur-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
