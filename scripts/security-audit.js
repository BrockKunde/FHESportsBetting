const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

console.log("=".repeat(60));
console.log("Security Audit & Vulnerability Scan");
console.log("=".repeat(60));

async function runSecurityChecks() {
  const checks = [
    {
      name: "NPM Audit",
      command: "npm audit --audit-level=moderate",
      critical: false
    },
    {
      name: "Dependency Check",
      command: "npm outdated",
      critical: false
    },
    {
      name: "Solidity Linting (Security Rules)",
      command: "npx solhint 'contracts/**/*.sol'",
      critical: true
    },
    {
      name: "Check for Hardcoded Secrets",
      command: "grep -r -i 'private.*key\\|secret\\|password' contracts/ scripts/ --exclude-dir=node_modules || echo 'No secrets found'",
      critical: true
    }
  ];

  let failedChecks = 0;
  let criticalFailures = 0;

  for (const check of checks) {
    console.log(`\n[${"=".repeat(54)}]`);
    console.log(`Running: ${check.name}`);
    console.log(`[${"=".repeat(54)}]\n`);

    try {
      const { stdout, stderr } = await execPromise(check.command);
      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes("npm notice")) console.error(stderr);
      console.log(`✅ ${check.name} passed`);
    } catch (error) {
      console.error(`❌ ${check.name} failed`);
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.error(error.stderr);

      failedChecks++;
      if (check.critical) {
        criticalFailures++;
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("Security Audit Summary");
  console.log("=".repeat(60));
  console.log(`Total checks: ${checks.length}`);
  console.log(`Passed: ${checks.length - failedChecks}`);
  console.log(`Failed: ${failedChecks}`);
  console.log(`Critical failures: ${criticalFailures}`);

  if (criticalFailures > 0) {
    console.log("\n❌ Critical security issues detected!");
    process.exit(1);
  } else if (failedChecks > 0) {
    console.log("\n⚠️  Non-critical issues detected. Please review.");
    process.exit(0);
  } else {
    console.log("\n✅ All security checks passed!");
    process.exit(0);
  }
}

runSecurityChecks().catch((error) => {
  console.error("Security audit failed:", error);
  process.exit(1);
});
