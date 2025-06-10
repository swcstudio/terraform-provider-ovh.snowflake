package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

var _ resource.Resource = &SnowflakeWarehouseResource{}

func NewSnowflakeWarehouseResource() resource.Resource {
	return &SnowflakeWarehouseResource{}
}

type SnowflakeWarehouseResource struct {
	config *Config
}

type SnowflakeWarehouseResourceModel struct {
	ID                types.String `tfsdk:"id"`
	Name              types.String `tfsdk:"name"`
	Size              types.String `tfsdk:"size"`
	AutoSuspend       types.Int64  `tfsdk:"auto_suspend"`
	AutoResume        types.Bool   `tfsdk:"auto_resume"`
	InitiallySuspended types.Bool   `tfsdk:"initially_suspended"`
	Comment           types.String `tfsdk:"comment"`
}

func (r *SnowflakeWarehouseResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_warehouse"
}

func (r *SnowflakeWarehouseResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Manages a Snowflake warehouse on OVH infrastructure.",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "Unique identifier for the warehouse.",
				Computed:    true,
			},
			"name": schema.StringAttribute{
				Description: "Name of the warehouse.",
				Required:    true,
			},
			"size": schema.StringAttribute{
				Description: "Size of the warehouse (X-SMALL, SMALL, MEDIUM, LARGE, X-LARGE, etc.).",
				Optional:    true,
				Computed:    true,
			},
			"auto_suspend": schema.Int64Attribute{
				Description: "Number of seconds to wait before automatically suspending the warehouse.",
				Optional:    true,
				Computed:    true,
			},
			"auto_resume": schema.BoolAttribute{
				Description: "Whether to automatically resume the warehouse when accessed.",
				Optional:    true,
				Computed:    true,
			},
			"initially_suspended": schema.BoolAttribute{
				Description: "Whether the warehouse should be created in a suspended state.",
				Optional:    true,
				Computed:    true,
			},
			"comment": schema.StringAttribute{
				Description: "Comment for the warehouse.",
				Optional:    true,
			},
		},
	}
}

func (r *SnowflakeWarehouseResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

func (r *SnowflakeWarehouseResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var data SnowflakeWarehouseResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Creating Snowflake warehouse", map[string]interface{}{
		"name": data.Name.ValueString(),
	})

	data.ID = types.StringValue(fmt.Sprintf("warehouse-%s", data.Name.ValueString()))

	tflog.Trace(ctx, "Created Snowflake warehouse")

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeWarehouseResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var data SnowflakeWarehouseResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Reading Snowflake warehouse", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeWarehouseResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var data SnowflakeWarehouseResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Updating Snowflake warehouse", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeWarehouseResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var data SnowflakeWarehouseResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Deleting Snowflake warehouse", map[string]interface{}{
		"id": data.ID.ValueString(),
	})
}
