---
sidebar_position: 1
---

# Installation

This guide walks you through installing and configuring the OVH Snowflake Terraform Provider.

## Prerequisites

Before installing the provider, ensure you have the following prerequisites:

### System Requirements

- **Terraform** >= 1.0.0
- **Go** >= 1.21 (for building from source)
- **Operating System**: Linux, macOS, or Windows

### Account Requirements

- **OVH Account** with API access
- **Snowflake Account** with appropriate permissions
- **Valid API Credentials** for both services

### Permissions Required

#### OVH Permissions
- API key with compute and network management permissions
- Access to OVH Cloud services

#### Snowflake Permissions
- `ACCOUNTADMIN` role (recommended for initial setup)
- Or custom role with the following privileges:
  - `CREATE DATABASE`
  - `CREATE SCHEMA`
  - `CREATE TABLE`
  - `CREATE USER`
  - `CREATE ROLE`
  - `CREATE WAREHOUSE`

## Installation Methods

### Method 1: Terraform Registry (Recommended)

The easiest way to install the provider is through the Terraform Registry.

1. **Add the provider to your Terraform configuration:**

```title="main.tf"
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    ovh-snowflake = {
      source  = "ovh/snowflake"
      version = "~> 0.1.0"
    }
  }
}
```

2. **Initialize Terraform:**

```bash
terraform init
```

Terraform will automatically download and install the provider.

### Method 2: Manual Installation

For air-gapped environments or specific version requirements:

1. **Download the provider binary:**

```bash
# Linux AMD64
wget https://github.com/ovh/terraform-provider-ovh-snowflake/releases/download/v0.1.0/terraform-provider-ovh-snowflake_0.1.0_linux_amd64.zip

# macOS AMD64
wget https://github.com/ovh/terraform-provider-ovh-snowflake/releases/download/v0.1.0/terraform-provider-ovh-snowflake_0.1.0_darwin_amd64.zip

# macOS ARM64 (Apple Silicon)
wget https://github.com/ovh/terraform-provider-ovh-snowflake/releases/download/v0.1.0/terraform-provider-ovh-snowflake_0.1.0_darwin_arm64.zip

# Windows AMD64
wget https://github.com/ovh/terraform-provider-ovh-snowflake/releases/download/v0.1.0/terraform-provider-ovh-snowflake_0.1.0_windows_amd64.zip
```

2. **Extract and install:**

```bash
# Create provider directory
mkdir -p ~/.terraform.d/plugins/registry.terraform.io/ovh/snowflake/0.1.0/linux_amd64

# Extract binary
unzip terraform-provider-ovh-snowflake_0.1.0_linux_amd64.zip

# Move to provider directory
mv terraform-provider-ovh-snowflake_v0.1.0 ~/.terraform.d/plugins/registry.terraform.io/ovh/snowflake/0.1.0/linux_amd64/
```

3. **Configure provider installation:**

```title="terraform.tf"
terraform {
  required_providers {
    ovh-snowflake = {
      source  = "registry.terraform.io/ovh/snowflake"
      version = "0.1.0"
    }
  }
}
```

### Method 3: Build from Source

For development or customization purposes:

1. **Clone the repository:**

```bash
git clone https://github.com/ovh/terraform-provider-ovh-snowflake.git
cd terraform-provider-ovh-snowflake
```

2. **Build the provider:**

```bash
make build
```

3. **Install locally:**

```bash
make install
```

## Provider Configuration

### Basic Configuration

Create a provider configuration block:

```title="provider.tf"
provider "ovh-snowflake" {
  # OVH Configuration
  ovh_endpoint          = "ovh-eu"  # or "ovh-us", "ovh-ca"
  ovh_application_key   = var.ovh_application_key
  ovh_application_secret = var.ovh_application_secret
  ovh_consumer_key      = var.ovh_consumer_key
  
  # Snowflake Configuration
  snowflake_account     = var.snowflake_account
  snowflake_user        = var.snowflake_user
  snowflake_private_key = var.snowflake_private_key
  snowflake_region      = var.snowflake_region
}
```

### Environment Variables

You can also configure the provider using environment variables:

```bash title=".env"
# OVH Configuration
export OVH_ENDPOINT="ovh-eu"
export OVH_APPLICATION_KEY="your-application-key"
export OVH_APPLICATION_SECRET="your-application-secret"
export OVH_CONSUMER_KEY="your-consumer-key"

# Snowflake Configuration
export SNOWFLAKE_ACCOUNT="your-account"
export SNOWFLAKE_USER="your-username"
export SNOWFLAKE_PRIVATE_KEY="your-private-key"
export SNOWFLAKE_REGION="your-region"
```

### Variables Configuration

Create a `variables.tf` file for better management:

```title="variables.tf"
# OVH Variables
variable "ovh_application_key" {
  description = "OVH API Application Key"
  type        = string
  sensitive   = true
}

variable "ovh_application_secret" {
  description = "OVH API Application Secret"
  type        = string
  sensitive   = true
}

variable "ovh_consumer_key" {
  description = "OVH API Consumer Key"
  type        = string
  sensitive   = true
}

# Snowflake Variables
variable "snowflake_account" {
  description = "Snowflake Account Identifier"
  type        = string
}

variable "snowflake_user" {
  description = "Snowflake Username"
  type        = string
}

variable "snowflake_private_key" {
  description = "Snowflake Private Key for Authentication"
  type        = string
  sensitive   = true
}

variable "snowflake_region" {
  description = "Snowflake Region"
  type        = string
  default     = "us-east-1"
}
```

And a `terraform.tfvars` file:

```title="terraform.tfvars"
# OVH Configuration
ovh_application_key    = "your-ovh-app-key"
ovh_application_secret = "your-ovh-app-secret"
ovh_consumer_key      = "your-ovh-consumer-key"

# Snowflake Configuration
snowflake_account     = "your-snowflake-account"
snowflake_user        = "your-snowflake-user"
snowflake_private_key = "your-snowflake-private-key"
snowflake_region      = "us-east-1"
```

## Installation Verification

### Test Provider Installation

1. **Create a simple test configuration:**

```title="test.tf"
terraform {
  required_providers {
    ovh-snowflake = {
      source  = "ovh/snowflake"
      version = "~> 0.1.0"
    }
  }
}

provider "ovh-snowflake" {
  # Configuration here
}

# Test data source
data "ovh-snowflake_current_account" "test" {}

output "account_info" {
  value = data.ovh-snowflake_current_account.test
}
```

2. **Initialize and validate:**

```bash
terraform init
terraform validate
terraform plan
```

### Verify Provider Registration

Check that Terraform recognizes the provider:

```bash
terraform providers
```

Expected output:
```
Providers required by configuration:
.
└── provider[registry.terraform.io/ovh/snowflake] ~> 0.1.0
```

### Test Connectivity

Create a simple resource to test connectivity:

```title="connectivity-test.tf"
resource "ovh-snowflake_database" "test" {
  name    = "TEST_CONNECTIVITY_DB"
  comment = "Test database to verify provider connectivity"
}
```

```bash
terraform plan
```

If the plan succeeds without authentication errors, your installation is working correctly.

## Docker Installation

For containerized environments:

```dockerfile title="Dockerfile"
FROM hashicorp/terraform:1.6

# Copy provider binary
COPY terraform-provider-ovh-snowflake /usr/local/bin/

# Set provider permissions
RUN chmod +x /usr/local/bin/terraform-provider-ovh-snowflake

# Create provider directory
RUN mkdir -p /root/.terraform.d/plugins/registry.terraform.io/ovh/snowflake/0.1.0/linux_amd64/

# Link provider
RUN ln -s /usr/local/bin/terraform-provider-ovh-snowflake \
    /root/.terraform.d/plugins/registry.terraform.io/ovh/snowflake/0.1.0/linux_amd64/terraform-provider-ovh-snowflake_v0.1.0

WORKDIR /workspace
```

## Troubleshooting

### Common Installation Issues

#### Provider Not Found

**Error:**
```
Error: Failed to query available provider packages
```

**Solution:**
1. Check your Terraform version: `terraform version`
2. Verify provider source in configuration
3. Run `terraform init -upgrade`

#### Authentication Failures

**Error:**
```
Error: Authentication failed
```

**Solution:**
1. Verify OVH API credentials
2. Check Snowflake key-pair authentication
3. Ensure proper permissions are granted

#### Version Conflicts

**Error:**
```
Error: Incompatible provider version
```

**Solution:**
1. Update version constraints in `required_providers`
2. Run `terraform init -upgrade`
3. Check for conflicting provider versions

#### Network Connectivity

**Error:**
```
Error: Connection timeout
```

**Solution:**
1. Check firewall settings
2. Verify network connectivity to OVH and Snowflake APIs
3. Configure proxy settings if needed

### Debug Mode

Enable debug logging for troubleshooting:

```bash
export TF_LOG=DEBUG
export TF_LOG_PATH=./terraform.log
terraform plan
```

### Getting Help

If you encounter issues:

1. **Check the logs** with debug mode enabled
2. **Review documentation** for configuration requirements
3. **Search existing issues** on GitHub
4. **Create a new issue** with detailed information

### Proxy Configuration

For environments behind a proxy:

```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1
```

## Next Steps

Once installation is complete:

1. **[Configure Authentication](./authentication)** - Set up secure authentication
2. **[Review Resources](../resources/overview)** - Explore available resources
3. **[Check Data Sources](../data-sources/accounts)** - Learn about data sources
4. **[API Reference](/api/intro)** - Review API documentation

---

:::tip Pro Tip
Use Terraform workspaces to manage multiple environments with the same provider configuration.
:::

:::warning Important
Always store sensitive credentials securely using Terraform variables, environment variables, or secret management systems. Never commit credentials to version control.
:::