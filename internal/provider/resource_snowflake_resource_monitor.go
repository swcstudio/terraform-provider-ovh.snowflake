package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceSnowflakeResourceMonitor() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake resource monitor",

		CreateContext: resourceSnowflakeResourceMonitorCreate,
		ReadContext:   resourceSnowflakeResourceMonitorRead,
		UpdateContext: resourceSnowflakeResourceMonitorUpdate,
		DeleteContext: resourceSnowflakeResourceMonitorDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Resource monitor name",
			},
			"credit_quota": {
				Type:         schema.TypeInt,
				Optional:     true,
				Description:  "Credit quota",
				ValidateFunc: validation.IntAtLeast(1),
			},
			"frequency": {
				Type:        schema.TypeString,
				Optional:    true,
				Default:     "MONTHLY",
				Description: "Frequency",
				ValidateFunc: validation.StringInSlice([]string{
					"MONTHLY", "DAILY", "WEEKLY", "YEARLY", "NEVER",
				}, false),
			},
			"start_timestamp": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Start timestamp",
			},
			"end_timestamp": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "End timestamp",
			},
			"notify_triggers": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Notify triggers",
				Elem: &schema.Schema{
					Type:         schema.TypeInt,
					ValidateFunc: validation.IntBetween(1, 100),
				},
			},
			"suspend_triggers": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Suspend triggers",
				Elem: &schema.Schema{
					Type:         schema.TypeInt,
					ValidateFunc: validation.IntBetween(1, 100),
				},
			},
			"suspend_immediate_triggers": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Suspend immediate triggers",
				Elem: &schema.Schema{
					Type:         schema.TypeInt,
					ValidateFunc: validation.IntBetween(1, 100),
				},
			},
			"notify_users": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Users to notify",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the resource monitor",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Resource monitor owner",
			},
		},
	}
}

func resourceSnowflakeResourceMonitorCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	monitorConfig := map[string]interface{}{
		"name":                     d.Get("name").(string),
		"creditQuota":              d.Get("credit_quota").(int),
		"frequency":                d.Get("frequency").(string),
		"startTimestamp":           d.Get("start_timestamp").(string),
		"endTimestamp":             d.Get("end_timestamp").(string),
		"notifyTriggers":           d.Get("notify_triggers").([]interface{}),
		"suspendTriggers":          d.Get("suspend_triggers").([]interface{}),
		"suspendImmediateTriggers": d.Get("suspend_immediate_triggers").([]interface{}),
		"notifyUsers":              d.Get("notify_users").([]interface{}),
		"comment":                  d.Get("comment").(string),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/resource-monitor", monitorConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake resource monitor: %w", err))
	}

	monitorId := result["id"].(string)
	d.SetId(monitorId)

	return resourceSnowflakeResourceMonitorRead(ctx, d, meta)
}

func resourceSnowflakeResourceMonitorRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	monitorId := d.Id()

	var monitor map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/resource-monitor/%s", monitorId), &monitor)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake resource monitor: %w", err))
	}

	d.Set("name", monitor["name"])
	d.Set("credit_quota", monitor["creditQuota"])
	d.Set("frequency", monitor["frequency"])
	d.Set("start_timestamp", monitor["startTimestamp"])
	d.Set("end_timestamp", monitor["endTimestamp"])
	d.Set("notify_triggers", monitor["notifyTriggers"])
	d.Set("suspend_triggers", monitor["suspendTriggers"])
	d.Set("suspend_immediate_triggers", monitor["suspendImmediateTriggers"])
	d.Set("notify_users", monitor["notifyUsers"])
	d.Set("comment", monitor["comment"])
	d.Set("created_on", monitor["createdOn"])
	d.Set("owner", monitor["owner"])

	return nil
}

func resourceSnowflakeResourceMonitorUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	monitorId := d.Id()

	if d.HasChanges("credit_quota", "frequency", "start_timestamp", "end_timestamp", "notify_triggers", "suspend_triggers", "suspend_immediate_triggers", "notify_users", "comment") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("credit_quota") {
			updateConfig["creditQuota"] = d.Get("credit_quota").(int)
		}
		if d.HasChange("frequency") {
			updateConfig["frequency"] = d.Get("frequency").(string)
		}
		if d.HasChange("start_timestamp") {
			updateConfig["startTimestamp"] = d.Get("start_timestamp").(string)
		}
		if d.HasChange("end_timestamp") {
			updateConfig["endTimestamp"] = d.Get("end_timestamp").(string)
		}
		if d.HasChange("notify_triggers") {
			updateConfig["notifyTriggers"] = d.Get("notify_triggers").([]interface{})
		}
		if d.HasChange("suspend_triggers") {
			updateConfig["suspendTriggers"] = d.Get("suspend_triggers").([]interface{})
		}
		if d.HasChange("suspend_immediate_triggers") {
			updateConfig["suspendImmediateTriggers"] = d.Get("suspend_immediate_triggers").([]interface{})
		}
		if d.HasChange("notify_users") {
			updateConfig["notifyUsers"] = d.Get("notify_users").([]interface{})
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/resource-monitor/%s", monitorId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake resource monitor: %w", err))
		}
	}

	return resourceSnowflakeResourceMonitorRead(ctx, d, meta)
}

func resourceSnowflakeResourceMonitorDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	monitorId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/resource-monitor/%s", monitorId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake resource monitor: %w", err))
	}

	d.SetId("")
	return nil
}
