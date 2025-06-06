---
page_title: "snowflake_ovh_accounts Data Source - terraform-provider-snowflake-ovh"
subcategory: ""
description: |-
  Retrieves information about Snowflake accounts on OVH infrastructure.
---

# snowflake_ovh_accounts (Data Source)

Retrieves information about Snowflake accounts on OVH infrastructure.

## Example Usage

```terraform
data "snowflake_ovh_accounts" "available" {
  region = "eu-west-1"
  status = "ACTIVE"
}

output "account_names" {
  value = [for account in data.snowflake_ovh_accounts.available.accounts : account.name]
}
```

## Schema

### Optional

- `region` (String) Filter accounts by OVH region
- `status` (String) Filter accounts by status

### Read-Only

- `id` (String) The ID of this resource
- `accounts` (List of Object) List of Snowflake accounts (see [below for nested schema](#nestedatt--accounts))

<a id="nestedatt--accounts"></a>
### Nested Schema for `accounts`

Read-Only:

- `id` (String) Account ID
- `name` (String) Account name
- `region` (String) OVH region
- `edition` (String) Snowflake edition
- `url` (String) Account URL
- `status` (String) Account status
- `created_on` (String) Creation timestamp
- `tags` (Map of String) Account tags
