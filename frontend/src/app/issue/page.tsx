'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { IssueCertificateForm } from '@/components/IssueCertificateForm';

export default function IssuePage() {
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
              <Link href="/verify" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Verify
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
          <h1 className="text-4xl font-bold mb-4">Issue Certificate</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Issue tamper-proof certificates on the blockchain
          </p>
        </div>

        <IssueCertificateForm />
      </main>
    </div>
  );
}
