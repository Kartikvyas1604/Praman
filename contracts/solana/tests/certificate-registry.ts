import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CertificateRegistry } from "../target/types/certificate_registry";
import { expect } from "chai";

describe("certificate-registry", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CertificateRegistry as Program<CertificateRegistry>;
  
  const admin = provider.wallet;
  const issuerKeypair = anchor.web3.Keypair.generate();
  const recipientKeypair = anchor.web3.Keypair.generate();

  const [registryPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("registry")],
    program.programId
  );

  const [issuerPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("issuer"), issuerKeypair.publicKey.toBuffer()],
    program.programId
  );

  it("Initializes the registry", async () => {
    await program.methods
      .initialize()
      .accounts({
        registry: registryPda,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const registryAccount = await program.account.registry.fetch(registryPda);
    expect(registryAccount.admin.toString()).to.equal(admin.publicKey.toString());
    expect(registryAccount.totalCertificates.toNumber()).to.equal(0);
    expect(registryAccount.totalIssuers.toNumber()).to.equal(0);
  });

  it("Registers a new issuer", async () => {
    await program.methods
      .registerIssuer("Test University", "A test institution")
      .accounts({
        registry: registryPda,
        issuer: issuerPda,
        authority: issuerKeypair.publicKey,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const issuerAccount = await program.account.issuer.fetch(issuerPda);
    expect(issuerAccount.name).to.equal("Test University");
    expect(issuerAccount.active).to.be.true;
    expect(issuerAccount.totalIssued.toNumber()).to.equal(0);
  });

  it("Issues a certificate", async () => {
    // Airdrop SOL to issuer for transaction fees
    await provider.connection.requestAirdrop(
      issuerKeypair.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const certificateId = "CERT-001";
    const [certificatePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("certificate"), Buffer.from(certificateId)],
      program.programId
    );

    await program.methods
      .issueCertificate(certificateId, "ipfs://QmTest123", new anchor.BN(0))
      .accounts({
        registry: registryPda,
        issuer: issuerPda,
        certificate: certificatePda,
        recipient: recipientKeypair.publicKey,
        issuerAuthority: issuerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([issuerKeypair])
      .rpc();

    const certificateAccount = await program.account.certificate.fetch(certificatePda);
    expect(certificateAccount.certificateId).to.equal(certificateId);
    expect(certificateAccount.recipient.toString()).to.equal(
      recipientKeypair.publicKey.toString()
    );
    expect(certificateAccount.revoked).to.be.false;
  });

  it("Revokes a certificate", async () => {
    const certificateId = "CERT-002";
    const [certificatePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("certificate"), Buffer.from(certificateId)],
      program.programId
    );

    // Issue certificate first
    await program.methods
      .issueCertificate(certificateId, "ipfs://QmTest456", new anchor.BN(0))
      .accounts({
        registry: registryPda,
        issuer: issuerPda,
        certificate: certificatePda,
        recipient: recipientKeypair.publicKey,
        issuerAuthority: issuerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([issuerKeypair])
      .rpc();

    // Now revoke it
    await program.methods
      .revokeCertificate()
      .accounts({
        registry: registryPda,
        issuer: issuerPda,
        certificate: certificatePda,
        authority: issuerKeypair.publicKey,
      })
      .signers([issuerKeypair])
      .rpc();

    const certificateAccount = await program.account.certificate.fetch(certificatePda);
    expect(certificateAccount.revoked).to.be.true;
  });

  it("Updates issuer status", async () => {
    await program.methods
      .updateIssuerStatus(false)
      .accounts({
        registry: registryPda,
        issuer: issuerPda,
        admin: admin.publicKey,
      })
      .rpc();

    const issuerAccount = await program.account.issuer.fetch(issuerPda);
    expect(issuerAccount.active).to.be.false;
  });
});
