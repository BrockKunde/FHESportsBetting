const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ConfidentialSportsBetting", function () {
  let contract;
  let contractAddress;
  let owner;
  let oracle;
  let alice;
  let bob;
  let carol;

  async function deployFixture() {
    const ConfidentialSportsBetting = await ethers.getContractFactory("ConfidentialSportsBetting");
    const instance = await ConfidentialSportsBetting.deploy();
    await instance.waitForDeployment();
    const addr = await instance.getAddress();
    return { contract: instance, contractAddress: addr };
  }

  before(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    oracle = signers[1];
    alice = signers[2];
    bob = signers[3];
    carol = signers[4];
  });

  beforeEach(async function () {
    ({ contract, contractAddress } = await deployFixture());
  });

  describe("Deployment and Initialization", function () {
    it("should deploy successfully", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("should set deployer as owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should initialize with zero matches", async function () {
      expect(await contract.currentMatchId()).to.equal(0);
    });

    it("should set correct minimum bet amount", async function () {
      const minBet = await contract.MIN_BET_AMOUNT();
      expect(minBet).to.equal(ethers.parseEther("0.01"));
    });

    it("should set correct maximum bet amount", async function () {
      const maxBet = await contract.MAX_BET_AMOUNT();
      expect(maxBet).to.equal(ethers.parseEther("10"));
    });

    it("should authorize deployer as oracle", async function () {
      expect(await contract.authorizedOracles(owner.address)).to.be.true;
    });
  });

  describe("Oracle Authorization", function () {
    it("should allow owner to authorize oracle", async function () {
      await expect(contract.connect(owner).authorizeOracle(oracle.address))
        .to.emit(contract, "OracleAuthorized")
        .withArgs(oracle.address);

      expect(await contract.authorizedOracles(oracle.address)).to.be.true;
    });

    it("should allow owner to revoke oracle", async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);

      await expect(contract.connect(owner).revokeOracle(oracle.address))
        .to.emit(contract, "OracleRevoked")
        .withArgs(oracle.address);

      expect(await contract.authorizedOracles(oracle.address)).to.be.false;
    });

    it("should reject non-owner authorization attempt", async function () {
      await expect(
        contract.connect(alice).authorizeOracle(oracle.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("should reject non-owner revocation attempt", async function () {
      await expect(
        contract.connect(alice).revokeOracle(owner.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Match Creation", function () {
    beforeEach(async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
    });

    it("should allow oracle to create match", async function () {
      const currentTime = await time.latest();
      const startTime = currentTime + 3600;
      const duration = 7200;

      await expect(
        contract.connect(oracle).createMatch(
          "Liverpool",
          "Manchester United",
          startTime,
          duration,
          5,
          1
        )
      ).to.emit(contract, "MatchCreated")
        .withArgs(1, "Liverpool", "Manchester United", startTime);

      expect(await contract.currentMatchId()).to.equal(1);
    });

    it("should reject match creation from non-oracle", async function () {
      const currentTime = await time.latest();
      const startTime = currentTime + 3600;

      await expect(
        contract.connect(alice).createMatch(
          "Team A",
          "Team B",
          startTime,
          7200,
          5,
          1
        )
      ).to.be.revertedWith("Not authorized oracle");
    });

    it("should reject match with past start time", async function () {
      const pastTime = (await time.latest()) - 1000;

      await expect(
        contract.connect(oracle).createMatch(
          "Team A",
          "Team B",
          pastTime,
          7200,
          5,
          1
        )
      ).to.be.revertedWith("Start time must be in future");
    });

    it("should reject match with zero duration", async function () {
      const currentTime = await time.latest();
      const startTime = currentTime + 3600;

      await expect(
        contract.connect(oracle).createMatch(
          "Team A",
          "Team B",
          startTime,
          0,
          5,
          1
        )
      ).to.be.revertedWith("Duration must be positive");
    });

    it("should reject match with empty team names", async function () {
      const currentTime = await time.latest();
      const startTime = currentTime + 3600;

      await expect(
        contract.connect(oracle).createMatch(
          "",
          "Team B",
          startTime,
          7200,
          5,
          1
        )
      ).to.be.revertedWith("Team names required");
    });

    it("should store match details correctly", async function () {
      const currentTime = await time.latest();
      const startTime = currentTime + 3600;
      const duration = 7200;

      await contract.connect(oracle).createMatch(
        "Liverpool",
        "Chelsea",
        startTime,
        duration,
        5,
        1
      );

      const matchInfo = await contract.getMatchBasicInfo(1);
      expect(matchInfo[0]).to.equal("Liverpool");
      expect(matchInfo[1]).to.equal("Chelsea");
      expect(matchInfo[2]).to.equal(startTime);
      expect(matchInfo[3]).to.equal(startTime + duration);
    });
  });

  describe("Betting Functionality", function () {
    let matchId;
    let startTime;

    beforeEach(async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      startTime = currentTime + 100;

      await contract.connect(oracle).createMatch(
        "Arsenal",
        "Tottenham",
        startTime,
        7200,
        5,
        1
      );
      matchId = 1;

      // Fast forward to match start
      await time.increaseTo(startTime + 1);
    });

    it("should allow user to place bet", async function () {
      await expect(
        contract.connect(alice).placeBet(
          matchId,
          0, // BetType.WinLose
          0,
          2, // Home team
          { value: ethers.parseEther("0.1") }
        )
      ).to.emit(contract, "BetPlaced")
        .withArgs(matchId, alice.address, 0, ethers.parseEther("0.1"));
    });

    it("should reject bet below minimum amount", async function () {
      await expect(
        contract.connect(alice).placeBet(
          matchId,
          0,
          0,
          2,
          { value: ethers.parseEther("0.005") }
        )
      ).to.be.revertedWith("Invalid bet amount");
    });

    it("should reject bet above maximum amount", async function () {
      await expect(
        contract.connect(alice).placeBet(
          matchId,
          0,
          0,
          2,
          { value: ethers.parseEther("15") }
        )
      ).to.be.revertedWith("Invalid bet amount");
    });

    it("should reject duplicate bet from same user", async function () {
      await contract.connect(alice).placeBet(
        matchId,
        0,
        0,
        2,
        { value: ethers.parseEther("0.1") }
      );

      await expect(
        contract.connect(alice).placeBet(
          matchId,
          0,
          0,
          2,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWith("Already placed bet for this match");
    });

    it("should reject bet on non-existent match", async function () {
      await expect(
        contract.connect(alice).placeBet(
          999,
          0,
          0,
          2,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWith("Match does not exist");
    });

    it("should track total home bets", async function () {
      await contract.connect(alice).placeBet(
        matchId,
        0,
        0,
        2, // Home team
        { value: ethers.parseEther("0.1") }
      );

      await contract.connect(bob).placeBet(
        matchId,
        0,
        0,
        2, // Home team
        { value: ethers.parseEther("0.15") }
      );

      const matchStatus = await contract.getMatchStatus(matchId);
      expect(matchStatus[1]).to.equal(ethers.parseEther("0.25")); // totalHomeBets
    });

    it("should track total away bets", async function () {
      await contract.connect(alice).placeBet(
        matchId,
        0,
        0,
        4, // Away team
        { value: ethers.parseEther("0.2") }
      );

      const matchStatus = await contract.getMatchStatus(matchId);
      expect(matchStatus[2]).to.equal(ethers.parseEther("0.2")); // totalAwayBets
    });

    it("should track multiple bettors", async function () {
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });
      await contract.connect(bob).placeBet(matchId, 0, 0, 4, { value: ethers.parseEther("0.1") });
      await contract.connect(carol).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });

      const bettors = await contract.getMatchBettors(matchId);
      expect(bettors.length).to.equal(3);
      expect(bettors).to.include(alice.address);
      expect(bettors).to.include(bob.address);
      expect(bettors).to.include(carol.address);
    });
  });

  describe("Match Settlement", function () {
    let matchId;
    let startTime;
    let endTime;

    beforeEach(async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      startTime = currentTime + 100;

      await contract.connect(oracle).createMatch(
        "Barcelona",
        "Real Madrid",
        startTime,
        3600, // 1 hour
        5,
        1
      );
      matchId = 1;
      endTime = startTime + 3600;

      // Fast forward to match start and place bets
      await time.increaseTo(startTime + 1);
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });
      await contract.connect(bob).placeBet(matchId, 0, 0, 4, { value: ethers.parseEther("0.1") });
    });

    it("should allow oracle to finish match", async function () {
      await time.increaseTo(endTime + 1);

      await expect(
        contract.connect(oracle).finishMatch(matchId, 3, 1)
      ).to.emit(contract, "MatchFinished")
        .withArgs(matchId, 3, 1);
    });

    it("should reject finish from non-oracle", async function () {
      await time.increaseTo(endTime + 1);

      await expect(
        contract.connect(alice).finishMatch(matchId, 3, 1)
      ).to.be.revertedWith("Not authorized oracle");
    });

    it("should reject finish before match end", async function () {
      await expect(
        contract.connect(oracle).finishMatch(matchId, 3, 1)
      ).to.be.revertedWith("Match still ongoing");
    });

    it("should store match result correctly", async function () {
      await time.increaseTo(endTime + 1);
      await contract.connect(oracle).finishMatch(matchId, 4, 2);

      const result = await contract.getMatchResult(matchId);
      expect(result[0]).to.equal(4); // homeScore
      expect(result[1]).to.equal(2); // awayScore
      expect(result[2]).to.be.true;  // scoresRevealed
    });

    it("should update match status to finished", async function () {
      await time.increaseTo(endTime + 1);
      await contract.connect(oracle).finishMatch(matchId, 2, 2);

      const matchStatus = await contract.getMatchStatus(matchId);
      expect(matchStatus[0]).to.equal(2); // MatchStatus.Finished
    });
  });

  describe("Winnings Claim", function () {
    let matchId;
    let startTime;
    let endTime;

    beforeEach(async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      startTime = currentTime + 100;

      await contract.connect(oracle).createMatch(
        "PSG",
        "Bayern Munich",
        startTime,
        3600,
        5,
        1
      );
      matchId = 1;
      endTime = startTime + 3600;

      await time.increaseTo(startTime + 1);
    });

    it("should allow winner to claim winnings", async function () {
      // Alice bets on home, Bob bets on away
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });
      await contract.connect(bob).placeBet(matchId, 0, 0, 4, { value: ethers.parseEther("0.1") });

      // Finish match with home team winning
      await time.increaseTo(endTime + 1);
      await contract.connect(oracle).finishMatch(matchId, 3, 1);

      // Alice claims winnings
      const balanceBefore = await ethers.provider.getBalance(alice.address);
      const tx = await contract.connect(alice).claimWinnings(matchId);
      const receipt = await tx.wait();
      const balanceAfter = await ethers.provider.getBalance(alice.address);

      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const netProfit = balanceAfter - balanceBefore + gasUsed;

      expect(netProfit).to.be.gt(ethers.parseEther("0.1")); // Should profit
    });

    it("should emit WinningsClaimed event", async function () {
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });
      await contract.connect(bob).placeBet(matchId, 0, 0, 4, { value: ethers.parseEther("0.1") });

      await time.increaseTo(endTime + 1);
      await contract.connect(oracle).finishMatch(matchId, 2, 1);

      await expect(contract.connect(alice).claimWinnings(matchId))
        .to.emit(contract, "WinningsClaimed");
    });

    it("should reject claim before match finished", async function () {
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });

      await expect(
        contract.connect(alice).claimWinnings(matchId)
      ).to.be.revertedWith("Match not finished");
    });

    it("should reject duplicate claim", async function () {
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });
      await contract.connect(bob).placeBet(matchId, 0, 0, 4, { value: ethers.parseEther("0.1") });

      await time.increaseTo(endTime + 1);
      await contract.connect(oracle).finishMatch(matchId, 3, 1);

      await contract.connect(alice).claimWinnings(matchId);

      await expect(
        contract.connect(alice).claimWinnings(matchId)
      ).to.be.revertedWith("Already claimed");
    });

    it("should handle loser claim gracefully", async function () {
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });
      await contract.connect(bob).placeBet(matchId, 0, 0, 4, { value: ethers.parseEther("0.1") });

      await time.increaseTo(endTime + 1);
      await contract.connect(oracle).finishMatch(matchId, 3, 1); // Home wins

      // Bob lost, should get nothing
      await expect(contract.connect(bob).claimWinnings(matchId)).to.not.be.reverted;
    });
  });

  describe("Match Cancellation", function () {
    let matchId;
    let startTime;

    beforeEach(async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      startTime = currentTime + 100;

      await contract.connect(oracle).createMatch(
        "AC Milan",
        "Inter Milan",
        startTime,
        3600,
        5,
        1
      );
      matchId = 1;

      await time.increaseTo(startTime + 1);
      await contract.connect(alice).placeBet(matchId, 0, 0, 2, { value: ethers.parseEther("0.1") });
      await contract.connect(bob).placeBet(matchId, 0, 0, 4, { value: ethers.parseEther("0.15") });
    });

    it("should allow oracle to cancel match", async function () {
      await expect(contract.connect(oracle).cancelMatch(matchId))
        .to.emit(contract, "MatchCancelled")
        .withArgs(matchId);
    });

    it("should reject cancellation from non-oracle", async function () {
      await expect(
        contract.connect(alice).cancelMatch(matchId)
      ).to.be.revertedWith("Not authorized oracle");
    });

    it("should refund all bettors on cancellation", async function () {
      const aliceBalanceBefore = await ethers.provider.getBalance(alice.address);
      const bobBalanceBefore = await ethers.provider.getBalance(bob.address);

      await contract.connect(oracle).cancelMatch(matchId);

      const aliceBalanceAfter = await ethers.provider.getBalance(alice.address);
      const bobBalanceAfter = await ethers.provider.getBalance(bob.address);

      // Both should receive refunds
      expect(aliceBalanceAfter).to.be.gt(aliceBalanceBefore);
      expect(bobBalanceAfter).to.be.gt(bobBalanceBefore);
    });

    it("should update match status to cancelled", async function () {
      await contract.connect(oracle).cancelMatch(matchId);

      const matchStatus = await contract.getMatchStatus(matchId);
      expect(matchStatus[0]).to.equal(3); // MatchStatus.Cancelled
    });
  });

  describe("View Functions", function () {
    it("should return correct match basic info", async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      const startTime = currentTime + 3600;
      const duration = 7200;

      await contract.connect(oracle).createMatch("Team A", "Team B", startTime, duration, 5, 1);

      const info = await contract.getMatchBasicInfo(1);
      expect(info[0]).to.equal("Team A");
      expect(info[1]).to.equal("Team B");
      expect(info[2]).to.equal(startTime);
      expect(info[3]).to.equal(startTime + duration);
    });

    it("should return correct bet basic info", async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      const startTime = currentTime + 100;

      await contract.connect(oracle).createMatch("Team A", "Team B", startTime, 3600, 5, 1);
      await time.increaseTo(startTime + 1);

      await contract.connect(alice).placeBet(1, 0, 0, 2, { value: ethers.parseEther("0.5") });

      const betInfo = await contract.getBetBasicInfo(1, alice.address);
      expect(betInfo[0]).to.equal(ethers.parseEther("0.5")); // amount
      expect(betInfo[1]).to.equal(0); // BetType.WinLose
      expect(betInfo[2]).to.be.false; // not claimed
      expect(betInfo[3]).to.be.true; // exists
    });
  });

  describe("Edge Cases", function () {
    it("should handle zero home bets", async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      const startTime = currentTime + 100;

      await contract.connect(oracle).createMatch("Team A", "Team B", startTime, 3600, 5, 1);

      const matchStatus = await contract.getMatchStatus(1);
      expect(matchStatus[1]).to.equal(0); // totalHomeBets
    });

    it("should handle maximum bet amount", async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      const startTime = currentTime + 100;

      await contract.connect(oracle).createMatch("Team A", "Team B", startTime, 3600, 5, 1);
      await time.increaseTo(startTime + 1);

      await expect(
        contract.connect(alice).placeBet(1, 0, 0, 2, { value: ethers.parseEther("10") })
      ).to.not.be.reverted;
    });

    it("should handle minimum bet amount", async function () {
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      const startTime = currentTime + 100;

      await contract.connect(oracle).createMatch("Team A", "Team B", startTime, 3600, 5, 1);
      await time.increaseTo(startTime + 1);

      await expect(
        contract.connect(alice).placeBet(1, 0, 0, 2, { value: ethers.parseEther("0.01") })
      ).to.not.be.reverted;
    });
  });

  describe("Owner Functions", function () {
    it("should allow owner to withdraw funds", async function () {
      // First, add some funds to contract through failed bets
      await contract.connect(owner).authorizeOracle(oracle.address);
      const currentTime = await time.latest();
      const startTime = currentTime + 100;

      await contract.connect(oracle).createMatch("Team A", "Team B", startTime, 3600, 5, 1);
      await time.increaseTo(startTime + 1);

      // Send some ETH to contract
      await alice.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther("1")
      });

      const contractBalance = await ethers.provider.getBalance(contractAddress);
      expect(contractBalance).to.be.gt(0);

      await expect(contract.connect(owner).withdraw()).to.not.be.reverted;
    });

    it("should reject withdraw from non-owner", async function () {
      await expect(
        contract.connect(alice).withdraw()
      ).to.be.revertedWith("Not authorized");
    });
  });
});
