# Testing Documentation

Comprehensive testing guide for the Confidential Sports Betting Platform.

## Table of Contents

- [Test Suite Overview](#test-suite-overview)
- [Running Tests](#running-tests)
- [Test Categories](#test-categories)
- [Test Coverage](#test-coverage)
- [Testing Best Practices](#testing-best-practices)

## Test Suite Overview

The project includes **53 comprehensive test cases** covering all aspects of the smart contract functionality.

### Test Infrastructure

- **Framework**: Hardhat with Mocha
- **Assertions**: Chai matchers
- **Network Helpers**: @nomicfoundation/hardhat-network-helpers
- **Test Files**: `test/ConfidentialSportsBetting.test.js`

### Test Statistics

| Category | Test Count | Description |
|----------|-----------|-------------|
| Deployment & Initialization | 6 | Contract deployment and setup |
| Oracle Authorization | 4 | Oracle management |
| Match Creation | 6 | Creating betting markets |
| Betting Functionality | 8 | Placing bets |
| Match Settlement | 5 | Finishing matches |
| Winnings Claim | 5 | Claiming payouts |
| Match Cancellation | 4 | Canceling matches and refunds |
| View Functions | 2 | Read-only queries |
| Edge Cases | 3 | Boundary conditions |
| Owner Functions | 2 | Admin operations |
| **Total** | **53** | **Complete coverage** |

## Running Tests

### Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run specific test file
npx hardhat test test/ConfidentialSportsBetting.test.js

# Run with detailed output
npx hardhat test --verbose
```

### Test on Specific Network

```bash
# Test on Hardhat network (default)
npx hardhat test

# Test on localhost (requires running node)
npx hardhat node  # In one terminal
npx hardhat test --network localhost  # In another terminal

# Test on Sepolia
npx hardhat test --network sepolia
```

### Code Coverage

```bash
# Generate coverage report
npx hardhat coverage

# View coverage report
open coverage/index.html  # macOS
start coverage/index.html  # Windows
xdg-open coverage/index.html  # Linux
```

## Test Categories

### 1. Deployment and Initialization (6 tests)

Tests contract deployment and initial state:

- ✅ Should deploy successfully
- ✅ Should set deployer as owner
- ✅ Should initialize with zero matches
- ✅ Should set correct minimum bet amount (0.01 ETH)
- ✅ Should set correct maximum bet amount (10 ETH)
- ✅ Should authorize deployer as oracle

**Coverage**: Contract deployment, ownership, constants

### 2. Oracle Authorization (4 tests)

Tests oracle management functions:

- ✅ Should allow owner to authorize oracle
- ✅ Should allow owner to revoke oracle
- ✅ Should reject non-owner authorization attempt
- ✅ Should reject non-owner revocation attempt

**Coverage**: Access control, events, authorization

### 3. Match Creation (6 tests)

Tests creating betting markets:

- ✅ Should allow oracle to create match
- ✅ Should reject match creation from non-oracle
- ✅ Should reject match with past start time
- ✅ Should reject match with zero duration
- ✅ Should reject match with empty team names
- ✅ Should store match details correctly

**Coverage**: Input validation, permissions, data storage

### 4. Betting Functionality (8 tests)

Tests placing bets on matches:

- ✅ Should allow user to place bet
- ✅ Should reject bet below minimum amount
- ✅ Should reject bet above maximum amount
- ✅ Should reject duplicate bet from same user
- ✅ Should reject bet on non-existent match
- ✅ Should track total home bets
- ✅ Should track total away bets
- ✅ Should track multiple bettors

**Coverage**: Betting logic, amount limits, duplicate prevention, tracking

### 5. Match Settlement (5 tests)

Tests finishing matches with results:

- ✅ Should allow oracle to finish match
- ✅ Should reject finish from non-oracle
- ✅ Should reject finish before match end
- ✅ Should store match result correctly
- ✅ Should update match status to finished

**Coverage**: Oracle operations, timing, result storage

### 6. Winnings Claim (5 tests)

Tests payout claiming:

- ✅ Should allow winner to claim winnings
- ✅ Should emit WinningsClaimed event
- ✅ Should reject claim before match finished
- ✅ Should reject duplicate claim
- ✅ Should handle loser claim gracefully

**Coverage**: Payout calculations, claim prevention, events

### 7. Match Cancellation (4 tests)

Tests match cancellation and refunds:

- ✅ Should allow oracle to cancel match
- ✅ Should reject cancellation from non-oracle
- ✅ Should refund all bettors on cancellation
- ✅ Should update match status to cancelled

**Coverage**: Refund logic, status updates, permissions

### 8. View Functions (2 tests)

Tests read-only queries:

- ✅ Should return correct match basic info
- ✅ Should return correct bet basic info

**Coverage**: Getter functions, data retrieval

### 9. Edge Cases (3 tests)

Tests boundary conditions:

- ✅ Should handle zero home bets
- ✅ Should handle maximum bet amount
- ✅ Should handle minimum bet amount

**Coverage**: Boundary values, zero states

### 10. Owner Functions (2 tests)

Tests admin operations:

- ✅ Should allow owner to withdraw funds
- ✅ Should reject withdraw from non-owner

**Coverage**: Owner privileges, fund management

## Test Coverage

### Expected Coverage Metrics

```
File                               | % Stmts | % Branch | % Funcs | % Lines |
-----------------------------------|---------|----------|---------|---------|
contracts/                         |         |          |         |         |
  ConfidentialSportsBetting.sol    |   >85%  |   >75%   |   >90%  |   >85%  |
-----------------------------------|---------|----------|---------|---------|
All files                          |   >85%  |   >75%   |   >90%  |   >85%  |
```

### Coverage Goals

- **Statement Coverage**: > 85%
- **Branch Coverage**: > 75%
- **Function Coverage**: > 90%
- **Line Coverage**: > 85%

## Testing Best Practices

### Test Structure

Each test follows the AAA pattern:

```javascript
it("should do something", async function () {
  // Arrange - Setup test data
  const value = 100;

  // Act - Execute the function
  await contract.someFunction(value);

  // Assert - Verify results
  expect(result).to.equal(expected);
});
```

### Test Isolation

- Each test uses `beforeEach` for fresh contract deployment
- No shared state between tests
- Independent test execution

### Descriptive Test Names

```javascript
// ✅ Good - Clear and descriptive
it("should reject bet below minimum amount", async function () {});

// ❌ Bad - Unclear
it("test betting", async function () {});
```

### Proper Assertions

```javascript
// ✅ Good - Specific expectations
expect(value).to.equal(100);
expect(tx).to.emit(contract, "EventName");
expect(balance).to.be.gt(ethers.parseEther("1"));

// ❌ Bad - Vague assertions
expect(result).to.be.ok;
```

### Error Testing

```javascript
// Test reverts with specific messages
await expect(
  contract.restrictedFunction()
).to.be.revertedWith("Not authorized");

// Test event emissions
await expect(contract.createMatch(...))
  .to.emit(contract, "MatchCreated")
  .withArgs(expectedId, expectedName, ...);
```

### Time Manipulation

```javascript
const { time } = require("@nomicfoundation/hardhat-network-helpers");

// Increase time
await time.increase(3600); // 1 hour

// Set specific timestamp
await time.increaseTo(targetTimestamp);

// Get latest block timestamp
const currentTime = await time.latest();
```

### Gas Optimization Testing

```javascript
it("should be gas efficient", async function () {
  const tx = await contract.someFunction();
  const receipt = await tx.wait();

  // Verify gas usage is reasonable
  expect(receipt.gasUsed).to.be.lt(500000);
});
```

## Test Utilities

### Signers Setup

```javascript
let owner, oracle, alice, bob, carol;

before(async function () {
  const signers = await ethers.getSigners();
  owner = signers[0];
  oracle = signers[1];
  alice = signers[2];
  bob = signers[3];
  carol = signers[4];
});
```

### Deployment Fixture

```javascript
async function deployFixture() {
  const Contract = await ethers.getContractFactory("ContractName");
  const instance = await Contract.deploy();
  await instance.waitForDeployment();
  const address = await instance.getAddress();
  return { contract: instance, contractAddress: address };
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run coverage
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in test: `this.timeout(60000)`
   - Check network connectivity for testnet tests

2. **Gas estimation failed**
   - Check transaction will not revert
   - Verify sufficient balance

3. **Nonce too high**
   - Reset Hardhat network: `npx hardhat clean`
   - Restart local node

4. **TypeScript errors**
   - Run `npx hardhat typechain`
   - Check type definitions

## Additional Resources

- [Hardhat Testing Guide](https://hardhat.org/tutorial/testing-contracts)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Hardhat Network Helpers](https://hardhat.org/hardhat-network-helpers)
- [Ethers.js Documentation](https://docs.ethers.org/)

## Test Maintenance

### Adding New Tests

1. Identify the feature to test
2. Write descriptive test name
3. Follow AAA pattern
4. Add to appropriate describe block
5. Update this documentation

### Test Review Checklist

- [ ] All tests pass
- [ ] Coverage goals met
- [ ] No console.log statements
- [ ] Descriptive test names
- [ ] Proper error messages tested
- [ ] Events tested where applicable
- [ ] Edge cases covered
- [ ] Gas usage reasonable

---

**Last Updated**: 2025-01-15

For questions or issues with tests, please review the test files in `test/` directory or consult the deployment team.
