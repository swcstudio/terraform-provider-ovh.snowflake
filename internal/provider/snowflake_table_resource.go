package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

var _ resource.Resource = &SnowflakeTableResource{}

func NewSnowflakeTableResource() resource.Resource {
	return &SnowflakeTableResource{}
}

type SnowflakeTableResource struct {
	config *Config
}

type SnowflakeTableResourceModel struct {
	ID       types.String `tfsdk:"id"`
	Name     types.String `tfsdk:"name"`
	Database types.String `tfsdk:"database"`
	Schema   types.String `tfsdk:"schema"`
	Comment  types.String `tfsdk:"comment"`
}

func (r *SnowflakeTableResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_table"
}

func (r *SnowflakeTableResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Manages a Snowflake table on OVH infrastructure.",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "Unique identifier for the table.",
				Computed:    true,
			},
			"name": schema.StringAttribute{
				Description: "Name of the table.",
				Required:    true,
			},
			"database": schema.StringAttribute{
				Description: "Database that contains the table.",
				Required:    true,
			},
			"schema": schema.StringAttribute{
				Description: "Schema that contains the table.",
				Required:    true,
			},
			"comment": schema.StringAttribute{
				Description: "Comment for the table.",
				Optional:    true,
			},
		},
	}
}

func (r *SnowflakeTableResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
	if req.ProviderData == nil {
		return
	}

	config, ok := req.ProviderData.(*Config)
	if !ok {
		resp.Diagnostics.AddError(
			"Unexpected Resource Configure Type",
			fmt.Sprintf("Expected *Config, got: %T. Please report this issue to the provider developers.", req.ProviderData),
		)
		return
	}

	r.config = config
}

func (r *SnowflakeTableResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var data SnowflakeTableResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Creating Snowflake table", map[string]interface{}{
		"name":     data.Name.ValueString(),
		"database": data.Database.ValueString(),
		"schema":   data.Schema.ValueString(),
	})

	data.ID = types.StringValue(fmt.Sprintf("table-%s-%s-%s", data.Database.ValueString(), data.Schema.ValueString(), data.Name.ValueString()))

	tflog.Trace(ctx, "Created Snowflake table")

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeTableResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var data SnowflakeTableResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Reading Snowflake table", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeTableResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var data SnowflakeTableResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Updating Snowflake table", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeTableResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var data SnowflakeTableResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Deleting Snowflake table", map[string]interface{}{
		"id": data.ID.ValueString(),
	})
}
