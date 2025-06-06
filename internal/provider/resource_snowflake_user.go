package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceSnowflakeUser() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake user",

		CreateContext: resourceSnowflakeUserCreate,
		ReadContext:   resourceSnowflakeUserRead,
		UpdateContext: resourceSnowflakeUserUpdate,
		DeleteContext: resourceSnowflakeUserDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Username",
			},
			"password": {
				Type:        schema.TypeString,
				Optional:    true,
				Sensitive:   true,
				Description: "User password",
			},
			"login_name": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Login name",
			},
			"display_name": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Display name",
			},
			"first_name": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "First name",
			},
			"last_name": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Last name",
			},
			"email": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Email address",
			},
			"must_change_password": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Force password change on next login",
			},
			"disabled": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Disable user account",
			},
			"default_warehouse": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Default warehouse",
			},
			"default_namespace": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Default namespace",
			},
			"default_role": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Default role",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the user",
			},
			"tags": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Tags to apply to user",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Creation timestamp",
			},
			"login_name_computed": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Computed login name",
			},
			"display_name_computed": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Computed display name",
			},
		},
	}
}

func resourceSnowflakeUserCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	userConfig := map[string]interface{}{
		"name":               d.Get("name").(string),
		"password":           d.Get("password").(string),
		"loginName":          d.Get("login_name").(string),
		"displayName":        d.Get("display_name").(string),
		"firstName":          d.Get("first_name").(string),
		"lastName":           d.Get("last_name").(string),
		"email":              d.Get("email").(string),
		"mustChangePassword": d.Get("must_change_password").(bool),
		"disabled":           d.Get("disabled").(bool),
		"defaultWarehouse":   d.Get("default_warehouse").(string),
		"defaultNamespace":   d.Get("default_namespace").(string),
		"defaultRole":        d.Get("default_role").(string),
		"comment":            d.Get("comment").(string),
		"tags":               d.Get("tags"),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/user", userConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake user: %w", err))
	}

	userId := result["id"].(string)
	d.SetId(userId)

	return resourceSnowflakeUserRead(ctx, d, meta)
}

func resourceSnowflakeUserRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	userId := d.Id()

	var user map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/user/%s", userId), &user)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake user: %w", err))
	}

	d.Set("name", user["name"])
	d.Set("login_name", user["loginName"])
	d.Set("display_name", user["displayName"])
	d.Set("first_name", user["firstName"])
	d.Set("last_name", user["lastName"])
	d.Set("email", user["email"])
	d.Set("must_change_password", user["mustChangePassword"])
	d.Set("disabled", user["disabled"])
	d.Set("default_warehouse", user["defaultWarehouse"])
	d.Set("default_namespace", user["defaultNamespace"])
	d.Set("default_role", user["defaultRole"])
	d.Set("comment", user["comment"])
	d.Set("created_on", user["createdOn"])
	d.Set("login_name_computed", user["loginNameComputed"])
	d.Set("display_name_computed", user["displayNameComputed"])

	if tags, ok := user["tags"].(map[string]interface{}); ok {
		d.Set("tags", tags)
	}

	return nil
}

func resourceSnowflakeUserUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	userId := d.Id()

	if d.HasChanges("password", "login_name", "display_name", "first_name", "last_name", "email", "must_change_password", "disabled", "default_warehouse", "default_namespace", "default_role", "comment", "tags") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("password") {
			updateConfig["password"] = d.Get("password").(string)
		}
		if d.HasChange("login_name") {
			updateConfig["loginName"] = d.Get("login_name").(string)
		}
		if d.HasChange("display_name") {
			updateConfig["displayName"] = d.Get("display_name").(string)
		}
		if d.HasChange("first_name") {
			updateConfig["firstName"] = d.Get("first_name").(string)
		}
		if d.HasChange("last_name") {
			updateConfig["lastName"] = d.Get("last_name").(string)
		}
		if d.HasChange("email") {
			updateConfig["email"] = d.Get("email").(string)
		}
		if d.HasChange("must_change_password") {
			updateConfig["mustChangePassword"] = d.Get("must_change_password").(bool)
		}
		if d.HasChange("disabled") {
			updateConfig["disabled"] = d.Get("disabled").(bool)
		}
		if d.HasChange("default_warehouse") {
			updateConfig["defaultWarehouse"] = d.Get("default_warehouse").(string)
		}
		if d.HasChange("default_namespace") {
			updateConfig["defaultNamespace"] = d.Get("default_namespace").(string)
		}
		if d.HasChange("default_role") {
			updateConfig["defaultRole"] = d.Get("default_role").(string)
		}
		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}
		if d.HasChange("tags") {
			updateConfig["tags"] = d.Get("tags")
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/user/%s", userId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake user: %w", err))
		}
	}

	return resourceSnowflakeUserRead(ctx, d, meta)
}

func resourceSnowflakeUserDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	userId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/user/%s", userId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake user: %w", err))
	}

	d.SetId("")
	return nil
}
