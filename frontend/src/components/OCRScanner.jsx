import { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { extractAmountFromImage } from '../services/ocrService';

export default function OCRScanner({ onAmountExtracted, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraMode, setCameraMode] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      setPreview(e.target.result);
      const amount = await extractAmountFromImage(e.target.result);
      setProcessing(false);
      if (amount) {
        onAmountExtracted?.(amount);
        onClose?.();
      } else {
        setError('Could not detect amount. Try a clearer image.');
      }
    };
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    setCameraMode(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setError('Camera access denied');
      setCameraMode(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'bill.jpg', { type: 'image/jpeg' });
      handleFile(file);
    }, 'image/jpeg');
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setCameraMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-sm mx-4">
        <h3 className="font-bold text-lg mb-4">Scan Bill</h3>

        {cameraMode ? (
          <div className="relative">
            <video ref={videoRef} className="w-full h-64 rounded-xl bg-black object-cover" />
            <div className="flex gap-2 mt-3">
              <button onClick={capturePhoto} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Camera size={18} /> Capture
              </button>
              <button onClick={stopCamera} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Bill" className="w-full h-48 object-contain rounded-xl bg-slate-100" />
                {processing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                    <div className="text-center">
                      <Loader2 size={28} className="animate-spin text-kanakko-500 mx-auto" />
                      <p className="text-sm text-slate-500 mt-2">Reading amount...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3 mb-3">
                <button onClick={openCamera} className="flex-1 py-12 rounded-xl bg-kanakko-50 text-kanakko-600 flex flex-col items-center gap-2 active:bg-kanakko-100 transition-colors">
                  <Camera size={32} />
                  <span className="font-medium">Camera</span>
                </button>
                <button onClick={() => fileRef.current?.click()} className="flex-1 py-12 rounded-xl bg-slate-100 text-slate-600 flex flex-col items-center gap-2 active:bg-slate-200 transition-colors">
                  <Upload size={32} />
                  <span className="font-medium">Gallery</span>
                </button>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {error && <p className="text-sm text-rose-500 mt-2">{error}</p>}
            <button onClick={onClose} className="btn-secondary w-full mt-2">
              {preview ? 'Cancel' : 'Close'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
