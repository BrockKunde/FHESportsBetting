# Deployment Guide

Complete deployment guide for the Confidential Sports Betting Platform on Ethereum networks.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Compilation](#compilation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Verification](#verification)
- [Interaction](#interaction)
- [Network Information](#network-information)

## Prerequisites

### Required Software

- Node.js v18+ and npm
- Git
- A code editor (VS Code recommended)

### Required Accounts

- Ethereum wallet with private key
- Infura/Alchemy account for RPC access
- Etherscan account for API key

### Funding

- Sepolia Testnet: Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Mainnet: Real ETH required

## Environment Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Gas reporting
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

### 3. Security Check

Ensure `.env` is in `.gitignore`:

```bash
echo ".env" >> .gitignore
```

Never commit your `.env` file to version control!

## Compilation

Compile the smart contracts:

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Compilation Configuration

The project uses advanced compiler settings in `hardhat.config.js`:

- Solidity version: 0.8.24
- Optimizer: Enabled (200 runs)
- EVM version: Cancun
- Via IR: Enabled for better optimization

## Testing

### Run All Tests

```bash
npx hardhat test
```

### Run Specific Test File

```bash
npx hardhat test test/ConfidentialSportsBetting.test.js
```

### Generate Gas Report

```bash
REPORT_GAS=true npx hardhat test
```

### Run Simulation

Test the complete betting workflow on local network:

```bash
npx hardhat run scripts/simulate.js --network localhost
```

First, start a local node in another terminal:

```bash
npx hardhat node
```

## Deployment

### Deploy to Sepolia Testnet

1. Ensure you have test ETH in your wallet
2. Check your balance:

```bash
npx hardhat run scripts/interact.js --network sepolia
```

3. Deploy the contracts:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
==================================================
Confidential Sports Betting Platform - Deployment
==================================================

Deployer address: 0x...
Deployer balance: 0.5 ETH
Network: sepolia
Chain ID: 11155111

==================================================
Deploying Contracts...
==================================================

[1/1] Deploying ConfidentialSportsBetting...
Estimating gas...
Estimated gas: 2847239
Transaction hash: 0x...
Waiting for confirmations...
✅ ConfidentialSportsBetting deployed to: 0x...

==================================================
Deployment Summary
==================================================
Network: sepolia
ConfidentialSportsBetting: 0x...
Deployment data saved to: deployments/sepolia-1234567890.json

==================================================
Contract Verification
==================================================

Waiting for block confirmations before verification...
✅ 2 confirmations received

To verify the contract on Etherscan, run:
npx hardhat run scripts/verify.js --network sepolia

==================================================
Etherscan Links
==================================================
Contract: https://sepolia.etherscan.io/address/0x...
Transaction: https://sepolia.etherscan.io/tx/0x...

✅ Deployment completed successfully!
```

4. Save the contract address from the output

### Deploy to Mainnet

**WARNING:** This deploys to real Ethereum mainnet with real ETH!

1. Triple-check your configuration
2. Ensure sufficient ETH for deployment and gas
3. Deploy:

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Deployment Artifacts

Deployment data is saved in `deployments/`:

- `{network}-{timestamp}.json` - Full deployment record
- `{network}-latest.json` - Latest deployment for quick access
- `{network}-failed-{timestamp}.json` - Failed deployments for debugging

Example deployment file:
```json
{
  "network": "sepolia",
  "chainId": "11155111",
  "deployer": "0x...",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "contracts": {
    "ConfidentialSportsBetting": {
      "address": "0x...",
      "transactionHash": "0x...",
      "blockNumber": 12345678,
      "constructorArgs": []
    }
  }
}
```

## Verification

### Automatic Verification

Verify contracts on Etherscan:

```bash
npx hardhat run scripts/verify.js --network sepolia
```

Expected output:
```
==================================================
Contract Verification on Etherscan
==================================================

Network: sepolia

Loaded deployment from: deployments/sepolia-latest.json
Deployed at: 2025-01-15T10:30:00.000Z

==================================================
Verifying Contracts...
==================================================

[1/1] Verifying ConfidentialSportsBetting...
Address: 0x...
Constructor arguments: []
✅ ConfidentialSportsBetting verified successfully!

==================================================
Verification Summary
==================================================

ConfidentialSportsBetting:
  Status: success
  Address: 0x...
  View on Etherscan: https://sepolia.etherscan.io/address/0x...#code

✅ Verification process completed!
```

### Manual Verification

If automatic verification fails:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Verify on Etherscan Website

1. Go to Etherscan contract page
2. Click "Contract" tab
3. Click "Verify and Publish"
4. Fill in:
   - Compiler: v0.8.24
   - Optimization: Yes, 200 runs
   - License: MIT
5. Paste contract source code
6. Click "Verify and Publish"

## Interaction

### View Contract Information

```bash
npx hardhat run scripts/interact.js --network sepolia
```

This displays:
- Contract address
- Owner address
- Current match count
- Minimum/maximum bet amounts
- Available functions

### Custom Interactions

Edit `scripts/interact.js` to call specific functions:

```javascript
// Example: Create a match
const tx = await contract.createMatch(
  "Liverpool",
  "Manchester United",
  Math.floor(Date.now()/1000) + 3600,  // Start in 1 hour
  7200,  // 2 hours duration
  5,     // Target total
  1      // Handicap value
);
await tx.wait();
console.log("Match created!");
```

### Hardhat Console

Interactive console for contract interaction:

```bash
npx hardhat console --network sepolia
```

```javascript
const contract = await ethers.getContractAt("ConfidentialSportsBetting", "0x...");
const matchId = await contract.currentMatchId();
console.log("Current match:", matchId.toString());
```

## Network Information

### Sepolia Testnet

- **Network Name:** Sepolia
- **Chain ID:** 11155111
- **RPC URL:** https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer:** https://sepolia.etherscan.io
- **Faucets:**
  - https://sepoliafaucet.com
  - https://faucet.sepolia.dev

### Ethereum Mainnet

- **Network Name:** Mainnet
- **Chain ID:** 1
- **RPC URL:** https://mainnet.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer:** https://etherscan.io

### Gas Optimization

- Use Sepolia for testing to minimize costs
- Deploy during low network usage (weekends/late night UTC)
- Monitor gas prices: https://etherscan.io/gastracker
- Optimize contract before mainnet deployment

## Contract Addresses

### Sepolia Testnet

Replace with your deployed addresses:

```
ConfidentialSportsBetting: 0x...
```

### Mainnet

```
ConfidentialSportsBetting: Not deployed yet
```

## Troubleshooting

### Common Issues

1. **Insufficient funds**
   - Ensure wallet has enough ETH for deployment and gas
   - Get test ETH from faucets for testnets

2. **RPC connection errors**
   - Verify RPC URL in `.env`
   - Check Infura/Alchemy project status
   - Try alternative RPC providers

3. **Verification failed**
   - Wait a few minutes after deployment
   - Check constructor arguments match deployment
   - Verify compiler settings match exactly

4. **Gas estimation failed**
   - Increase gas limit in hardhat.config.js
   - Check contract logic for reverts
   - Ensure sufficient ETH balance

5. **Nonce too high/low**
   - Reset Metamask account: Settings > Advanced > Reset Account
   - Check for pending transactions

### Getting Help

- Review Hardhat documentation: https://hardhat.org/docs
- Check Etherscan status: https://etherscan.io/status
- Review transaction on block explorer
- Check contract events and logs

## Security Considerations

1. **Private Key Security**
   - Never commit `.env` to git
   - Use hardware wallet for mainnet
   - Consider multi-sig for contract ownership

2. **Pre-Deployment Checklist**
   - [ ] All tests passing
   - [ ] Security audit completed
   - [ ] Gas optimization reviewed
   - [ ] Emergency procedures documented
   - [ ] Monitoring setup complete

3. **Post-Deployment**
   - Monitor contract events
   - Set up alerting for unusual activity
   - Keep deployment keys secure
   - Document all admin actions

## Maintenance

### Upgrading

This contract is non-upgradeable. To update:

1. Deploy new version
2. Migrate state if needed
3. Update frontend with new address
4. Deprecate old contract

### Monitoring

- Watch contract events on Etherscan
- Set up alerts for admin functions
- Monitor transaction volume
- Track gas usage

## Additional Resources

- Hardhat Documentation: https://hardhat.org
- Ethers.js Documentation: https://docs.ethers.org
- Solidity Documentation: https://docs.soliditylang.org
- OpenZeppelin Contracts: https://docs.openzeppelin.com

## Support

For issues or questions:
1. Check documentation
2. Review deployment artifacts
3. Examine transaction on block explorer
4. Contact development team
