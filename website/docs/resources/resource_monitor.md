---
# generated by https://github.com/hashicorp/terraform-plugin-docs
page_title: "snowflake-ovh_resource_monitor Resource - terraform-provider-snowflake-ovh"
subcategory: ""
description: |-
  Manages a Snowflake resource monitor on OVH infrastructure.
---

# snowflake-ovh_resource_monitor (Resource)

Manages a Snowflake resource monitor on OVH infrastructure.



<!-- schema generated by tfplugindocs -->
## Schema

### Required

- `name` (String) Name of the resource monitor.

### Optional

- `credit_quota` (Number) Credit quota for the resource monitor.
- `end_time` (String) End time for the resource monitor.
- `frequency` (String) Frequency of the resource monitor (MONTHLY, DAILY, WEEKLY, YEARLY, NEVER).
- `start_time` (String) Start time for the resource monitor.
- `suspend_at` (Number) Percentage of quota at which to suspend warehouses.
- `suspend_immediately_at` (Number) Percentage of quota at which to immediately suspend warehouses.

### Read-Only

- `id` (String) Unique identifier for the resource monitor.
