# CI/CD Documentation

Comprehensive guide for Continuous Integration and Continuous Deployment pipelines.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Code Quality Tools](#code-quality-tools)
- [Local Development](#local-development)
- [Coverage Reports](#coverage-reports)
- [Best Practices](#best-practices)

## Overview

This project uses GitHub Actions for automated testing, code quality checks, and deployment workflows. All workflows are defined in `.github/workflows/` directory.

### CI/CD Pipeline Features

✅ **Automated Testing**
- Multi-version Node.js testing (18.x, 20.x)
- 53 comprehensive test cases
- Automatic test execution on push and PR

✅ **Code Quality Checks**
- Solidity linting with Solhint
- JavaScript linting with ESLint
- Code formatting with Prettier
- Security audit with npm audit

✅ **Coverage Reporting**
- Istanbul/NYC coverage generation
- Codecov integration
- Coverage threshold enforcement (80% target)

✅ **Continuous Deployment**
- Automated builds
- Artifact storage
- Contract size validation

## GitHub Actions Workflows

### 1. Main CI/CD Pipeline (`test.yml`)

**File**: `.github/workflows/test.yml`

**Triggers:**
```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

**Job Flow:**

```
┌─────────────────────┐
│ Code Quality Checks │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐  ┌───▼────┐
│ Node 18 │  │ Node 20│
│  Tests  │  │  Tests │
│         │  │ +Coverage│
└────┬────┘  └───┬────┘
     │           │
     └─────┬─────┘
           │
      ┌────▼────┐
      │  Build  │
      └────┬────┘
           │
    ┌──────▼──────┐
    │All Checks OK│
    └─────────────┘
```

**Jobs Breakdown:**

1. **lint-and-format** (Ubuntu)
   - Prettier format check
   - ESLint JavaScript linting
   - Solhint Solidity linting

2. **test-node-18** (Ubuntu, Node 18.x)
   - Install dependencies
   - Compile contracts
   - Run test suite

3. **test-node-20** (Ubuntu, Node 20.x)
   - Install dependencies
   - Compile contracts
   - Run test suite
   - Generate coverage
   - Upload to Codecov

4. **security-audit** (Ubuntu)
   - npm audit for vulnerabilities
   - Continue on moderate issues

5. **build** (Ubuntu)
   - Compile contracts
   - Upload artifacts (7-day retention)

6. **all-checks-passed**
   - Verify all jobs succeeded
   - Exit with error if any failed

### 2. Pull Request Checks (`pull-request.yml`)

**File**: `.github/workflows/pull-request.yml`

**Triggers:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**Features:**
- PR information display
- Quick quality checks
- Contract size validation (24KB limit)
- Automated PR comments with results

**Example PR Comment:**

```markdown
## PR Check Results

- Quick Checks: ✅
- Size Check: ✅

✅ All checks passed! Ready for review.
```

## Code Quality Tools

### 1. Solhint - Solidity Linter

**Configuration**: `.solhint.json`

**Key Rules:**
- Code complexity max: 10
- Compiler version: >= 0.8.24
- Line length max: 120 characters
- Naming conventions enforced
- Constructor syntax validation

**Usage:**
```bash
# Check Solidity files
npm run lint:sol

# Auto-fix issues
npm run lint:sol:fix
```

**Rule Details:**

| Rule | Severity | Description |
|------|----------|-------------|
| code-complexity | error | Max cyclomatic complexity: 10 |
| compiler-version | error | Minimum Solidity 0.8.24 |
| func-visibility | error | Explicit visibility required |
| max-line-length | error | 120 character limit |
| quotes | error | Use double quotes |
| naming conventions | error | CamelCase/mixedCase enforcement |

### 2. ESLint - JavaScript Linter

**Configuration**: `.eslintrc.json`

**Key Rules:**
- 2-space indentation
- Double quotes
- Semicolons required
- Unix line endings
- No unused variables (except `_` prefix)

**Usage:**
```bash
# Check JavaScript files
npm run lint:js

# Auto-fix issues
npm run lint:js:fix
```

### 3. Prettier - Code Formatter

**Configuration**: `.prettierrc.yml`

**Settings:**
- Print width: 120 characters
- Tab width: 2 spaces (4 for Solidity)
- Trailing commas: ES5
- LF line endings

**Usage:**
```bash
# Check formatting
npm run prettier:check

# Format all files
npm run prettier:write
# or
npm run format
```

### 4. Solidity Coverage

**Configuration**: `.solcover.js`

**Settings:**
- Istanbul reporters: HTML, LCOV, Text, JSON
- Skip test files
- Mocha timeout: 40s
- Optimizer disabled for accurate coverage

**Usage:**
```bash
# Generate coverage report
npm run coverage

# View HTML report
open coverage/index.html
```

**Coverage Targets:**

| Metric | Target | Threshold |
|--------|--------|-----------|
| Statements | 80% | 2% |
| Branches | 75% | 5% |
| Functions | 90% | 2% |
| Lines | 80% | 2% |

## Local Development

### Setup

```bash
# Install dependencies
npm install

# Setup git hooks (optional)
npm run prepare
```

### Development Workflow

1. **Before Committing:**
```bash
# Run all checks
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

2. **Run Tests:**
```bash
# Quick test
npm test

# With coverage
npm run coverage
```

3. **Compile Contracts:**
```bash
npm run compile
```

### Pre-commit Checklist

- [ ] All tests pass
- [ ] Code is formatted (`npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] Coverage meets targets
- [ ] Contracts compile successfully

## Coverage Reports

### Codecov Integration

**Configuration**: `.codecov.yml`

**Features:**
- Automatic coverage upload from CI
- PR comments with coverage diff
- Branch coverage tracking
- Coverage badges

**Setup:**

1. Add repository to Codecov
2. Get Codecov token
3. Add token to GitHub secrets as `CODECOV_TOKEN`
4. Coverage automatically uploaded on CI runs

**Badge:**
```markdown
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

### Local Coverage

```bash
# Generate coverage
npm run coverage

# Open HTML report
open coverage/index.html  # macOS
start coverage/index.html  # Windows
xdg-open coverage/index.html  # Linux
```

**Report Locations:**
- HTML: `coverage/index.html`
- LCOV: `coverage/lcov.info`
- JSON: `coverage/coverage-final.json`

## Best Practices

### 1. Code Quality

✅ **DO:**
- Run linters before committing
- Fix all linting errors
- Maintain consistent formatting
- Write descriptive commit messages

❌ **DON'T:**
- Commit with linting errors
- Disable linting rules without reason
- Skip code formatting
- Push directly to main

### 2. Testing

✅ **DO:**
- Write tests for new features
- Maintain high coverage (>80%)
- Test edge cases
- Use descriptive test names

❌ **DON'T:**
- Skip tests to fix CI quickly
- Ignore failing tests
- Write tests that depend on each other
- Test implementation details

### 3. Pull Requests

✅ **DO:**
- Create small, focused PRs
- Include test coverage
- Update documentation
- Wait for CI to pass

❌ **DON'T:**
- Create large, monolithic PRs
- Merge without CI passing
- Skip documentation updates
- Force push to PR branch unnecessarily

### 4. CI/CD Maintenance

✅ **DO:**
- Keep dependencies updated
- Monitor workflow run times
- Review failed builds promptly
- Update workflow actions regularly

❌ **DON'T:**
- Ignore security alerts
- Let workflows break silently
- Skip dependency updates
- Use outdated action versions

## Troubleshooting

### Common Issues

#### 1. Linting Errors

**Problem:** CI fails on linting

**Solution:**
```bash
npm run lint:fix
npm run format
git add .
git commit -m "fix: linting issues"
```

#### 2. Tests Fail in CI but Pass Locally

**Problem:** Different behavior in CI vs local

**Solution:**
```bash
# Match CI Node version
nvm use 20

# Clean install
npm ci

# Clear cache
npm run clean
npx hardhat clean
```

#### 3. Coverage Below Threshold

**Problem:** Coverage drops below 80%

**Solution:**
```bash
# Generate coverage locally
npm run coverage

# Identify uncovered lines
open coverage/index.html

# Add tests for uncovered code
```

#### 4. Codecov Upload Fails

**Problem:** Coverage not uploading to Codecov

**Solution:**
1. Verify `CODECOV_TOKEN` in GitHub secrets
2. Check `.codecov.yml` configuration
3. Review Codecov action logs
4. Ensure `coverage/lcov.info` is generated

#### 5. Contract Size Exceeds Limit

**Problem:** Contract bytecode > 24KB

**Solution:**
```bash
# Check contract size
npm run compile

# Optimize:
# - Extract libraries
# - Use minimal imports
# - Optimize optimizer settings
# - Split large contracts
```

## GitHub Actions Permissions

### Required Permissions

```yaml
permissions:
  contents: read        # Read repository contents
  pull-requests: write  # Comment on PRs
```

### Security Best Practices

- Use minimal permissions
- Pin action versions with commit SHAs
- Disable credential persistence
- Use `GITHUB_TOKEN` for API calls

## Monitoring

### CI/CD Metrics

Monitor these metrics:
- Workflow run duration
- Pass/fail rates
- Coverage trends
- Security audit results

### GitHub Insights

View CI/CD health at:
```
https://github.com/USERNAME/REPO/actions
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Hardhat Testing](https://hardhat.org/tutorial/testing-contracts)
- [Codecov Documentation](https://docs.codecov.com/)
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Support

For CI/CD issues:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Open an issue in the repository
4. Contact the development team

---

**Last Updated**: 2025-01-15

For the latest CI/CD updates, check the `.github/workflows/` directory.
