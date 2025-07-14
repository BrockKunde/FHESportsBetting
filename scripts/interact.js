const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(50));
  console.log("Contract Interaction Script");
  console.log("=".repeat(50));

  const network = hre.network.name;
  console.log("\nNetwork:", network);

  // Load deployment data
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const latestFile = path.join(deploymentsDir, `${network}-latest.json`);

  if (!fs.existsSync(latestFile)) {
    console.error("❌ No deployment found for network:", network);
    console.log("Please deploy first: npx hardhat run scripts/deploy.js --network", network);
    process.exit(1);
  }

  const deploymentData = JSON.parse(fs.readFileSync(latestFile, "utf8"));
  const contractAddress = deploymentData.contracts.ConfidentialSportsBetting.address;

  console.log("Contract Address:", contractAddress);

  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);

  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  // Get contract instance
  const ConfidentialSportsBetting = await hre.ethers.getContractFactory("ConfidentialSportsBetting");
  const contract = ConfidentialSportsBetting.attach(contractAddress);

  console.log("\n" + "=".repeat(50));
  console.log("Contract Information");
  console.log("=".repeat(50));

  try {
    const owner = await contract.owner();
    console.log("Owner:", owner);

    const currentMatchId = await contract.currentMatchId();
    console.log("Current Match ID:", currentMatchId.toString());

    const minBet = await contract.MIN_BET_AMOUNT();
    console.log("Minimum Bet:", hre.ethers.formatEther(minBet), "ETH");

    const maxBet = await contract.MAX_BET_AMOUNT();
    console.log("Maximum Bet:", hre.ethers.formatEther(maxBet), "ETH");

    const isAuthorized = await contract.authorizedOracles(signer.address);
    console.log("Signer is authorized oracle:", isAuthorized);

    console.log("\n" + "=".repeat(50));
    console.log("Available Actions");
    console.log("=".repeat(50));

    console.log("\nFor Oracle (only if authorized):");
    console.log("1. Create Match");
    console.log("   const tx = await contract.createMatch(");
    console.log("     'Team A', 'Team B',");
    console.log("     Math.floor(Date.now()/1000) + 3600,  // Start in 1 hour");
    console.log("     7200,  // 2 hours duration");
    console.log("     5,     // Target total");
    console.log("     1      // Handicap value");
    console.log("   );");

    console.log("\n2. Finish Match");
    console.log("   const tx = await contract.finishMatch(matchId, homeScore, awayScore);");

    console.log("\n3. Cancel Match");
    console.log("   const tx = await contract.cancelMatch(matchId);");

    console.log("\nFor Bettors:");
    console.log("4. Place Bet");
    console.log("   const tx = await contract.placeBet(");
    console.log("     matchId,");
    console.log("     0,  // BetType: 0=WinLose, 1=OverUnder, 2=Handicap");
    console.log("     1,  // Prediction");
    console.log("     2,  // Bet options (bitflags)");
    console.log("     { value: ethers.parseEther('0.1') }");
    console.log("   );");

    console.log("\n5. Claim Winnings");
    console.log("   const tx = await contract.claimWinnings(matchId);");

    console.log("\nView Functions:");
    console.log("6. Get Match Info");
    console.log("   const info = await contract.getMatchBasicInfo(matchId);");
    console.log("   const status = await contract.getMatchStatus(matchId);");
    console.log("   const result = await contract.getMatchResult(matchId);");

    console.log("\n7. Get Bet Info");
    console.log("   const betInfo = await contract.getBetBasicInfo(matchId, bettorAddress);");
    console.log("   const betDetails = await contract.getBetDetails(matchId, bettorAddress);");

    console.log("\n8. Get Match Bettors");
    console.log("   const bettors = await contract.getMatchBettors(matchId);");

    // Example: Get details of existing matches
    if (currentMatchId > 0) {
      console.log("\n" + "=".repeat(50));
      console.log("Existing Matches");
      console.log("=".repeat(50));

      for (let i = 1; i <= currentMatchId; i++) {
        try {
          const matchInfo = await contract.getMatchBasicInfo(i);
          const matchStatus = await contract.getMatchStatus(i);
          const matchResult = await contract.getMatchResult(i);

          console.log(`\nMatch ${i}:`);
          console.log("  Teams:", matchInfo[0], "vs", matchInfo[1]);
          console.log("  Start Time:", new Date(Number(matchInfo[2]) * 1000).toLocaleString());
          console.log("  End Time:", new Date(Number(matchInfo[3]) * 1000).toLocaleString());
          console.log("  Status:", ["Created", "Active", "Finished", "Cancelled"][matchStatus[0]]);
          console.log("  Total Home Bets:", hre.ethers.formatEther(matchStatus[1]), "ETH");
          console.log("  Total Away Bets:", hre.ethers.formatEther(matchStatus[2]), "ETH");

          if (matchResult[2]) {  // scoresRevealed
            console.log("  Final Score:", matchResult[0], "-", matchResult[1]);
          }

          const bettors = await contract.getMatchBettors(i);
          console.log("  Total Bettors:", bettors.length);
        } catch (error) {
          console.log(`  Error fetching match ${i}:`, error.message);
        }
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("Interaction Examples Complete");
    console.log("=".repeat(50));
    console.log("\nModify this script to perform specific actions on the contract.");
    console.log("Uncomment and customize the examples above as needed.\n");

  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
