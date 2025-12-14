'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, keccak256, toBytes } from 'viem';
import toast from 'react-hot-toast';
import { CERTIFICATE_REGISTRY_ABI } from '@/config/abi';
import { CONTRACTS, CertificateData } from '@/config/constants';
import { generateQRCode } from '@/lib/qrcode';

export function IssueCertificateForm() {
  const { address, chain } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [formData, setFormData] = useState<CertificateData>({
    certificateId: '',
    recipientName: '',
    recipientAddress: '',
    courseName: '',
    issueDate: new Date(),
    expiryDate: undefined,
    grade: '',
    description: '',
    issuerName: '',
  });

  const [qrCode, setQrCode] = useState<string>('');
  const [certificateHash, setCertificateHash] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !chain) {
      toast.error('Please connect your wallet');
      return;
    }

    const contractAddress = CONTRACTS[chain.id]?.address;
    if (!contractAddress) {
      toast.error('Contract not deployed on this network');
      return;
    }

    try {
      // Create metadata object
      const metadata = {
        certificateId: formData.certificateId,
        recipientName: formData.recipientName,
        courseName: formData.courseName,
        grade: formData.grade,
        description: formData.description,
        issuerName: formData.issuerName,
        issueDate: formData.issueDate.toISOString(),
      };

      // Generate certificate hash
      const metadataString = JSON.stringify(metadata);
      const hash = keccak256(toBytes(metadataString));
      setCertificateHash(hash);

      // In production, upload metadata to IPFS
      const metadataURI = `data:application/json;base64,${btoa(metadataString)}`;

      const expiryTimestamp = formData.expiryDate
        ? Math.floor(formData.expiryDate.getTime() / 1000)
        : 0;

      writeContract({
        address: contractAddress,
        abi: CERTIFICATE_REGISTRY_ABI,
        functionName: 'issueCertificate',
        args: [
          hash,
          formData.recipientAddress as `0x${string}`,
          BigInt(expiryTimestamp),
          metadataURI,
        ],
      });

      toast.success('Transaction submitted!');
    } catch (error: any) {
      console.error('Error issuing certificate:', error);
      toast.error(error?.message || 'Failed to issue certificate');
    }
  };

  // Generate QR code when transaction succeeds
  if (isSuccess && certificateHash && !qrCode) {
    const qrData = {
      hash: certificateHash,
      chain: chain?.id,
      type: 'certificate',
    };
    generateQRCode(JSON.stringify(qrData)).then(setQrCode);
  }

  if (isSuccess && qrCode) {
    return (
      <div className="card text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Certificate Issued Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Certificate Hash: {certificateHash.slice(0, 10)}...{certificateHash.slice(-8)}
          </p>
        </div>

        <div className="mb-6">
          <img src={qrCode} alt="Certificate QR Code" className="mx-auto max-w-xs" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Scan this QR code to verify the certificate
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <a href={qrCode} download={`certificate-${formData.certificateId}.png`} className="btn-primary">
            Download QR Code
          </a>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Issue Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Certificate ID *</label>
          <input
            type="text"
            name="certificateId"
            value={formData.certificateId}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="CERT-2025-001"
          />
        </div>

        <div>
          <label className="label">Issuer Name *</label>
          <input
            type="text"
            name="issuerName"
            value={formData.issuerName}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="University Name"
          />
        </div>

        <div>
          <label className="label">Recipient Name *</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="label">Recipient Address *</label>
          <input
            type="text"
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="label">Course/Program Name *</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Computer Science"
          />
        </div>

        <div>
          <label className="label">Grade (Optional)</label>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="input-field"
            placeholder="A+"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="input-field"
            rows={4}
            placeholder="Certificate description..."
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="btn-primary w-full"
        >
          {isPending || isConfirming ? 'Processing...' : 'Issue Certificate'}
        </button>
      </div>
    </form>
  );
}
