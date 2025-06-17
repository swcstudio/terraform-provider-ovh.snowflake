package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakePipe() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake pipe",

		CreateContext: resourceSnowflakePipeCreate,
		ReadContext:   resourceSnowflakePipeRead,
		UpdateContext: resourceSnowflakePipeUpdate,
		DeleteContext: resourceSnowflakePipeDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Pipe name",
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
			"copy_statement": {
				Type:        schema.TypeString,
				Required:    true,
				Description: "COPY statement for the pipe",
			},
			"auto_ingest": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Enable auto ingest",
			},
			"aws_sns_topic": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "AWS SNS topic ARN",
			},
			"integration": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Integration name",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the pipe",
			},
			"notification_channel": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Notification channel",
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Pipe owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakePipeCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	pipeConfig := map[string]interface{}{
		"name":          d.Get("name").(string),
		"database":      d.Get("database").(string),
		"schema":        d.Get("schema").(string),
		"copyStatement": d.Get("copy_statement").(string),
		"autoIngest":    d.Get("auto_ingest").(bool),
		"awsSnsTopic":   d.Get("aws_sns_topic").(string),
		"integration":   d.Get("integration").(string),
		"comment":       d.Get("comment").(string),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/pipe", pipeConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake pipe: %w", err))
	}

	pipeId := result["id"].(string)
	d.SetId(pipeId)

	return resourceSnowflakePipeRead(ctx, d, meta)
}

func resourceSnowflakePipeRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	pipeId := d.Id()

	var pipe map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/pipe/%s", pipeId), &pipe)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake pipe: %w", err))
	}

	d.Set("name", pipe["name"])
	d.Set("database", pipe["database"])
	d.Set("schema", pipe["schema"])
	d.Set("copy_statement", pipe["copyStatement"])
	d.Set("auto_ingest", pipe["autoIngest"])
	d.Set("aws_sns_topic", pipe["awsSnsTopic"])
	d.Set("integration", pipe["integration"])
	d.Set("comment", pipe["comment"])
	d.Set("notification_channel", pipe["notificationChannel"])
	d.Set("owner", pipe["owner"])
	d.Set("created_on", pipe["createdOn"])

	return nil
}

func resourceSnowflakePipeUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	pipeId := d.Id()

	if d.HasChanges("copy_statement", "auto_ingest", "aws_sns_topic", "integration", "comment") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("copy_statement") {
			updateConfig["copyStatement"] = d.Get("copy_statement").(string)
		}
		if d.HasChange("auto_ingest") {
			updateConfig["autoIngest"] = d.Get("auto_ingest").(bool)
		}
		if d.HasChange("aws_sns_topic") {
			updateConfig["awsSnsTopic"] = d.Get("aws_sns_topic").(string)
		}
		if d.HasChange("integration") {
			updateConfig["integration"] = d.Get("integration").(string)
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/pipe/%s", pipeId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake pipe: %w", err))
		}
	}

	return resourceSnowflakePipeRead(ctx, d, meta)
}

func resourceSnowflakePipeDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	pipeId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/pipe/%s", pipeId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake pipe: %w", err))
	}

	d.SetId("")
	return nil
}
