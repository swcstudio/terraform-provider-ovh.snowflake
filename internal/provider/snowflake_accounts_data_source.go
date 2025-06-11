package provider

import (
	"context"

	"github.com/hashicorp/terraform-plugin-framework/datasource"
	"github.com/hashicorp/terraform-plugin-framework/datasource/schema"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

var _ datasource.DataSource = &SnowflakeAccountsDataSource{}

func NewSnowflakeAccountsDataSource() datasource.DataSource {
	return &SnowflakeAccountsDataSource{}
}

type SnowflakeAccountsDataSource struct {
	config *Config
}

type SnowflakeAccountsDataSourceModel struct {
	ID       types.String                         `tfsdk:"id"`
	Accounts []SnowflakeAccountsDataSourceAccount `tfsdk:"accounts"`
}

type SnowflakeAccountsDataSourceAccount struct {
	ID     types.String `tfsdk:"id"`
	Name   types.String `tfsdk:"name"`
	Region types.String `tfsdk:"region"`
	URL    types.String `tfsdk:"url"`
}

func (d *SnowflakeAccountsDataSource) Metadata(ctx context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_accounts"
}

func (d *SnowflakeAccountsDataSource) Schema(ctx context.Context, req datasource.SchemaRequest, resp *datasource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Fetches information about Snowflake accounts available on OVH infrastructure.",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "Unique identifier for this data source.",
				Computed:    true,
			},
			"accounts": schema.ListNestedAttribute{
				Description: "List of available Snowflake accounts.",
				Computed:    true,
				NestedObject: schema.NestedAttributeObject{
					Attributes: map[string]schema.Attribute{
						"id": schema.StringAttribute{
							Description: "Account identifier.",
							Computed:    true,
						},
						"name": schema.StringAttribute{
							Description: "Account name.",
							Computed:    true,
						},
						"region": schema.StringAttribute{
							Description: "Account region.",
							Computed:    true,
						},
						"url": schema.StringAttribute{
							Description: "Account URL.",
							Computed:    true,
						},
					},
				},
			},
		},
	}
}

func (d *SnowflakeAccountsDataSource) Configure(ctx context.Context, req datasource.ConfigureRequest, resp *datasource.ConfigureResponse) {
	if req.ProviderData == nil {
		return
	}

	config, ok := req.ProviderData.(*Config)
	if !ok {
		resp.Diagnostics.AddError(
			"Unexpected Data Source Configure Type",
			"Expected *Config, got something else. Please report this issue to the provider developers.",
		)
		return
	}

	d.config = config
}

func (d *SnowflakeAccountsDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
	var data SnowflakeAccountsDataSourceModel

	resp.Diagnostics.Append(req.Config.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Reading Snowflake accounts data source")

	data.ID = types.StringValue("snowflake-accounts")
	data.Accounts = []SnowflakeAccountsDataSourceAccount{
		{
			ID:     types.StringValue("account-1"),
			Name:   types.StringValue("Production Account"),
			Region: types.StringValue("eu-west-1"),
			URL:    types.StringValue("https://account-1.snowflakecomputing.com"),
		},
	}

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}
