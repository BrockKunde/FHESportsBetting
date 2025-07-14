const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(50));
  console.log("Contract Verification on Etherscan");
  console.log("=".repeat(50));

  const network = hre.network.name;
  console.log("\nNetwork:", network);

  if (network === "hardhat" || network === "localhost") {
    console.log("❌ Cannot verify on local network");
    process.exit(1);
  }

  // Load deployment data
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const latestFile = path.join(deploymentsDir, `${network}-latest.json`);

  if (!fs.existsSync(latestFile)) {
    console.error("❌ No deployment found for network:", network);
    console.log("Please deploy first: npx hardhat run scripts/deploy.js --network", network);
    process.exit(1);
  }

  const deploymentData = JSON.parse(fs.readFileSync(latestFile, "utf8"));
  console.log("\nLoaded deployment from:", latestFile);
  console.log("Deployed at:", deploymentData.timestamp);

  const contracts = deploymentData.contracts;

  console.log("\n" + "=".repeat(50));
  console.log("Verifying Contracts...");
  console.log("=".repeat(50));

  let verificationResults = {
    network: network,
    timestamp: new Date().toISOString(),
    results: {}
  };

  // Verify ConfidentialSportsBetting
  if (contracts.ConfidentialSportsBetting) {
    const contract = contracts.ConfidentialSportsBetting;
    console.log("\n[1/1] Verifying ConfidentialSportsBetting...");
    console.log("Address:", contract.address);
    console.log("Constructor arguments:", JSON.stringify(contract.constructorArgs));

    try {
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
        contract: "contracts/ConfidentialSportsBetting.sol:ConfidentialSportsBetting"
      });

      console.log("✅ ConfidentialSportsBetting verified successfully!");
      verificationResults.results.ConfidentialSportsBetting = {
        status: "success",
        address: contract.address
      };

    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ Contract already verified!");
        verificationResults.results.ConfidentialSportsBetting = {
          status: "already_verified",
          address: contract.address
        };
      } else {
        console.error("❌ Verification failed:", error.message);
        verificationResults.results.ConfidentialSportsBetting = {
          status: "failed",
          address: contract.address,
          error: error.message
        };
      }
    }
  }

  // Save verification results
  const verificationFile = path.join(deploymentsDir, `${network}-verification.json`);
  fs.writeFileSync(verificationFile, JSON.stringify(verificationResults, null, 2));

  console.log("\n" + "=".repeat(50));
  console.log("Verification Summary");
  console.log("=".repeat(50));

  const etherscanBase = network === "mainnet"
    ? "https://etherscan.io"
    : `https://${network}.etherscan.io`;

  Object.entries(verificationResults.results).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log("  Status:", result.status);
    console.log("  Address:", result.address);
    console.log("  View on Etherscan:", `${etherscanBase}/address/${result.address}#code`);
  });

  console.log("\nVerification results saved to:", verificationFile);
  console.log("\n✅ Verification process completed!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
