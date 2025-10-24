# Contributing to Confidential Sports Betting Platform

Thank you for your interest in contributing to the Confidential Sports Betting Platform! We welcome contributions from the community to enhance privacy features and improve the platform.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Security](#security)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js v18 or higher
- npm package manager
- Git for version control
- MetaMask or Web3 wallet for testing
- Basic understanding of:
  - Solidity smart contracts
  - Fully Homomorphic Encryption (FHE)
  - Ethereum development
  - Hardhat framework

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/FHESportsBetting.git
cd FHESportsBetting
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/BrockKunde/FHESportsBetting.git
```

4. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

## Development Setup

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your configuration
```

### Environment Configuration

Configure your `.env` file:

```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Deployment Keys
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Development Settings
REPORT_GAS=true
```

### Build and Compile

```bash
# Compile smart contracts
npm run compile

# Run local Hardhat node
npx hardhat node
```

### Running Tests

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run specific test file
npx hardhat test test/ConfidentialSportsBetting.test.js

# Generate coverage report
npm run coverage
```

## Code Standards

### Solidity Guidelines

#### Smart Contract Standards

- Use Solidity 0.8.24 or compatible version
- Follow official [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use meaningful variable and function names
- Add comprehensive NatSpec comments

**Example:**

```solidity
/**
 * @notice Places an encrypted bet on a match
 * @param matchId The ID of the match to bet on
 * @param betType The type of bet (Win/Lose, Over/Under, Handicap)
 * @param prediction The encrypted prediction value
 * @param betOptions Encoded bet options (team selection, over/under flag)
 */
function placeBet(
    uint32 matchId,
    BetType betType,
    uint8 prediction,
    uint8 betOptions
) external payable matchExists(matchId) matchActive(matchId) {
    // Implementation
}
```

#### Security Best Practices

- Always use `nonReentrant` modifier for functions that transfer funds
- Validate all inputs with `require` statements
- Use SafeMath for arithmetic (built-in Solidity 0.8+)
- Follow checks-effects-interactions pattern
- Protect against common vulnerabilities (reentrancy, overflow, etc.)

**Example:**

```solidity
function claimWinnings(uint32 matchId)
    external
    nonReentrant
    matchExists(matchId)
    matchFinished(matchId)
{
    // Checks
    Bet storage userBet = bets[matchId][msg.sender];
    require((userBet.flags & 16) != 0, "No bet found");
    require((userBet.flags & 1) == 0, "Already claimed");

    // Effects
    userBet.flags |= 1;

    // Interactions
    if (payout > 0) {
        payable(msg.sender).transfer(payout);
    }
}
```

#### FHE Implementation

- Use appropriate encrypted types (`euint8`, `euint32`, etc.)
- Always call `FHE.allowThis()` for contract access
- Call `FHE.allow()` when granting user decryption rights
- Minimize decryption operations for gas efficiency

**Example:**

```solidity
euint8 encryptedValue = FHE.asEuint8(plainValue);
FHE.allowThis(encryptedValue);
FHE.allow(encryptedValue, userAddress);
```

### JavaScript/TypeScript Guidelines

#### Code Style

- Use ES6+ syntax (const, let, arrow functions, async/await)
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use meaningful variable names
- Add JSDoc comments for functions

**Example:**

```javascript
/**
 * Deploys the ConfidentialSportsBetting contract
 * @param {Object} options - Deployment options
 * @param {string} options.network - Network name
 * @param {boolean} options.verify - Whether to verify on Etherscan
 * @returns {Promise<Contract>} Deployed contract instance
 */
async function deployContract({ network, verify = true }) {
    const Contract = await ethers.getContractFactory("ConfidentialSportsBetting");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    if (verify) {
        await verifyContract(await contract.getAddress());
    }

    return contract;
}
```

#### Testing Standards

- Write comprehensive tests for all features
- Maintain minimum 80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Test both success and failure cases

**Example:**

```javascript
describe("Bet Placement", function () {
    it("should allow placing a valid encrypted bet", async function () {
        // Arrange
        const matchId = 1;
        const betAmount = ethers.parseEther("0.1");
        const prediction = 0; // Home team
        const betOptions = 0b0010;

        // Act
        await contract.placeBet(matchId, 0, prediction, betOptions, {
            value: betAmount
        });

        // Assert
        const [amount, betType, claimed, exists] =
            await contract.getBetBasicInfo(matchId, bettor.address);
        expect(amount).to.equal(betAmount);
        expect(exists).to.be.true;
        expect(claimed).to.be.false;
    });

    it("should reject bets below minimum amount", async function () {
        const lowAmount = ethers.parseEther("0.005");

        await expect(
            contract.placeBet(1, 0, 0, 0, { value: lowAmount })
        ).to.be.revertedWith("Invalid bet amount");
    });
});
```

### Git Commit Messages

Use conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Build process or auxiliary tool changes
- `style`: Code style changes (formatting, semicolons, etc.)

#### Examples:

```
feat(betting): add handicap betting support

Implement encrypted handicap betting with configurable handicap values.
Users can now place bets with handicap predictions.

Closes #42
```

```
fix(contract): prevent reentrancy in claimWinnings

Add nonReentrant modifier to claimWinnings function to prevent
reentrancy attacks during payout distribution.

Security issue reported by @auditor
```

## Testing Guidelines

### Test Coverage Requirements

- **Smart Contracts**: Minimum 80% coverage
- **Critical Functions**: 100% coverage (placeBet, claimWinnings, finishMatch)
- **Edge Cases**: Test boundary conditions and error cases

### Running Tests

```bash
# Run full test suite
npm test

# Run with coverage
npm run coverage

# Run specific test category
npx hardhat test --grep "Bet Placement"

# Run gas benchmarks
npm run test:gas
```

### Writing Tests

Include tests for:

1. **Success Cases**: Normal operation
2. **Failure Cases**: Expected errors
3. **Edge Cases**: Boundary conditions
4. **Access Control**: Permission checks
5. **Gas Optimization**: Performance benchmarks

### Test Structure

```javascript
describe("Contract Name", function () {
    describe("Function Name", function () {
        it("should handle success case", async function () {
            // Test implementation
        });

        it("should reject invalid input", async function () {
            // Test implementation
        });

        it("should respect access control", async function () {
            // Test implementation
        });
    });
});
```

## Pull Request Process

### Before Submitting

1. **Update from upstream:**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run all checks:**

```bash
npm run lint        # Code linting
npm test           # Run tests
npm run coverage   # Check coverage
npm run compile    # Ensure compilation
```

3. **Update documentation:**
   - Update README.md if needed
   - Add/update code comments
   - Update CHANGELOG.md

### PR Title Format

Use conventional commit format:

```
feat: Add new betting type support
fix: Correct payout calculation in edge case
docs: Update deployment instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update

## Testing
- [ ] Added new tests
- [ ] All tests pass
- [ ] Coverage maintained/improved

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code commented where necessary
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass

## Related Issues
Closes #[issue number]
```

### Review Process

1. Submit PR with clear description
2. Automated checks run (tests, linting, coverage)
3. Code review by maintainers
4. Address feedback and update PR
5. Approval and merge

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the Bug**
Clear description of the issue.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Execute '...'
4. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Environment**
- Node version: [e.g., v18.17.0]
- Hardhat version: [e.g., 2.19.0]
- Network: [e.g., Sepolia]
- OS: [e.g., Ubuntu 22.04]

**Additional Context**
Error messages, logs, screenshots.
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the proposed feature.

**Use Case**
Why is this feature needed? Who benefits?

**Proposed Implementation**
High-level approach to implementation.

**Alternatives Considered**
Other approaches considered.

**Additional Context**
Mockups, examples, references.
```

## Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email security concerns to: security@example.com
2. Include detailed description
3. Provide reproduction steps if possible
4. Allow time for fix before public disclosure

### Security Best Practices

- Never commit private keys or secrets
- Use `.env` for sensitive configuration
- Add `.env` to `.gitignore`
- Review dependencies for vulnerabilities: `npm audit`
- Follow smart contract security patterns
- Use latest stable versions

## Development Workflow

### Typical Workflow

1. **Pick an issue** from GitHub Issues
2. **Create feature branch**:
   ```bash
   git checkout -b feature/issue-123-add-feature
   ```

3. **Make changes** with regular commits
4. **Write/update tests** for changes
5. **Run checks**:
   ```bash
   npm run lint
   npm test
   npm run coverage
   ```

6. **Update documentation** as needed
7. **Push branch**:
   ```bash
   git push origin feature/issue-123-add-feature
   ```

8. **Create Pull Request** on GitHub
9. **Address review feedback**
10. **Merge** after approval

## Code Review Guidelines

### For Authors

- Keep PRs focused and reasonably sized
- Provide clear PR description
- Respond to feedback promptly
- Be open to suggestions
- Test thoroughly before requesting review

### For Reviewers

- Review promptly
- Be constructive and respectful
- Focus on code, not the person
- Explain reasoning behind suggestions
- Approve when satisfied with changes

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Give credit where due
- Focus on constructive feedback
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Getting Help

- **Documentation**: Check [docs/](./docs/) folder
- **GitHub Issues**: [Ask questions](https://github.com/BrockKunde/FHESportsBetting/issues)
- **GitHub Discussions**: Community forum
- **Live Demo**: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)

## Resources

### Learning Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Ethers.js Documentation](https://docs.ethers.org/)

### Development Tools

- [Hardhat](https://hardhat.org/) - Development environment
- [Ethers.js](https://ethers.org/) - Ethereum library
- [OpenZeppelin](https://openzeppelin.com/) - Security contracts
- [Remix IDE](https://remix.ethereum.org/) - Online Solidity IDE

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to the Confidential Sports Betting Platform!**

**Together, we're building the future of privacy-preserving betting on blockchain.**

For questions or support, please open an issue or reach out to the maintainers.
