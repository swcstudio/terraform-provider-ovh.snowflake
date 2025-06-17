package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeStream() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake stream",

		CreateContext: resourceSnowflakeStreamCreate,
		ReadContext:   resourceSnowflakeStreamRead,
		UpdateContext: resourceSnowflakeStreamUpdate,
		DeleteContext: resourceSnowflakeStreamDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Stream name",
			},
			"database": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Database name",
			},
			"schema": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Schema name",
			},
			"on_table": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "Table to create stream on",
			},
			"on_view": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "View to create stream on",
			},
			"append_only": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				ForceNew:    true,
				Description: "Create append-only stream",
			},
			"show_initial_rows": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				ForceNew:    true,
				Description: "Show initial rows",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the stream",
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Stream owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
			"table_name": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Source table name",
			},
			"type": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Stream type",
			},
			"stale": {
				Type:        schema.TypeBool,
				Computed:    true,
				Description: "Stream is stale",
			},
			"mode": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Stream mode",
			},
		},
	}
}

func resourceSnowflakeStreamCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	streamConfig := map[string]interface{}{
		"name":            d.Get("name").(string),
		"database":        d.Get("database").(string),
		"schema":          d.Get("schema").(string),
		"onTable":         d.Get("on_table").(string),
		"onView":          d.Get("on_view").(string),
		"appendOnly":      d.Get("append_only").(bool),
		"showInitialRows": d.Get("show_initial_rows").(bool),
		"comment":         d.Get("comment").(string),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/stream", streamConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake stream: %w", err))
	}

	streamId := result["id"].(string)
	d.SetId(streamId)

	return resourceSnowflakeStreamRead(ctx, d, meta)
}

func resourceSnowflakeStreamRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	streamId := d.Id()

	var stream map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/stream/%s", streamId), &stream)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake stream: %w", err))
	}

	d.Set("name", stream["name"])
	d.Set("database", stream["database"])
	d.Set("schema", stream["schema"])
	d.Set("on_table", stream["onTable"])
	d.Set("on_view", stream["onView"])
	d.Set("append_only", stream["appendOnly"])
	d.Set("show_initial_rows", stream["showInitialRows"])
	d.Set("comment", stream["comment"])
	d.Set("owner", stream["owner"])
	d.Set("created_on", stream["createdOn"])
	d.Set("table_name", stream["tableName"])
	d.Set("type", stream["type"])
	d.Set("stale", stream["stale"])
	d.Set("mode", stream["mode"])

	return nil
}

func resourceSnowflakeStreamUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	streamId := d.Id()

	if d.HasChange("comment") {
		updateConfig := map[string]interface{}{
			"comment": d.Get("comment").(string),
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/stream/%s", streamId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake stream: %w", err))
		}
	}

	return resourceSnowflakeStreamRead(ctx, d, meta)
}

func resourceSnowflakeStreamDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	streamId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/stream/%s", streamId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake stream: %w", err))
	}

	d.SetId("")
	return nil
}
