# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing, code quality checks, and deployment.

## Workflows

### 1. `test.yml` - Main CI/CD Pipeline

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
1. **Code Quality Checks** - Runs Prettier, ESLint, and Solhint
2. **Test on Node.js 18.x** - Full test suite on Node 18
3. **Test on Node.js 20.x** - Full test suite with coverage on Node 20
4. **Security Audit** - npm audit for vulnerabilities
5. **Build** - Contract compilation and artifact upload
6. **All Checks Passed** - Final status check

**Features:**
- Multi-version Node.js testing (18.x, 20.x)
- Code coverage with Codecov integration
- Artifact retention for 7 days
- Parallel job execution

### 2. `pull-request.yml` - PR Checks

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**
1. **PR Information** - Display PR details
2. **Quick Quality Checks** - Fast linting and testing
3. **Contract Size Check** - Verify contracts under 24KB
4. **PR Summary** - Comment results on PR

**Features:**
- PR comment with check results
- Contract size validation
- Quick feedback for contributors

## Running Workflows Locally

### Prerequisites

```bash
npm install
```

### Run All Quality Checks

```bash
npm run lint
```

### Run Tests

```bash
npm test
```

### Generate Coverage

```bash
npm run coverage
```

## Workflow Configuration

### Secrets Required

Add these secrets in GitHub repository settings:

- `CODECOV_TOKEN` - Token for Codecov integration (optional but recommended)

### Badge URLs

Add to README.md:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%2FCD%20Pipeline/badge.svg)
![Coverage](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)
```

## Troubleshooting

### Workflow Fails on Lint

```bash
npm run lint:fix
npm run format
```

### Tests Fail Locally but Pass in CI

- Check Node.js version matches CI (18.x or 20.x)
- Clear cache: `npm run clean && npm ci`

### Coverage Upload Fails

- Verify `CODECOV_TOKEN` is set in repository secrets
- Check `.codecov.yml` configuration

## Maintenance

### Update Dependencies

```bash
npm audit fix
npm outdated
```

### Update Workflow Actions

Periodically update action versions in workflow files:
- `actions/checkout`
- `actions/setup-node`
- `codecov/codecov-action`
- `actions/upload-artifact`

## Contact

For issues with CI/CD workflows, please open an issue in the repository.
