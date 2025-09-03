# Git Aliases for Afarsemon Workflow

Add these aliases to your Git configuration for easier workflow management:

```bash
# Set up Git aliases for Feature-First GitFlow
git config alias.new-demo '!f() { git checkout develop && git checkout -b feature/demo-$1; }; f'
git config alias.new-app '!f() { git checkout develop && git checkout -b feature/app-$1; }; f'
git config alias.new-integration '!f() { git checkout develop && git checkout -b feature/integration-$1; }; f'
git config alias.new-hotfix '!f() { git checkout main && git checkout -b hotfix/urgent-$1; }; f'

git config alias.finish-feature '!f() { 
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git checkout develop && 
  git merge $BRANCH && 
  git push origin develop && 
  git branch -d $BRANCH
}; f'

git config alias.deploy-production '!f() { 
  git checkout main && 
  git merge develop && 
  git push origin main && 
  git checkout develop
}; f'

git config alias.finish-hotfix '!f() { 
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git checkout main && 
  git merge $BRANCH && 
  git push origin main && 
  git checkout develop && 
  git merge $BRANCH && 
  git push origin develop && 
  git branch -d $BRANCH
}; f'
```

## Usage Examples

```bash
# Create new branches
git new-demo customer-service-automation
git new-app admin-dashboard
git new-integration n8n
git new-hotfix auth-vulnerability

# Finish feature development
git finish-feature

# Deploy to production
git deploy-production

# Finish hotfix
git finish-hotfix
```

## Branch Status Helper

```bash
# Show all feature branches
git config alias.show-features 'branch --list "feature/*"'

# Show branch status
git config alias.status-all '!git for-each-ref --format="%(refname:short) %(upstream:track)" refs/heads'
```
