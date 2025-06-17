package provider

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceSnowflakeAccount() *schema.Resource {
	return &schema.Resource{
		Description: "Manages a Snowflake account on OVH infrastructure with enterprise features",

		CreateContext: resourceSnowflakeAccountCreate,
		ReadContext:   resourceSnowflakeAccountRead,
		UpdateContext: resourceSnowflakeAccountUpdate,
		DeleteContext: resourceSnowflakeAccountDelete,

		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Name of the Snowflake account",
			},
			"region": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "OVH region for the account",
				ValidateFunc: validation.StringInSlice([]string{
					"GRA", "SBG", "RBX", "BHS", "WAW", "DE", "UK", "SGP", "SYD", "US-EAST", "US-WEST",
				}, false),
			},
			"edition": {
				Type:        schema.TypeString,
				Required:    true,
				Description: "Snowflake edition",
				ValidateFunc: validation.StringInSlice([]string{
					"STANDARD", "ENTERPRISE", "BUSINESS_CRITICAL", "VPS",
				}, false),
			},
			"admin_name": {
				Type:        schema.TypeString,
				Required:    true,
				Description: "Administrator username",
			},
			"admin_password": {
				Type:        schema.TypeString,
				Required:    true,
				Sensitive:   true,
				Description: "Administrator password",
			},
			"admin_email": {
				Type:        schema.TypeString,
				Required:    true,
				Description: "Administrator email",
			},
			"comment": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Comment for the account",
			},
			"auto_suspend": {
				Type:         schema.TypeInt,
				Optional:     true,
				Default:      60,
				Description:  "Auto suspend time in minutes",
				ValidateFunc: validation.IntBetween(1, 10080),
			},
			"auto_resume": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Enable auto resume",
			},
			"web3_analytics": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Enable Web3 analytics features",
			},
			"blockchain_connectors": {
				Type:        schema.TypeList,
				Optional:    true,
				Description: "Blockchain connectors to enable",
				Elem: &schema.Schema{
					Type: schema.TypeString,
					ValidateFunc: validation.StringInSlice([]string{
						"ethereum", "bitcoin", "polygon", "avalanche", "solana",
					}, false),
				},
			},
			"cost_optimization": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Enable OVH cost optimization",
			},
			"private_connectivity": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Enable private connectivity via OVH vRack",
			},
			"tags": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "Tags to apply to account resources",
				Elem: &schema.Schema{
					Type: schema.TypeString,
				},
			},
			"account_locator": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Snowflake account locator",
			},
			"account_url": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Snowflake account URL",
			},
			"organization_name": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Organization name",
			},
			"status": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Account status",
			},
			"created_on": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Account creation timestamp",
			},
		},
	}
}

func resourceSnowflakeAccountCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	accountConfig := map[string]interface{}{
		"name":                 d.Get("name").(string),
		"region":               d.Get("region").(string),
		"edition":              d.Get("edition").(string),
		"adminName":            d.Get("admin_name").(string),
		"adminPassword":        d.Get("admin_password").(string),
		"adminEmail":           d.Get("admin_email").(string),
		"comment":              d.Get("comment").(string),
		"autoSuspend":          d.Get("auto_suspend").(int),
		"autoResume":           d.Get("auto_resume").(bool),
		"web3Analytics":        d.Get("web3_analytics").(bool),
		"blockchainConnectors": d.Get("blockchain_connectors").([]interface{}),
		"costOptimization":     d.Get("cost_optimization").(bool),
		"privateConnectivity":  d.Get("private_connectivity").(bool),
		"tags":                 d.Get("tags"),
	}

	var result map[string]interface{}
	err := config.OVHClient.Post("/cloud/project/snowflake/account", accountConfig, &result)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to create Snowflake account: %w", err))
	}

	accountId := result["id"].(string)
	d.SetId(accountId)

	return resourceSnowflakeAccountRead(ctx, d, meta)
}

func resourceSnowflakeAccountRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	accountId := d.Id()

	var account map[string]interface{}
	err := config.OVHClient.Get(fmt.Sprintf("/cloud/project/snowflake/account/%s", accountId), &account)
	if err != nil {
		d.SetId("")
		return diag.FromErr(fmt.Errorf("failed to read Snowflake account: %w", err))
	}

	d.Set("name", account["name"])
	d.Set("region", account["region"])
	d.Set("edition", account["edition"])
	d.Set("admin_name", account["adminName"])
	d.Set("admin_email", account["adminEmail"])
	d.Set("comment", account["comment"])
	d.Set("auto_suspend", account["autoSuspend"])
	d.Set("auto_resume", account["autoResume"])
	d.Set("web3_analytics", account["web3Analytics"])
	d.Set("blockchain_connectors", account["blockchainConnectors"])
	d.Set("cost_optimization", account["costOptimization"])
	d.Set("private_connectivity", account["privateConnectivity"])
	d.Set("account_locator", account["accountLocator"])
	d.Set("account_url", account["accountUrl"])
	d.Set("organization_name", account["organizationName"])
	d.Set("status", account["status"])
	d.Set("created_on", account["createdOn"])

	if tags, ok := account["tags"].(map[string]interface{}); ok {
		d.Set("tags", tags)
	}

	return nil
}

func resourceSnowflakeAccountUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	accountId := d.Id()

	if d.HasChanges("comment", "auto_suspend", "auto_resume", "tags") {
		updateConfig := map[string]interface{}{}

		if d.HasChange("comment") {
			updateConfig["comment"] = d.Get("comment").(string)
		}
		if d.HasChange("auto_suspend") {
			updateConfig["autoSuspend"] = d.Get("auto_suspend").(int)
		}
		if d.HasChange("auto_resume") {
			updateConfig["autoResume"] = d.Get("auto_resume").(bool)
		}
		if d.HasChange("tags") {
			updateConfig["tags"] = d.Get("tags")
		}

		err := config.OVHClient.Put(fmt.Sprintf("/cloud/project/snowflake/account/%s", accountId), updateConfig, nil)
		if err != nil {
			return diag.FromErr(fmt.Errorf("failed to update Snowflake account: %w", err))
		}
	}

	return resourceSnowflakeAccountRead(ctx, d, meta)
}

func resourceSnowflakeAccountDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	accountId := d.Id()

	err := config.OVHClient.Delete(fmt.Sprintf("/cloud/project/snowflake/account/%s", accountId), nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to delete Snowflake account: %w", err))
	}

	d.SetId("")
	return nil
}
