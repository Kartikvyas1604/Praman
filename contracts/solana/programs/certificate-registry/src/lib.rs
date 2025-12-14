use anchor_lang::prelude::*;

declare_id!("CertReg11111111111111111111111111111111111");

#[program]
pub mod certificate_registry {
    use super::*;

    /// Initialize the program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.admin = ctx.accounts.admin.key();
        registry.total_certificates = 0;
        registry.total_issuers = 0;
        registry.bump = ctx.bumps.registry;
        Ok(())
    }

    /// Register a new issuer
    pub fn register_issuer(
        ctx: Context<RegisterIssuer>,
        name: String,
        details: String,
    ) -> Result<()> {
        require!(name.len() > 0 && name.len() <= 100, ErrorCode::InvalidName);
        require!(details.len() <= 500, ErrorCode::InvalidDetails);

        let issuer = &mut ctx.accounts.issuer;
        let registry = &mut ctx.accounts.registry;

        issuer.authority = ctx.accounts.authority.key();
        issuer.name = name;
        issuer.details = details;
        issuer.active = true;
        issuer.registration_date = Clock::get()?.unix_timestamp;
        issuer.total_issued = 0;
        issuer.bump = ctx.bumps.issuer;

        registry.total_issuers += 1;

        emit!(IssuerRegistered {
            issuer: issuer.authority,
            name: issuer.name.clone(),
            timestamp: issuer.registration_date,
        });

        Ok(())
    }

    /// Update issuer status
    pub fn update_issuer_status(
        ctx: Context<UpdateIssuerStatus>,
        active: bool,
    ) -> Result<()> {
        let issuer = &mut ctx.accounts.issuer;
        issuer.active = active;

        emit!(IssuerStatusUpdated {
            issuer: issuer.authority,
            active,
        });

        Ok(())
    }

    /// Issue a new certificate
    pub fn issue_certificate(
        ctx: Context<IssueCertificate>,
        certificate_id: String,
        metadata_uri: String,
        expiry_date: i64,
    ) -> Result<()> {
        require!(
            certificate_id.len() > 0 && certificate_id.len() <= 64,
            ErrorCode::InvalidCertificateId
        );
        require!(metadata_uri.len() <= 200, ErrorCode::InvalidMetadataUri);
        require!(
            expiry_date == 0 || expiry_date > Clock::get()?.unix_timestamp,
            ErrorCode::InvalidExpiryDate
        );

        let issuer = &mut ctx.accounts.issuer;
        require!(issuer.active, ErrorCode::IssuerNotActive);

        let certificate = &mut ctx.accounts.certificate;
        let registry = &mut ctx.accounts.registry;
        let clock = Clock::get()?;

        certificate.certificate_id = certificate_id.clone();
        certificate.issuer = issuer.authority;
        certificate.recipient = ctx.accounts.recipient.key();
        certificate.issue_date = clock.unix_timestamp;
        certificate.expiry_date = expiry_date;
        certificate.revoked = false;
        certificate.metadata_uri = metadata_uri.clone();
        certificate.bump = ctx.bumps.certificate;

        issuer.total_issued += 1;
        registry.total_certificates += 1;

        emit!(CertificateIssued {
            certificate_id,
            issuer: issuer.authority,
            recipient: certificate.recipient,
            issue_date: certificate.issue_date,
            metadata_uri,
        });

        Ok(())
    }

    /// Revoke a certificate
    pub fn revoke_certificate(ctx: Context<RevokeCertificate>) -> Result<()> {
        let certificate = &mut ctx.accounts.certificate;
        
        require!(!certificate.revoked, ErrorCode::AlreadyRevoked);

        certificate.revoked = true;

        emit!(CertificateRevoked {
            certificate_id: certificate.certificate_id.clone(),
            issuer: certificate.issuer,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Verify a certificate (read-only, returns data via account)
    pub fn verify_certificate(_ctx: Context<VerifyCertificate>) -> Result<()> {
        // This is a read-only operation
        // Verification logic is handled on the client side by reading the account
        Ok(())
    }
}

// Account Structures

#[account]
pub struct Registry {
    pub admin: Pubkey,
    pub total_certificates: u64,
    pub total_issuers: u64,
    pub bump: u8,
}

impl Registry {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        8 +  // total_certificates
        8 +  // total_issuers
        1;   // bump
}

#[account]
pub struct Issuer {
    pub authority: Pubkey,
    pub name: String,
    pub details: String,
    pub active: bool,
    pub registration_date: i64,
    pub total_issued: u64,
    pub bump: u8,
}

impl Issuer {
    pub const MAX_NAME_LEN: usize = 100;
    pub const MAX_DETAILS_LEN: usize = 500;
    
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        4 + Self::MAX_NAME_LEN + // name
        4 + Self::MAX_DETAILS_LEN + // details
        1 +  // active
        8 +  // registration_date
        8 +  // total_issued
        1;   // bump
}

#[account]
pub struct Certificate {
    pub certificate_id: String,
    pub issuer: Pubkey,
    pub recipient: Pubkey,
    pub issue_date: i64,
    pub expiry_date: i64,
    pub revoked: bool,
    pub metadata_uri: String,
    pub bump: u8,
}

impl Certificate {
    pub const MAX_ID_LEN: usize = 64;
    pub const MAX_URI_LEN: usize = 200;
    
    pub const LEN: usize = 8 + // discriminator
        4 + Self::MAX_ID_LEN + // certificate_id
        32 + // issuer
        32 + // recipient
        8 +  // issue_date
        8 +  // expiry_date
        1 +  // revoked
        4 + Self::MAX_URI_LEN + // metadata_uri
        1;   // bump
}

// Context Structures

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = Registry::LEN,
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterIssuer<'info> {
    #[account(
        mut,
        seeds = [b"registry"],
        bump = registry.bump,
        has_one = admin
    )]
    pub registry: Account<'info, Registry>,
    
    #[account(
        init,
        payer = admin,
        space = Issuer::LEN,
        seeds = [b"issuer", authority.key().as_ref()],
        bump
    )]
    pub issuer: Account<'info, Issuer>,
    
    /// CHECK: This is the issuer's authority account
    pub authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateIssuerStatus<'info> {
    #[account(
        seeds = [b"registry"],
        bump = registry.bump,
        has_one = admin
    )]
    pub registry: Account<'info, Registry>,
    
    #[account(
        mut,
        seeds = [b"issuer", issuer.authority.as_ref()],
        bump = issuer.bump
    )]
    pub issuer: Account<'info, Issuer>,
    
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(certificate_id: String)]
pub struct IssueCertificate<'info> {
    #[account(
        mut,
        seeds = [b"registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, Registry>,
    
    #[account(
        mut,
        seeds = [b"issuer", issuer_authority.key().as_ref()],
        bump = issuer.bump,
        has_one = authority @ ErrorCode::UnauthorizedIssuer
    )]
    pub issuer: Account<'info, Issuer>,
    
    #[account(
        init,
        payer = issuer_authority,
        space = Certificate::LEN,
        seeds = [b"certificate", certificate_id.as_bytes()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,
    
    /// CHECK: This is the certificate recipient
    pub recipient: AccountInfo<'info>,
    
    #[account(mut)]
    pub issuer_authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeCertificate<'info> {
    #[account(
        seeds = [b"registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, Registry>,
    
    #[account(
        seeds = [b"issuer", issuer.authority.as_ref()],
        bump = issuer.bump
    )]
    pub issuer: Account<'info, Issuer>,
    
    #[account(
        mut,
        seeds = [b"certificate", certificate.certificate_id.as_bytes()],
        bump = certificate.bump,
        constraint = certificate.issuer == issuer.authority @ ErrorCode::UnauthorizedRevoke
    )]
    pub certificate: Account<'info, Certificate>,
    
    #[account(
        constraint = authority.key() == issuer.authority || authority.key() == registry.admin
        @ ErrorCode::UnauthorizedRevoke
    )]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyCertificate<'info> {
    #[account(
        seeds = [b"certificate", certificate.certificate_id.as_bytes()],
        bump = certificate.bump
    )]
    pub certificate: Account<'info, Certificate>,
}

// Events

#[event]
pub struct IssuerRegistered {
    pub issuer: Pubkey,
    pub name: String,
    pub timestamp: i64,
}

#[event]
pub struct IssuerStatusUpdated {
    pub issuer: Pubkey,
    pub active: bool,
}

#[event]
pub struct CertificateIssued {
    pub certificate_id: String,
    pub issuer: Pubkey,
    pub recipient: Pubkey,
    pub issue_date: i64,
    pub metadata_uri: String,
}

#[event]
pub struct CertificateRevoked {
    pub certificate_id: String,
    pub issuer: Pubkey,
    pub timestamp: i64,
}

// Error Codes

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid name length")]
    InvalidName,
    
    #[msg("Invalid details length")]
    InvalidDetails,
    
    #[msg("Invalid certificate ID")]
    InvalidCertificateId,
    
    #[msg("Invalid metadata URI")]
    InvalidMetadataUri,
    
    #[msg("Invalid expiry date")]
    InvalidExpiryDate,
    
    #[msg("Issuer is not active")]
    IssuerNotActive,
    
    #[msg("Unauthorized issuer")]
    UnauthorizedIssuer,
    
    #[msg("Certificate already revoked")]
    AlreadyRevoked,
    
    #[msg("Unauthorized to revoke certificate")]
    UnauthorizedRevoke,
}
