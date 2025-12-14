const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CertificateRegistry", function () {
  let certificateRegistry;
  let owner, issuer, recipient, addr1;

  beforeEach(async function () {
    [owner, issuer, recipient, addr1] = await ethers.getSigners();

    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    certificateRegistry = await CertificateRegistry.deploy();
    await certificateRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const ADMIN_ROLE = await certificateRegistry.ADMIN_ROLE();
      expect(await certificateRegistry.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Issuer Management", function () {
    it("Should register a new issuer", async function () {
      await certificateRegistry.registerIssuer(
        issuer.address,
        "Test University",
        "A test educational institution"
      );

      const issuerInfo = await certificateRegistry.getIssuerInfo(issuer.address);
      expect(issuerInfo.name).to.equal("Test University");
      expect(issuerInfo.active).to.be.true;
    });

    it("Should not allow non-admin to register issuer", async function () {
      await expect(
        certificateRegistry.connect(addr1).registerIssuer(
          issuer.address,
          "Test University",
          "Details"
        )
      ).to.be.reverted;
    });

    it("Should update issuer status", async function () {
      await certificateRegistry.registerIssuer(
        issuer.address,
        "Test University",
        "Details"
      );

      await certificateRegistry.updateIssuerStatus(issuer.address, false);
      const issuerInfo = await certificateRegistry.getIssuerInfo(issuer.address);
      expect(issuerInfo.active).to.be.false;
    });
  });

  describe("Certificate Issuance", function () {
    beforeEach(async function () {
      await certificateRegistry.registerIssuer(
        issuer.address,
        "Test University",
        "Details"
      );
    });

    it("Should issue a certificate", async function () {
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("cert123"));
      const metadataURI = "ipfs://QmTest123";

      await expect(
        certificateRegistry.connect(issuer).issueCertificate(
          certHash,
          recipient.address,
          0,
          metadataURI
        )
      )
        .to.emit(certificateRegistry, "CertificateIssued")
        .withArgs(certHash, issuer.address, recipient.address, await time.latest() + 1, metadataURI);

      const cert = await certificateRegistry.certificates(certHash);
      expect(cert.recipient).to.equal(recipient.address);
      expect(cert.issuer).to.equal(issuer.address);
    });

    it("Should not allow duplicate certificate", async function () {
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("cert123"));

      await certificateRegistry.connect(issuer).issueCertificate(
        certHash,
        recipient.address,
        0,
        "ipfs://test"
      );

      await expect(
        certificateRegistry.connect(issuer).issueCertificate(
          certHash,
          recipient.address,
          0,
          "ipfs://test"
        )
      ).to.be.revertedWith("Certificate already exists");
    });

    it("Should not allow inactive issuer to issue", async function () {
      await certificateRegistry.updateIssuerStatus(issuer.address, false);
      
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("cert123"));
      
      await expect(
        certificateRegistry.connect(issuer).issueCertificate(
          certHash,
          recipient.address,
          0,
          "ipfs://test"
        )
      ).to.be.revertedWith("Not an active issuer");
    });
  });

  describe("Certificate Verification", function () {
    let certHash;

    beforeEach(async function () {
      await certificateRegistry.registerIssuer(
        issuer.address,
        "Test University",
        "Details"
      );

      certHash = ethers.keccak256(ethers.toUtf8Bytes("cert123"));
      await certificateRegistry.connect(issuer).issueCertificate(
        certHash,
        recipient.address,
        0,
        "ipfs://test"
      );
    });

    it("Should verify valid certificate", async function () {
      const [isValid, issuerAddr, recipientAddr, , , revoked, metadataURI] = 
        await certificateRegistry.verifyCertificate(certHash);

      expect(isValid).to.be.true;
      expect(issuerAddr).to.equal(issuer.address);
      expect(recipientAddr).to.equal(recipient.address);
      expect(revoked).to.be.false;
      expect(metadataURI).to.equal("ipfs://test");
    });

    it("Should mark revoked certificate as invalid", async function () {
      await certificateRegistry.connect(issuer).revokeCertificate(certHash);

      const [isValid, , , , , revoked] = 
        await certificateRegistry.verifyCertificate(certHash);

      expect(isValid).to.be.false;
      expect(revoked).to.be.true;
    });

    it("Should handle non-existent certificate", async function () {
      const fakeCertHash = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      
      await expect(
        certificateRegistry.verifyCertificate(fakeCertHash)
      ).to.be.revertedWith("Certificate does not exist");
    });
  });

  describe("Certificate Revocation", function () {
    let certHash;

    beforeEach(async function () {
      await certificateRegistry.registerIssuer(
        issuer.address,
        "Test University",
        "Details"
      );

      certHash = ethers.keccak256(ethers.toUtf8Bytes("cert123"));
      await certificateRegistry.connect(issuer).issueCertificate(
        certHash,
        recipient.address,
        0,
        "ipfs://test"
      );
    });

    it("Should allow issuer to revoke certificate", async function () {
      await expect(
        certificateRegistry.connect(issuer).revokeCertificate(certHash)
      ).to.emit(certificateRegistry, "CertificateRevoked");

      const cert = await certificateRegistry.certificates(certHash);
      expect(cert.revoked).to.be.true;
    });

    it("Should not allow non-issuer to revoke", async function () {
      await expect(
        certificateRegistry.connect(addr1).revokeCertificate(certHash)
      ).to.be.revertedWith("Not authorized to revoke");
    });

    it("Should not allow double revocation", async function () {
      await certificateRegistry.connect(issuer).revokeCertificate(certHash);

      await expect(
        certificateRegistry.connect(issuer).revokeCertificate(certHash)
      ).to.be.revertedWith("Certificate already revoked");
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      await certificateRegistry.registerIssuer(
        issuer.address,
        "Test University",
        "Details"
      );

      for (let i = 0; i < 3; i++) {
        const certHash = ethers.keccak256(ethers.toUtf8Bytes(`cert${i}`));
        await certificateRegistry.connect(issuer).issueCertificate(
          certHash,
          recipient.address,
          0,
          `ipfs://test${i}`
        );
      }
    });

    it("Should get certificates by recipient", async function () {
      const certs = await certificateRegistry.getCertificatesByRecipient(recipient.address);
      expect(certs.length).to.equal(3);
    });

    it("Should get certificates by issuer", async function () {
      const certs = await certificateRegistry.getCertificatesByIssuer(issuer.address);
      expect(certs.length).to.equal(3);
    });

    it("Should get total certificates count", async function () {
      const total = await certificateRegistry.getTotalCertificates();
      expect(total).to.equal(3);
    });
  });
});
