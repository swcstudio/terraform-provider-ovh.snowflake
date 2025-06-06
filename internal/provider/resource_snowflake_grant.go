package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceSnowflakeGrant() *schema.Resource {
	return &schema.Resource{
		Description: "Manages Snowflake grants",

		CreateContext: resourceSnowflakeGrantCreate,
		ReadContext:   resourceSnowflakeGrantRead,
		UpdateContext: resourceSnowflakeGrantUpdate,
		DeleteContext: resourceSnowflakeGrantDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"privilege": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Privilege to grant",
				ValidateFunc: validation.StringInSlice([]string{
					"SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES",
					"USAGE", "CREATE", "MONITOR", "OPERATE", "READ", "WRITE",
					"ALL", "ALL PRIVILEGES",
				}, false),
			},
			"on": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Object type to grant on",
				ValidateFunc: validation.StringInSlice([]string{
					"ACCOUNT", "DATABASE", "SCHEMA", "TABLE", "VIEW", "WAREHOUSE",
					"ROLE", "USER", "RESOURCE MONITOR", "INTEGRATION",
				}, false),
			},
			"object_name": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "Name of the object to grant on",
			},
			"to_role": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "Role to grant to",
			},
			"to_user": {
				Type:        schema.TypeString,
				Optional:    true,
				ForceNew:    true,
				Description: "User to grant to",
			},
			"with_grant_option": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				ForceNew:    true,
				Description: "Grant with grant option",
			},
			"granted_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Object granted on",
			},
			"granted_to": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Granted to",
			},
			"granted_by": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Granted by",
			},
		},
	}
}

func resourceSnowflakeGrantCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	grantConfig := map[string]interface{}{
		"privilege":       d.Get("privilege").(string),
		"on":              d.Get("on").(string),
		"objectName":      d.Get("object_name").(string),
		"toRole":          d.Get("to_role").(string),
		"toUser":          d.Get("to_user").(string),
		"withGrantOption": d.Get("with_grant_option").(bool),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/grant", grantConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake grant: %w", err))
	}

	grantId := result["id"].(string)
	d.SetId(grantId)

	return resourceSnowflakeGrantRead(ctx, d, meta)
}

func resourceSnowflakeGrantRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	grantId := d.Id()

	var grant map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/grant/%s", grantId), &grant)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake grant: %w", err))
	}

	d.Set("privilege", grant["privilege"])
	d.Set("on", grant["on"])
	d.Set("object_name", grant["objectName"])
	d.Set("to_role", grant["toRole"])
	d.Set("to_user", grant["toUser"])
	d.Set("with_grant_option", grant["withGrantOption"])
	d.Set("granted_on", grant["grantedOn"])
	d.Set("granted_to", grant["grantedTo"])
	d.Set("granted_by", grant["grantedBy"])

	return nil
}

func resourceSnowflakeGrantUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	return resourceSnowflakeGrantRead(ctx, d, meta)
}

func resourceSnowflakeGrantDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	grantId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/grant/%s", grantId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake grant: %w", err))
	}

	d.SetId("")
	return nil
}
