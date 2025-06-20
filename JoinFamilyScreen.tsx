
import React, { useState, useRef, useEffect } from 'react';

interface JoinFamilyScreenProps {
  onFamilyJoined: (familyId: string, familyName: string) => void;
  onBack: () => void;
}

const JoinFamilyScreen: React.FC<JoinFamilyScreenProps> = ({ onFamilyJoined, onBack }) => {
  const [familyCode, setFamilyCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulate joining
  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyCode.trim()) {
      // In a real app, validate code against a backend
      console.log(`Attempting to join family with code: ${familyCode}`);
      // Simulate success
      onFamilyJoined(familyCode.trim(), `Family ${familyCode.trim()}`);
    } else {
      setError("Please enter a family code.");
    }
  };

  const handleScanQRCode = async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setIsScanning(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // In a real app, you'd use a QR scanning library here (e.g., jsQR, react-qr-reader)
          // For now, we'll simulate finding a QR code after a delay
          console.log("QR Scanner activated. Point camera at QR code.");
          setTimeout(() => {
            if (isScanning) { // Check if still scanning
              console.log("Simulated QR code found!");
              const simulatedFamilyIdFromQR = "QR123FAMILY";
              onFamilyJoined(simulatedFamilyIdFromQR, `Family QR ${simulatedFamilyIdFromQR}`);
              stopScan();
            }
          }, 5000); // Simulate scan for 5 seconds
        }
      } catch (err) {
        console.error("Error accessing camera for QR scan:", err);
        setError("Could not access camera. Please ensure permissions are granted and try again.");
        setIsScanning(false);
      }
    } else {
      setError("QR code scanning is not supported on this browser or device.");
    }
  };

  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };
  
  useEffect(() => {
    // Cleanup stream when component unmounts or scanning stops
    return () => {
      if (isScanning) {
        stopScan();
      }
    };
  }, [isScanning]);


  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-600">Join a Family Group</h2>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md w-full text-center">{error}</p>}

      {!isScanning && (
        <>
          <button
            onClick={handleScanQRCode}
            className="w-full max-w-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
            aria-label="Scan QR Code to join family"
          >
            📷 Scan QR Code
          </button>

          <p className="text-gray-600">OR</p>

          <form onSubmit={handleJoinWithCode} className="w-full max-w-sm space-y-3">
            <div>
              <label htmlFor="familyCode" className="block text-sm font-medium text-gray-700">Enter Family Code</label>
              <input
                type="text"
                id="familyCode"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                placeholder="e.g., XYZ123"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
            >
              Join with Code
            </button>
          </form>
        </>
      )}

      {isScanning && (
        <div className="w-full max-w-sm flex flex-col items-center space-y-3">
          <p className="text-gray-700">Point your camera at the QR code...</p>
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border-2 border-gray-300 shadow-md" style={{transform: 'scaleX(-1)'}}></video>
          <button
            onClick={stopScan}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Cancel Scan
          </button>
        </div>
      )}
      
      <button
        onClick={onBack}
        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        aria-label="Go back to previous screen"
      >
        &larr; Back
      </button>
    </div>
  );
};

export default JoinFamilyScreen;
