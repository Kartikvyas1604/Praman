'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { VerifyCertificateForm } from '@/components/VerifyCertificateForm';
import { QRScanner } from '@/components/QRScanner';

export default function VerifyPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');

  const handleScan = (data: string) => {
    setScannedData(data);
    setShowScanner(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Praman
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/issue" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Issue
              </Link>
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Dashboard
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Verify Certificate</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Verify the authenticity of blockchain certificates
          </p>
        </div>

        {/* QR Scanner Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="btn-primary"
          >
            {showScanner ? 'Close Scanner' : '📷 Scan QR Code'}
          </button>
        </div>

        {/* QR Scanner */}
        {showScanner && (
          <div className="mb-8">
            <QRScanner onScan={handleScan} />
          </div>
        )}

        {/* Verification Form */}
        <VerifyCertificateForm initialData={scannedData} />
      </main>
    </div>
  );
}
