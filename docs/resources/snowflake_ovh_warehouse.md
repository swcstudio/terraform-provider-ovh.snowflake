---
page_title: "snowflake_ovh_warehouse Resource - terraform-provider-snowflake-ovh"
subcategory: ""
description: |-
  Manages a Snowflake warehouse with OVH infrastructure optimization.
---

# snowflake_ovh_warehouse (Resource)

Manages a Snowflake warehouse with OVH infrastructure optimization.

## Example Usage

```terraform
resource "snowflake_ovh_warehouse" "example" {
  name                = "example_warehouse"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  performance_insights = true

  tags = {
    Environment = "production"
    Team        = "data-engineering"
  }
}
```

## Schema

### Required

- `name` (String) Name of the warehouse

### Optional

- `size` (String) Size of the warehouse. Valid values: `X-SMALL`, `SMALL`, `MEDIUM`, `LARGE`, `X-LARGE`, `2X-LARGE`, `3X-LARGE`, `4X-LARGE`, `5X-LARGE`, `6X-LARGE`. Default: `X-SMALL`
- `max_cluster_count` (Number) Maximum number of clusters. Default: `1`
- `min_cluster_count` (Number) Minimum number of clusters. Default: `1`
- `auto_suspend` (Number) Auto suspend time in seconds. Default: `60`
- `auto_resume` (Boolean) Auto resume warehouse. Default: `true`
- `initially_suspended` (Boolean) Initially suspend warehouse. Default: `false`
- `scaling_policy` (String) Scaling policy. Valid values: `STANDARD`, `ECONOMY`. Default: `STANDARD`
- `resource_monitor` (String) Resource monitor name
- `comment` (String) Comment for the warehouse
- `ovh_optimization` (Boolean) Enable OVH infrastructure optimization. Default: `true`
- `cost_tracking` (Boolean) Enable cost tracking. Default: `true`
- `performance_insights` (Boolean) Enable performance insights. Default: `false`
- `tags` (Map of String) Tags to apply to warehouse

### Read-Only

- `id` (String) The ID of this resource
- `state` (String) Warehouse state
- `type` (String) Warehouse type
- `created_on` (String) Creation timestamp

## Import

Import is supported using the following syntax:

```shell
terraform import snowflake_ovh_warehouse.example warehouse_id
```
