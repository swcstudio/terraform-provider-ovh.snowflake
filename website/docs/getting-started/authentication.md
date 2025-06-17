---
sidebar_position: 2
---

# Authentication

The OVH Snowflake Terraform Provider supports multiple authentication methods to securely connect to both OVH and Snowflake services.

## Authentication Flow

![Authentication Flow](/img/diagrams/authentication-flow.svg)

## Supported Authentication Methods

### OVH API Authentication

The provider uses OVH API keys for authentication with OVH services:

```hcl
provider "ovh-snowflake" {
  ovh_endpoint          = "ovh-eu"
  ovh_application_key   = var.ovh_application_key
  ovh_application_secret = var.ovh_application_secret
  ovh_consumer_key      = var.ovh_consumer_key
}
```

### Snowflake Authentication

For Snowflake authentication, the provider supports key-pair authentication:

```hcl
provider "ovh-snowflake" {
  snowflake_account     = var.snowflake_account
  snowflake_user        = var.snowflake_user
  snowflake_private_key = var.snowflake_private_key
  snowflake_region      = var.snowflake_region
}
```

## Security Best Practices

- Store credentials securely using Terraform variables
- Use environment variables for sensitive data
- Implement proper key rotation policies
- Monitor authentication logs regularly
