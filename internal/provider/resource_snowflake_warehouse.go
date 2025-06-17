package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceSnowflakeWarehouse() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake warehouse with OVH infrastructure optimization",

		CreateContext: resourceSnowflakeWarehouseCreate,
		ReadContext:   resourceSnowflakeWarehouseRead,
		UpdateContext: resourceSnowflakeWarehouseUpdate,
		DeleteContext: resourceSnowflakeWarehouseDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Name of the warehouse",
			},
			"size": {
				Type:        schema.TypeString,
				Optional:    true,
				Default:     "X-SMALL",
				Description: "Size of the warehouse",
				ValidateFunc: validation.StringInSlice([]string{
					"X-SMALL", "SMALL", "MEDIUM", "LARGE", "X-LARGE",
					"2X-LARGE", "3X-LARGE", "4X-LARGE", "5X-LARGE", "6X-LARGE",
				}, false),
			},
			"max_cluster_count": {
				Type:         schema.TypeInt,
				Optional:     true,
				Default:      1,
				Description:  "Maximum number of clusters",
				ValidateFunc: validation.IntBetween(1, 10),
			},
			"min_cluster_count": {
				Type:         schema.TypeInt,
				Optional:     true,
				Default:      1,
				Description:  "Minimum number of clusters",
				ValidateFunc: validation.IntBetween(1, 10),
			},
			"auto_suspend": {
				Type:         schema.TypeInt,
				Optional:     true,
				Default:      60,
				Description:  "Auto suspend time in seconds",
				ValidateFunc: validation.IntAtLeast(60),
			},
			"auto_resume": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Auto resume warehouse",
			},
			"initially_suspended": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Initially suspend warehouse",
			},
			"scaling_policy": {
				Type:        schema.TypeString,
				Optional:    true,
				Default:     "STANDARD",
				Description: "Scaling policy",
				ValidateFunc: validation.StringInSlice([]string{
					"STANDARD", "ECONOMY",
				}, false),
			},
			"resource_monitor": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Resource monitor name",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the warehouse",
			},
			"ovh_optimization": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Enable OVH infrastructure optimization",
			},
			"cost_tracking": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Enable cost tracking",
			},
			"performance_insights": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Enable performance insights",
			},
			"tags": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Tags to apply to warehouse",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"state": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Warehouse state",
			},
			"type": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Warehouse type",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakeWarehouseCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	warehouseConfig := map[string]interface{}{
		"name":                d.Get("name").(string),
		"size":                d.Get("size").(string),
		"maxClusterCount":     d.Get("max_cluster_count").(int),
		"minClusterCount":     d.Get("min_cluster_count").(int),
		"autoSuspend":         d.Get("auto_suspend").(int),
		"autoResume":          d.Get("auto_resume").(bool),
		"initiallySuspended":  d.Get("initially_suspended").(bool),
		"scalingPolicy":       d.Get("scaling_policy").(string),
		"resourceMonitor":     d.Get("resource_monitor").(string),
		"comment":             d.Get("comment").(string),
		"ovhOptimization":     d.Get("ovh_optimization").(bool),
		"costTracking":        d.Get("cost_tracking").(bool),
		"performanceInsights": d.Get("performance_insights").(bool),
		"tags":                d.Get("tags"),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/warehouse", warehouseConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake warehouse: %w", err))
	}

	warehouseId := result["id"].(string)
	d.SetId(warehouseId)

	return resourceSnowflakeWarehouseRead(ctx, d, meta)
}

func resourceSnowflakeWarehouseRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	warehouseId := d.Id()

	var warehouse map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/warehouse/%s", warehouseId), &warehouse)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake warehouse: %w", err))
	}

	d.Set("name", warehouse["name"])
	d.Set("size", warehouse["size"])
	d.Set("max_cluster_count", warehouse["maxClusterCount"])
	d.Set("min_cluster_count", warehouse["minClusterCount"])
	d.Set("auto_suspend", warehouse["autoSuspend"])
	d.Set("auto_resume", warehouse["autoResume"])
	d.Set("initially_suspended", warehouse["initiallySuspended"])
	d.Set("scaling_policy", warehouse["scalingPolicy"])
	d.Set("resource_monitor", warehouse["resourceMonitor"])
	d.Set("comment", warehouse["comment"])
	d.Set("ovh_optimization", warehouse["ovhOptimization"])
	d.Set("cost_tracking", warehouse["costTracking"])
	d.Set("performance_insights", warehouse["performanceInsights"])
	d.Set("state", warehouse["state"])
	d.Set("type", warehouse["type"])
	d.Set("created_on", warehouse["createdOn"])

	if tags, ok := warehouse["tags"].(map[string]interface{}); ok {
		d.Set("tags", tags)
	}

	return nil
}

func resourceSnowflakeWarehouseUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	warehouseId := d.Id()

	if d.HasChanges("size", "max_cluster_count", "min_cluster_count", "auto_suspend", "auto_resume", "scaling_policy", "resource_monitor", "comment", "tags") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("size") {
			updateConfig["size"] = d.Get("size").(string)
		}
		if d.HasChange("max_cluster_count") {
			updateConfig["maxClusterCount"] = d.Get("max_cluster_count").(int)
		}
		if d.HasChange("min_cluster_count") {
			updateConfig["minClusterCount"] = d.Get("min_cluster_count").(int)
		}
		if d.HasChange("auto_suspend") {
			updateConfig["autoSuspend"] = d.Get("auto_suspend").(int)
		}
		if d.HasChange("auto_resume") {
			updateConfig["autoResume"] = d.Get("auto_resume").(bool)
		}
		if d.HasChange("scaling_policy") {
			updateConfig["scalingPolicy"] = d.Get("scaling_policy").(string)
		}
		if d.HasChange("resource_monitor") {
			updateConfig["resourceMonitor"] = d.Get("resource_monitor").(string)
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}
		if d.HasChange("tags") {
			updateConfig["tags"] = d.Get("tags")
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/warehouse/%s", warehouseId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake warehouse: %w", err))
		}
	}

	return resourceSnowflakeWarehouseRead(ctx, d, meta)
}

func resourceSnowflakeWarehouseDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	warehouseId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/warehouse/%s", warehouseId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake warehouse: %w", err))
	}

	d.SetId("")
	return nil
}
