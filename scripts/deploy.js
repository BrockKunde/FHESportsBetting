const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(50));
  console.log("Confidential Sports Betting Platform - Deployment");
  console.log("=".repeat(50));

  const [deployer] = await hre.ethers.getSigners();
  console.log("\nDeployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  const network = hre.network.name;
  console.log("Network:", network);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());

  if (balance === 0n) {
    console.error("\n❌ Insufficient balance. Please fund the deployer account.");
    process.exit(1);
  }

  console.log("\n" + "=".repeat(50));
  console.log("Deploying Contracts...");
  console.log("=".repeat(50));

  let deploymentData = {
    network: network,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {}
  };

  try {
    console.log("\n[1/1] Deploying ConfidentialSportsBetting...");
    const ConfidentialSportsBetting = await hre.ethers.getContractFactory("ConfidentialSportsBetting");

    console.log("Estimating gas...");
    const deploymentTx = await ConfidentialSportsBetting.getDeployTransaction();
    const estimatedGas = await hre.ethers.provider.estimateGas(deploymentTx);
    console.log("Estimated gas:", estimatedGas.toString());

    const bettingContract = await ConfidentialSportsBetting.deploy();
    console.log("Transaction hash:", bettingContract.deploymentTransaction().hash);
    console.log("Waiting for confirmations...");

    await bettingContract.waitForDeployment();
    const bettingAddress = await bettingContract.getAddress();

    console.log("✅ ConfidentialSportsBetting deployed to:", bettingAddress);

    deploymentData.contracts.ConfidentialSportsBetting = {
      address: bettingAddress,
      transactionHash: bettingContract.deploymentTransaction().hash,
      blockNumber: bettingContract.deploymentTransaction().blockNumber,
      constructorArgs: []
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const deploymentFile = path.join(deploymentsDir, `${network}-${timestamp}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));

    const latestFile = path.join(deploymentsDir, `${network}-latest.json`);
    fs.writeFileSync(latestFile, JSON.stringify(deploymentData, null, 2));

    console.log("\n" + "=".repeat(50));
    console.log("Deployment Summary");
    console.log("=".repeat(50));
    console.log("Network:", network);
    console.log("ConfidentialSportsBetting:", bettingAddress);
    console.log("Deployment data saved to:", deploymentFile);

    if (network !== "hardhat" && network !== "localhost") {
      console.log("\n" + "=".repeat(50));
      console.log("Contract Verification");
      console.log("=".repeat(50));
      console.log("\nWaiting for block confirmations before verification...");

      const confirmations = network === "mainnet" ? 6 : 2;
      await bettingContract.deploymentTransaction().wait(confirmations);
      console.log(`✅ ${confirmations} confirmations received`);

      console.log("\nTo verify the contract on Etherscan, run:");
      console.log(`npx hardhat run scripts/verify.js --network ${network}`);

      console.log("\nOr manually verify with:");
      console.log(`npx hardhat verify --network ${network} ${bettingAddress}`);

      const etherscanBase = network === "mainnet"
        ? "https://etherscan.io"
        : `https://${network}.etherscan.io`;

      console.log("\n" + "=".repeat(50));
      console.log("Etherscan Links");
      console.log("=".repeat(50));
      console.log("Contract:", `${etherscanBase}/address/${bettingAddress}`);
      console.log("Transaction:", `${etherscanBase}/tx/${bettingContract.deploymentTransaction().hash}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("Next Steps");
    console.log("=".repeat(50));
    console.log("1. Verify the contract: npx hardhat run scripts/verify.js --network", network);
    console.log("2. Interact with contract: npx hardhat run scripts/interact.js --network", network);
    console.log("3. Run simulations: npx hardhat run scripts/simulate.js --network", network);
    console.log("4. Update frontend with new contract address");
    console.log("5. Test all contract functions");

    console.log("\n✅ Deployment completed successfully!\n");

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);

    deploymentData.error = error.message;
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    const timestamp = Date.now();
    const failedFile = path.join(deploymentsDir, `${network}-failed-${timestamp}.json`);
    fs.writeFileSync(failedFile, JSON.stringify(deploymentData, null, 2));

    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
