# Feature-First GitFlow Strategy for Afarsemon

## Branch Structure

### Core Branches
- **main** - Production branch (auto-deploy to Vercel)
- **develop** - Integration branch for all features

### Feature Branches
- **feature/demo-{automation-name}** - Individual automation demos
- **feature/app-{app-name}** - New app development  
- **feature/integration-{service}** - External service integrations
- **hotfix/urgent-{issue}** - Critical production fixes

## Workflow Rules

### 1. Feature Development
1. Create feature branch from `develop`
2. Implement with proper TypeScript types
3. Add i18n translations (Hebrew first)
4. Write integration tests
5. PR review + automated checks
6. Merge to `develop` → deploy to staging

### 2. Demo Development
1. Create `feature/demo-{automation-name}` from `develop`
2. Test automation workflows
3. Record demo interactions
4. Document setup instructions
5. Merge to `develop` then `main` for production showcase

### 3. App Extensions
1. Create `feature/app-{app-name}` from `develop`
2. Leverage shared packages
3. Configure routing and navigation
4. Add to Turborepo build pipeline
5. Independent deployment capability

### 4. Integration Development
1. Create `feature/integration-{service}` from `develop`
2. Implement webhook endpoints
3. Test with external services
4. Document API specifications
5. Merge to `develop` for testing

### 5. Hotfixes
1. Create `hotfix/urgent-{issue}` from `main`
2. Fix critical production issues
3. Merge to both `main` and `develop`
4. Deploy immediately to production

## Branch Protection Rules

### main branch:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to administrators only

### develop branch:
- Require pull request reviews
- Require status checks to pass
- Allow force pushes for maintainers

## Quick Commands

### Creating Feature Branches
```bash
# Demo automation features
git checkout develop
git checkout -b feature/demo-customer-service-automation
git checkout -b feature/demo-inventory-management
git checkout -b feature/demo-social-media-scheduler

# App features
git checkout develop
git checkout -b feature/app-marketing-site
git checkout -b feature/app-admin-dashboard
git checkout -b feature/app-demo-showcase

# Integration features
git checkout develop
git checkout -b feature/integration-n8n
git checkout -b feature/integration-makecom
git checkout -b feature/integration-vapi
git checkout -b feature/integration-grow-payments

# Hotfix
git checkout main
git checkout -b hotfix/urgent-{issue-description}
```

### Merging Workflow
```bash
# Feature to develop
git checkout develop
git merge feature/demo-customer-service-automation
git push origin develop

# Develop to main (production)
git checkout main
git merge develop
git push origin main

# Hotfix workflow
git checkout main
git merge hotfix/urgent-{issue}
git checkout develop
git merge hotfix/urgent-{issue}
git push origin main develop
```
