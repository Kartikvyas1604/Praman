'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { CERTIFICATE_REGISTRY_ABI } from '@/config/abi';
import { CONTRACTS } from '@/config/constants';

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount();
  const [activeTab, setActiveTab] = useState<'issued' | 'received'>('issued');

  const contractAddress = chain?.id ? CONTRACTS[chain.id]?.address : undefined;

  // Fetch issued certificates
  const { data: issuedCerts } = useReadContract({
    address: contractAddress,
    abi: CERTIFICATE_REGISTRY_ABI,
    functionName: 'getCertificatesByIssuer',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });

  // Fetch received certificates
  const { data: receivedCerts } = useReadContract({
    address: contractAddress,
    abi: CERTIFICATE_REGISTRY_ABI,
    functionName: 'getCertificatesByRecipient',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });

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
              <Link href="/issue" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Issue
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {!isConnected ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet to view your certificates
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('issued')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'issued'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Issued Certificates ({Array.isArray(issuedCerts) ? issuedCerts.length : 0})
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'received'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Received Certificates ({Array.isArray(receivedCerts) ? receivedCerts.length : 0})
              </button>
            </div>

            {/* Certificate List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'issued' && Array.isArray(issuedCerts) && issuedCerts.length > 0 ? (
                issuedCerts.map((certHash, index) => (
                  <CertificateCard key={index} certHash={certHash.toString()} />
                ))
              ) : activeTab === 'received' && Array.isArray(receivedCerts) && receivedCerts.length > 0 ? (
                receivedCerts.map((certHash, index) => (
                  <CertificateCard key={index} certHash={certHash.toString()} />
                ))
              ) : (
                <div className="col-span-full card text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No certificates found
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function CertificateCard({ certHash }: { certHash: string }) {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm font-mono text-gray-500 break-all">
          {certHash.slice(0, 10)}...{certHash.slice(-8)}
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Valid
        </span>
      </div>
      <h3 className="font-semibold text-lg mb-2">Certificate</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        View details on blockchain explorer
      </p>
      <Link
        href={`/verify?hash=${certHash}`}
        className="btn-primary w-full text-center"
      >
        View Details
      </Link>
    </div>
  );
}
