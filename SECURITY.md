# Security & Performance Optimization Guide

Comprehensive security audit and performance optimization documentation for the Confidential Sports Betting Platform.

## Table of Contents

- [Security Architecture](#security-architecture)
- [Security Patterns](#security-patterns)
- [DoS Protection](#dos-protection)
- [Gas Optimization](#gas-optimization)
- [Performance Benchmarks](#performance-benchmarks)
- [Security Auditing](#security-auditing)
- [Best Practices](#best-practices)

## Security Architecture

### Multi-Layer Security Approach

```
┌─────────────────────────────────────────────┐
│         Application Layer                    │
│  • Input Validation                          │
│  • Access Control                            │
│  • Rate Limiting                             │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│         Contract Layer                       │
│  • ReentrancyGuard                          │
│  • Pausable                                 │
│  • Role-Based Access                        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│         Blockchain Layer                     │
│  • Immutable Storage                        │
│  • Event Logging                            │
│  • Transaction History                      │
└─────────────────────────────────────────────┘
```

### Security Components

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| ReentrancyGuard | Prevent reentrancy attacks | `contracts/security/ReentrancyGuard.sol` |
| Pausable | Emergency stop mechanism | `contracts/security/Pausable.sol` |
| RateLimiter | DoS protection | `contracts/security/RateLimiter.sol` |
| Access Control | Permission management | Built-in owner/oracle roles |

## Security Patterns

### 1. Reentrancy Protection

**Pattern**: Checks-Effects-Interactions

```solidity
// ✅ GOOD - Protected pattern
function claimWinnings() external nonReentrant {
    // Checks
    require(hasWon[msg.sender], "No winnings");
    require(!claimed[msg.sender], "Already claimed");

    // Effects
    claimed[msg.sender] = true;
    uint256 amount = winnings[msg.sender];
    winnings[msg.sender] = 0;

    // Interactions
    payable(msg.sender).transfer(amount);
}
```

**Usage in Contract**:
```solidity
import "./security/ReentrancyGuard.sol";

contract ConfidentialSportsBetting is ReentrancyGuard {
    function claimWinnings(uint32 matchId)
        external
        nonReentrant  // ✅ Protected
    {
        // Safe withdrawal logic
    }
}
```

### 2. Pausable Emergency Stop

**Pattern**: Circuit Breaker

```solidity
// ✅ GOOD - Pausable functions
function placeBet(...) external payable whenNotPaused {
    // Only executes when contract is not paused
}
```

**Emergency Response**:
```solidity
// Pause in emergency
contract.pause();  // Stops all pausable functions

// Resume after fix
contract.unpause();  // Resumes normal operation
```

### 3. Access Control

**Pattern**: Role-Based Permissions

```solidity
// Owner functions
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

// Oracle functions
modifier onlyOracle() {
    require(authorizedOracles[msg.sender], "Not authorized oracle");
    _;
}
```

**Security Levels**:
- **Owner**: Contract deployment, oracle management
- **Oracle**: Match management, result submission
- **Users**: Betting, claiming winnings

### 4. Input Validation

**Pattern**: Fail-Fast Validation

```solidity
// ✅ GOOD - Comprehensive validation
function placeBet(uint32 matchId, ...) external payable {
    require(matchId > 0 && matchId <= currentMatchId, "Invalid match");
    require(msg.value >= MIN_BET && msg.value <= MAX_BET, "Invalid amount");
    require(matches[matchId].status == Active, "Match not active");
    require(block.timestamp >= startTime, "Not started");
    require(block.timestamp < endTime, "Betting closed");
    // ... function logic
}
```

## DoS Protection

### 1. Rate Limiting

**Implementation**: `contracts/security/RateLimiter.sol`

```solidity
contract ProtectedContract is RateLimiter(60) {  // 60 second cooldown
    function frequentAction() external rateLimit {
        // Action limited to once per minute per address
    }
}
```

**Configuration**:
```env
# .env
ACTION_COOLDOWN=60  # seconds between actions
```

### 2. Gas Limits

**Prevention**: Unbounded loops

```solidity
// ❌ BAD - Unbounded loop (DoS risk)
function processAllBettors() external {
    for (uint i = 0; i < bettors.length; i++) {  // Could run out of gas
        process(bettors[i]);
    }
}

// ✅ GOOD - Batch processing with limits
function processBettorsBatch(uint256 start, uint256 end) external {
    require(end - start <= 50, "Batch too large");  // Limit batch size
    for (uint i = start; i < end; i++) {
        process(bettors[i]);
    }
}
```

### 3. Pull Over Push

**Pattern**: Users claim winnings (pull) vs contract sends (push)

```solidity
// ✅ GOOD - Pull pattern
function claimWinnings() external {
    uint256 amount = calculateWinnings(msg.sender);
    // User initiates withdrawal
    payable(msg.sender).transfer(amount);
}

// ❌ BAD - Push pattern (DoS risk)
function distributeWinnings() external {
    for (uint i = 0; i < winners.length; i++) {
        winners[i].transfer(amounts[i]);  // Fails if one fails
    }
}
```

### 4. External Call Safety

**Pattern**: Check-Effect-Interact

```solidity
// ✅ GOOD - Safe external calls
function safeWithdraw() external {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0;  // Update state BEFORE external call

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

## Gas Optimization

### Optimization Strategies

| Strategy | Savings | Implementation Difficulty |
|----------|---------|--------------------------|
| Use `calldata` vs `memory` | 10-50% | Easy |
| Pack storage variables | 20-50% | Medium |
| Use events instead of storage | 90%+ | Easy |
| Cache storage reads | 100+ gas/read | Easy |
| Use `immutable` | 20,000 gas | Easy |
| Use `constant` | Full cost | Easy |
| Batch operations | 20-40% | Medium |
| Optimize loops | Varies | Medium |

### 1. Storage Optimization

```solidity
// ❌ BAD - Expensive storage layout
struct Match {
    uint8 status;      // 1 byte
    uint256 startTime; // 32 bytes
    uint8 homeScore;   // 1 byte
    uint256 endTime;   // 32 bytes
}
// Total: 4 storage slots (expensive!)

// ✅ GOOD - Packed storage
struct Match {
    uint256 startTime;  // 32 bytes
    uint256 endTime;    // 32 bytes
    uint8 status;       // 1 byte
    uint8 homeScore;    // 1 byte
    uint8 awayScore;    // 1 byte
    // Packed into 3 slots (saves 1 slot = ~20,000 gas)
}
```

### 2. Function Parameter Optimization

```solidity
// ❌ BAD - Uses memory (copies data)
function processTeams(string memory team1, string memory team2) external {
    // Copies strings to memory = expensive
}

// ✅ GOOD - Uses calldata (reference)
function processTeams(string calldata team1, string calldata team2) external {
    // References calldata = cheap
}
```

### 3. Cache Storage Reads

```solidity
// ❌ BAD - Multiple storage reads
function calculate() external view returns (uint256) {
    uint256 total = matches[id].homeScore + matches[id].awayScore;
    return matches[id].status == 2 ? total : 0;
    // Reads matches[id] from storage 3 times
}

// ✅ GOOD - Cache in memory
function calculate() external view returns (uint256) {
    Match memory m = matches[id];  // Read once
    uint256 total = m.homeScore + m.awayScore;
    return m.status == 2 ? total : 0;
}
```

### 4. Event Usage

```solidity
// ❌ BAD - Store in contract state
mapping(uint256 => HistoryEntry[]) public history;  // Very expensive

// ✅ GOOD - Emit events (off-chain indexing)
event BetPlaced(uint256 indexed matchId, address indexed bettor, uint256 amount);
```

### 5. Compiler Optimization

**hardhat.config.js**:
```javascript
solidity: {
  version: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,  // Balance between deployment and runtime gas
      details: {
        yul: true
      }
    },
    viaIR: true  // Intermediate representation for better optimization
  }
}
```

**Optimization Tradeoffs**:

| Runs | Deployment Gas | Runtime Gas | Use Case |
|------|---------------|-------------|----------|
| 1 | Low | High | Rarely called contracts |
| 200 | Medium | Medium | **Recommended default** |
| 10000 | High | Low | Frequently called contracts |

## Performance Benchmarks

### Gas Cost Targets

| Operation | Target Gas | Max Acceptable |
|-----------|-----------|----------------|
| Contract Deployment | < 3,000,000 | 5,000,000 |
| Create Match | < 200,000 | 500,000 |
| Place Bet | < 150,000 | 300,000 |
| Finish Match | < 100,000 | 200,000 |
| Claim Winnings | < 80,000 | 150,000 |
| View Functions | < 30,000 | 50,000 |

### Running Benchmarks

```bash
# Run gas benchmarks
npm run test:gas

# Generate gas report
REPORT_GAS=true npm test

# Analyze contract sizes
npm run gas:analyze
```

### Example Output:

```
Gas Optimization Benchmarks
────────────────────────────────────────
Deployment gas used: 2,847,239
Create match gas: 187,542
Place bet gas: 142,389
Finish match gas: 89,234
Claim winnings gas: 73,892
────────────────────────────────────────
✅ All operations within gas limits
```

## Security Auditing

### Automated Audit Tools

```bash
# Run all security checks
npm run security:audit

# Individual checks
npm run lint:sol      # Solhint security rules
npm audit             # NPM vulnerabilities
npm outdated          # Dependency updates
```

### Security Checklist

#### Smart Contract Security

- [ ] Reentrancy protection implemented
- [ ] Access control properly configured
- [ ] Input validation on all public functions
- [ ] Integer overflow/underflow checks (Solidity 0.8+)
- [ ] External call safety (checks-effects-interactions)
- [ ] Pull payment pattern for withdrawals
- [ ] DoS protection (rate limiting, gas limits)
- [ ] Emergency pause mechanism
- [ ] Event logging for critical operations
- [ ] Time-dependent logic handled safely

#### Gas & Performance

- [ ] Contract size under 24KB limit
- [ ] Storage variables optimally packed
- [ ] Expensive operations cached
- [ ] Loops bounded and gas-efficient
- [ ] Events used instead of storage where possible
- [ ] Compiler optimization enabled
- [ ] Gas benchmarks passing

#### Testing & Quality

- [ ] >80% test coverage
- [ ] Edge cases tested
- [ ] Negative test cases included
- [ ] Gas benchmarks included
- [ ] Integration tests passing
- [ ] Security tests included

### Security Audit Script

**Location**: `scripts/security-audit.js`

```bash
# Run comprehensive security audit
npm run security:audit

# Output includes:
# ✓ NPM vulnerability scan
# ✓ Dependency check
# ✓ Solidity security linting
# ✓ Hardcoded secrets detection
```

### Manual Audit Points

1. **Access Control Review**
   - Verify owner functions are protected
   - Check oracle authorization logic
   - Validate user permission boundaries

2. **State Machine Verification**
   - Ensure match states transition correctly
   - Verify betting phases are enforced
   - Check claim logic is sound

3. **Financial Logic Audit**
   - Verify payout calculations
   - Check for rounding errors
   - Ensure no funds can be locked

4. **External Dependencies**
   - Review imported libraries
   - Check for known vulnerabilities
   - Verify version compatibility

## Best Practices

### Development Workflow

```bash
# Before committing
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code
npm test               # Run tests
npm run security:audit # Security check

# Pre-commit hooks will automatically run:
# ✓ Linting
# ✓ Formatting check
# ✓ Tests
# ✓ Secret detection
```

### Code Review Checklist

#### For Reviewers

- [ ] Security patterns followed
- [ ] Gas optimization applied
- [ ] Tests comprehensive
- [ ] Documentation updated
- [ ] No hardcoded values
- [ ] Error messages clear
- [ ] Events emitted appropriately

#### For Authors

- [ ] Self-review completed
- [ ] Tests passing locally
- [ ] Gas benchmarks checked
- [ ] Security checklist reviewed
- [ ] Documentation added
- [ ] Breaking changes documented

### Deployment Safety

```bash
# Pre-deployment checklist
1. Run full test suite: npm test
2. Run security audit: npm run security:audit
3. Check gas costs: REPORT_GAS=true npm test
4. Verify contract size: npm run gas:analyze
5. Review deployment script
6. Test on testnet first
7. Verify source code on Etherscan
8. Set up monitoring
```

### Emergency Response

#### If Vulnerability Discovered

1. **Immediate**: Pause contract (if pausable)
```bash
npm run interact:sepolia
# Then call: contract.pause()
```

2. **Assess**: Review scope and impact

3. **Fix**: Deploy patched version

4. **Migrate**: If upgradeable, upgrade; otherwise deploy new

5. **Notify**: Inform users and stakeholders

6. **Post-Mortem**: Document and learn

#### Contact Information

- **Security Issues**: Report to `security@example.com`
- **Bug Bounty**: See `SECURITY.md`
- **Emergency Contact**: Available in `.env`

## Tools Integration Stack

### Complete Toolchain

```
Development Layer
├── Hardhat          (Smart contract framework)
├── Solhint          (Solidity linting)
├── ESLint           (JavaScript linting)
├── Prettier         (Code formatting)
├── Gas Reporter     (Gas cost analysis)
└── Optimizer        (Compiler optimization)
         ↓
Security Layer
├── ReentrancyGuard  (Reentrancy protection)
├── Pausable         (Emergency stops)
├── RateLimiter      (DoS protection)
├── Access Control   (Permissions)
└── Security Audit   (Automated checks)
         ↓
Testing Layer
├── Mocha/Chai       (Test framework)
├── Coverage         (Code coverage)
├── Gas Benchmarks   (Performance tests)
└── Integration      (End-to-end tests)
         ↓
CI/CD Layer
├── GitHub Actions   (Automation)
├── Pre-commit Hooks (Quality gates)
├── Codecov          (Coverage tracking)
└── Monitoring       (Production alerts)
```

### Configuration Files

| File | Purpose |
|------|---------|
| `.solhint.json` | Solidity linting rules |
| `.eslintrc.json` | JavaScript linting rules |
| `.prettierrc.yml` | Code formatting rules |
| `.solcover.js` | Coverage configuration |
| `.codecov.yml` | Coverage reporting |
| `.husky/` | Git hooks |
| `hardhat.config.js` | Hardhat & optimizer settings |
| `.env.example` | Environment variables template |

## Additional Resources

- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/4.x/api/security)
- [Solidity Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [Gas Optimization Tips](https://github.com/ethereum/solidity/issues)

---

**Last Updated**: 2025-01-15

For security concerns, please email: security@example.com
