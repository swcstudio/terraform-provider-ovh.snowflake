package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeTable() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake table",

		CreateContext: resourceSnowflakeTableCreate,
		ReadContext:   resourceSnowflakeTableRead,
		UpdateContext: resourceSnowflakeTableUpdate,
		DeleteContext: resourceSnowflakeTableDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Name of the table",
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
						"nullable": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Column nullable",
						},
						"default": {
							Type:        schema.TypeString,
							Optional:    true,
							Description: "Default value",
						},
						"comment": {
							Type:        schema.TypeString,
							Optional:    true,
							Description: "Column comment",
						},
					},
				},
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the table",
			},
			"cluster_by": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Clustering keys",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"data_retention_time_in_days": {
				Type:        schema.TypeInt,
				Optional:    true,
				Description: "Data retention time in days",
			},
			"change_tracking": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Enable change tracking",
			},
			"tags": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Tags to apply to table",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Table owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakeTableCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableConfig := map[string]interface{}{
		"name":                    d.Get("name").(string),
		"database":                d.Get("database").(string),
		"schema":                  d.Get("schema").(string),
		"columns":                 d.Get("columns").([]interface{}),
		"comment":                 d.Get("comment").(string),
		"clusterBy":               d.Get("cluster_by").([]interface{}),
		"dataRetentionTimeInDays": d.Get("data_retention_time_in_days").(int),
		"changeTracking":          d.Get("change_tracking").(bool),
		"tags":                    d.Get("tags"),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/table", tableConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake table: %w", err))
	}

	tableId := result["id"].(string)
	d.SetId(tableId)

	return resourceSnowflakeTableRead(ctx, d, meta)
}

func resourceSnowflakeTableRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableId := d.Id()

	var table map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/table/%s", tableId), &table)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake table: %w", err))
	}

	d.Set("name", table["name"])
	d.Set("database", table["database"])
	d.Set("schema", table["schema"])
	d.Set("columns", table["columns"])
	d.Set("comment", table["comment"])
	d.Set("cluster_by", table["clusterBy"])
	d.Set("data_retention_time_in_days", table["dataRetentionTimeInDays"])
	d.Set("change_tracking", table["changeTracking"])
	d.Set("owner", table["owner"])
	d.Set("created_on", table["createdOn"])

	if tags, ok := table["tags"].(map[string]interface{}); ok {
		d.Set("tags", tags)
	}

	return nil
}

func resourceSnowflakeTableUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableId := d.Id()

	if d.HasChanges("columns", "comment", "cluster_by", "data_retention_time_in_days", "change_tracking", "tags") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("columns") {
			updateConfig["columns"] = d.Get("columns").([]interface{})
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}
		if d.HasChange("cluster_by") {
			updateConfig["clusterBy"] = d.Get("cluster_by").([]interface{})
		}
		if d.HasChange("data_retention_time_in_days") {
			updateConfig["dataRetentionTimeInDays"] = d.Get("data_retention_time_in_days").(int)
		}
		if d.HasChange("change_tracking") {
			updateConfig["changeTracking"] = d.Get("change_tracking").(bool)
		}
		if d.HasChange("tags") {
			updateConfig["tags"] = d.Get("tags")
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/table/%s", tableId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake table: %w", err))
		}
	}

	return resourceSnowflakeTableRead(ctx, d, meta)
}

func resourceSnowflakeTableDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	tableId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/table/%s", tableId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake table: %w", err))
	}

	d.SetId("")
	return nil
}
