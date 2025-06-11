# Terraform Provider for Snowflake on OVH

This Terraform provider enables management of Snowflake resources on OVH cloud infrastructure, providing cost-effective data warehousing with European data sovereignty.

## Features

- **Complete Snowflake Resource Management**: Warehouses, databases, schemas, tables, users, roles, and more
- **OVH Cloud Integration**: Optimized for OVH infrastructure with cost tracking and performance insights
- **Enterprise Security**: Network policies, resource monitors, and comprehensive RBAC
- **Data Pipeline Support**: Pipes, streams, tasks, and external tables for modern data architectures
- **European Data Sovereignty**: Compliant with GDPR and European data protection regulations

## Quick Start

```hcl
terraform {
  required_providers {
    snowflake-ovh = {
      source  = "swcstudio/snowflake-ovh"
      version = "~> 0.1.0"
    }
  }
}

provider "snowflake-ovh" {
  ovh_endpoint        = var.ovh_endpoint
  ovh_application_key = var.ovh_application_key
  ovh_application_secret = var.ovh_application_secret
  ovh_consumer_key    = var.ovh_consumer_key
  snowflake_account   = var.snowflake_account
  snowflake_username  = var.snowflake_username
  snowflake_password  = var.snowflake_password
}

resource "snowflake_ovh_warehouse" "example" {
  name                = "example_warehouse"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
}

resource "snowflake_ovh_database" "example" {
  name                     = "example_db"
  data_retention_time_in_days = 7
  comment                  = "Example database on OVH"
}
```

## Resources

### Core Resources
- `snowflake_ovh_account` - Snowflake account management
- `snowflake_ovh_warehouse` - Compute warehouses with OVH optimization
- `snowflake_ovh_database` - Database management
- `snowflake_ovh_schema` - Schema management
- `snowflake_ovh_table` - Table management with clustering
- `snowflake_ovh_external_table` - External table management

### Security & Access
- `snowflake_ovh_user` - User management
- `snowflake_ovh_role` - Role management
- `snowflake_ovh_grant` - Permission grants
- `snowflake_ovh_network_policy` - Network access policies

### Data Pipeline
- `snowflake_ovh_pipe` - Data ingestion pipes
- `snowflake_ovh_stream` - Change data capture streams
- `snowflake_ovh_task` - Scheduled tasks and workflows

### Monitoring
- `snowflake_ovh_resource_monitor` - Cost and usage monitoring

## Data Sources

- `snowflake_ovh_accounts` - List available Snowflake accounts

## Authentication

The provider supports multiple authentication methods:

### OVH API Credentials
```hcl
provider "snowflake-ovh" {
  ovh_endpoint        = "ovh-eu"
  ovh_application_key = "your-app-key"
  ovh_application_secret = "your-app-secret"
  ovh_consumer_key    = "your-consumer-key"
}
```

### Environment Variables
```bash
export OVH_ENDPOINT=ovh-eu
export OVH_APPLICATION_KEY=your-app-key
export OVH_APPLICATION_SECRET=your-app-secret
export OVH_CONSUMER_KEY=your-consumer-key
export SNOWFLAKE_ACCOUNT=your-account
export SNOWFLAKE_USERNAME=your-username
export SNOWFLAKE_PASSWORD=your-password
```

## Development

### Requirements
- Go 1.19+
- Terraform 1.0+
- Make

### Building
```bash
make build
```

### Testing
```bash
make test
make testacc
```

### Installing Locally
```bash
make install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `make test`
6. Submit a pull request

## License

This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details.

## Deployment

This provider uses automated CI/CD pipelines for testing, building, and releasing.

### Automated Release Process

Releases are automatically created when a new tag is pushed:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The GitHub Actions workflow will:
- Run comprehensive tests
- Build multi-platform binaries
- Sign releases with GPG
- Create GitHub releases
- Upload all artifacts

### Prerequisites for Maintainers

- GPG private key configured in GitHub Secrets as `GPG_PRIVATE_KEY`
- GPG passphrase configured in GitHub Secrets as `PASSPHRASE`
- Repository configured for automated releases

### Terraform Registry Publication

After a successful release, the provider can be published to the Terraform Registry:

1. Go to [registry.terraform.io](https://registry.terraform.io)
2. Sign in with GitHub
3. Click "Publish" → "Provider"
4. Select `swcstudio/terraform-provider-snowflake-ovh`
5. The registry will automatically detect releases and GPG signatures

## Development

### Getting Started

```bash
# Clone the repository
git clone https://github.com/swcstudio/terraform-provider-snowflake-ovh.git
cd terraform-provider-snowflake-ovh

# Install dependencies
go mod download
go mod tidy

# Build the provider
make build

# Run tests
make test

# Install locally for testing
make install
```

### Continuous Integration

This repository uses GitHub Actions for:

- **Comprehensive Testing**: Unit tests, integration tests, and acceptance tests
- **Code Quality**: Linting with golangci-lint, security scanning with gosec
- **Multi-Platform Builds**: Automated builds for all supported platforms
- **Documentation**: Automated documentation generation and validation
- **Dependency Management**: Automated dependency reviews and license checks

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   ```bash
   # Edit code in internal/
   # Add comprehensive tests
   ```

3. **Run local tests:**
   ```bash
   make fmt test lint
   ```

4. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

The CI pipeline will automatically run all tests and quality checks.

### Testing Framework

We maintain comprehensive test coverage with multiple test types:

#### Unit Tests
```bash
make test
```

#### Integration Tests
```bash
INTEGRATION_TEST=1 make test
```

#### Acceptance Tests
```bash
TF_ACC=1 make testacc
```

#### Performance Tests
```bash
PERFORMANCE_TESTS=1 INTEGRATION_TEST=1 make test
```

### Available Make Targets

```bash
make help     # Show all available targets
make build    # Build the provider binary
make install  # Install provider locally
make test     # Run unit tests
make testacc  # Run acceptance tests
make docs     # Generate documentation
make lint     # Run linter
make fmt      # Format code
make clean    # Clean build artifacts
```

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

#### Quick Contributing Guide

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Make your changes** with comprehensive tests
4. **Ensure CI passes:** All tests, linting, and security checks
5. **Update documentation** if needed
6. **Submit a pull request** with clear description

#### Code Quality Standards

- **Test Coverage**: Maintain >80% test coverage
- **Documentation**: All public APIs must be documented
- **Security**: No hardcoded credentials or security vulnerabilities
- **Performance**: Consider impact on large-scale deployments
- **Compatibility**: Maintain backward compatibility when possible

### Project Structure

```
├── .github/
│   ├── workflows/        # GitHub Actions CI/CD pipelines
│   └── ISSUE_TEMPLATE/   # Issue and PR templates
├── internal/
│   └── provider/         # Provider implementation and tests
├── examples/             # Example configurations
│   ├── main.tf          # Basic example
│   └── local-dev/       # Local development setup
├── docs/                # Auto-generated documentation
├── .goreleaser.yml      # Release configuration
├── .golangci.yml        # Linting configuration
├── CONTRIBUTING.md      # Contribution guidelines
├── SECURITY.md          # Security policy
└── LICENSE              # Mozilla Public License 2.0
```

### Testing Strategy

#### Automated Testing in CI

Our GitHub Actions pipeline runs:
- **Unit Tests** on multiple Go versions (1.20, 1.21)
- **Integration Tests** with real API calls (when credentials available)
- **Acceptance Tests** for Terraform resource lifecycle testing
- **Security Scanning** with gosec and dependency review
- **Performance Tests** for large-scale operations
- **Documentation Validation** ensuring examples are valid

#### Local Testing

```bash
# Run unit tests
make test

# Run with coverage
go test -v -race -coverprofile=coverage.out ./...

# Run acceptance tests (requires credentials)
TF_ACC=1 make testacc

# Run integration tests
INTEGRATION_TEST=1 make test

# Test provider installation
make install
cd examples/local-dev
terraform init && terraform plan
```

#### Test Environment Setup

For acceptance and integration tests, set environment variables:

```bash
export OVH_ENDPOINT="ovh-eu"
export OVH_APPLICATION_KEY="your-key"
export OVH_APPLICATION_SECRET="your-secret"
export OVH_CONSUMER_KEY="your-consumer-key"
export SNOWFLAKE_ACCOUNT="your-account"
export SNOWFLAKE_USERNAME="your-username"
export SNOWFLAKE_PASSWORD="your-password"
```

## Support

- [Documentation](https://registry.terraform.io/providers/swcstudio/snowflake-ovh/latest/docs)
- [Issues](https://github.com/swcstudio/terraform-provider-snowflake-ovh/issues)
- [Discussions](https://github.com/swcstudio/terraform-provider-snowflake-ovh/discussions)
