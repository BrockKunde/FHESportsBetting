const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas Optimization Benchmarks", function () {
  let contract;
  let owner;
  let oracle;
  let alice;

  const GAS_LIMITS = {
    deployment: 5000000,      // 5M gas for deployment
    createMatch: 500000,      // 500k gas for match creation
    placeBet: 300000,         // 300k gas for placing bet
    finishMatch: 200000,      // 200k gas for finishing match
    claimWinnings: 150000     // 150k gas for claiming
  };

  before(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    oracle = signers[1];
    alice = signers[2];
  });

  describe("Deployment Gas Cost", function () {
    it("should deploy within gas limit", async function () {
      const ConfidentialSportsBetting = await ethers.getContractFactory("ConfidentialSportsBetting");
      const deployTx = await ConfidentialSportsBetting.deploy();
      const receipt = await deployTx.deploymentTransaction().wait();

      console.log(`    Deployment gas used: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(GAS_LIMITS.deployment);
    });
  });

  describe("Operation Gas Costs", function () {
    beforeEach(async function () {
      const ConfidentialSportsBetting = await ethers.getContractFactory("ConfidentialSportsBetting");
      contract = await ConfidentialSportsBetting.deploy();
      await contract.waitForDeployment();

      await contract.connect(owner).authorizeOracle(oracle.address);
    });

    it("should create match within gas limit", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const tx = await contract.connect(oracle).createMatch(
        "Liverpool",
        "Chelsea",
        currentTime + 3600,
        7200,
        5,
        1
      );
      const receipt = await tx.wait();

      console.log(`    Create match gas: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(GAS_LIMITS.createMatch);
    });

    it("should place bet within gas limit", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = currentTime + 100;

      await contract.connect(oracle).createMatch(
        "Arsenal",
        "Tottenham",
        startTime,
        7200,
        5,
        1
      );

      await ethers.provider.send("evm_increaseTime", [101]);
      await ethers.provider.send("evm_mine");

      const tx = await contract.connect(alice).placeBet(
        1,
        0,
        0,
        2,
        { value: ethers.parseEther("0.1") }
      );
      const receipt = await tx.wait();

      console.log(`    Place bet gas: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(GAS_LIMITS.placeBet);
    });

    it("should finish match within gas limit", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = currentTime + 100;

      await contract.connect(oracle).createMatch(
        "Barcelona",
        "Real Madrid",
        startTime,
        3600,
        5,
        1
      );

      await ethers.provider.send("evm_increaseTime", [3700]);
      await ethers.provider.send("evm_mine");

      const tx = await contract.connect(oracle).finishMatch(1, 3, 1);
      const receipt = await tx.wait();

      console.log(`    Finish match gas: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(GAS_LIMITS.finishMatch);
    });

    it("should claim winnings within gas limit", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = currentTime + 100;
      const endTime = startTime + 3600;

      await contract.connect(oracle).createMatch(
        "PSG",
        "Bayern",
        startTime,
        3600,
        5,
        1
      );

      await ethers.provider.send("evm_increaseTime", [101]);
      await ethers.provider.send("evm_mine");

      await contract.connect(alice).placeBet(1, 0, 0, 2, { value: ethers.parseEther("0.1") });

      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");

      await contract.connect(oracle).finishMatch(1, 3, 1);

      const tx = await contract.connect(alice).claimWinnings(1);
      const receipt = await tx.wait();

      console.log(`    Claim winnings gas: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(GAS_LIMITS.claimWinnings);
    });
  });

  describe("Gas Optimization Verification", function () {
    beforeEach(async function () {
      const ConfidentialSportsBetting = await ethers.getContractFactory("ConfidentialSportsBetting");
      contract = await ConfidentialSportsBetting.deploy();
      await contract.waitForDeployment();

      await contract.connect(owner).authorizeOracle(oracle.address);
    });

    it("should use minimal gas for view functions", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      await contract.connect(oracle).createMatch("TeamA", "TeamB", currentTime + 3600, 7200, 5, 1);

      // View functions should use minimal gas
      const gasEstimate = await contract.getMatchBasicInfo.estimateGas(1);
      console.log(`    View function gas: ${gasEstimate.toString()}`);

      expect(gasEstimate).to.be.lt(50000); // View functions should be cheap
    });

    it("should batch operations efficiently", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = currentTime + 100;

      // Create match
      await contract.connect(oracle).createMatch("Team1", "Team2", startTime, 3600, 5, 1);

      await ethers.provider.send("evm_increaseTime", [101]);
      await ethers.provider.send("evm_mine");

      // Place multiple bets and measure total gas
      const signers = await ethers.getSigners();
      let totalGas = 0n;

      for (let i = 0; i < 3; i++) {
        const tx = await contract.connect(signers[i + 2]).placeBet(
          1,
          0,
          0,
          2,
          { value: ethers.parseEther("0.1") }
        );
        const receipt = await tx.wait();
        totalGas += receipt.gasUsed;
      }

      const avgGas = totalGas / 3n;
      console.log(`    Average gas per bet: ${avgGas.toString()}`);

      // Later bets should not cost significantly more
      expect(avgGas).to.be.lt(GAS_LIMITS.placeBet);
    });
  });
});
