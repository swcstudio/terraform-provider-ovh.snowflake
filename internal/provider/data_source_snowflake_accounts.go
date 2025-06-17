package provider

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func dataSourceSnowflakeAccounts() *schema.Resource {
	return &schema.Resource{
		Description: "Retrieves information about Snowflake accounts on OVH infrastructure",

		ReadContext: dataSourceSnowflakeAccountsRead,

		Schema: map[string]*schema.Schema{
			"region": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Filter accounts by OVH region",
			},
			"status": {
				Type:        schema.TypeString,
				Optional:    true,
				Description: "Filter accounts by status",
			},
			"accounts": {
				Type:        schema.TypeList,
				Computed:    true,
				Description: "List of Snowflake accounts",
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"id": {
							Type:        schema.TypeString,
							Computed:    true,
							Description: "Account ID",
						},
						"name": {
							Type:        schema.TypeString,
							Computed:    true,
							Description: "Account name",
						},
						"region": {
							Type:        schema.TypeString,
							Computed:    true,
							Description: "OVH region",
						},
						"edition": {
							Type:        schema.TypeString,
							Computed:    true,
							Description: "Snowflake edition",
						},
						"url": {
							Type:        schema.TypeString,
							Computed:    true,
							Description: "Account URL",
						},
						"status": {
							Type:        schema.TypeString,
							Computed:    true,
							Description: "Account status",
						},
						"created_on": {
							Type:        schema.TypeString,
							Computed:    true,
							Description: "Creation timestamp",
						},
						"tags": {
							Type:        schema.TypeMap,
							Computed:    true,
							Description: "Account tags",
							Elem: &schema.Schema{
								Type: schema.TypeString,
							},
						},
					},
				},
			},
		},
	}
}

func dataSourceSnowflakeAccountsRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	config := meta.(*Config)
	_ = diag.Diagnostics{}

	var accounts []map[string]interface{}
	err := config.OVHClient.Get("/cloud/project/snowflake/account", &accounts)
	if err != nil {
		return diag.FromErr(fmt.Errorf("failed to read Snowflake accounts: %w", err))
	}

	region := d.Get("region").(string)
	status := d.Get("status").(string)

	var filteredAccounts []map[string]interface{}
	for _, account := range accounts {
		if region != "" && account["region"].(string) != region {
			continue
		}
		if status != "" && account["status"].(string) != status {
			continue
		}
		filteredAccounts = append(filteredAccounts, account)
	}

	accountList := make([]interface{}, len(filteredAccounts))
	for i, account := range filteredAccounts {
		accountMap := map[string]interface{}{
			"id":         account["id"],
			"name":       account["name"],
			"region":     account["region"],
			"edition":    account["edition"],
			"url":        account["url"],
			"status":     account["status"],
			"created_on": account["createdOn"],
		}

		if tags, ok := account["tags"].(map[string]interface{}); ok {
			accountMap["tags"] = tags
		}

		accountList[i] = accountMap
	}

	d.Set("accounts", accountList)
	d.SetId(strconv.FormatInt(time.Now().Unix(), 10))

	return nil
}
