package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeRole() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake role",

		CreateContext: resourceSnowflakeRoleCreate,
		ReadContext:   resourceSnowflakeRoleRead,
		UpdateContext: resourceSnowflakeRoleUpdate,
		DeleteContext: resourceSnowflakeRoleDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Role name",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the role",
			},
			"tags": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Tags to apply to role",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"owner": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Role owner",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
		},
	}
}

func resourceSnowflakeRoleCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	roleConfig := map[string]interface{}{
		"name":    d.Get("name").(string),
		"comment": d.Get("comment").(string),
		"tags":    d.Get("tags"),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/role", roleConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake role: %w", err))
	}

	roleId := result["id"].(string)
	d.SetId(roleId)

	return resourceSnowflakeRoleRead(ctx, d, meta)
}

func resourceSnowflakeRoleRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	roleId := d.Id()

	var role map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/role/%s", roleId), &role)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake role: %w", err))
	}

	d.Set("name", role["name"])
	d.Set("comment", role["comment"])
	d.Set("owner", role["owner"])
	d.Set("created_on", role["createdOn"])

	if tags, ok := role["tags"].(map[string]interface{}); ok {
		d.Set("tags", tags)
	}

	return nil
}

func resourceSnowflakeRoleUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	roleId := d.Id()

	if d.HasChanges("comment", "tags") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}
		if d.HasChange("tags") {
			updateConfig["tags"] = d.Get("tags")
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/role/%s", roleId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake role: %w", err))
		}
	}

	return resourceSnowflakeRoleRead(ctx, d, meta)
}

func resourceSnowflakeRoleDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	roleId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/role/%s", roleId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake role: %w", err))
	}

	d.SetId("")
	return nil
}
