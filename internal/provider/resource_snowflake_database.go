package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeDatabase() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake database with OVH infrastructure optimization",

		CreateContext: resourceSnowflakeDatabaseCreate,
		ReadContext:   resourceSnowflakeDatabaseRead,
		UpdateContext: resourceSnowflakeDatabaseUpdate,
		DeleteContext: resourceSnowflakeDatabaseDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Name of the database",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the database",
			},
			"data_retention_time_in_days": {
				Type:        schema.TypeInt,
				Optional:    true,
				Default:     1,
				Description: "Data retention time in days",
			},
			"from_share": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "Create database from share",
			},
			"from_database": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "Create database from existing database",
			},
			"from_replica": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "Create database from replica",
			},
			"tags": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Tags to apply to database",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Database owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakeDatabaseCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	databaseConfig := map[string]interface{}{
		"name":                    d.Get("name").(string),
		"comment":                 d.Get("comment").(string),
		"dataRetentionTimeInDays": d.Get("data_retention_time_in_days").(int),
		"fromShare":               d.Get("from_share").(string),
		"fromDatabase":            d.Get("from_database").(string),
		"fromReplica":             d.Get("from_replica").(string),
		"tags":                    d.Get("tags"),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/database", databaseConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake database: %w", err))
	}

	databaseId := result["id"].(string)
	d.SetId(databaseId)

	return resourceSnowflakeDatabaseRead(ctx, d, meta)
}

func resourceSnowflakeDatabaseRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	databaseId := d.Id()

	var database map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/database/%s", databaseId), &database)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake database: %w", err))
	}

	d.Set("name", database["name"])
	d.Set("comment", database["comment"])
	d.Set("data_retention_time_in_days", database["dataRetentionTimeInDays"])
	d.Set("owner", database["owner"])
	d.Set("created_on", database["createdOn"])

	if tags, ok := database["tags"].(map[string]interface{}); ok {
		d.Set("tags", tags)
	}

	return nil
}

func resourceSnowflakeDatabaseUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	databaseId := d.Id()

	if d.HasChanges("comment", "data_retention_time_in_days", "tags") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}
		if d.HasChange("data_retention_time_in_days") {
			updateConfig["dataRetentionTimeInDays"] = d.Get("data_retention_time_in_days").(int)
		}
		if d.HasChange("tags") {
			updateConfig["tags"] = d.Get("tags")
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/database/%s", databaseId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake database: %w", err))
		}
	}

	return resourceSnowflakeDatabaseRead(ctx, d, meta)
}

func resourceSnowflakeDatabaseDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	databaseId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/database/%s", databaseId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake database: %w", err))
	}

	d.SetId("")
	return nil
}
