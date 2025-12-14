'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import QR scanner to avoid SSR issues
const QrReader = dynamic(() => import('react-qr-reader').then((mod) => mod.QrReader), {
  ssr: false,
});

interface Props {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: Props) {
  const [error, setError] = useState<string>('');

  const handleScan = (result: any) => {
    if (result) {
      onScan(result.text);
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    setError('Failed to access camera. Please check permissions.');
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 text-center">Scan QR Code</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="max-w-md mx-auto">
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: 'environment' }}
          containerStyle={{ width: '100%' }}
          videoStyle={{ width: '100%' }}
        />
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Position the QR code within the frame to scan
      </p>
    </div>
  );
}
