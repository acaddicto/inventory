// components/UploadForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Unable to access camera. Please ensure you have granted camera permissions or try uploading a file instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      handleImageUpload(imageData);
    }
  };

  const handleImageUpload = async (base64Image: string) => {
    setIsUploading(true);
    setProgress(20);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: base64Image }),
      });

      setProgress(80);

      if (!response.ok) throw new Error('Failed to process file');

      const data = await response.json();
      setProgress(100);
      
      localStorage.setItem('scanResult', JSON.stringify(data));
      router.push('/result');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(20);

    try {
      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      setProgress(40);
      await handleImageUpload(base64String as string);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Receive Inventory</h1>
      </div>

      <div className="p-4">
        {/* Camera Section */}
        <div className="mb-6">
          <div className="bg-black rounded-xl overflow-hidden aspect-[3/4] relative">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={captureImage}
                  disabled={isUploading}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg active:transform active:scale-95 transition-transform"
                >
                  Capture
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <button
                  onClick={startCamera}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4 flex items-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Start Camera</span>
                </button>
                {cameraError && (
                  <p className="text-sm text-center text-red-600">{cameraError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="text-center">
          <div className="mb-2 text-sm text-gray-500">or</div>
          <label className="block">
            <div className="bg-white px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors">
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600 font-medium">Upload Image</span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG, PDF</span>
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Progress Indicator */}
        {isUploading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              Processing...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}