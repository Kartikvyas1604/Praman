'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import toast from 'react-hot-toast';
import { CERTIFICATE_REGISTRY_ABI } from '@/config/abi';
import { CONTRACTS, VerifiedCertificate } from '@/config/constants';

interface Props {
  initialData?: string;
}

export function VerifyCertificateForm({ initialData }: Props) {
  const [certificateHash, setCertificateHash] = useState('');
  const [selectedChain, setSelectedChain] = useState<number>(base.id);
  const [verificationResult, setVerificationResult] = useState<VerifiedCertificate | null>(null);

  useEffect(() => {
    if (initialData) {
      try {
        const parsed = JSON.parse(initialData);
        if (parsed.hash) setCertificateHash(parsed.hash);
        if (parsed.chain) setSelectedChain(parsed.chain);
      } catch {
        setCertificateHash(initialData);
      }
    }
  }, [initialData]);

  const contractAddress = CONTRACTS[selectedChain]?.address;

  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: CERTIFICATE_REGISTRY_ABI,
    functionName: 'verifyCertificate',
    args: certificateHash ? [certificateHash as `0x${string}`] : undefined,
    query: {
      enabled: false,
    },
  });

  const handleVerify = async () => {
    if (!certificateHash) {
      toast.error('Please enter a certificate hash');
      return;
    }

    if (!certificateHash.startsWith('0x')) {
      toast.error('Certificate hash must start with 0x');
      return;
    }

    try {
      const result = await refetch();
      if (result.data) {
        const [isValid, issuer, recipient, issueDate, expiryDate, revoked, metadataURI] = result.data;
        setVerificationResult({
          isValid,
          issuer,
          recipient,
          issueDate: Number(issueDate),
          expiryDate: Number(expiryDate),
          revoked,
          metadataURI,
        });
        
        if (isValid) {
          toast.success('Certificate is valid!');
        } else {
          toast.error('Certificate is invalid or revoked');
        }
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error('Certificate not found or verification failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="card">
        <div className="mb-4">
          <label className="label">Select Blockchain</label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(Number(e.target.value))}
            className="input-field"
          >
            <option value={base.id}>Base</option>
            <option value={mainnet.id}>Ethereum</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="label">Certificate Hash</label>
          <input
            type="text"
            value={certificateHash}
            onChange={(e) => setCertificateHash(e.target.value)}
            className="input-field font-mono"
            placeholder="0x..."
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || !certificateHash}
          className="btn-primary w-full"
        >
          {isLoading ? 'Verifying...' : 'Verify Certificate'}
        </button>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`card ${verificationResult.isValid ? 'border-green-500 border-2' : 'border-red-500 border-2'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Verification Result</h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                verificationResult.isValid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {verificationResult.isValid ? '✓ Valid' : '✗ Invalid'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Issuer</div>
              <div className="font-mono text-sm break-all">{verificationResult.issuer}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Recipient</div>
              <div className="font-mono text-sm break-all">{verificationResult.recipient}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Issue Date</div>
                <div>{new Date(verificationResult.issueDate * 1000).toLocaleDateString()}</div>
              </div>

              {verificationResult.expiryDate > 0 && (
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Expiry Date</div>
                  <div>{new Date(verificationResult.expiryDate * 1000).toLocaleDateString()}</div>
                </div>
              )}
            </div>

            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={verificationResult.revoked ? 'text-red-600' : 'text-green-600'}>
                    {verificationResult.revoked ? '✗' : '✓'}
                  </span>
                  <span>{verificationResult.revoked ? 'Revoked' : 'Not Revoked'}</span>
                </div>
              </div>
            </div>

            {verificationResult.metadataURI && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Certificate Details</div>
                {verificationResult.metadataURI.startsWith('data:') && (
                  <CertificateMetadata uri={verificationResult.metadataURI} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CertificateMetadata({ uri }: { uri: string }) {
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (uri.startsWith('data:application/json;base64,')) {
      try {
        const base64Data = uri.split(',')[1];
        const jsonString = atob(base64Data);
        setMetadata(JSON.parse(jsonString));
      } catch (error) {
        console.error('Failed to parse metadata:', error);
      }
    }
  }, [uri]);

  if (!metadata) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key}>
          <span className="text-sm font-semibold capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}:
          </span>{' '}
          <span className="text-sm">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}
