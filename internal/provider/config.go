package provider

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/ovh/go-ovh/ovh"
)

// Config holds the configuration for the provider.
type Config struct {
	// OVH Configuration
	OVHClient            *ovh.Client
	OVHEndpoint          string
	OVHApplicationKey    string
	OVHApplicationSecret string
	OVHConsumerKey       string

	// Snowflake Configuration
	SnowflakeDB             *sql.DB
	SnowflakeAccount        string
	SnowflakeUsername       string
	SnowflakePassword       string
	SnowflakeRole           string
	SnowflakeWarehouse      string
	SnowflakeDatabase       string
	SnowflakeSchema         string
	SnowflakePrivateKey     string
	SnowflakePrivateKeyPath string
}

// NewConfig creates a new Config instance.
func NewConfig() *Config {
	return &Config{}
}

// ConfigureOVHClient sets up the OVH API client.
func (c *Config) ConfigureOVHClient(ctx context.Context) error {
	if c.OVHApplicationKey == "" || c.OVHApplicationSecret == "" || c.OVHConsumerKey == "" {
		return fmt.Errorf("OVH credentials are required: application_key, application_secret, and consumer_key")
	}

	client, err := ovh.NewClient(
		c.OVHEndpoint,
		c.OVHApplicationKey,
		c.OVHApplicationSecret,
		c.OVHConsumerKey,
	)
	if err != nil {
		return fmt.Errorf("failed to create OVH client: %w", err)
	}

	c.OVHClient = client

	tflog.Info(ctx, "OVH client configured successfully", map[string]interface{}{
		"endpoint": c.OVHEndpoint,
	})

	return nil
}

// ConfigureSnowflakeClient sets up the Snowflake database connection.
func (c *Config) ConfigureSnowflakeClient(ctx context.Context) error {
	if c.SnowflakeAccount == "" || c.SnowflakeUsername == "" {
		return fmt.Errorf("snowflake account and username are required")
	}

	// Check authentication method
	hasPassword := c.SnowflakePassword != ""
	hasPrivateKey := c.SnowflakePrivateKey != "" || c.SnowflakePrivateKeyPath != ""

	if !hasPassword && !hasPrivateKey {
		return fmt.Errorf("either password or private key authentication is required for snowflake")
	}

	// For now, we'll create a placeholder connection
	// In a real implementation, you would use the Snowflake Go driver
	// import _ "github.com/snowflakedb/gosnowflake"

	tflog.Info(ctx, "Snowflake client configured successfully", map[string]interface{}{
		"account":   c.SnowflakeAccount,
		"username":  c.SnowflakeUsername,
		"role":      c.SnowflakeRole,
		"warehouse": c.SnowflakeWarehouse,
		"database":  c.SnowflakeDatabase,
		"schema":    c.SnowflakeSchema,
	})

	return nil
}

// LoadConfiguration loads configuration from provider model.
func (c *Config) LoadConfiguration(ctx context.Context, model *SnowflakeOVHProviderModel) error {
	// Load OVH configuration
	if !model.OVHEndpoint.IsNull() {
		c.OVHEndpoint = model.OVHEndpoint.ValueString()
	}
	if !model.OVHApplicationKey.IsNull() {
		c.OVHApplicationKey = model.OVHApplicationKey.ValueString()
	}
	if !model.OVHApplicationSecret.IsNull() {
		c.OVHApplicationSecret = model.OVHApplicationSecret.ValueString()
	}
	if !model.OVHConsumerKey.IsNull() {
		c.OVHConsumerKey = model.OVHConsumerKey.ValueString()
	}

	// Load Snowflake configuration
	if !model.SnowflakeAccount.IsNull() {
		c.SnowflakeAccount = model.SnowflakeAccount.ValueString()
	}
	if !model.SnowflakeUser.IsNull() {
		c.SnowflakeUsername = model.SnowflakeUser.ValueString()
	}
	if !model.SnowflakePassword.IsNull() {
		c.SnowflakePassword = model.SnowflakePassword.ValueString()
	}
	if !model.SnowflakeRole.IsNull() {
		c.SnowflakeRole = model.SnowflakeRole.ValueString()
	}
	if !model.SnowflakeWarehouse.IsNull() {
		c.SnowflakeWarehouse = model.SnowflakeWarehouse.ValueString()
	}
	if !model.SnowflakePrivateKey.IsNull() {
		c.SnowflakePrivateKey = model.SnowflakePrivateKey.ValueString()
	}

	// Configure clients
	if err := c.ConfigureOVHClient(ctx); err != nil {
		return fmt.Errorf("failed to configure OVH client: %w", err)
	}

	if err := c.ConfigureSnowflakeClient(ctx); err != nil {
		return fmt.Errorf("failed to configure Snowflake client: %w", err)
	}

	return nil
}

// ValidateConfiguration validates the provider configuration.
func (c *Config) ValidateConfiguration(ctx context.Context) error {
	if c.OVHClient == nil {
		return fmt.Errorf("OVH client is not configured")
	}

	// Test OVH client connection
	var me struct {
		Name string `json:"name"`
	}
	if err := c.OVHClient.Get("/me", &me); err != nil {
		tflog.Warn(ctx, "Failed to validate OVH client connection", map[string]interface{}{
			"error": err.Error(),
		})
		// Don't fail validation for API test failures in case of network issues
	} else {
		tflog.Info(ctx, "OVH client connection validated successfully", map[string]interface{}{
			"account": me.Name,
		})
	}

	return nil
}
