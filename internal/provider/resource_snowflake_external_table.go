package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeExternalTable() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake external table",

		CreateContext: resourceSnowflakeExternalTableCreate,
		ReadContext:   resourceSnowflakeExternalTableRead,
		UpdateContext: resourceSnowflakeExternalTableUpdate,
		DeleteContext: resourceSnowflakeExternalTableDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "External table name",
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
			"columns": {
				Type:        schema.TypeList,
				Required:    true,
				Description: "Table columns",
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"name": {
							Type:        schema.TypeString,
							Required:    true,
							Description: "Column name",
						},
						"type": {
							Type:        schema.TypeString,
							Required:    true,
							Description: "Column data type",
						},
						"as": {
							Type:        schema.TypeString,
							Optional:    true,
							Description: "Column expression",
						},
					},
				},
			},
			"location": {
				Type:        schema.TypeString,
				Required:    true,
				Description: "External location",
			},
			"file_format": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "File format",
			},
			"pattern": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "File pattern",
			},
			"partition_by": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Partition columns",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"auto_refresh": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Enable auto refresh",
			},
			"refresh_on_create": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Refresh on create",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the external table",
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "External table owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakeExternalTableCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableConfig := map[string]interface{}{
		"name":            d.Get("name").(string),
		"database":        d.Get("database").(string),
		"schema":          d.Get("schema").(string),
		"columns":         d.Get("columns").([]interface{}),
		"location":        d.Get("location").(string),
		"fileFormat":      d.Get("file_format").(string),
		"pattern":         d.Get("pattern").(string),
		"partitionBy":     d.Get("partition_by").([]interface{}),
		"autoRefresh":     d.Get("auto_refresh").(bool),
		"refreshOnCreate": d.Get("refresh_on_create").(bool),
		"comment":         d.Get("comment").(string),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/external-table", tableConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake external table: %w", err))
	}

	tableId := result["id"].(string)
	d.SetId(tableId)

	return resourceSnowflakeExternalTableRead(ctx, d, meta)
}

func resourceSnowflakeExternalTableRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableId := d.Id()

	var table map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/external-table/%s", tableId), &table)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake external table: %w", err))
	}

	d.Set("name", table["name"])
	d.Set("database", table["database"])
	d.Set("schema", table["schema"])
	d.Set("columns", table["columns"])
	d.Set("location", table["location"])
	d.Set("file_format", table["fileFormat"])
	d.Set("pattern", table["pattern"])
	d.Set("partition_by", table["partitionBy"])
	d.Set("auto_refresh", table["autoRefresh"])
	d.Set("refresh_on_create", table["refreshOnCreate"])
	d.Set("comment", table["comment"])
	d.Set("owner", table["owner"])
	d.Set("created_on", table["createdOn"])

	return nil
}

func resourceSnowflakeExternalTableUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableId := d.Id()

	if d.HasChanges("columns", "file_format", "pattern", "partition_by", "auto_refresh", "comment") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("columns") {
			updateConfig["columns"] = d.Get("columns").([]interface{})
		}
		if d.HasChange("file_format") {
			updateConfig["fileFormat"] = d.Get("file_format").(string)
		}
		if d.HasChange("pattern") {
			updateConfig["pattern"] = d.Get("pattern").(string)
		}
		if d.HasChange("partition_by") {
			updateConfig["partitionBy"] = d.Get("partition_by").([]interface{})
		}
		if d.HasChange("auto_refresh") {
			updateConfig["autoRefresh"] = d.Get("auto_refresh").(bool)
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/external-table/%s", tableId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake external table: %w", err))
		}
	}

	return resourceSnowflakeExternalTableRead(ctx, d, meta)
}

func resourceSnowflakeExternalTableDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/external-table/%s", tableId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake external table: %w", err))
	}

	d.SetId("")
	return nil
}
