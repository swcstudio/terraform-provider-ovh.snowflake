---
sidebar_position: 1
---

# Introduction

Welcome to the **OVH Snowflake Terraform Provider** documentation! This provider enables you to manage Snowflake resources through OVH's infrastructure using Terraform's declarative configuration language.

## What is the OVH Snowflake Provider?

The OVH Snowflake Terraform Provider is a bridge between Terraform and Snowflake that leverages OVH's cloud infrastructure. It allows you to:

- **Manage Snowflake Resources**: Create and manage databases, schemas, tables, users, roles, and warehouses
- **Infrastructure as Code**: Define your Snowflake infrastructure using declarative HCL configuration
- **OVH Integration**: Leverage OVH's robust cloud infrastructure for enhanced performance and reliability
- **Enterprise Ready**: Built with enterprise-grade security, scalability, and monitoring capabilities

## Key Features

### 🏗️ **Complete Resource Management**
- **Databases & Schemas**: Full lifecycle management of Snowflake databases and schemas
- **Tables & Views**: Create and manage tables, views, and their properties
- **Access Control**: Comprehensive user and role management with fine-grained permissions
- **Compute Resources**: Warehouse provisioning and configuration

### 🔐 **Enterprise Security**
- **Authentication**: Multiple authentication methods including key-pair and OAuth
- **Access Control**: Role-based access control (RBAC) integration
- **Encryption**: End-to-end encryption for data in transit and at rest
- **Audit Logging**: Comprehensive audit trails for compliance

### 🚀 **Performance & Reliability**
- **OVH Infrastructure**: Leverages OVH's high-performance cloud infrastructure
- **Global Availability**: Multi-region support for enhanced availability
- **Optimized Connectivity**: Direct, low-latency connections to Snowflake
- **Monitoring**: Built-in monitoring and alerting capabilities

## Quick Start

Get up and running with the OVH Snowflake provider in just a few steps:

### Prerequisites

Before you begin, ensure you have:

- **Terraform** >= 1.0 installed
- **OVH Account** with API credentials
- **Snowflake Account** with appropriate permissions
- **Go** >= 1.21 (for development)

### Installation

1. **Add the provider to your Terraform configuration:**

```
terraform {
  required_providers {
    ovh-snowflake = {
      source  = "ovh/snowflake"
      version = "~> 0.1.0"
    }
  }
}
```

2. **Configure the provider:**

```
provider "ovh-snowflake" {
  # OVH Configuration
  ovh_endpoint          = "ovh-eu"
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

3. **Initialize Terraform:**

```bash
terraform init
```

### Your First Resource

Create a simple Snowflake database:

```
resource "ovh-snowflake_database" "example" {
  name    = "EXAMPLE_DB"
  comment = "Example database created with OVH Snowflake provider"
  
  tags = {
    environment = "development"
    team        = "data-engineering"
  }
}
```

Apply the configuration:

```bash
terraform plan
terraform apply
```

## Architecture Overview

The OVH Snowflake Terraform Provider provides a comprehensive bridge between Terraform and Snowflake, leveraging OVH's robust cloud infrastructure for enhanced performance, security, and reliability.

![Provider Architecture](/img/diagrams/provider-architecture.svg)

## Documentation Structure

This documentation is organized into several sections to help you find what you need quickly:

### 📚 **Core Documentation**
- **[Installation](./getting-started/installation)** - Detailed setup and configuration guide
- **[Authentication](./getting-started/authentication)** - Authentication setup and configuration

### 🔧 **Resource Reference**
- **[Resources Overview](./resources/overview)** - Complete reference for all supported resources
- **[Data Sources](./data-sources/accounts)** - Available data sources for reading existing infrastructure

### 🛠️ **Development**
- **[Contributing](../community/contributing)** - How to contribute to the provider
- **[API Reference](../api/intro)** - Complete API documentation

## Supported Resources

The provider currently supports the following Snowflake resources:

| Resource Type | Description | Status |
|---------------|-------------|---------|
| `ovh-snowflake_database` | Snowflake databases | ✅ Available |
| `ovh-snowflake_schema` | Database schemas | ✅ Available |
| `ovh-snowflake_table` | Tables and external tables | ✅ Available |
| `ovh-snowflake_view` | Views and materialized views | ✅ Available |
| `ovh-snowflake_user` | User accounts | ✅ Available |
| `ovh-snowflake_role` | Roles and privileges | ✅ Available |
| `ovh-snowflake_warehouse` | Virtual warehouses | ✅ Available |
| `ovh-snowflake_resource_monitor` | Resource monitoring | 🚧 Beta |
| `ovh-snowflake_share` | Data sharing | 🚧 Beta |
| `ovh-snowflake_stream` | Change data capture | 📅 Planned |
| `ovh-snowflake_task` | Scheduled tasks | 📅 Planned |

## Version Compatibility

| Provider Version | Terraform Version | Snowflake Version | OVH API Version |
|------------------|-------------------|-------------------|-----------------|
| 0.1.x | >= 1.0 | >= 6.0 | v1 |
| 0.2.x (planned) | >= 1.0 | >= 7.0 | v1 |

## Getting Help

If you need assistance:

### 📖 **Documentation**
- Browse this documentation for detailed guides and examples
- Check the installation guide for setup instructions
- Review resource documentation for usage details

### 💬 **Community Support**
- [GitHub Discussions](https://github.com/ovh/terraform-provider-ovh-snowflake/discussions) - Community Q&A
- [Stack Overflow](https://stackoverflow.com/questions/tagged/terraform-provider-ovh-snowflake) - Technical questions
- [Discord Community](https://discord.gg/ovh) - Real-time chat support

### 🐛 **Bug Reports & Feature Requests**
- [GitHub Issues](https://github.com/ovh/terraform-provider-ovh-snowflake/issues) - Bug reports and feature requests
- [Feature Request Board](https://github.com/ovh/terraform-provider-ovh-snowflake/discussions/categories/ideas) - Vote on upcoming features

### 🏢 **Enterprise Support**
- **OVH Enterprise Support** - Available for OVH enterprise customers
- **Professional Services** - Implementation and consulting services
- **Training Programs** - Terraform and Snowflake training workshops

## What's Next?

Ready to dive deeper? Here are some recommended next steps:

1. **[Installation Guide](./getting-started/installation)** - Detailed installation walkthrough
2. **[Authentication Setup](./getting-started/authentication)** - Configure authentication
3. **[Resources Overview](./resources/overview)** - Learn about available resources
4. **[Data Sources](./data-sources/accounts)** - Explore data sources

---

:::tip **Pro Tip**
Start with the [Installation guide](./getting-started/installation) for a step-by-step walkthrough of setting up your first Snowflake infrastructure with the OVH provider.
:::

:::info **Stay Updated**
The OVH Snowflake Terraform Provider is actively developed. Check our [changelog](https://github.com/ovh/terraform-provider-ovh-snowflake/releases) for the latest updates and new features.
:::
