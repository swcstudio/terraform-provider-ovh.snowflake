package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeTask() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake task",

		CreateContext: resourceSnowflakeTaskCreate,
		ReadContext:   resourceSnowflakeTaskRead,
		UpdateContext: resourceSnowflakeTaskUpdate,
		DeleteContext: resourceSnowflakeTaskDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Task name",
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
			"sql_statement": {
				Type:        schema.TypeString,
				Required:    true,
				Description: "SQL statement to execute",
			},
			"warehouse": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Warehouse to use",
			},
			"schedule": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Task schedule",
			},
			"session_parameters": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Session parameters",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"user_task_timeout_ms": {
				Type:        schema.TypeInt,
				Optional:    true,
				Description: "User task timeout in milliseconds",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the task",
			},
			"after": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Tasks this task depends on",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"when": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Condition for task execution",
			},
			"enabled": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Enable task",
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Task owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
			"state": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Task state",
			},
			"definition": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Task definition",
			},
			"condition": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Task condition",
			},
		},
	}
}

func resourceSnowflakeTaskCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	taskConfig := map[string]interface{}{
		"name":              d.Get("name").(string),
		"database":          d.Get("database").(string),
		"schema":            d.Get("schema").(string),
		"sqlStatement":      d.Get("sql_statement").(string),
		"warehouse":         d.Get("warehouse").(string),
		"schedule":          d.Get("schedule").(string),
		"sessionParameters": d.Get("session_parameters"),
		"userTaskTimeoutMs": d.Get("user_task_timeout_ms").(int),
		"comment":           d.Get("comment").(string),
		"after":             d.Get("after").([]interface{}),
		"when":              d.Get("when").(string),
		"enabled":           d.Get("enabled").(bool),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/task", taskConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake task: %w", err))
	}

	taskId := result["id"].(string)
	d.SetId(taskId)

	return resourceSnowflakeTaskRead(ctx, d, meta)
}

func resourceSnowflakeTaskRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	taskId := d.Id()

	var task map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/task/%s", taskId), &task)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake task: %w", err))
	}

	d.Set("name", task["name"])
	d.Set("database", task["database"])
	d.Set("schema", task["schema"])
	d.Set("sql_statement", task["sqlStatement"])
	d.Set("warehouse", task["warehouse"])
	d.Set("schedule", task["schedule"])
	d.Set("session_parameters", task["sessionParameters"])
	d.Set("user_task_timeout_ms", task["userTaskTimeoutMs"])
	d.Set("comment", task["comment"])
	d.Set("after", task["after"])
	d.Set("when", task["when"])
	d.Set("enabled", task["enabled"])
	d.Set("owner", task["owner"])
	d.Set("created_on", task["createdOn"])
	d.Set("state", task["state"])
	d.Set("definition", task["definition"])
	d.Set("condition", task["condition"])

	return nil
}

func resourceSnowflakeTaskUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	taskId := d.Id()

	if d.HasChanges("sql_statement", "warehouse", "schedule", "session_parameters", "user_task_timeout_ms", "comment", "after", "when", "enabled") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("sql_statement") {
			updateConfig["sqlStatement"] = d.Get("sql_statement").(string)
		}
		if d.HasChange("warehouse") {
			updateConfig["warehouse"] = d.Get("warehouse").(string)
		}
		if d.HasChange("schedule") {
			updateConfig["schedule"] = d.Get("schedule").(string)
		}
		if d.HasChange("session_parameters") {
			updateConfig["sessionParameters"] = d.Get("session_parameters")
		}
		if d.HasChange("user_task_timeout_ms") {
			updateConfig["userTaskTimeoutMs"] = d.Get("user_task_timeout_ms").(int)
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}
		if d.HasChange("after") {
			updateConfig["after"] = d.Get("after").([]interface{})
		}
		if d.HasChange("when") {
			updateConfig["when"] = d.Get("when").(string)
		}
		if d.HasChange("enabled") {
			updateConfig["enabled"] = d.Get("enabled").(bool)
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/task/%s", taskId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake task: %w", err))
		}
	}

	return resourceSnowflakeTaskRead(ctx, d, meta)
}

func resourceSnowflakeTaskDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	taskId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/task/%s", taskId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake task: %w", err))
	}

	d.SetId("")
	return nil
}
