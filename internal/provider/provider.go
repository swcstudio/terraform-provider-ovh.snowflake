package provider

import (
	"context"
	"fmt"
	"os"

	"github.com/hashicorp/terraform-plugin-framework/datasource"
	"github.com/hashicorp/terraform-plugin-framework/provider"
	"github.com/hashicorp/terraform-plugin-framework/provider/schema"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

// Ensure provider defined types fully satisfy framework interfaces.
var _ provider.Provider = &SnowflakeOVHProvider{}

// SnowflakeOVHProvider defines the provider implementation.
type SnowflakeOVHProvider struct {
	// version is set to the provider version on release, "dev" when the
	// provider is built and ran locally, and "test" when running acceptance
	// testing.
	version string
}

// SnowflakeOVHProviderModel describes the provider data model.
type SnowflakeOVHProviderModel struct {
	OVHEndpoint           types.String `tfsdk:"ovh_endpoint"`
	OVHApplicationKey     types.String `tfsdk:"ovh_application_key"`
	OVHApplicationSecret  types.String `tfsdk:"ovh_application_secret"`
	OVHConsumerKey        types.String `tfsdk:"ovh_consumer_key"`
	SnowflakeAccount      types.String `tfsdk:"snowflake_account"`
	SnowflakeUsername     types.String `tfsdk:"snowflake_username"`
	SnowflakePassword     types.String `tfsdk:"snowflake_password"`
	SnowflakeRole         types.String `tfsdk:"snowflake_role"`
	SnowflakeWarehouse    types.String `tfsdk:"snowflake_warehouse"`
	SnowflakeDatabase     types.String `tfsdk:"snowflake_database"`
	SnowflakeSchema       types.String `tfsdk:"snowflake_schema"`
	SnowflakePrivateKey   types.String `tfsdk:"snowflake_private_key"`
	SnowflakePrivateKeyPath types.String `tfsdk:"snowflake_private_key_path"`
}

func (p *SnowflakeOVHProvider) Metadata(ctx context.Context, req provider.MetadataRequest, resp *provider.MetadataResponse) {
	resp.TypeName = "snowflake"
	resp.Version = p.version
}

func (p *SnowflakeOVHProvider) Schema(ctx context.Context, req provider.SchemaRequest, resp *provider.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Terraform Provider for managing Snowflake Platform on OVHcloud infrastructure",
		Attributes: map[string]schema.Attribute{
			"ovh_endpoint": schema.StringAttribute{
				Description: "OVH API endpoint (e.g., ovh-eu, ovh-us, ovh-ca). Can be set via OVH_ENDPOINT environment variable.",
				Optional:    true,
			},
			"ovh_application_key": schema.StringAttribute{
				Description: "OVH Application Key for API authentication. Can be set via OVH_APPLICATION_KEY environment variable.",
				Optional:    true,
				Sensitive:   true,
			},
			"ovh_application_secret": schema.StringAttribute{
				Description: "OVH Application Secret for API authentication. Can be set via OVH_APPLICATION_SECRET environment variable.",
				Optional:    true,
				Sensitive:   true,
			},
			"ovh_consumer_key": schema.StringAttribute{
				Description: "OVH Consumer Key for API authentication. Can be set via OVH_CONSUMER_KEY environment variable.",
				Optional:    true,
				Sensitive:   true,
			},
			"snowflake_account": schema.StringAttribute{
				Description: "Snowflake account identifier. Can be set via SNOWFLAKE_ACCOUNT environment variable.",
				Optional:    true,
			},
			"snowflake_username": schema.StringAttribute{
				Description: "Snowflake username for authentication. Can be set via SNOWFLAKE_USERNAME environment variable.",
				Optional:    true,
			},
			"snowflake_password": schema.StringAttribute{
				Description: "Snowflake password for authentication. Can be set via SNOWFLAKE_PASSWORD environment variable.",
				Optional:    true,
				Sensitive:   true,
			},
			"snowflake_role": schema.StringAttribute{
				Description: "Snowflake role to use for operations. Can be set via SNOWFLAKE_ROLE environment variable.",
				Optional:    true,
			},
			"snowflake_warehouse": schema.StringAttribute{
				Description: "Default Snowflake warehouse. Can be set via SNOWFLAKE_WAREHOUSE environment variable.",
				Optional:    true,
			},
			"snowflake_database": schema.StringAttribute{
				Description: "Default Snowflake database. Can be set via SNOWFLAKE_DATABASE environment variable.",
				Optional:    true,
			},
			"snowflake_schema": schema.StringAttribute{
				Description: "Default Snowflake schema. Can be set via SNOWFLAKE_SCHEMA environment variable.",
				Optional:    true,
			},
			"snowflake_private_key": schema.StringAttribute{
				Description: "Snowflake private key for key-pair authentication. Can be set via SNOWFLAKE_PRIVATE_KEY environment variable.",
				Optional:    true,
				Sensitive:   true,
			},
			"snowflake_private_key_path": schema.StringAttribute{
				Description: "Path to Snowflake private key file for key-pair authentication. Can be set via SNOWFLAKE_PRIVATE_KEY_PATH environment variable.",
				Optional:    true,
			},
		},
	}
}

func (p *SnowflakeOVHProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
	var config SnowflakeOVHProviderModel

	resp.Diagnostics.Append(req.Config.Get(ctx, &config)...)

	if resp.Diagnostics.HasError() {
		return
	}

	// Set defaults from environment variables
	if config.OVHEndpoint.IsUnknown() || config.OVHEndpoint.IsNull() {
		if endpoint := os.Getenv("OVH_ENDPOINT"); endpoint != "" {
			config.OVHEndpoint = types.StringValue(endpoint)
		} else {
			config.OVHEndpoint = types.StringValue("ovh-eu")
		}
	}

	if config.OVHApplicationKey.IsUnknown() || config.OVHApplicationKey.IsNull() {
		if key := os.Getenv("OVH_APPLICATION_KEY"); key != "" {
			config.OVHApplicationKey = types.StringValue(key)
		}
	}

	if config.OVHApplicationSecret.IsUnknown() || config.OVHApplicationSecret.IsNull() {
		if secret := os.Getenv("OVH_APPLICATION_SECRET"); secret != "" {
			config.OVHApplicationSecret = types.StringValue(secret)
		}
	}

	if config.OVHConsumerKey.IsUnknown() || config.OVHConsumerKey.IsNull() {
		if key := os.Getenv("OVH_CONSUMER_KEY"); key != "" {
			config.OVHConsumerKey = types.StringValue(key)
		}
	}

	if config.SnowflakeAccount.IsUnknown() || config.SnowflakeAccount.IsNull() {
		if account := os.Getenv("SNOWFLAKE_ACCOUNT"); account != "" {
			config.SnowflakeAccount = types.StringValue(account)
		}
	}

	if config.SnowflakeUsername.IsUnknown() || config.SnowflakeUsername.IsNull() {
		if username := os.Getenv("SNOWFLAKE_USERNAME"); username != "" {
			config.SnowflakeUsername = types.StringValue(username)
		}
	}

	if config.SnowflakePassword.IsUnknown() || config.SnowflakePassword.IsNull() {
		if password := os.Getenv("SNOWFLAKE_PASSWORD"); password != "" {
			config.SnowflakePassword = types.StringValue(password)
		}
	}

	if config.SnowflakeRole.IsUnknown() || config.SnowflakeRole.IsNull() {
		if role := os.Getenv("SNOWFLAKE_ROLE"); role != "" {
			config.SnowflakeRole = types.StringValue(role)
		}
	}

	if config.SnowflakeWarehouse.IsUnknown() || config.SnowflakeWarehouse.IsNull() {
		if warehouse := os.Getenv("SNOWFLAKE_WAREHOUSE"); warehouse != "" {
			config.SnowflakeWarehouse = types.StringValue(warehouse)
		}
	}

	if config.SnowflakeDatabase.IsUnknown() || config.SnowflakeDatabase.IsNull() {
		if database := os.Getenv("SNOWFLAKE_DATABASE"); database != "" {
			config.SnowflakeDatabase = types.StringValue(database)
		}
	}

	if config.SnowflakeSchema.IsUnknown() || config.SnowflakeSchema.IsNull() {
		if schema := os.Getenv("SNOWFLAKE_SCHEMA"); schema != "" {
			config.SnowflakeSchema = types.StringValue(schema)
		}
	}

	if config.SnowflakePrivateKey.IsUnknown() || config.SnowflakePrivateKey.IsNull() {
		if key := os.Getenv("SNOWFLAKE_PRIVATE_KEY"); key != "" {
			config.SnowflakePrivateKey = types.StringValue(key)
		}
	}

	if config.SnowflakePrivateKeyPath.IsUnknown() || config.SnowflakePrivateKeyPath.IsNull() {
		if path := os.Getenv("SNOWFLAKE_PRIVATE_KEY_PATH"); path != "" {
			config.SnowflakePrivateKeyPath = types.StringValue(path)
		}
	}

	// Log configuration (without sensitive values)
	tflog.Info(ctx, "Configuring Snowflake OVH provider", map[string]interface{}{
		"ovh_endpoint":      config.OVHEndpoint.ValueString(),
		"snowflake_account": config.SnowflakeAccount.ValueString(),
		"snowflake_username": config.SnowflakeUsername.ValueString(),
		"snowflake_role":    config.SnowflakeRole.ValueString(),
		"snowflake_warehouse": config.SnowflakeWarehouse.ValueString(),
		"snowflake_database": config.SnowflakeDatabase.ValueString(),
		"snowflake_schema":  config.SnowflakeSchema.ValueString(),
	})

	// Validate required fields
	if config.SnowflakeAccount.IsNull() || config.SnowflakeAccount.ValueString() == "" {
		resp.Diagnostics.AddError(
			"Missing Snowflake Account",
			"The provider requires a Snowflake account to be configured. "+
				"Please set the snowflake_account attribute or SNOWFLAKE_ACCOUNT environment variable.",
		)
	}

	if config.SnowflakeUsername.IsNull() || config.SnowflakeUsername.ValueString() == "" {
		resp.Diagnostics.AddError(
			"Missing Snowflake Username",
			"The provider requires a Snowflake username to be configured. "+
				"Please set the snowflake_username attribute or SNOWFLAKE_USERNAME environment variable.",
		)
	}

	// Check authentication method
	hasPassword := !config.SnowflakePassword.IsNull() && config.SnowflakePassword.ValueString() != ""
	hasPrivateKey := (!config.SnowflakePrivateKey.IsNull() && config.SnowflakePrivateKey.ValueString() != "") ||
		(!config.SnowflakePrivateKeyPath.IsNull() && config.SnowflakePrivateKeyPath.ValueString() != "")

	if !hasPassword && !hasPrivateKey {
		resp.Diagnostics.AddError(
			"Missing Snowflake Authentication",
			"The provider requires either password or private key authentication. "+
				"Please set snowflake_password or snowflake_private_key/snowflake_private_key_path.",
		)
	}

	if resp.Diagnostics.HasError() {
		return
	}

	// Store configuration in client data for resources and data sources
	resp.DataSourceData = &config
	resp.ResourceData = &config

	tflog.Info(ctx, "Successfully configured Snowflake OVH provider")
}

func (p *SnowflakeOVHProvider) Resources(ctx context.Context) []func() resource.Resource {
	return []func() resource.Resource{
		// NewWarehouseResource,
		// NewDatabaseResource,
		// NewSchemaResource,
		// NewUserResource,
		// NewRoleResource,
	}
}

func (p *SnowflakeOVHProvider) DataSources(ctx context.Context) []func() datasource.DataSource {
	return []func() datasource.DataSource{
		// NewAccountsDataSource,
	}
}

func New(version string) func() provider.Provider {
	return func() provider.Provider {
		return &SnowflakeOVHProvider{
			version: version,
		}
	}
}