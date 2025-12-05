import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, ScanLine } from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Tidak dapat mengakses kamera. Pastikan izin diberikan.');
        console.error(err);
      }
    };

    startCamera();

    // Simulate scanning success after 3 seconds for demo purposes
    const timer = setTimeout(() => {
      if (scanning) {
        onScan("IOT-DEVICE-8821");
      }
    }, 3000);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearTimeout(timer);
    };
  }, [scanning, onScan]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">
            {error}
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
              <div className="w-64 h-64 border-2 border-[#00E6F6] rounded-xl relative shadow-[0_0_20px_rgba(0,230,246,0.5)]">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#00E6F6] -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#00E6F6] -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#00E6F6] -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#00E6F6] -mb-1 -mr-1"></div>
                
                {/* Scanning animation line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#00E6F6] shadow-[0_0_10px_#00E6F6] animate-[scan_2s_infinite]"></div>
              </div>
              <p className="mt-8 text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                Arahkan ke QR Code Device IoT
              </p>
            </div>
          </>
        )}
        
        <button 
          onClick={onClose}
          className="absolute top-safe top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-md border border-white/20"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="bg-[#0f172a] p-6 pb-safe text-center border-t border-[#1e293b]">
         <div className="flex items-center justify-center space-x-2 text-[#00E6F6]">
           <ScanLine className="animate-pulse" />
           <span>Mencari perangkat...</span>
         </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 1; }
          50% { top: 100%; opacity: 1; }
          51% { top: 100%; opacity: 0; }
          100% { top: 0; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;