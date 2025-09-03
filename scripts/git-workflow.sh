#!/bin/bash

# Afarsemon Git Workflow Helper Script

case "$1" in
  "demo")
    if [ -z "$2" ]; then
      echo "Usage: ./scripts/git-workflow.sh demo <automation-name>"
      echo "Example: ./scripts/git-workflow.sh demo customer-service-automation"
      exit 1
    fi
    git checkout develop
    git checkout -b "feature/demo-$2"
    echo "Created and switched to feature/demo-$2"
    ;;
    
  "app")
    if [ -z "$2" ]; then
      echo "Usage: ./scripts/git-workflow.sh app <app-name>"
      echo "Example: ./scripts/git-workflow.sh app marketing-site"
      exit 1
    fi
    git checkout develop
    git checkout -b "feature/app-$2"
    echo "Created and switched to feature/app-$2"
    ;;
    
  "integration")
    if [ -z "$2" ]; then
      echo "Usage: ./scripts/git-workflow.sh integration <service>"
      echo "Example: ./scripts/git-workflow.sh integration n8n"
      exit 1
    fi
    git checkout develop
    git checkout -b "feature/integration-$2"
    echo "Created and switched to feature/integration-$2"
    ;;
    
  "hotfix")
    if [ -z "$2" ]; then
      echo "Usage: ./scripts/git-workflow.sh hotfix <issue>"
      echo "Example: ./scripts/git-workflow.sh hotfix auth-vulnerability"
      exit 1
    fi
    git checkout main
    git checkout -b "hotfix/urgent-$2"
    echo "Created and switched to hotfix/urgent-$2"
    ;;
    
  "finish")
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [[ $BRANCH == feature/* ]]; then
      echo "Finishing feature branch: $BRANCH"
      git checkout develop
      git merge "$BRANCH"
      echo "Merged $BRANCH to develop"
      echo "Push to remote? (y/n)"
      read -r response
      if [[ $response == "y" ]]; then
        git push origin develop
        echo "Pushed develop to remote"
      fi
    elif [[ $BRANCH == hotfix/* ]]; then
      echo "Finishing hotfix branch: $BRANCH"
      git checkout main
      git merge "$BRANCH"
      git checkout develop
      git merge "$BRANCH"
      echo "Merged $BRANCH to both main and develop"
      echo "Push to remote? (y/n)"
      read -r response
      if [[ $response == "y" ]]; then
        git push origin main develop
        echo "Pushed main and develop to remote"
      fi
    else
      echo "Current branch $BRANCH is not a feature or hotfix branch"
    fi
    ;;
    
  "deploy")
    echo "Deploying develop to production (main)"
    git checkout main
    git merge develop
    echo "Push to remote? (y/n)"
    read -r response
    if [[ $response == "y" ]]; then
      git push origin main
      echo "Deployed to production!"
    fi
    git checkout develop
    ;;
    
  "status")
    echo "=== Branch Status ==="
    echo "Current branch: $(git rev-parse --abbrev-ref HEAD)"
    echo ""
    echo "=== Feature Branches ==="
    git branch --list "feature/*" | sed 's/^..//'
    echo ""
    echo "=== Hotfix Branches ==="
    git branch --list "hotfix/*" | sed 's/^..//'
    echo ""
    echo "=== Remote Status ==="
    git status -s
    ;;
    
  *)
    echo "Afarsemon Git Workflow Helper"
    echo ""
    echo "Usage: ./scripts/git-workflow.sh <command> [args]"
    echo ""
    echo "Commands:"
    echo "  demo <name>        Create feature/demo-<name> branch"
    echo "  app <name>         Create feature/app-<name> branch"
    echo "  integration <name> Create feature/integration-<name> branch"
    echo "  hotfix <name>      Create hotfix/urgent-<name> branch"
    echo "  finish             Merge current feature/hotfix to appropriate branch"
    echo "  deploy             Deploy develop to main (production)"
    echo "  status             Show branch status"
    echo ""
    echo "Examples:"
    echo "  ./scripts/git-workflow.sh demo customer-service-automation"
    echo "  ./scripts/git-workflow.sh app marketing-site"
    echo "  ./scripts/git-workflow.sh integration supabase"
    echo "  ./scripts/git-workflow.sh hotfix auth-vulnerability"
    echo "  ./scripts/git-workflow.sh finish"
    echo "  ./scripts/git-workflow.sh deploy"
    ;;
esac
