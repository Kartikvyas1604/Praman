# Contributing to Praman

First off, thank you for considering contributing to Praman! It's people like you that make Praman such a great tool for the blockchain community.

## 🌟 Ways to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide detailed description** of the suggested enhancement
- **Explain why this would be useful** to most users
- **List any alternative solutions** you've considered

### 🔧 Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes**
3. **Add tests** if you've added code
4. **Update documentation** as needed
5. **Ensure tests pass**
6. **Follow code style guidelines**
7. **Submit the pull request**

## 🚀 Development Setup

### Prerequisites

```bash
# Install Node.js 18+
node --version

# Install Rust (for Solana)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0
```

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/praman.git
cd praman

# Install dependencies
npm install

# Set up environment
cd frontend
cp .env.example .env.local
# Fill in your environment variables

# Run tests
npm run test:evm
npm run test:solana
```

## 📝 Code Style Guidelines

### Solidity

```solidity
// Use NatSpec comments
/**
 * @notice Issue a new certificate
 * @param _certificateHash Unique hash of certificate
 * @param _recipient Recipient address
 */
function issueCertificate(
    bytes32 _certificateHash,
    address _recipient
) external {
    // Implementation
}

// Use meaningful variable names
uint256 issueDate; // Good
uint256 d; // Bad

// Follow Solidity style guide
// - 4 spaces for indentation
// - Max line length 120
```

### Rust

```rust
// Use descriptive names
pub fn issue_certificate(
    ctx: Context<IssueCertificate>,
    certificate_id: String,
) -> Result<()> {
    // Implementation
}

// Use cargo fmt
cargo fmt

// Use cargo clippy
cargo clippy
```

### TypeScript/React

```typescript
// Use functional components
export function MyComponent({ prop }: Props) {
  // Use hooks
  const [state, setState] = useState();

  // Use descriptive names
  const handleSubmit = () => {
    // Implementation
  };

  return <div>{/* JSX */}</div>;
}

// Use TypeScript types
interface Props {
  prop: string;
}

// Use Prettier
npm run format
```

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// EVM Tests
describe('CertificateRegistry', () => {
  it('should issue certificate', async () => {
    // Arrange
    const certHash = ethers.keccak256(ethers.toUtf8Bytes('test'));
    
    // Act
    await certificateRegistry.issueCertificate(certHash, recipient, 0, 'uri');
    
    // Assert
    const cert = await certificateRegistry.certificates(certHash);
    expect(cert.recipient).to.equal(recipient);
  });
});

// Solana Tests
#[tokio::test]
async fn test_issue_certificate() {
    // Setup
    let mut program_test = ProgramTest::new(...);
    
    // Execute
    let result = issue_certificate(...).await;
    
    // Verify
    assert!(result.is_ok());
}
```

### Running Tests

```bash
# EVM contracts
cd contracts/evm
npx hardhat test
npx hardhat coverage

# Solana program
cd contracts/solana
anchor test

# Frontend
cd frontend
npm test
```

## 📚 Documentation

### Code Documentation

- **Document all public functions**
- **Explain complex logic**
- **Include examples for APIs**
- **Keep docs up to date**

### Documentation Files

When updating features:
- Update README.md if needed
- Update API.md for API changes
- Update DEVELOPMENT.md for workflow changes
- Add examples to QUICKSTART.md

## 🔀 Git Workflow

### Branch Naming

```bash
feature/add-batch-issuance
fix/certificate-validation
docs/update-readme
refactor/optimize-gas
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add batch certificate issuance
fix: resolve verification error
docs: update API documentation
refactor: optimize gas usage
test: add integration tests
chore: update dependencies
```

### PR Process

1. **Update your fork**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/praman.git
   git fetch upstream
   git merge upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create pull request** on GitHub

## 🎯 Priority Areas

We're especially looking for help with:

### High Priority
- [ ] Security audits and improvements
- [ ] Gas optimization
- [ ] Test coverage improvements
- [ ] Mobile responsiveness

### Medium Priority
- [ ] Additional blockchain support
- [ ] UI/UX enhancements
- [ ] Performance optimization
- [ ] Documentation improvements

### Future Features
- [ ] NFT certificate support
- [ ] Batch operations
- [ ] Analytics dashboard
- [ ] Mobile app

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## ❓ Questions?

- 💬 Open a [Discussion](https://github.com/yourusername/praman/discussions)
- 🐛 File an [Issue](https://github.com/yourusername/praman/issues)
- 📧 Email the maintainers

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions to open source, large or small, make great projects like this possible. Thank you for taking the time to contribute.

---

**Happy Coding! 🚀**
