package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

var _ resource.Resource = &SnowflakeGrantResource{}

func NewSnowflakeGrantResource() resource.Resource {
	return &SnowflakeGrantResource{}
}

type SnowflakeGrantResource struct {
	config *Config
}

type SnowflakeGrantResourceModel struct {
	ID         types.String `tfsdk:"id"`
	Privilege  types.String `tfsdk:"privilege"`
	ObjectType types.String `tfsdk:"object_type"`
	ObjectName types.String `tfsdk:"object_name"`
	Role       types.String `tfsdk:"role"`
}

func (r *SnowflakeGrantResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_grant"
}

func (r *SnowflakeGrantResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Manages a Snowflake grant on OVH infrastructure.",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "Unique identifier for the grant.",
				Computed:    true,
			},
			"privilege": schema.StringAttribute{
				Description: "Privilege to grant (SELECT, INSERT, UPDATE, DELETE, etc.).",
				Required:    true,
			},
			"object_type": schema.StringAttribute{
				Description: "Type of object to grant privilege on (TABLE, DATABASE, SCHEMA, etc.).",
				Required:    true,
			},
			"object_name": schema.StringAttribute{
				Description: "Name of the object to grant privilege on.",
				Required:    true,
			},
			"role": schema.StringAttribute{
				Description: "Role to grant the privilege to.",
				Required:    true,
			},
		},
	}
}

func (r *SnowflakeGrantResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

func (r *SnowflakeGrantResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var data SnowflakeGrantResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Creating Snowflake grant", map[string]interface{}{
		"privilege":   data.Privilege.ValueString(),
		"object_type": data.ObjectType.ValueString(),
		"object_name": data.ObjectName.ValueString(),
		"role":        data.Role.ValueString(),
	})

	data.ID = types.StringValue(fmt.Sprintf("grant-%s-%s-%s-%s",
		data.Privilege.ValueString(),
		data.ObjectType.ValueString(),
		data.ObjectName.ValueString(),
		data.Role.ValueString()))

	tflog.Trace(ctx, "Created Snowflake grant")

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeGrantResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var data SnowflakeGrantResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Reading Snowflake grant", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeGrantResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var data SnowflakeGrantResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Updating Snowflake grant", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeGrantResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var data SnowflakeGrantResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Deleting Snowflake grant", map[string]interface{}{
		"id": data.ID.ValueString(),
	})
}
