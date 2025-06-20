package provider

import (
	"context"

	"os"

	"github.com/hashicorp/terraform-plugin-framework/datasource"
	"github.com/hashicorp/terraform-plugin-framework/provider"
	"github.com/hashicorp/terraform-plugin-framework/provider/schema"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

var _ provider.Provider = &SnowflakeOVHProvider{}

type SnowflakeOVHProvider struct {
	version string
}

type SnowflakeOVHProviderModel struct {
	OVHEndpoint          types.String `tfsdk:"ovh_endpoint"`
	OVHApplicationKey    types.String `tfsdk:"ovh_application_key"`
	OVHApplicationSecret types.String `tfsdk:"ovh_application_secret"`
	OVHConsumerKey       types.String `tfsdk:"ovh_consumer_key"`
	SnowflakeAccount     types.String `tfsdk:"snowflake_account"`
	SnowflakeUser        types.String `tfsdk:"snowflake_user"`
	SnowflakePassword    types.String `tfsdk:"snowflake_password"`
	SnowflakePrivateKey  types.String `tfsdk:"snowflake_private_key"`
	SnowflakeRole        types.String `tfsdk:"snowflake_role"`
	SnowflakeWarehouse   types.String `tfsdk:"snowflake_warehouse"`
}

func (p *SnowflakeOVHProvider) Metadata(ctx context.Context, req provider.MetadataRequest, resp *provider.MetadataResponse) {
	resp.TypeName = "snowflake-ovh"
	resp.Version = p.version
}

func (p *SnowflakeOVHProvider) Schema(ctx context.Context, req provider.SchemaRequest, resp *provider.SchemaResponse) {
	resp.Schema = schema.Schema{
		Attributes: map[string]schema.Attribute{
			"ovh_endpoint": schema.StringAttribute{
				MarkdownDescription: "OVH API endpoint",
				Optional:            true,
			},
			"ovh_application_key": schema.StringAttribute{
				MarkdownDescription: "OVH API application key",
				Optional:            true,
			},
			"ovh_application_secret": schema.StringAttribute{
				MarkdownDescription: "OVH API application secret",
				Optional:            true,
				Sensitive:           true,
			},
			"ovh_consumer_key": schema.StringAttribute{
				MarkdownDescription: "OVH API consumer key",
				Optional:            true,
				Sensitive:           true,
			},
			"snowflake_account": schema.StringAttribute{
				MarkdownDescription: "Snowflake account identifier",
				Optional:            true,
			},
			"snowflake_user": schema.StringAttribute{
				MarkdownDescription: "Snowflake username",
				Optional:            true,
			},
			"snowflake_password": schema.StringAttribute{
				MarkdownDescription: "Snowflake password",
				Optional:            true,
				Sensitive:           true,
			},
			"snowflake_private_key": schema.StringAttribute{
				MarkdownDescription: "Snowflake private key for key pair authentication",
				Optional:            true,
				Sensitive:           true,
			},
			"snowflake_role": schema.StringAttribute{
				MarkdownDescription: "Snowflake role",
				Optional:            true,
			},
			"snowflake_warehouse": schema.StringAttribute{
				MarkdownDescription: "Snowflake warehouse",
				Optional:            true,
			},
		},
	}
}

func (p *SnowflakeOVHProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
	tflog.Info(ctx, "Configuring Snowflake OVH client")

	var config SnowflakeOVHProviderModel
	diags := req.Config.Get(ctx, &config)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	ovhEndpoint := os.Getenv("OVH_ENDPOINT")
	if !config.OVHEndpoint.IsNull() {
		ovhEndpoint = config.OVHEndpoint.ValueString()
	}
	if ovhEndpoint == "" {
		ovhEndpoint = "ovh-eu"
	}

	ovhApplicationKey := os.Getenv("OVH_APPLICATION_KEY")
	if !config.OVHApplicationKey.IsNull() {
		ovhApplicationKey = config.OVHApplicationKey.ValueString()
	}

	ovhApplicationSecret := os.Getenv("OVH_APPLICATION_SECRET")
	if !config.OVHApplicationSecret.IsNull() {
		ovhApplicationSecret = config.OVHApplicationSecret.ValueString()
	}

	ovhConsumerKey := os.Getenv("OVH_CONSUMER_KEY")
	if !config.OVHConsumerKey.IsNull() {
		ovhConsumerKey = config.OVHConsumerKey.ValueString()
	}

	snowflakeAccount := os.Getenv("SNOWFLAKE_ACCOUNT")
	if !config.SnowflakeAccount.IsNull() {
		snowflakeAccount = config.SnowflakeAccount.ValueString()
	}

	snowflakeUser := os.Getenv("SNOWFLAKE_USER")
	if !config.SnowflakeUser.IsNull() {
		snowflakeUser = config.SnowflakeUser.ValueString()
	}

	snowflakePassword := os.Getenv("SNOWFLAKE_PASSWORD")
	if !config.SnowflakePassword.IsNull() {
		snowflakePassword = config.SnowflakePassword.ValueString()
	}

	snowflakePrivateKey := os.Getenv("SNOWFLAKE_PRIVATE_KEY")
	if !config.SnowflakePrivateKey.IsNull() {
		snowflakePrivateKey = config.SnowflakePrivateKey.ValueString()
	}

	snowflakeRole := os.Getenv("SNOWFLAKE_ROLE")
	if !config.SnowflakeRole.IsNull() {
		snowflakeRole = config.SnowflakeRole.ValueString()
	}

	snowflakeWarehouse := os.Getenv("SNOWFLAKE_WAREHOUSE")
	if !config.SnowflakeWarehouse.IsNull() {
		snowflakeWarehouse = config.SnowflakeWarehouse.ValueString()
	}

	tflog.Debug(ctx, "Snowflake configuration loaded", map[string]interface{}{
		"has_password":    snowflakePassword != "",
		"has_private_key": snowflakePrivateKey != "",
		"role":            snowflakeRole,
		"warehouse":       snowflakeWarehouse,
	})

	if ovhApplicationKey == "" {
		resp.Diagnostics.AddError(
			"Unable to find OVH application key",
			"ovh_application_key cannot be an empty string",
		)
		return
	}

	if ovhApplicationSecret == "" {
		resp.Diagnostics.AddError(
			"Unable to find OVH application secret",
			"ovh_application_secret cannot be an empty string",
		)
		return
	}

	if ovhConsumerKey == "" {
		resp.Diagnostics.AddError(
			"Unable to find OVH consumer key",
			"ovh_consumer_key cannot be an empty string",
		)
		return
	}

	ctx = tflog.SetField(ctx, "ovh_endpoint", ovhEndpoint)
	ctx = tflog.SetField(ctx, "ovh_application_key", ovhApplicationKey)
	ctx = tflog.SetField(ctx, "snowflake_account", snowflakeAccount)
	ctx = tflog.SetField(ctx, "snowflake_user", snowflakeUser)
	ctx = tflog.MaskFieldValuesWithFieldKeys(ctx, "ovh_application_secret")
	ctx = tflog.MaskFieldValuesWithFieldKeys(ctx, "ovh_consumer_key")
	ctx = tflog.MaskFieldValuesWithFieldKeys(ctx, "snowflake_password")
	ctx = tflog.MaskFieldValuesWithFieldKeys(ctx, "snowflake_private_key")

	tflog.Debug(ctx, "Configuring provider clients")

	client := NewConfig()
	if err := client.LoadConfiguration(ctx, &config); err != nil {
		resp.Diagnostics.AddError(
			"Failed to configure provider",
			"Failed to load provider configuration:\n\n"+err.Error(),
		)
		return
	}

	if err := client.ValidateConfiguration(ctx); err != nil {
		resp.Diagnostics.AddError(
			"Failed to validate provider configuration",
			"Provider configuration validation failed:\n\n"+err.Error(),
		)
		return
	}

	resp.DataSourceData = client
	resp.ResourceData = client

	tflog.Info(ctx, "Configured Snowflake OVH client", map[string]any{"success": true})
}

func (p *SnowflakeOVHProvider) Resources(ctx context.Context) []func() resource.Resource {
	return []func() resource.Resource{
		NewSnowflakeWarehouseResource,
		NewSnowflakeDatabaseResource,
		NewSnowflakeSchemaResource,
		NewSnowflakeTableResource,
		NewSnowflakeUserResource,
		NewSnowflakeRoleResource,
		NewSnowflakeGrantResource,
		NewSnowflakeResourceMonitorResource,
	}
}

func (p *SnowflakeOVHProvider) DataSources(ctx context.Context) []func() datasource.DataSource {
	return []func() datasource.DataSource{
		NewSnowflakeAccountsDataSource,
	}
}

func New(version string) func() provider.Provider {
	return func() provider.Provider {
		return &SnowflakeOVHProvider{
			version: version,
		}
	}
}
