package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeNetworkPolicy() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake network policy",

		CreateContext: resourceSnowflakeNetworkPolicyCreate,
		ReadContext:   resourceSnowflakeNetworkPolicyRead,
		UpdateContext: resourceSnowflakeNetworkPolicyUpdate,
		DeleteContext: resourceSnowflakeNetworkPolicyDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Network policy name",
			},
			"allowed_ip_list": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Allowed IP addresses",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"blocked_ip_list": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Blocked IP addresses",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the network policy",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakeNetworkPolicyCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	policyConfig := map[string]interface{}{
		"name":           d.Get("name").(string),
		"allowedIpList":  d.Get("allowed_ip_list").([]interface{}),
		"blockedIpList":  d.Get("blocked_ip_list").([]interface{}),
		"comment":        d.Get("comment").(string),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/network-policy", policyConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake network policy: %w", err))
	}

	policyId := result["id"].(string)
	d.SetId(policyId)

	return resourceSnowflakeNetworkPolicyRead(ctx, d, meta)
}

func resourceSnowflakeNetworkPolicyRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	policyId := d.Id()

	var policy map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/network-policy/%s", policyId), &policy)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake network policy: %w", err))
	}

	d.Set("name", policy["name"])
	d.Set("allowed_ip_list", policy["allowedIpList"])
	d.Set("blocked_ip_list", policy["blockedIpList"])
	d.Set("comment", policy["comment"])
	d.Set("created_on", policy["createdOn"])

	return nil
}

func resourceSnowflakeNetworkPolicyUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	policyId := d.Id()

	if d.HasChanges("allowed_ip_list", "blocked_ip_list", "comment") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("allowed_ip_list") {
			updateConfig["allowedIpList"] = d.Get("allowed_ip_list").([]interface{})
		}
		if d.HasChange("blocked_ip_list") {
			updateConfig["blockedIpList"] = d.Get("blocked_ip_list").([]interface{})
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/network-policy/%s", policyId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake network policy: %w", err))
		}
	}

	return resourceSnowflakeNetworkPolicyRead(ctx, d, meta)
}

func resourceSnowflakeNetworkPolicyDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	policyId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/network-policy/%s", policyId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake network policy: %w", err))
	}

	d.SetId("")
	return nil
}
