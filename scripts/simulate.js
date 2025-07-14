const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("=".repeat(50));
  console.log("Sports Betting Simulation");
  console.log("=".repeat(50));

  const network = hre.network.name;
  console.log("\nNetwork:", network);

  if (network !== "hardhat" && network !== "localhost") {
    console.log("⚠️  Warning: Running simulation on", network);
    console.log("This will create real transactions. Press Ctrl+C to cancel.\n");
    await sleep(5000);
  }

  // Get signers
  const [deployer, bettor1, bettor2, bettor3, oracle] = await hre.ethers.getSigners();

  console.log("\nAccounts:");
  console.log("Deployer/Owner:", deployer.address);
  console.log("Bettor 1:", bettor1.address);
  console.log("Bettor 2:", bettor2.address);
  console.log("Bettor 3:", bettor3.address);
  console.log("Oracle:", oracle.address);

  // Deploy or load contract
  let contractAddress;
  let contract;

  if (network === "hardhat" || network === "localhost") {
    console.log("\n" + "=".repeat(50));
    console.log("Deploying Contract for Simulation...");
    console.log("=".repeat(50));

    const ConfidentialSportsBetting = await hre.ethers.getContractFactory("ConfidentialSportsBetting");
    contract = await ConfidentialSportsBetting.deploy();
    await contract.waitForDeployment();
    contractAddress = await contract.getAddress();
    console.log("Contract deployed to:", contractAddress);

  } else {
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    const latestFile = path.join(deploymentsDir, `${network}-latest.json`);

    if (!fs.existsSync(latestFile)) {
      console.error("❌ No deployment found. Deploy first or run on localhost.");
      process.exit(1);
    }

    const deploymentData = JSON.parse(fs.readFileSync(latestFile, "utf8"));
    contractAddress = deploymentData.contracts.ConfidentialSportsBetting.address;

    const ConfidentialSportsBetting = await hre.ethers.getContractFactory("ConfidentialSportsBetting");
    contract = ConfidentialSportsBetting.attach(contractAddress);
    console.log("Using deployed contract at:", contractAddress);
  }

  console.log("\n" + "=".repeat(50));
  console.log("Simulation Scenario: Football Match Betting");
  console.log("=".repeat(50));

  try {
    // Step 1: Authorize oracle
    console.log("\n[Step 1] Authorizing oracle...");
    const authTx = await contract.connect(deployer).authorizeOracle(oracle.address);
    await authTx.wait();
    console.log("✅ Oracle authorized:", oracle.address);

    // Step 2: Create a match
    console.log("\n[Step 2] Creating match: Liverpool vs Manchester United");
    const currentTime = Math.floor(Date.now() / 1000);
    const startTime = currentTime + 300;  // Start in 5 minutes
    const duration = 7200;  // 2 hours
    const targetTotal = 5;  // Over/Under 5 goals
    const handicapValue = 1;  // Handicap

    const createTx = await contract.connect(oracle).createMatch(
      "Liverpool",
      "Manchester United",
      startTime,
      duration,
      targetTotal,
      handicapValue
    );
    const receipt = await createTx.wait();

    const matchCreatedEvent = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log).name === "MatchCreated";
      } catch {
        return false;
      }
    });

    const matchId = matchCreatedEvent ? contract.interface.parseLog(matchCreatedEvent).args[0] : 1n;
    console.log("✅ Match created with ID:", matchId.toString());
    console.log("   Start time:", new Date(startTime * 1000).toLocaleString());

    // Step 3: Place bets
    console.log("\n[Step 3] Placing bets from multiple bettors...");

    // Bettor 1: Bets on Home team (Liverpool) to win - 0.1 ETH
    console.log("\nBettor 1: Betting 0.1 ETH on Liverpool (Home) to win");
    const bet1Tx = await contract.connect(bettor1).placeBet(
      matchId,
      0,  // BetType.WinLose
      0,  // Prediction (not used for WinLose in flags)
      2,  // betOptions: predictedWinner=Home (bits 1-2: 01 = 1, shifted left = 2)
      { value: hre.ethers.parseEther("0.1") }
    );
    await bet1Tx.wait();
    console.log("✅ Bet placed by", bettor1.address);

    // Bettor 2: Bets on Away team (Manchester United) to win - 0.15 ETH
    console.log("\nBettor 2: Betting 0.15 ETH on Manchester United (Away) to win");
    const bet2Tx = await contract.connect(bettor2).placeBet(
      matchId,
      0,  // BetType.WinLose
      1,  // Prediction (not used for WinLose in flags)
      4,  // betOptions: predictedWinner=Away (bits 1-2: 10 = 2, shifted left = 4)
      { value: hre.ethers.parseEther("0.15") }
    );
    await bet2Tx.wait();
    console.log("✅ Bet placed by", bettor2.address);

    // Bettor 3: Bets on Over 5 goals - 0.05 ETH
    console.log("\nBettor 3: Betting 0.05 ETH on Over 5 goals");
    const bet3Tx = await contract.connect(bettor3).placeBet(
      matchId,
      1,  // BetType.OverUnder
      6,  // Prediction: 6 goals
      1,  // betOptions: isOver=true (bit 0: 1)
      { value: hre.ethers.parseEther("0.05") }
    );
    await bet3Tx.wait();
    console.log("✅ Bet placed by", bettor3.address);

    // Step 4: Check match status
    console.log("\n[Step 4] Checking match status...");
    const matchStatus = await contract.getMatchStatus(matchId);
    console.log("Match Status:", ["Created", "Active", "Finished", "Cancelled"][matchStatus[0]]);
    console.log("Total Home Bets:", hre.ethers.formatEther(matchStatus[1]), "ETH");
    console.log("Total Away Bets:", hre.ethers.formatEther(matchStatus[2]), "ETH");

    const bettors = await contract.getMatchBettors(matchId);
    console.log("Total Bettors:", bettors.length);

    // Step 5: Simulate match end
    console.log("\n[Step 5] Simulating match completion...");
    console.log("Setting block timestamp to after match end...");

    if (network === "hardhat" || network === "localhost") {
      await hre.network.provider.send("evm_increaseTime", [duration + 1]);
      await hre.network.provider.send("evm_mine");
    } else {
      console.log("⚠️  Waiting for actual match end time...");
      console.log("   This would take 2 hours in real deployment.");
      console.log("   Skipping to next step for demonstration.");
    }

    // Step 6: Finish match with results
    console.log("\n[Step 6] Submitting match results...");
    console.log("Final Score: Liverpool 3 - 2 Manchester United");
    const finishTx = await contract.connect(oracle).finishMatch(
      matchId,
      3,  // Home score: Liverpool
      2   // Away score: Manchester United
    );
    await finishTx.wait();
    console.log("✅ Match finished and scores revealed");

    // Step 7: Check results
    console.log("\n[Step 7] Match Results:");
    const matchResult = await contract.getMatchResult(matchId);
    console.log("Home Score:", matchResult[0]);
    console.log("Away Score:", matchResult[1]);
    console.log("Scores Revealed:", matchResult[2]);

    // Winner: Liverpool (Home team won 3-2)
    // Under 5 goals (3+2=5, not over 5)

    // Step 8: Check bet outcomes
    console.log("\n[Step 8] Bet Outcomes:");

    const bet1Info = await contract.getBetBasicInfo(matchId, bettor1.address);
    console.log("\nBettor 1 (Bet on Liverpool):");
    console.log("  Amount:", hre.ethers.formatEther(bet1Info[0]), "ETH");
    console.log("  Bet Type:", ["WinLose", "OverUnder", "Handicap"][bet1Info[1]]);
    console.log("  Claimed:", bet1Info[2]);
    console.log("  Result: WON (Liverpool won 3-2)");

    const bet2Info = await contract.getBetBasicInfo(matchId, bettor2.address);
    console.log("\nBettor 2 (Bet on Manchester United):");
    console.log("  Amount:", hre.ethers.formatEther(bet2Info[0]), "ETH");
    console.log("  Bet Type:", ["WinLose", "OverUnder", "Handicap"][bet2Info[1]]);
    console.log("  Claimed:", bet2Info[2]);
    console.log("  Result: LOST (Manchester United lost 2-3)");

    const bet3Info = await contract.getBetBasicInfo(matchId, bettor3.address);
    console.log("\nBettor 3 (Bet on Over 5 goals):");
    console.log("  Amount:", hre.ethers.formatEther(bet3Info[0]), "ETH");
    console.log("  Bet Type:", ["WinLose", "OverUnder", "Handicap"][bet3Info[1]]);
    console.log("  Claimed:", bet3Info[2]);
    console.log("  Result: LOST (Total goals: 5, not over 5)");

    // Step 9: Claim winnings
    console.log("\n[Step 9] Claiming winnings...");

    console.log("\nBettor 1 claiming winnings...");
    const balanceBefore = await hre.ethers.provider.getBalance(bettor1.address);
    const claimTx = await contract.connect(bettor1).claimWinnings(matchId);
    const claimReceipt = await claimTx.wait();
    const balanceAfter = await hre.ethers.provider.getBalance(bettor1.address);

    const gasUsed = claimReceipt.gasUsed * claimReceipt.gasPrice;
    const netProfit = balanceAfter - balanceBefore + gasUsed;

    console.log("✅ Winnings claimed!");
    console.log("   Net profit:", hre.ethers.formatEther(netProfit), "ETH");

    // Bettors 2 and 3 can try to claim but will get nothing
    console.log("\nBettor 2 attempting to claim (should get nothing)...");
    const claim2Tx = await contract.connect(bettor2).claimWinnings(matchId);
    await claim2Tx.wait();
    console.log("✅ Claim processed (no payout for losing bet)");

    console.log("\n" + "=".repeat(50));
    console.log("Simulation Summary");
    console.log("=".repeat(50));
    console.log("Match: Liverpool 3 - 2 Manchester United");
    console.log("Total Bets Placed: 3");
    console.log("Total Wagered:", hre.ethers.formatEther(
      hre.ethers.parseEther("0.1") +
      hre.ethers.parseEther("0.15") +
      hre.ethers.parseEther("0.05")
    ), "ETH");
    console.log("Winners: Bettor 1 (Liverpool)");
    console.log("Losers: Bettor 2 (Manchester United), Bettor 3 (Over 5 goals)");

    console.log("\n✅ Simulation completed successfully!\n");

  } catch (error) {
    console.error("\n❌ Simulation failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
