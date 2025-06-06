---
page_title: "Provider: Snowflake OVH"
description: |-
  The Snowflake OVH provider enables management of Snowflake resources on OVH cloud infrastructure.
---

# Snowflake OVH Provider

The Snowflake OVH provider enables management of Snowflake resources on OVH cloud infrastructure, providing cost-effective data warehousing with European data sovereignty.

## Example Usage

```terraform
terraform {
  required_providers {
    snowflake-ovh = {
      source  = "spectrumwebco/snowflake-ovh"
      version = "~> 0.1.0"
    }
  }
}

provider "snowflake-ovh" {
  ovh_endpoint        = "ovh-eu"
  ovh_application_key = var.ovh_application_key
  ovh_application_secret = var.ovh_application_secret
  ovh_consumer_key    = var.ovh_consumer_key
  snowflake_account   = var.snowflake_account
  snowflake_username  = var.snowflake_username
  snowflake_password  = var.snowflake_password
}
```

## Authentication

The provider supports authentication via OVH API credentials and Snowflake credentials.

### OVH API Credentials

You can provide credentials via provider configuration:

```terraform
provider "snowflake-ovh" {
  ovh_endpoint        = "ovh-eu"
  ovh_application_key = "your-app-key"
  ovh_application_secret = "your-app-secret"
  ovh_consumer_key    = "your-consumer-key"
}
```

Or via environment variables:

```bash
export OVH_ENDPOINT=ovh-eu
export OVH_APPLICATION_KEY=your-app-key
export OVH_APPLICATION_SECRET=your-app-secret
export OVH_CONSUMER_KEY=your-consumer-key
```

### Snowflake Credentials

```bash
export SNOWFLAKE_ACCOUNT=your-account
export SNOWFLAKE_USERNAME=your-username
export SNOWFLAKE_PASSWORD=your-password
```

## Schema

### Required

- `ovh_endpoint` (String) OVH API endpoint
- `ovh_application_key` (String) OVH application key
- `ovh_application_secret` (String, Sensitive) OVH application secret
- `ovh_consumer_key` (String, Sensitive) OVH consumer key
- `snowflake_account` (String) Snowflake account identifier
- `snowflake_username` (String) Snowflake username
- `snowflake_password` (String, Sensitive) Snowflake password

### Optional

- `ovh_project_id` (String) OVH project ID
- `snowflake_region` (String) Snowflake region
