---
# generated by https://github.com/hashicorp/terraform-plugin-docs
page_title: "snowflake-ovh_warehouse Resource - terraform-provider-snowflake-ovh"
subcategory: ""
description: |-
  Manages a Snowflake warehouse on OVH infrastructure.
---

# snowflake-ovh_warehouse (Resource)

Manages a Snowflake warehouse on OVH infrastructure.



<!-- schema generated by tfplugindocs -->
## Schema

### Required

- `name` (String) Name of the warehouse.

### Optional

- `auto_resume` (Boolean) Whether to automatically resume the warehouse when accessed.
- `auto_suspend` (Number) Number of seconds to wait before automatically suspending the warehouse.
- `comment` (String) Comment for the warehouse.
- `initially_suspended` (Boolean) Whether the warehouse should be created in a suspended state.
- `size` (String) Size of the warehouse (X-SMALL, SMALL, MEDIUM, LARGE, X-LARGE, etc.).

### Read-Only

- `id` (String) Unique identifier for the warehouse.
