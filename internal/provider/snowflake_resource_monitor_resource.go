package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

var _ resource.Resource = &SnowflakeResourceMonitorResource{}

func NewSnowflakeResourceMonitorResource() resource.Resource {
	return &SnowflakeResourceMonitorResource{}
}

type SnowflakeResourceMonitorResource struct {
	config *Config
}

type SnowflakeResourceMonitorResourceModel struct {
	ID           types.String `tfsdk:"id"`
	Name         types.String `tfsdk:"name"`
	CreditQuota  types.Int64  `tfsdk:"credit_quota"`
	Frequency    types.String `tfsdk:"frequency"`
	StartTime    types.String `tfsdk:"start_time"`
	EndTime      types.String `tfsdk:"end_time"`
	SuspendAt    types.Int64  `tfsdk:"suspend_at"`
	SuspendImmediatelyAt types.Int64  `tfsdk:"suspend_immediately_at"`
}

func (r *SnowflakeResourceMonitorResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_resource_monitor"
}

func (r *SnowflakeResourceMonitorResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Manages a Snowflake resource monitor on OVH infrastructure.",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "Unique identifier for the resource monitor.",
				Computed:    true,
			},
			"name": schema.StringAttribute{
				Description: "Name of the resource monitor.",
				Required:    true,
			},
			"credit_quota": schema.Int64Attribute{
				Description: "Credit quota for the resource monitor.",
				Optional:    true,
			},
			"frequency": schema.StringAttribute{
				Description: "Frequency of the resource monitor (MONTHLY, DAILY, WEEKLY, YEARLY, NEVER).",
				Optional:    true,
			},
			"start_time": schema.StringAttribute{
				Description: "Start time for the resource monitor.",
				Optional:    true,
			},
			"end_time": schema.StringAttribute{
				Description: "End time for the resource monitor.",
				Optional:    true,
			},
			"suspend_at": schema.Int64Attribute{
				Description: "Percentage of quota at which to suspend warehouses.",
				Optional:    true,
			},
			"suspend_immediately_at": schema.Int64Attribute{
				Description: "Percentage of quota at which to immediately suspend warehouses.",
				Optional:    true,
			},
		},
	}
}

func (r *SnowflakeResourceMonitorResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

func (r *SnowflakeResourceMonitorResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var data SnowflakeResourceMonitorResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Creating Snowflake resource monitor", map[string]interface{}{
		"name": data.Name.ValueString(),
	})

	data.ID = types.StringValue(fmt.Sprintf("resource-monitor-%s", data.Name.ValueString()))

	tflog.Trace(ctx, "Created Snowflake resource monitor")

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeResourceMonitorResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var data SnowflakeResourceMonitorResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Reading Snowflake resource monitor", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeResourceMonitorResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var data SnowflakeResourceMonitorResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Updating Snowflake resource monitor", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeResourceMonitorResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var data SnowflakeResourceMonitorResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Deleting Snowflake resource monitor", map[string]interface{}{
		"id": data.ID.ValueString(),
	})
}
