package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
	"github.com/hashicorp/terraform-plugin-framework/types"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

var _ resource.Resource = &SnowflakeSchemaResource{}

func NewSnowflakeSchemaResource() resource.Resource {
	return &SnowflakeSchemaResource{}
}

type SnowflakeSchemaResource struct {
	config *Config
}

type SnowflakeSchemaResourceModel struct {
	ID       types.String `tfsdk:"id"`
	Name     types.String `tfsdk:"name"`
	Database types.String `tfsdk:"database"`
	Comment  types.String `tfsdk:"comment"`
}

func (r *SnowflakeSchemaResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_schema"
}

func (r *SnowflakeSchemaResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
	resp.Schema = schema.Schema{
		Description: "Manages a Snowflake schema on OVH infrastructure.",
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Description: "Unique identifier for the schema.",
				Computed:    true,
			},
			"name": schema.StringAttribute{
				Description: "Name of the schema.",
				Required:    true,
			},
			"database": schema.StringAttribute{
				Description: "Database that contains the schema.",
				Required:    true,
			},
			"comment": schema.StringAttribute{
				Description: "Comment for the schema.",
				Optional:    true,
			},
		},
	}
}

func (r *SnowflakeSchemaResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

func (r *SnowflakeSchemaResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var data SnowflakeSchemaResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Creating Snowflake schema", map[string]interface{}{
		"name":     data.Name.ValueString(),
		"database": data.Database.ValueString(),
	})

	data.ID = types.StringValue(fmt.Sprintf("schema-%s-%s", data.Database.ValueString(), data.Name.ValueString()))

	tflog.Trace(ctx, "Created Snowflake schema")

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeSchemaResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var data SnowflakeSchemaResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Reading Snowflake schema", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeSchemaResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var data SnowflakeSchemaResourceModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Updating Snowflake schema", map[string]interface{}{
		"id": data.ID.ValueString(),
	})

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SnowflakeSchemaResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var data SnowflakeSchemaResourceModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)
	if resp.Diagnostics.HasError() {
		return
	}

	tflog.Debug(ctx, "Deleting Snowflake schema", map[string]interface{}{
		"id": data.ID.ValueString(),
	})
}
