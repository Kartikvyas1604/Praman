// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CertificateRegistry
 * @dev Manages the issuance and verification of certificates on the blockchain
 * @notice This contract allows authorized institutions to issue tamper-proof certificates
 */
contract CertificateRegistry is AccessControl, ReentrancyGuard, Pausable {
    // Role definitions
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Certificate structure
    struct Certificate {
        bytes32 certificateHash;    // Unique hash of certificate data
        address issuer;              // Institution that issued the certificate
        address recipient;           // Certificate recipient
        uint256 issueDate;          // Timestamp of issuance
        uint256 expiryDate;         // Expiry date (0 for non-expiring)
        bool revoked;               // Revocation status
        string metadataURI;         // IPFS or storage URI for certificate data
    }

    // Issuer/Institution structure
    struct Issuer {
        string name;
        string details;
        bool active;
        uint256 registrationDate;
    }

    // Storage
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => Issuer) public issuers;
    mapping(address => bytes32[]) public recipientCertificates;
    mapping(address => bytes32[]) public issuerCertificates;
    
    // Array to keep track of all certificate hashes
    bytes32[] public allCertificates;

    // Events
    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed issuer,
        address indexed recipient,
        uint256 issueDate,
        string metadataURI
    );

    event CertificateRevoked(
        bytes32 indexed certificateHash,
        address indexed issuer,
        uint256 revokedDate
    );

    event IssuerRegistered(
        address indexed issuer,
        string name,
        uint256 registrationDate
    );

    event IssuerStatusUpdated(
        address indexed issuer,
        bool active
    );

    // Modifiers
    modifier onlyActiveIssuer() {
        require(
            hasRole(ISSUER_ROLE, msg.sender) && issuers[msg.sender].active,
            "Not an active issuer"
        );
        _;
    }

    modifier certificateExists(bytes32 _certificateHash) {
        require(
            certificates[_certificateHash].issueDate > 0,
            "Certificate does not exist"
        );
        _;
    }

    /**
     * @dev Constructor - sets up admin role
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Register a new issuer/institution
     * @param _issuer Address of the institution
     * @param _name Name of the institution
     * @param _details Additional details about the institution
     */
    function registerIssuer(
        address _issuer,
        string memory _name,
        string memory _details
    ) external onlyRole(ADMIN_ROLE) {
        require(_issuer != address(0), "Invalid issuer address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(issuers[_issuer].registrationDate == 0, "Issuer already registered");

        issuers[_issuer] = Issuer({
            name: _name,
            details: _details,
            active: true,
            registrationDate: block.timestamp
        });

        _grantRole(ISSUER_ROLE, _issuer);

        emit IssuerRegistered(_issuer, _name, block.timestamp);
    }

    /**
     * @dev Update issuer status (activate/deactivate)
     * @param _issuer Address of the issuer
     * @param _active New status
     */
    function updateIssuerStatus(
        address _issuer,
        bool _active
    ) external onlyRole(ADMIN_ROLE) {
        require(issuers[_issuer].registrationDate > 0, "Issuer not registered");
        
        issuers[_issuer].active = _active;

        emit IssuerStatusUpdated(_issuer, _active);
    }

    /**
     * @dev Issue a new certificate
     * @param _certificateHash Unique hash of the certificate
     * @param _recipient Address of the certificate recipient
     * @param _expiryDate Expiry date (0 for non-expiring)
     * @param _metadataURI URI pointing to certificate metadata
     */
    function issueCertificate(
        bytes32 _certificateHash,
        address _recipient,
        uint256 _expiryDate,
        string memory _metadataURI
    ) external onlyActiveIssuer whenNotPaused nonReentrant {
        require(_certificateHash != bytes32(0), "Invalid certificate hash");
        require(_recipient != address(0), "Invalid recipient address");
        require(
            certificates[_certificateHash].issueDate == 0,
            "Certificate already exists"
        );
        require(
            _expiryDate == 0 || _expiryDate > block.timestamp,
            "Invalid expiry date"
        );

        certificates[_certificateHash] = Certificate({
            certificateHash: _certificateHash,
            issuer: msg.sender,
            recipient: _recipient,
            issueDate: block.timestamp,
            expiryDate: _expiryDate,
            revoked: false,
            metadataURI: _metadataURI
        });

        recipientCertificates[_recipient].push(_certificateHash);
        issuerCertificates[msg.sender].push(_certificateHash);
        allCertificates.push(_certificateHash);

        emit CertificateIssued(
            _certificateHash,
            msg.sender,
            _recipient,
            block.timestamp,
            _metadataURI
        );
    }

    /**
     * @dev Revoke a certificate
     * @param _certificateHash Hash of the certificate to revoke
     */
    function revokeCertificate(
        bytes32 _certificateHash
    ) external certificateExists(_certificateHash) whenNotPaused {
        Certificate storage cert = certificates[_certificateHash];
        
        require(
            cert.issuer == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized to revoke"
        );
        require(!cert.revoked, "Certificate already revoked");

        cert.revoked = true;

        emit CertificateRevoked(_certificateHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify a certificate
     * @param _certificateHash Hash of the certificate to verify
     * @return isValid Whether the certificate is valid
     * @return issuer Address of the issuer
     * @return recipient Address of the recipient
     * @return issueDate Date of issuance
     * @return expiryDate Expiry date
     * @return revoked Revocation status
     * @return metadataURI URI of certificate metadata
     */
    function verifyCertificate(
        bytes32 _certificateHash
    )
        external
        view
        certificateExists(_certificateHash)
        returns (
            bool isValid,
            address issuer,
            address recipient,
            uint256 issueDate,
            uint256 expiryDate,
            bool revoked,
            string memory metadataURI
        )
    {
        Certificate memory cert = certificates[_certificateHash];
        
        bool expired = cert.expiryDate != 0 && cert.expiryDate < block.timestamp;
        isValid = !cert.revoked && !expired && issuers[cert.issuer].active;

        return (
            isValid,
            cert.issuer,
            cert.recipient,
            cert.issueDate,
            cert.expiryDate,
            cert.revoked,
            cert.metadataURI
        );
    }

    /**
     * @dev Get certificates by recipient
     * @param _recipient Address of the recipient
     * @return Array of certificate hashes
     */
    function getCertificatesByRecipient(
        address _recipient
    ) external view returns (bytes32[] memory) {
        return recipientCertificates[_recipient];
    }

    /**
     * @dev Get certificates by issuer
     * @param _issuer Address of the issuer
     * @return Array of certificate hashes
     */
    function getCertificatesByIssuer(
        address _issuer
    ) external view returns (bytes32[] memory) {
        return issuerCertificates[_issuer];
    }

    /**
     * @dev Get total number of certificates
     * @return Total count
     */
    function getTotalCertificates() external view returns (uint256) {
        return allCertificates.length;
    }

    /**
     * @dev Get issuer information
     * @param _issuer Address of the issuer
     * @return Issuer details
     */
    function getIssuerInfo(
        address _issuer
    ) external view returns (Issuer memory) {
        return issuers[_issuer];
    }

    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
