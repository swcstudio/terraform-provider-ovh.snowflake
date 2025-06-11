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

### Prerequisites

Before deploying this provider to the Terraform Registry, ensure you have:

- ✅ **Go 1.18+** installed
- ✅ **GoReleaser** installed (`brew install goreleaser`)
- ✅ **GPG key** configured for signing releases
- ✅ **GitHub Personal Access Token** with repo permissions
- ✅ **Clean git state** (no uncommitted changes)

### Quick Deploy

For maintainers, use the automated release script:

```bash
# Set your GitHub token
export GITHUB_TOKEN=your_github_token_here

# Create and publish a release
./scripts/release.sh v0.1.0
```

### Manual Deployment Steps

1. **Prepare the release:**
   ```bash
   git checkout main
   git pull origin main
   make test
   ```

2. **Create and push a tag:**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

3. **Build and publish:**
   ```bash
   export GPG_TTY=$(tty)
   export GPG_FINGERPRINT=your_gpg_fingerprint
   export GITHUB_TOKEN=your_github_token
   goreleaser release --clean
   ```

4. **Register with Terraform Registry:**
   - Go to [registry.terraform.io](https://registry.terraform.io)
   - Sign in with GitHub
   - Click "Publish" → "Provider"
   - Select `swcstudio/terraform-provider-snowflake-ovh`
   - Add your GPG public key

## Development

### Quick Start Development

Run the automated development setup:

```bash
./scripts/dev-setup.sh
```

This will install all dependencies and configure your development environment.

### Manual Development Setup

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

# Run acceptance tests (requires API credentials)
make testacc

# Install locally for testing
make install
```

### Development Workflow

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API credentials
   ```

2. **Make your changes:**
   ```bash
   # Edit code in internal/
   # Add tests in internal/provider/*_test.go
   ```

3. **Test your changes:**
   ```bash
   make fmt      # Format code
   make lint     # Run linter
   make test     # Run unit tests
   make build    # Build provider
   ```

4. **Test locally:**
   ```bash
   make install  # Install to local Terraform
   cd examples/local-dev
   terraform init
   terraform plan
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

### Development Shortcuts

Use the development helper script for common tasks:

```bash
./dev.sh build    # Build provider
./dev.sh test     # Run tests
./dev.sh install  # Install locally
./dev.sh docs     # Generate docs
./dev.sh release v0.1.0  # Create release
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Make your changes** following the development workflow above
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Commit your changes:** `git commit -am 'Add some feature'`
7. **Push to the branch:** `git push origin feature/your-feature-name`
8. **Submit a pull request**

### Project Structure

```
├── internal/
│   └── provider/          # Provider implementation
├── examples/              # Example configurations
│   ├── main.tf           # Basic example
│   └── local-dev/        # Local development setup
├── docs/                 # Auto-generated documentation
├── scripts/              # Development and release scripts
│   ├── dev-setup.sh      # Development environment setup
│   └── release.sh        # Automated release script
├── CONTRIBUTING.md       # Contribution guidelines
├── DEPLOYMENT_CHECKLIST.md # Deployment checklist
└── .goreleaser.yml       # Release configuration
```

### Testing

#### Unit Tests
```bash
make test
```

#### Acceptance Tests
Acceptance tests require valid OVH and Snowflake credentials:

```bash
export OVH_ENDPOINT="ovh-eu"
export OVH_APPLICATION_KEY="your-key"
export OVH_APPLICATION_SECRET="your-secret" 
export OVH_CONSUMER_KEY="your-consumer-key"
export SNOWFLAKE_ACCOUNT="your-account"
export SNOWFLAKE_USERNAME="your-username"
export SNOWFLAKE_PASSWORD="your-password"

make testacc
```

#### Local Testing
```bash
# Install provider locally
make install

# Test with example configuration
cd examples/local-dev
terraform init
terraform plan
terraform apply
```

## Support

- [Documentation](https://registry.terraform.io/providers/swcstudio/snowflake-ovh/latest/docs)
- [Issues](https://github.com/swcstudio/terraform-provider-snowflake-ovh/issues)
- [Discussions](https://github.com/swcstudio/terraform-provider-snowflake-ovh/discussions)
