const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

console.log("=".repeat(60));
console.log("Gas Optimization Analysis");
console.log("=".repeat(60));

async function analyzeGasUsage() {
  console.log("\nCompiling contracts...");
  await hre.run("compile");

  console.log("\n" + "=".repeat(60));
  console.log("Contract Size Analysis");
  console.log("=".repeat(60));

  const artifactsPath = path.join(__dirname, "..", "artifacts", "contracts");

  if (!fs.existsSync(artifactsPath)) {
    console.error("❌ Artifacts not found. Run 'npm run compile' first.");
    process.exit(1);
  }

  const contracts = [];

  function findContracts(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.includes(".dbg.sol")) {
        findContracts(fullPath);
      } else if (file.endsWith(".json") && !file.endsWith(".dbg.json")) {
        const artifact = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        if (artifact.bytecode && artifact.bytecode !== "0x") {
          const bytecodeSize = (artifact.bytecode.length - 2) / 2; // Remove 0x and divide by 2
          const sizeInKB = (bytecodeSize / 1024).toFixed(2);

          contracts.push({
            name: artifact.contractName,
            size: bytecodeSize,
            sizeKB: sizeInKB,
            deployedBytecode: artifact.deployedBytecode
          });
        }
      }
    }
  }

  findContracts(artifactsPath);

  // Sort by size
  contracts.sort((a, b) => b.size - a.size);

  console.log("\nContract Sizes:");
  console.log("-".repeat(60));
  console.log("Contract Name".padEnd(40) + "Size".padEnd(15) + "Status");
  console.log("-".repeat(60));

  const MAX_SIZE_KB = 24; // EIP-170 limit
  const WARNING_SIZE_KB = 20;

  for (const contract of contracts) {
    const sizeNum = parseFloat(contract.sizeKB);
    let status = "✅ OK";

    if (sizeNum > MAX_SIZE_KB) {
      status = "❌ TOO LARGE";
    } else if (sizeNum > WARNING_SIZE_KB) {
      status = "⚠️  WARNING";
    }

    console.log(
      contract.name.padEnd(40) +
      `${contract.sizeKB} KB`.padEnd(15) +
      status
    );
  }

  console.log("\n" + "=".repeat(60));
  console.log("Gas Optimization Recommendations");
  console.log("=".repeat(60));

  const recommendations = [
    "✓ Use 'calldata' instead of 'memory' for external function parameters",
    "✓ Cache storage variables in memory to reduce SLOAD operations",
    "✓ Use events instead of storage for data that doesn't need to be queried",
    "✓ Pack struct variables to save storage slots",
    "✓ Use 'uint256' instead of smaller uints (uint8, uint16) in structs",
    "✓ Avoid loops with unbounded iterations (DoS risk)",
    "✓ Use 'immutable' for variables set once in constructor",
    "✓ Use 'constant' for compile-time constants",
    "✓ Short-circuit boolean operations (use && and ||)",
    "✓ Remove unused code and imports"
  ];

  recommendations.forEach(rec => console.log(rec));

  console.log("\n" + "=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));

  const oversizedContracts = contracts.filter(c => parseFloat(c.sizeKB) > MAX_SIZE_KB);
  const warningContracts = contracts.filter(c => {
    const size = parseFloat(c.sizeKB);
    return size > WARNING_SIZE_KB && size <= MAX_SIZE_KB;
  });

  console.log(`Total contracts analyzed: ${contracts.length}`);
  console.log(`Contracts over ${MAX_SIZE_KB}KB limit: ${oversizedContracts.length}`);
  console.log(`Contracts near limit (${WARNING_SIZE_KB}-${MAX_SIZE_KB}KB): ${warningContracts.length}`);

  if (oversizedContracts.length > 0) {
    console.log("\n❌ Some contracts exceed the 24KB size limit!");
    console.log("Consider:");
    console.log("  - Splitting into multiple contracts");
    console.log("  - Using libraries");
    console.log("  - Removing unnecessary code");
    console.log("  - Optimizing data structures");
    process.exit(1);
  } else if (warningContracts.length > 0) {
    console.log("\n⚠️  Some contracts are approaching the size limit.");
    console.log("Monitor these contracts for future growth.");
  } else {
    console.log("\n✅ All contracts are within size limits!");
  }
}

analyzeGasUsage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Gas analysis failed:", error);
    process.exit(1);
  });
