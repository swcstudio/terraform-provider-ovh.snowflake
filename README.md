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
      source  = "spectrumwebco/snowflake-ovh"
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

## Support

- [Documentation](https://registry.terraform.io/providers/spectrumwebco/snowflake-ovh/latest/docs)
- [Issues](https://github.com/spectrumwebco/terraform-provider-snowflake-ovh/issues)
- [Discussions](https://github.com/spectrumwebco/terraform-provider-snowflake-ovh/discussions)
