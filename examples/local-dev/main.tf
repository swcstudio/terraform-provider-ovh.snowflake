terraform {
  required_version = ">= 1.0"
  
  required_providers {
    snowflake-ovh = {
      source  = "swcstudio/snowflake-ovh"
      version = "~> 0.1.0"
    }
  }

  # Use local backend for development
  backend "local" {
    path = "terraform.tfstate"
  }
}

# Provider configuration
# Environment variables are preferred for sensitive values:
# export OVH_ENDPOINT="ovh-eu"
# export OVH_APPLICATION_KEY="your-app-key"
# export OVH_APPLICATION_SECRET="your-app-secret"
# export OVH_CONSUMER_KEY="your-consumer-key"
# export SNOWFLAKE_ACCOUNT="your-account"
# export SNOWFLAKE_USERNAME="your-username"
# export SNOWFLAKE_PASSWORD="your-password"
# export SNOWFLAKE_ROLE="your-role"
# export SNOWFLAKE_WAREHOUSE="your-warehouse"
provider "snowflake-ovh" {
  # Configuration will be loaded from environment variables
  # Alternatively, you can specify them here (not recommended for production):
  # ovh_endpoint           = "ovh-eu"
  # ovh_application_key    = var.ovh_application_key
  # ovh_application_secret = var.ovh_application_secret
  # ovh_consumer_key       = var.ovh_consumer_key
  # snowflake_account      = var.snowflake_account
  # snowflake_username     = var.snowflake_username
  # snowflake_password     = var.snowflake_password
}

# Variables for development (optional)
variable "warehouse_name" {
  description = "Name for the Snowflake warehouse"
  type        = string
  default     = "dev_warehouse"
}

variable "database_name" {
  description = "Name for the Snowflake database"
  type        = string
  default     = "dev_database"
}

variable "schema_name" {
  description = "Name for the Snowflake schema"
  type        = string
  default     = "dev_schema"
}

variable "environment" {
  description = "Environment tag"
  type        = string
  default     = "development"
}

variable "cost_center" {
  description = "Cost center for billing tracking"
  type        = string
  default     = "engineering"
}

# Example: Snowflake Warehouse with OVH Optimization
# Uncomment and modify as needed once the provider is fully implemented
/*
resource "snowflake_ovh_warehouse" "example" {
  name                = var.warehouse_name
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  
  # OVH-specific features
  ovh_cost_center     = var.cost_center
  ovh_billing_alerts  = true
  ovh_performance_insights = true
  
  comment = "Development warehouse with OVH optimization for ${var.environment}"
  
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Provider    = "snowflake-ovh"
    CostCenter  = var.cost_center
  }
}
*/

# Example: Snowflake Database
# Uncomment and modify as needed
/*
resource "snowflake_ovh_database" "example" {
  name                     = var.database_name
  data_retention_time_in_days = 7
  comment                  = "Development database for ${var.environment}"
  
  # OVH-specific data governance
  ovh_data_classification = "internal"
  ovh_gdpr_compliant     = true
  ovh_backup_policy      = "standard"
  
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Provider    = "snowflake-ovh"
    DataClass   = "internal"
  }
}
*/

# Example: Snowflake Schema
# Uncomment and modify as needed
/*
resource "snowflake_ovh_schema" "example" {
  database = snowflake_ovh_database.example.name
  name     = var.schema_name
  comment  = "Development schema for ${var.environment}"
  
  # OVH-specific features
  ovh_data_lineage_enabled = true
  ovh_audit_logging       = true
  
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Provider    = "snowflake-ovh"
  }
}
*/

# Example: Snowflake Table with European data residency
# Uncomment and modify as needed
/*
resource "snowflake_ovh_table" "example" {
  database = snowflake_ovh_database.example.name
  schema   = snowflake_ovh_schema.example.name
  name     = "example_table"
  
  columns = [
    {
      name = "id"
      type = "NUMBER(38,0)"
      nullable = false
    },
    {
      name = "name"
      type = "VARCHAR(255)"
      nullable = true
    },
    {
      name = "created_at"
      type = "TIMESTAMP_NTZ"
      nullable = false
      default = "CURRENT_TIMESTAMP()"
    }
  ]
  
  # OVH-specific data governance
  ovh_data_residency = "EU"
  ovh_encryption_key = "ovh-managed"
  ovh_compliance_tags = ["GDPR", "SOC2"]
  
  comment = "Example table with OVH data governance"
  
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Provider    = "snowflake-ovh"
    DataType    = "transactional"
  }
}
*/

# Example: Snowflake User with OVH SSO integration
# Uncomment and modify as needed
/*
resource "snowflake_ovh_user" "example" {
  name         = "dev_user"
  login_name   = "dev.user@company.com"
  email        = "dev.user@company.com"
  display_name = "Development User"
  
  # OVH SSO integration
  ovh_sso_enabled    = true
  ovh_sso_provider   = "okta"
  ovh_mfa_required   = true
  
  default_warehouse = snowflake_ovh_warehouse.example.name
  default_role      = "PUBLIC"
  
  comment = "Development user with OVH SSO integration"
  
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Provider    = "snowflake-ovh"
    UserType    = "developer"
  }
}
*/

# Example: Resource Monitor for cost control
# Uncomment and modify as needed
/*
resource "snowflake_ovh_resource_monitor" "example" {
  name         = "dev_cost_monitor"
  credit_quota = 100
  frequency    = "MONTHLY"
  
  # OVH-specific cost controls
  ovh_budget_alerts = [
    {
      threshold_percent = 50
      action           = "notify"
    },
    {
      threshold_percent = 80
      action           = "suspend_immediate"
    }
  ]
  
  ovh_cost_center = var.cost_center
  ovh_billing_notifications = ["admin@company.com"]
  
  warehouses = [snowflake_ovh_warehouse.example.name]
  
  comment = "Cost monitoring for development environment"
  
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Provider    = "snowflake-ovh"
    MonitorType = "cost"
  }
}
*/

# Data sources for testing
# These can be used to verify the provider is working
/*
data "snowflake_ovh_warehouses" "all" {}

data "snowflake_ovh_databases" "all" {}

data "snowflake_ovh_users" "all" {}

data "snowflake_ovh_accounts" "current" {}
*/

# Outputs for development
# Uncomment as resources are implemented
/*
output "warehouse_info" {
  description = "Snowflake warehouse information"
  value = {
    id               = snowflake_ovh_warehouse.example.id
    name             = snowflake_ovh_warehouse.example.name
    size             = snowflake_ovh_warehouse.example.size
    ovh_optimization = snowflake_ovh_warehouse.example.ovh_optimization
  }
}

output "database_info" {
  description = "Snowflake database information"
  value = {
    id                = snowflake_ovh_database.example.id
    name              = snowflake_ovh_database.example.name
    retention_days    = snowflake_ovh_database.example.data_retention_time_in_days
    ovh_gdpr_compliant = snowflake_ovh_database.example.ovh_gdpr_compliant
  }
}

output "cost_monitoring" {
  description = "Cost monitoring information"
  value = {
    monitor_name = snowflake_ovh_resource_monitor.example.name
    credit_quota = snowflake_ovh_resource_monitor.example.credit_quota
    cost_center  = snowflake_ovh_resource_monitor.example.ovh_cost_center
  }
}
*/

# Simple output to verify provider is loaded
output "provider_info" {
  description = "Information about the Snowflake-OVH provider"
  value = {
    provider_version    = "0.1.0"
    terraform_version   = ">= 1.0"
    environment         = var.environment
    warehouse_name      = var.warehouse_name
    database_name       = var.database_name
    schema_name         = var.schema_name
    cost_center         = var.cost_center
    ovh_features = {
      data_residency       = "EU"
      gdpr_compliance      = true
      cost_optimization    = true
      performance_insights = true
      sso_integration      = true
    }
  }
}