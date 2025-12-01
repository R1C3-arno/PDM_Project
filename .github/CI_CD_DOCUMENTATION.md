# CI/CD Pipeline Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline infrastructure for the PDM Loan Management System.

## Architecture

The CI/CD pipeline is built using GitHub Actions and consists of the following components:

### 1. Frontend CI Pipeline (`frontend-ci.yml`)
- **Triggers:** Push/PR to `main` and `deployment` branches
- **Node Version:** 20.x
- **Steps:**
  - Checkout code
  - Setup Node.js with caching
  - Install dependencies (npm ci)
  - Run ESLint for code quality
  - Run TypeScript type checking
  - Build Next.js application
  - Upload build artifacts

### 2. Backend CI Pipeline (`backend-ci.yml`)
- **Triggers:** Push/PR to `main` and `deployment` branches
- **Java Version:** 17 (Temurin distribution)
- **Steps:**
  - Checkout code
  - Setup JDK with Maven caching
  - Compile Java code
  - Run unit tests
  - Generate JaCoCo coverage reports
  - Build JAR package
  - Upload artifacts and test results

### 3. Security Scanning (`security-scan.yml`)
- **Triggers:** Push to `main`, PRs, weekly schedule (Mondays), manual dispatch
- **Scans:**
  - **Frontend:** npm audit for vulnerable packages
  - **Backend:** OWASP dependency check for Maven dependencies
  - **CodeQL:** Static analysis for Java and TypeScript
  - **Secret Scanning:** Gitleaks for exposed secrets
  - **SAST:** Semgrep for security patterns

### 4. Pull Request Checks (`pr-check.yml`)
- **Triggers:** Pull request events (opened, synchronize, reopened)
- **Checks:**
  - Change detection (frontend/backend/workflows)
  - Component-specific CI (only runs if changed)
  - Security scanning (always runs)
  - PR validation (title, description, branch naming)
  - Code quality checks (console.log, debugger, TODOs)
  - All checks must pass before merge

### 5. Dependency Management (`dependabot.yml`)
- **NPM (Frontend):** Daily updates at 03:00 UTC
- **Maven (Backend):** Daily updates at 03:30 UTC
- **GitHub Actions:** Weekly updates on Mondays at 04:00 UTC
- **Features:**
  - Automatic grouping of minor/patch updates
  - Auto-labeling and assignment
  - Conventional commit messages

## Workflow Triggers

### Branch Protection
- `main` - Production branch
- `deployment` - Staging/deployment branch

### Event Types
- **Push:** Automatic CI on code push
- **Pull Request:** All checks run on PRs
- **Schedule:** Weekly security scans
- **Manual:** Security scans can be triggered manually

## Caching Strategy

### Frontend
- **npm cache:** `~/.npm` and `node_modules`
- **Cache key:** Based on `package-lock.json` hash
- **Benefit:** Faster dependency installation

### Backend
- **Maven cache:** `~/.m2/repository`
- **Cache key:** Based on `pom.xml` hash
- **Benefit:** Faster dependency resolution

## Artifacts

### Build Artifacts
- **Frontend:** `.next` build directory (7 days retention)
- **Backend:** JAR files (7 days retention)
- **Test Results:** JUnit reports and coverage (7 days retention)

### Security Artifacts
- **Dependency Reports:** OWASP dependency check (30 days retention)
- **SARIF Files:** CodeQL and Semgrep results

## Status Badges

Add these badges to your README.md:

```markdown
![Frontend CI](https://github.com/R1C3-arno/PDM_Project/workflows/Frontend%20CI/badge.svg)
![Backend CI](https://github.com/R1C3-arno/PDM_Project/workflows/Backend%20CI/badge.svg)
![Security Scanning](https://github.com/R1C3-arno/PDM_Project/workflows/Security%20Scanning/badge.svg)
```

## Pull Request Guidelines

### PR Title Format
Follow conventional commit format:
```
<type>(<scope>): <description>

Examples:
feat(auth): add OAuth2 login
fix(api): resolve null pointer in user service
docs(readme): update installation instructions
```

### Valid Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style/formatting
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Tests
- `build` - Build system
- `ci` - CI/CD changes
- `chore` - Maintenance tasks

### Branch Naming
```
feature/<description>    - New features
bugfix/<description>     - Bug fixes
hotfix/<description>     - Urgent fixes
release/<version>        - Release preparation
chore/<description>      - Maintenance
docs/<description>       - Documentation
```

## Security Considerations

### Secret Management
- **Never commit secrets** to the repository
- Use GitHub Secrets for sensitive data
- Environment variables are managed through GitHub Actions secrets

### Security Scanning Levels
- **Critical:** Immediate action required
- **High:** Urgent attention needed
- **Medium:** Address soon
- **Low:** Schedule normally

### Vulnerability Reporting
For security vulnerabilities:
1. **Critical issues:** Use GitHub Security Advisories
2. **Non-critical:** Create a security issue using the template

## Troubleshooting

### Common Issues

#### Frontend Build Fails
```bash
# Locally test the build
cd pdm-frontend
npm ci
npm run build
```

#### Backend Build Fails
```bash
# Locally test the build
cd pdm-backend
mvn clean compile
mvn test
mvn package
```

#### Cache Issues
- Delete cache keys from GitHub Actions UI
- Clear local caches: `npm cache clean --force` or `mvn clean`

#### Permission Issues
- Ensure workflow has proper permissions
- Check GitHub token permissions in workflow YAML

### Viewing Logs
1. Go to Actions tab in GitHub
2. Select the workflow run
3. Click on the job name
4. Expand step to view logs

## Maintenance

### Regular Tasks
- **Weekly:** Review security scan results
- **Monthly:** Update dependencies via Dependabot PRs
- **Quarterly:** Review and update CI/CD configuration

### Updating Workflows
1. Make changes to workflow YAML files
2. Test in a feature branch
3. Create PR for review
4. Merge to main after approval

### Performance Optimization
- Use caching for dependencies
- Run jobs in parallel where possible
- Skip unnecessary steps with conditionals
- Use `concurrency` to cancel outdated runs

## Environment Variables

### Required Secrets
Configure these in GitHub Settings > Secrets and Variables > Actions:

```yaml
# Example secrets (configure as needed)
GITHUB_TOKEN          # Automatically provided
DATABASE_URL          # For integration tests
DATABASE_USERNAME     # For integration tests
DATABASE_PASSWORD     # For integration tests
```

### Environment-Specific Variables
- Development: Uses default values
- Staging: Configured in GitHub environment
- Production: Configured in GitHub environment

## Code Coverage

### JaCoCo Configuration
- **Location:** `pdm-backend/pom.xml`
- **Reports:** `target/site/jacoco/`
- **Minimum Coverage:** 0% (currently, increase as tests are added)

### Frontend Coverage
- Currently not configured
- TODO: Add Jest/Vitest for unit tests
- TODO: Configure coverage reporting

## Continuous Improvement

### Planned Enhancements
- [ ] Add automated deployment workflows
- [ ] Implement Docker image building
- [ ] Add end-to-end testing
- [ ] Integrate with deployment platforms
- [ ] Add performance testing
- [ ] Implement automatic rollback on failures

### Metrics to Track
- Build success rate
- Build duration
- Test coverage percentage
- Security vulnerability count
- Dependency update frequency

## Support

For issues with CI/CD pipeline:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Create an issue using the bug report template
4. Tag with `ci/cd` label

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [JaCoCo Documentation](https://www.jacoco.org/jacoco/trunk/doc/)

---

**Last Updated:** 2025-11-27
**Maintained By:** PDM Development Team
