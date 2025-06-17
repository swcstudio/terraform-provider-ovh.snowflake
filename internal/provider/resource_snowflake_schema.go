package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeSchema() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake schema",

		CreateContext: resourceSnowflakeSchemaCreate,
		ReadContext:   resourceSnowflakeSchemaRead,
		UpdateContext: resourceSnowflakeSchemaUpdate,
		DeleteContext: resourceSnowflakeSchemaDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Name of the schema",
			},
			"database": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Database name",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the schema",
			},
			"is_transient": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				ForceNew:    true,
				Description: "Create transient schema",
			},
			"is_managed": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				ForceNew:    true,
				Description: "Create managed schema",
			},
			"data_retention_time_in_days": {
				Type:        schema.TypeInt,
				Optional:    true,
				Description: "Data retention time in days",
			},
			"tags": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Tags to apply to schema",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Schema owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakeSchemaCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	schemaConfig := map[string]interface{}{
		"name":                    d.Get("name").(string),
		"database":                d.Get("database").(string),
		"comment":                 d.Get("comment").(string),
		"isTransient":             d.Get("is_transient").(bool),
		"isManaged":               d.Get("is_managed").(bool),
		"dataRetentionTimeInDays": d.Get("data_retention_time_in_days").(int),
		"tags":                    d.Get("tags"),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/schema", schemaConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake schema: %w", err))
	}

	schemaId := result["id"].(string)
	d.SetId(schemaId)

	return resourceSnowflakeSchemaRead(ctx, d, meta)
}

func resourceSnowflakeSchemaRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	schemaId := d.Id()

	var schema map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/schema/%s", schemaId), &schema)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake schema: %w", err))
	}

	d.Set("name", schema["name"])
	d.Set("database", schema["database"])
	d.Set("comment", schema["comment"])
	d.Set("is_transient", schema["isTransient"])
	d.Set("is_managed", schema["isManaged"])
	d.Set("data_retention_time_in_days", schema["dataRetentionTimeInDays"])
	d.Set("owner", schema["owner"])
	d.Set("created_on", schema["createdOn"])

	if tags, ok := schema["tags"].(map[string]interface{}); ok {
		d.Set("tags", tags)
	}

	return nil
}

func resourceSnowflakeSchemaUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	schemaId := d.Id()

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

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/schema/%s", schemaId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake schema: %w", err))
		}
	}

	return resourceSnowflakeSchemaRead(ctx, d, meta)
}

func resourceSnowflakeSchemaDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	schemaId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/schema/%s", schemaId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake schema: %w", err))
	}

	d.SetId("")
	return nil
}
