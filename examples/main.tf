terraform {
  required_providers {
    snowflake-ovh = {
      source  = "swcstudio/snowflake-ovh"
      version = "~> 0.1.0"
    }
  }
}

provider "snowflake-ovh" {
  ovh_endpoint           = var.ovh_endpoint
  ovh_application_key    = var.ovh_application_key
  ovh_application_secret = var.ovh_application_secret
  ovh_consumer_key       = var.ovh_consumer_key
  snowflake_account      = var.snowflake_account
  snowflake_username     = var.snowflake_username
  snowflake_password     = var.snowflake_password
}

resource "snowflake_ovh_warehouse" "example" {
  name                = "example_warehouse"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  performance_insights = true

  tags = {
    Environment = "development"
    Team        = "data-engineering"
  }
}

resource "snowflake_ovh_database" "example" {
  name                        = "example_db"
  data_retention_time_in_days = 7
  comment                     = "Example database on OVH infrastructure"

  tags = {
    Environment = "development"
    Purpose     = "analytics"
  }
}

resource "snowflake_ovh_schema" "example" {
  name     = "example_schema"
  database = snowflake_ovh_database.example.name
  comment  = "Example schema for data processing"

  tags = {
    Environment = "development"
    DataDomain  = "customer"
  }
}

resource "snowflake_ovh_table" "example" {
  name     = "customer_data"
  database = snowflake_ovh_database.example.name
  schema   = snowflake_ovh_schema.example.name

  columns = [
    {
      name     = "id"
      type     = "NUMBER(38,0)"
      nullable = false
    },
    {
      name     = "name"
      type     = "VARCHAR(255)"
      nullable = false
    },
    {
      name     = "email"
      type     = "VARCHAR(255)"
      nullable = true
    },
    {
      name     = "created_at"
      type     = "TIMESTAMP_NTZ"
      nullable = false
      default  = "CURRENT_TIMESTAMP()"
    }
  ]

  cluster_by      = ["id"]
  change_tracking = true
  comment         = "Customer data table with change tracking"

  tags = {
    Environment = "development"
    DataType    = "customer"
    PII         = "true"
  }
}

resource "snowflake_ovh_user" "example" {
  name         = "example_user"
  display_name = "Example User"
  email        = "user@example.com"
  password     = var.user_password

  default_warehouse = snowflake_ovh_warehouse.example.name
  default_namespace = "${snowflake_ovh_database.example.name}.${snowflake_ovh_schema.example.name}"

  tags = {
    Department = "data-engineering"
    Role       = "analyst"
  }
}

resource "snowflake_ovh_role" "example" {
  name    = "example_role"
  comment = "Example role for data analysts"

  tags = {
    Department = "data-engineering"
    Access     = "read-only"
  }
}

resource "snowflake_ovh_grant" "example" {
  privilege   = "SELECT"
  on          = "TABLE"
  object_name = "${snowflake_ovh_database.example.name}.${snowflake_ovh_schema.example.name}.${snowflake_ovh_table.example.name}"
  to_role     = snowflake_ovh_role.example.name
}

resource "snowflake_ovh_resource_monitor" "example" {
  name         = "example_monitor"
  credit_quota = 100
  frequency    = "MONTHLY"

  notify_triggers  = [80, 90]
  suspend_triggers = [95]

  notify_users = [snowflake_ovh_user.example.name]
  comment      = "Monthly credit monitor for development environment"
}

data "snowflake_ovh_accounts" "available" {
  region = "eu-west-1"
  status = "ACTIVE"
}

output "available_accounts" {
  value = data.snowflake_ovh_accounts.available.accounts
}

output "warehouse_url" {
  value = "https://${var.snowflake_account}.snowflakecomputing.com"
}
