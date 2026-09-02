import { useState, useRef, useEffect } from "react";
import { Camera, RotateCcw, Check, AlertCircle, X } from "lucide-react";

/**
 * SelfieCapture Component
 * 
 * Captures a selfie using the device camera for identity verification.
 * No facial recognition or AI - just a simple photo capture for manual admin review.
 * 
 * @param {Function} onCapture - Callback function that receives the captured image file
 * @param {Function} onCancel - Optional callback when user cancels
 */
export default function SelfieCapture({ onCapture, onCancel }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use front camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsCameraOpen(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      
      // Handle different error types
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera access denied. Please allow camera permissions in your browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No camera found on this device. Please use a device with a camera.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setError("Camera is already in use by another application. Please close other apps using the camera.");
      } else {
        setError(`Unable to access camera: ${err.message}`);
      }
      
      console.error("Camera error:", err);
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

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url);
        stopCamera();
      }
    }, "image/jpeg", 0.9);
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

    // Convert captured image to File object
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
        
        // Cleanup
        URL.revokeObjectURL(capturedImage);
        setCapturedImage(null);
      })
      .catch(err => {
        setError("Failed to process captured image. Please try again.");
        console.error("Image processing error:", err);
      });
  };

  const handleCancel = () => {
    stopCamera();
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    if (onCancel) onCancel();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Identity Selfie</h3>
        <p className="text-sm text-slate-600">
          Please take a clear photo of yourself. This photo will be reviewed by a Barangay Administrator 
          together with your submitted identification documents.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Camera View or Captured Image */}
      <div className="relative bg-slate-900 rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {!isCameraOpen && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Camera className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Camera preview will appear here</p>
            </div>
          </div>
        )}

        {/* Video Stream */}
        {isCameraOpen && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {/* Camera guidelines overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white/50 rounded-full" style={{ width: "60%", aspectRatio: "1" }}>
                <div className="w-full h-full rounded-full border-4 border-white/20" />
              </div>
            </div>
          </>
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="w-full h-full object-cover"
          />
        )}

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isCameraOpen && !capturedImage && (
          <>
            <button
              type="button"
              onClick={startCamera}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-5 h-5" />
              {isLoading ? "Starting Camera..." : "Take Selfie"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            )}
          </>
        )}

        {isCameraOpen && (
          <>
            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        )}

        {capturedImage && (
          <>
            <button
              type="button"
              onClick={confirmPhoto}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Check className="w-5 h-5" />
              Use This Photo
            </button>
            <button
              type="button"
              onClick={retakePhoto}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </button>
          </>
        )}
      </div>

      {/* Helper Text */}
      {isCameraOpen && (
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Position your face within the circle and ensure good lighting
          </p>
        </div>
      )}
    </div>
  );
}
