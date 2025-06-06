package provider

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/ovh/go-ovh/ovh"
	"github.com/snowflakedb/gosnowflake"
)

type Config struct {
	OVHClient       *ovh.Client
	SnowflakeClient *sql.DB
}

func New(version string) func() *schema.Provider {
	return func() *schema.Provider {
		p := &schema.Provider{
			Schema: map[string]*schema.Schema{
				"ovh_endpoint": {
					Type:        schema.TypeString,
					Required:    true,
					DefaultFunc: schema.EnvDefaultFunc("OVH_ENDPOINT", nil),
					Description: "OVH API endpoint",
				},
				"ovh_application_key": {
					Type:        schema.TypeString,
					Required:    true,
					DefaultFunc: schema.EnvDefaultFunc("OVH_APPLICATION_KEY", nil),
					Description: "OVH API application key",
				},
				"ovh_application_secret": {
					Type:        schema.TypeString,
					Required:    true,
					DefaultFunc: schema.EnvDefaultFunc("OVH_APPLICATION_SECRET", nil),
					Description: "OVH API application secret",
					Sensitive:   true,
				},
				"ovh_consumer_key": {
					Type:        schema.TypeString,
					Required:    true,
					DefaultFunc: schema.EnvDefaultFunc("OVH_CONSUMER_KEY", nil),
					Description: "OVH API consumer key",
					Sensitive:   true,
				},
				"snowflake_account": {
					Type:        schema.TypeString,
					Required:    true,
					DefaultFunc: schema.EnvDefaultFunc("SNOWFLAKE_ACCOUNT", nil),
					Description: "Snowflake account identifier",
				},
				"snowflake_user": {
					Type:        schema.TypeString,
					Required:    true,
					DefaultFunc: schema.EnvDefaultFunc("SNOWFLAKE_USER", nil),
					Description: "Snowflake username",
				},
				"snowflake_password": {
					Type:        schema.TypeString,
					Optional:    true,
					DefaultFunc: schema.EnvDefaultFunc("SNOWFLAKE_PASSWORD", nil),
					Description: "Snowflake password",
					Sensitive:   true,
				},
				"snowflake_private_key": {
					Type:        schema.TypeString,
					Optional:    true,
					DefaultFunc: schema.EnvDefaultFunc("SNOWFLAKE_PRIVATE_KEY", nil),
					Description: "Snowflake private key for key pair authentication",
					Sensitive:   true,
				},
				"snowflake_role": {
					Type:        schema.TypeString,
					Optional:    true,
					DefaultFunc: schema.EnvDefaultFunc("SNOWFLAKE_ROLE", nil),
					Description: "Snowflake role",
				},
				"snowflake_warehouse": {
					Type:        schema.TypeString,
					Optional:    true,
					DefaultFunc: schema.EnvDefaultFunc("SNOWFLAKE_WAREHOUSE", nil),
					Description: "Snowflake warehouse",
				},
			},
			ResourcesMap: map[string]*schema.Resource{
				"snowflake_ovh_account":           resourceSnowflakeAccount(),
				"snowflake_ovh_warehouse":         resourceSnowflakeWarehouse(),
				"snowflake_ovh_database":          resourceSnowflakeDatabase(),
				"snowflake_ovh_schema":            resourceSnowflakeSchema(),
				"snowflake_ovh_table":             resourceSnowflakeTable(),
				"snowflake_ovh_user":              resourceSnowflakeUser(),
				"snowflake_ovh_role":              resourceSnowflakeRole(),
				"snowflake_ovh_grant":             resourceSnowflakeGrant(),
				"snowflake_ovh_network_policy":    resourceSnowflakeNetworkPolicy(),
				"snowflake_ovh_resource_monitor":  resourceSnowflakeResourceMonitor(),
				"snowflake_ovh_pipe":              resourceSnowflakePipe(),
				"snowflake_ovh_stream":            resourceSnowflakeStream(),
				"snowflake_ovh_task":              resourceSnowflakeTask(),
				"snowflake_ovh_external_table":    resourceSnowflakeExternalTable(),
			},
			DataSourcesMap: map[string]*schema.Resource{
				"snowflake_ovh_accounts":    dataSourceSnowflakeAccounts(),
			},
			ConfigureContextFunc: providerConfigure,
		}

		return p
	}
}

func providerConfigure(ctx context.Context, d *schema.ResourceData) (interface{}, diag.Diagnostics) {
	_ = diag.Diagnostics{}

	ovhClient, err := ovh.NewClient(
		d.Get("ovh_endpoint").(string),
		d.Get("ovh_application_key").(string),
		d.Get("ovh_application_secret").(string),
		d.Get("ovh_consumer_key").(string),
	)
	if err != nil {
		return nil, diag.FromErr(fmt.Errorf("failed to create OVH client: %w", err))
	}

	cfg := &gosnowflake.Config{
		Account:  d.Get("snowflake_account").(string),
		User:     d.Get("snowflake_user").(string),
		Password: d.Get("snowflake_password").(string),
	}

	if role := d.Get("snowflake_role").(string); role != "" {
		cfg.Role = role
	}

	if warehouse := d.Get("snowflake_warehouse").(string); warehouse != "" {
		cfg.Warehouse = warehouse
	}

	if privateKey := d.Get("snowflake_private_key").(string); privateKey != "" {
		cfg.Authenticator = gosnowflake.AuthTypeSnowflake
	}

	dsn, err := gosnowflake.DSN(cfg)
	if err != nil {
		return nil, diag.FromErr(fmt.Errorf("failed to create Snowflake DSN: %w", err))
	}

	snowflakeClient, err := sql.Open("snowflake", dsn)
	if err != nil {
		return nil, diag.FromErr(fmt.Errorf("failed to create Snowflake client: %w", err))
	}

	config := &Config{
		OVHClient:       ovhClient,
		SnowflakeClient: snowflakeClient,
	}

	return config, nil
}
