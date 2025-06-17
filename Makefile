# ============================================
# Terraform Provider for Snowflake on OVHcloud
# Production-Ready Makefile
# Built by Spectrum Web Co
# ============================================

# Default shell
SHELL := /bin/bash

# Project configuration
PROJECT_NAME := terraform-provider-ovh-snowflake
PROVIDER_NAME := ovh
BINARY_NAME := terraform-provider-$(PROVIDER_NAME)
VERSION := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_DATE := $(shell date -u '+%Y-%m-%d_%H:%M:%S')

# Go configuration
GO_VERSION := 1.21
GOOS := $(shell go env GOOS)
GOARCH := $(shell go env GOARCH)
GO_MODULE := $(shell go list -m)

# Build configuration
BUILD_DIR := build
DIST_DIR := dist
DOCS_DIR := docs
WEBSITE_DIR := website

# Terraform configuration
TERRAFORM_VERSION := 1.5.0
TF_PLUGIN_DIR := ~/.terraform.d/plugins
LOCAL_PLUGIN_PATH := $(TF_PLUGIN_DIR)/registry.terraform.io/swcstudio/snowflake/$(VERSION)/$(GOOS)_$(GOARCH)

# Documentation configuration
TFPLUGINDOCS_VERSION := latest
MERMAID_VERSION := latest

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[1;37m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# ============================================
# Build Targets
# ============================================

.PHONY: build
build: ## Build the provider binary
	@echo -e "$(BLUE)Building $(BINARY_NAME) v$(VERSION)...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@CGO_ENABLED=0 go build \
		-ldflags="-s -w -X main.version=$(VERSION) -X main.commit=$(COMMIT) -X main.buildDate=$(BUILD_DATE)" \
		-o $(BUILD_DIR)/$(BINARY_NAME) \
		./
	@echo -e "$(GREEN)✅ Build complete: $(BUILD_DIR)/$(BINARY_NAME)$(NC)"

.PHONY: build-all
build-all: ## Build for all supported platforms
	@echo -e "$(BLUE)Building for all platforms...$(NC)"
	@mkdir -p $(DIST_DIR)
	@for os in linux darwin windows; do \
		for arch in amd64 arm64; do \
			if [[ "$$os" == "windows" && "$$arch" == "arm64" ]]; then continue; fi; \
			echo -e "$(CYAN)Building for $$os/$$arch...$(NC)"; \
			ext=""; \
			if [[ "$$os" == "windows" ]]; then ext=".exe"; fi; \
			CGO_ENABLED=0 GOOS=$$os GOARCH=$$arch go build \
				-ldflags="-s -w -X main.version=$(VERSION) -X main.commit=$(COMMIT) -X main.buildDate=$(BUILD_DATE)" \
				-o $(DIST_DIR)/$(BINARY_NAME)_$(VERSION)_$${os}_$${arch}$$ext \
				./; \
		done; \
	done
	@echo -e "$(GREEN)✅ Multi-platform build complete$(NC)"

.PHONY: install
install: build ## Install the provider locally for development
	@echo -e "$(BLUE)Installing provider locally...$(NC)"
	@mkdir -p $(LOCAL_PLUGIN_PATH)
	@cp $(BUILD_DIR)/$(BINARY_NAME) $(LOCAL_PLUGIN_PATH)/$(BINARY_NAME)_v$(VERSION)
	@echo -e "$(GREEN)✅ Provider installed to: $(LOCAL_PLUGIN_PATH)$(NC)"
	@echo -e "$(YELLOW)You can now use the provider in your Terraform configurations$(NC)"

.PHONY: uninstall
uninstall: ## Remove locally installed provider
	@echo -e "$(BLUE)Removing local provider installation...$(NC)"
	@rm -rf $(TF_PLUGIN_DIR)/registry.terraform.io/swcstudio/snowflake
	@echo -e "$(GREEN)✅ Local provider installation removed$(NC)"

# ============================================
# Development Targets
# ============================================

.PHONY: dev-setup
dev-setup: ## Set up development environment
	@echo -e "$(BLUE)Setting up development environment...$(NC)"
	@echo -e "$(CYAN)Installing Go tools...$(NC)"
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@go install github.com/securecodewarrior/sast-scan/cmd/gosec@latest
	@go install github.com/hashicorp/terraform-plugin-docs/cmd/tfplugindocs@$(TFPLUGINDOCS_VERSION)
	@go install honnef.co/go/tools/cmd/staticcheck@latest
	@echo -e "$(CYAN)Installing Node.js tools...$(NC)"
	@if command -v npm >/dev/null 2>&1; then \
		npm install -g @mermaid-js/mermaid-cli@$(MERMAID_VERSION); \
		npm install -g prettier; \
		npm install -g markdownlint-cli; \
	else \
		echo -e "$(YELLOW)⚠️  npm not found, skipping Node.js tools installation$(NC)"; \
	fi
	@echo -e "$(GREEN)✅ Development environment setup complete$(NC)"

.PHONY: deps
deps: ## Download and tidy dependencies
	@echo -e "$(BLUE)Managing Go dependencies...$(NC)"
	@go mod download
	@go mod tidy
	@go mod verify
	@echo -e "$(GREEN)✅ Dependencies updated$(NC)"

.PHONY: clean-deps
clean-deps: ## Clean module cache and re-download dependencies
	@echo -e "$(BLUE)Cleaning module cache...$(NC)"
	@go clean -modcache
	@go mod download
	@go mod tidy
	@echo -e "$(GREEN)✅ Module cache cleaned and dependencies refreshed$(NC)"

.PHONY: fmt
fmt: ## Format Go code
	@echo -e "$(BLUE)Formatting Go code...$(NC)"
	@go fmt ./...
	@echo -e "$(GREEN)✅ Code formatted$(NC)"

.PHONY: vet
vet: ## Run go vet
	@echo -e "$(BLUE)Running go vet...$(NC)"
	@go vet ./...
	@echo -e "$(GREEN)✅ go vet passed$(NC)"

.PHONY: lint
lint: ## Run linters
	@echo -e "$(BLUE)Running linters...$(NC)"
	@golangci-lint run ./...
	@echo -e "$(GREEN)✅ Linting passed$(NC)"

.PHONY: staticcheck
staticcheck: ## Run staticcheck
	@echo -e "$(BLUE)Running staticcheck...$(NC)"
	@staticcheck ./...
	@echo -e "$(GREEN)✅ Static analysis passed$(NC)"

.PHONY: security
security: ## Run security scan
	@echo -e "$(BLUE)Running security scan...$(NC)"
	@gosec -quiet ./...
	@echo -e "$(GREEN)✅ Security scan passed$(NC)"

.PHONY: check
check: fmt vet lint staticcheck security ## Run all code quality checks
	@echo -e "$(GREEN)✅ All code quality checks passed$(NC)"

# ============================================
# Testing Targets
# ============================================

.PHONY: test
test: ## Run unit tests
	@echo -e "$(BLUE)Running unit tests...$(NC)"
	@go test -v -race -timeout=5m ./...
	@echo -e "$(GREEN)✅ Unit tests passed$(NC)"

.PHONY: test-coverage
test-coverage: ## Run tests with coverage
	@echo -e "$(BLUE)Running tests with coverage...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@go test -v -race -timeout=5m -coverprofile=$(BUILD_DIR)/coverage.out -covermode=atomic ./...
	@go tool cover -html=$(BUILD_DIR)/coverage.out -o $(BUILD_DIR)/coverage.html
	@go tool cover -func=$(BUILD_DIR)/coverage.out | tail -1
	@echo -e "$(GREEN)✅ Coverage report generated: $(BUILD_DIR)/coverage.html$(NC)"

.PHONY: test-integration
test-integration: ## Run integration tests
	@echo -e "$(BLUE)Running integration tests...$(NC)"
	@if [[ -z "$$OVH_APPLICATION_KEY" ]]; then \
		echo -e "$(YELLOW)⚠️  OVH credentials not set, skipping integration tests$(NC)"; \
		echo -e "$(YELLOW)Set OVH_APPLICATION_KEY, OVH_APPLICATION_SECRET, and OVH_CONSUMER_KEY to run integration tests$(NC)"; \
	else \
		INTEGRATION_TEST=1 go test -v -timeout=30m ./internal/provider/...; \
	fi

.PHONY: test-acc
test-acc: ## Run acceptance tests
	@echo -e "$(BLUE)Running acceptance tests...$(NC)"
	@if [[ -z "$$TF_ACC" ]]; then \
		echo -e "$(YELLOW)⚠️  TF_ACC not set, setting it now$(NC)"; \
		export TF_ACC=1; \
	fi
	@if [[ -z "$$OVH_APPLICATION_KEY" ]]; then \
		echo -e "$(RED)❌ OVH credentials required for acceptance tests$(NC)"; \
		echo -e "$(YELLOW)Set OVH_APPLICATION_KEY, OVH_APPLICATION_SECRET, and OVH_CONSUMER_KEY$(NC)"; \
		exit 1; \
	fi
	@TF_ACC=1 go test -v -timeout=120m ./internal/provider/...

.PHONY: test-all
test-all: test test-integration test-acc ## Run all tests
	@echo -e "$(GREEN)✅ All tests completed$(NC)"

.PHONY: benchmark
benchmark: ## Run benchmarks
	@echo -e "$(BLUE)Running benchmarks...$(NC)"
	@go test -bench=. -benchmem ./...
	@echo -e "$(GREEN)✅ Benchmarks completed$(NC)"

# ============================================
# Documentation Targets
# ============================================

.PHONY: docs
docs: ## Generate provider documentation
	@echo -e "$(BLUE)Generating provider documentation...$(NC)"
	@tfplugindocs generate --provider-name $(PROVIDER_NAME)
	@echo -e "$(GREEN)✅ Provider documentation generated$(NC)"

.PHONY: docs-website-setup
docs-website-setup: ## Set up documentation website
	@echo -e "$(BLUE)Setting up documentation website...$(NC)"
	@cd $(WEBSITE_DIR) && npm ci
	@echo -e "$(GREEN)✅ Documentation website dependencies installed$(NC)"

.PHONY: docs-website-build
docs-website-build: docs-website-setup ## Build documentation website
	@echo -e "$(BLUE)Building documentation website...$(NC)"
	@cd $(WEBSITE_DIR) && npm run build
	@echo -e "$(GREEN)✅ Documentation website built$(NC)"

.PHONY: docs-website-start
docs-website-start: docs-website-setup ## Start documentation website locally
	@echo -e "$(BLUE)Starting documentation website...$(NC)"
	@echo -e "$(CYAN)Website will be available at: http://localhost:3000$(NC)"
	@cd $(WEBSITE_DIR) && npm start

.PHONY: docs-website-deploy
docs-website-deploy: docs-website-build ## Deploy documentation website
	@echo -e "$(BLUE)Deploying documentation website...$(NC)"
	@cd $(WEBSITE_DIR) && npm run deploy
	@echo -e "$(GREEN)✅ Documentation website deployed$(NC)"

.PHONY: docs-diagrams
docs-diagrams: ## Generate documentation diagrams
	@echo -e "$(BLUE)Generating documentation diagrams...$(NC)"
	@mkdir -p $(WEBSITE_DIR)/static/img/diagrams
	@if command -v mmdc >/dev/null 2>&1; then \
		find $(WEBSITE_DIR)/static/img/diagrams -name "*.mmd" -exec mmdc -i {} -o {}.svg -t dark -b transparent \; ; \
		echo -e "$(GREEN)✅ Diagrams generated$(NC)"; \
	else \
		echo -e "$(YELLOW)⚠️  mermaid-cli not found, run 'make dev-setup' to install$(NC)"; \
	fi

.PHONY: docs-all
docs-all: docs docs-diagrams docs-website-build ## Generate all documentation
	@echo -e "$(GREEN)✅ All documentation generated$(NC)"

# ============================================
# Release Targets
# ============================================

.PHONY: release-check
release-check: ## Check if ready for release
	@echo -e "$(BLUE)Checking release readiness...$(NC)"
	@if [[ -z "$(shell git status --porcelain)" ]]; then \
		echo -e "$(GREEN)✅ Working directory is clean$(NC)"; \
	else \
		echo -e "$(RED)❌ Working directory has uncommitted changes$(NC)"; \
		exit 1; \
	fi
	@if git describe --tags --exact-match >/dev/null 2>&1; then \
		echo -e "$(GREEN)✅ Current commit is tagged$(NC)"; \
	else \
		echo -e "$(YELLOW)⚠️  Current commit is not tagged$(NC)"; \
	fi
	@echo -e "$(GREEN)✅ Release check complete$(NC)"

.PHONY: release-notes
release-notes: ## Generate release notes
	@echo -e "$(BLUE)Generating release notes...$(NC)"
	@if command -v git-cliff >/dev/null 2>&1; then \
		git-cliff --latest; \
	else \
		echo -e "$(YELLOW)⚠️  git-cliff not found, showing recent commits:$(NC)"; \
		git log --oneline --since="1 month ago"; \
	fi

.PHONY: tag
tag: ## Create and push a new tag
	@read -p "Enter tag version (e.g., v1.0.0): " tag; \
	git tag -a $$tag -m "Release $$tag"; \
	git push origin $$tag; \
	echo -e "$(GREEN)✅ Tag $$tag created and pushed$(NC)"

# ============================================
# Local Development Targets
# ============================================

.PHONY: dev-terraform-init
dev-terraform-init: install ## Initialize Terraform with local provider
	@echo -e "$(BLUE)Initializing Terraform with local provider...$(NC)"
	@cd examples/local-dev && terraform init
	@echo -e "$(GREEN)✅ Terraform initialized$(NC)"

.PHONY: dev-terraform-plan
dev-terraform-plan: dev-terraform-init ## Run Terraform plan with local provider
	@echo -e "$(BLUE)Running Terraform plan...$(NC)"
	@cd examples/local-dev && terraform plan
	@echo -e "$(GREEN)✅ Terraform plan completed$(NC)"

.PHONY: dev-terraform-apply
dev-terraform-apply: dev-terraform-plan ## Apply Terraform configuration with local provider
	@echo -e "$(BLUE)Applying Terraform configuration...$(NC)"
	@cd examples/local-dev && terraform apply -auto-approve
	@echo -e "$(GREEN)✅ Terraform apply completed$(NC)"

.PHONY: dev-terraform-destroy
dev-terraform-destroy: ## Destroy Terraform resources
	@echo -e "$(BLUE)Destroying Terraform resources...$(NC)"
	@cd examples/local-dev && terraform destroy -auto-approve
	@echo -e "$(GREEN)✅ Terraform destroy completed$(NC)"

# ============================================
# Cleanup Targets
# ============================================

.PHONY: clean
clean: ## Clean build artifacts
	@echo -e "$(BLUE)Cleaning build artifacts...$(NC)"
	@rm -rf $(BUILD_DIR)
	@rm -rf $(DIST_DIR)
	@rm -f $(BINARY_NAME)
	@rm -f terraform-provider-*
	@echo -e "$(GREEN)✅ Build artifacts cleaned$(NC)"

.PHONY: clean-docs
clean-docs: ## Clean generated documentation
	@echo -e "$(BLUE)Cleaning generated documentation...$(NC)"
	@rm -rf $(DOCS_DIR)/data-sources
	@rm -rf $(DOCS_DIR)/resources
	@rm -rf $(DOCS_DIR)/guides
	@rm -rf $(WEBSITE_DIR)/build
	@rm -rf $(WEBSITE_DIR)/.docusaurus
	@rm -rf $(WEBSITE_DIR)/node_modules
	@echo -e "$(GREEN)✅ Documentation cleaned$(NC)"

.PHONY: clean-all
clean-all: clean clean-docs ## Clean everything
	@echo -e "$(BLUE)Cleaning everything...$(NC)"
	@go clean -cache -modcache -testcache
	@rm -rf ~/.terraform.d/plugins/registry.terraform.io/swcstudio
	@echo -e "$(GREEN)✅ Everything cleaned$(NC)"

# ============================================
# CI/CD Targets
# ============================================

.PHONY: ci-setup
ci-setup: ## Set up CI environment
	@echo -e "$(BLUE)Setting up CI environment...$(NC)"
	@go version
	@terraform version
	@echo -e "$(GREEN)✅ CI environment ready$(NC)"

.PHONY: ci-test
ci-test: check test test-coverage ## Run CI tests
	@echo -e "$(GREEN)✅ CI tests completed$(NC)"

.PHONY: ci-build
ci-build: build-all ## Run CI build
	@echo -e "$(GREEN)✅ CI build completed$(NC)"

.PHONY: ci-docs
ci-docs: docs-all ## Run CI documentation generation
	@echo -e "$(GREEN)✅ CI documentation generation completed$(NC)"

.PHONY: ci-all
ci-all: ci-setup ci-test ci-build ci-docs ## Run all CI tasks
	@echo -e "$(GREEN)✅ All CI tasks completed$(NC)"

# ============================================
# Utility Targets
# ============================================

.PHONY: version
version: ## Show version information
	@echo -e "$(BLUE)Version Information:$(NC)"
	@echo -e "$(CYAN)Project:$(NC) $(PROJECT_NAME)"
	@echo -e "$(CYAN)Version:$(NC) $(VERSION)"
	@echo -e "$(CYAN)Commit:$(NC) $(COMMIT)"
	@echo -e "$(CYAN)Build Date:$(NC) $(BUILD_DATE)"
	@echo -e "$(CYAN)Go Version:$(NC) $(shell go version)"
	@echo -e "$(CYAN)Platform:$(NC) $(GOOS)/$(GOARCH)"

.PHONY: env
env: ## Show environment information
	@echo -e "$(BLUE)Environment Information:$(NC)"
	@echo -e "$(CYAN)GOOS:$(NC) $(GOOS)"
	@echo -e "$(CYAN)GOARCH:$(NC) $(GOARCH)"
	@echo -e "$(CYAN)GOPATH:$(NC) $(GOPATH)"
	@echo -e "$(CYAN)GOROOT:$(NC) $(GOROOT)"
	@echo -e "$(CYAN)GO_MODULE:$(NC) $(GO_MODULE)"
	@echo -e "$(CYAN)BUILD_DIR:$(NC) $(BUILD_DIR)"
	@echo -e "$(CYAN)DIST_DIR:$(NC) $(DIST_DIR)"
	@echo -e "$(CYAN)TF_PLUGIN_DIR:$(NC) $(TF_PLUGIN_DIR)"

.PHONY: status
status: ## Show project status
	@echo -e "$(BLUE)Project Status:$(NC)"
	@echo -e "$(CYAN)Git Status:$(NC)"
	@git status --short
	@echo -e "$(CYAN)Git Branch:$(NC) $(shell git branch --show-current)"
	@echo -e "$(CYAN)Last Commit:$(NC) $(shell git log -1 --oneline)"
	@echo -e "$(CYAN)Go Modules:$(NC)"
	@go list -m all | head -5
	@if [[ -f "$(BUILD_DIR)/$(BINARY_NAME)" ]]; then \
		echo -e "$(CYAN)Binary:$(NC) $(BUILD_DIR)/$(BINARY_NAME) ($(shell stat -f%z $(BUILD_DIR)/$(BINARY_NAME) 2>/dev/null || stat -c%s $(BUILD_DIR)/$(BINARY_NAME) 2>/dev/null || echo 'unknown') bytes)"; \
	else \
		echo -e "$(CYAN)Binary:$(NC) Not built"; \
	fi

.PHONY: help
help: ## Show this help message
	@echo -e "$(WHITE)╔══════════════════════════════════════════════════════════════════════════════╗$(NC)"
	@echo -e "$(WHITE)║$(NC)  $(CYAN)Terraform Provider for Snowflake on OVHcloud$(NC) - $(PURPLE)Makefile Help$(NC)      $(WHITE)║$(NC)"
	@echo -e "$(WHITE)║$(NC)  $(YELLOW)Built by Spectrum Web Co$(NC) • $(GREEN)Production Ready$(NC)                          $(WHITE)║$(NC)"
	@echo -e "$(WHITE)╚══════════════════════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo -e "$(BLUE)📋 Available Targets:$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort
	@echo ""
	@echo -e "$(BLUE)🚀 Quick Start:$(NC)"
	@echo -e "  $(YELLOW)make dev-setup$(NC)     # Set up development environment"
	@echo -e "  $(YELLOW)make build$(NC)         # Build the provider"
	@echo -e "  $(YELLOW)make install$(NC)       # Install provider locally"
	@echo -e "  $(YELLOW)make test$(NC)          # Run tests"
	@echo -e "  $(YELLOW)make docs$(NC)          # Generate documentation"
	@echo ""
	@echo -e "$(BLUE)💡 Examples:$(NC)"
	@echo -e "  $(GRAY)make build install                    # Build and install$(NC)"
	@echo -e "  $(GRAY)make check test                       # Quality checks and tests$(NC)"
	@echo -e "  $(GRAY)make docs-website-start              # Start docs website$(NC)"
	@echo -e "  $(GRAY)make ci-all                          # Run all CI tasks$(NC)"
	@echo ""
	@echo -e "$(GREEN)Ready to build amazing Terraform providers! 🚀$(NC)"

# ============================================
# Phony target declarations
# ============================================

.PHONY: all
all: clean check build test docs ## Run clean, check, build, test, and docs
	@echo -e "$(GREEN)✅ All tasks completed successfully$(NC)"

# Special target to check if Make is working
.PHONY: ping
ping: ## Test if Makefile is working
	@echo -e "$(GREEN)🏓 Pong! Makefile is working correctly$(NC)"
	@echo -e "$(CYAN)Version: $(VERSION)$(NC)"
	@echo -e "$(CYAN)Platform: $(GOOS)/$(GOARCH)$(NC)"