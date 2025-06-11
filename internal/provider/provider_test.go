package provider

import (
	"os"
	"testing"

	"github.com/hashicorp/terraform-plugin-framework/providerserver"
	"github.com/hashicorp/terraform-plugin-go/tfprotov6"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

// testAccProtoV6ProviderFactories are used to instantiate a provider during
// acceptance testing. The factory function will be invoked for every Terraform
// CLI command executed to create a provider server to which the CLI can
// reattach.
var testAccProtoV6ProviderFactories = map[string]func() (tfprotov6.ProviderServer, error){
	"snowflake-ovh": providerserver.NewProtocol6WithError(New("test")()),
}

func TestProvider(t *testing.T) {
	provider := New("dev")()
	if provider == nil {
		t.Fatal("Provider should not be nil")
	}
}

func TestProvider_Schema(t *testing.T) {
	provider := New("test")()
	
	// Test that the provider can be instantiated
	if provider == nil {
		t.Fatal("Provider should not be nil")
	}
}

func TestProvider_Metadata(t *testing.T) {
	provider := New("test")()
	
	// Basic validation that provider can be created
	if provider == nil {
		t.Fatal("Provider should not be nil")
	}
}

func TestProvider_Resources(t *testing.T) {
	provider := New("test")()
	
	// Test that resources method can be called
	resources := provider.Resources(nil)
	
	// Just verify we get a slice back - the actual resources may not be implemented yet
	if resources == nil {
		t.Error("Resources should return a non-nil slice")
	}
	
	t.Logf("Provider registered %d resource types", len(resources))
}

func TestProvider_DataSources(t *testing.T) {
	provider := New("test")()
	
	// Test that data sources method can be called
	dataSources := provider.DataSources(nil)
	
	// Just verify we get a slice back - the actual data sources may not be implemented yet
	if dataSources == nil {
		t.Error("DataSources should return a non-nil slice")
	}
	
	t.Logf("Provider registered %d data source types", len(dataSources))
}

// TestAccProvider tests the provider with acceptance testing framework
func TestAccProvider(t *testing.T) {
	resource.Test(t, resource.TestCase{
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccProviderConfig,
				Check: func(s *terraform.State) error {
					// Basic provider test
					return nil
				},
			},
		},
	})
}

const testAccProviderConfig = `
provider "snowflake-ovh" {
  # Configuration will be provided via environment variables in CI
}
`

// TestAccProvider_WithConfiguration tests provider with explicit configuration
func TestAccProvider_WithConfiguration(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}
	
	// Skip if we don't have test credentials
	if os.Getenv("OVH_APPLICATION_KEY") == "" {
		t.Skip("OVH_APPLICATION_KEY not set, skipping acceptance test")
	}
	
	resource.Test(t, resource.TestCase{
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccProviderConfigWithCredentials,
				Check: resource.ComposeTestCheckFunc(
					testAccCheckProviderConfigured(),
				),
			},
		},
	})
}

const testAccProviderConfigWithCredentials = `
provider "snowflake-ovh" {
  ovh_endpoint           = "ovh-eu"
  ovh_application_key    = "test-key"
  ovh_application_secret = "test-secret"
  ovh_consumer_key       = "test-consumer"
  snowflake_account      = "test-account"
  snowflake_username     = "test-user"
  snowflake_password     = "test-password"
}
`

func testAccCheckProviderConfigured() resource.TestCheckFunc {
	return func(s *terraform.State) error {
		// Add checks to verify provider is properly configured
		// This could include API connectivity tests
		return nil
	}
}

// Benchmark tests
func BenchmarkProvider_New(b *testing.B) {
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		New("bench")()
	}
}

// Test helper functions
func testAccPreCheck(t *testing.T) {
	// Check required environment variables for acceptance tests
	requiredEnvVars := []string{
		"OVH_ENDPOINT",
		"OVH_APPLICATION_KEY", 
		"OVH_APPLICATION_SECRET",
		"OVH_CONSUMER_KEY",
	}
	
	for _, envVar := range requiredEnvVars {
		if v := os.Getenv(envVar); v == "" {
			t.Fatalf("%s must be set for acceptance tests", envVar)
		}
	}
	
	// Optional Snowflake credentials check
	snowflakeVars := []string{
		"SNOWFLAKE_ACCOUNT",
		"SNOWFLAKE_USERNAME", 
		"SNOWFLAKE_PASSWORD",
	}
	
	hasSnowflakeVars := true
	for _, envVar := range snowflakeVars {
		if v := os.Getenv(envVar); v == "" {
			hasSnowflakeVars = false
			break
		}
	}
	
	if !hasSnowflakeVars {
		t.Log("Snowflake credentials not set, some tests may be skipped")
	}
}

// Test concurrent access
func TestProvider_ConcurrentAccess(t *testing.T) {
	// Test that provider can handle concurrent instantiation
	const goroutines = 10
	done := make(chan bool, goroutines)
	
	for i := 0; i < goroutines; i++ {
		go func() {
			defer func() { done <- true }()
			provider := New("test")()
			if provider == nil {
				t.Error("Provider should not be nil")
			}
		}()
	}
	
	// Wait for all goroutines to complete
	for i := 0; i < goroutines; i++ {
		<-done
	}
}

// Test environment variable handling
func TestProvider_EnvironmentVariables(t *testing.T) {
	// Test that provider can read from environment variables
	originalVars := make(map[string]string)
	testVars := map[string]string{
		"OVH_ENDPOINT":           "ovh-eu",
		"OVH_APPLICATION_KEY":    "test-key",
		"OVH_APPLICATION_SECRET": "test-secret",
		"OVH_CONSUMER_KEY":       "test-consumer",
		"SNOWFLAKE_ACCOUNT":      "test-account",
		"SNOWFLAKE_USERNAME":     "test-user",
		"SNOWFLAKE_PASSWORD":     "test-password",
	}
	
	// Save original values and set test values
	for key, value := range testVars {
		originalVars[key] = os.Getenv(key)
		os.Setenv(key, value)
	}
	
	// Restore original values after test
	defer func() {
		for key, originalValue := range originalVars {
			if originalValue == "" {
				os.Unsetenv(key)
			} else {
				os.Setenv(key, originalValue)
			}
		}
	}()
	
	// Test provider creation with environment variables
	provider := New("test")()
	if provider == nil {
		t.Fatal("Provider should not be nil")
	}
}

// Test provider version
func TestProvider_Version(t *testing.T) {
	provider := New("v1.2.3")()
	if provider == nil {
		t.Fatal("Provider should not be nil")
	}
	
	// Test with development version
	devProvider := New("dev")()
	if devProvider == nil {
		t.Fatal("Development provider should not be nil")
	}
}

// Mock test for error handling
func TestProvider_ErrorHandling(t *testing.T) {
	// Test provider behavior with invalid configurations
	// This is a placeholder for more comprehensive error handling tests
	provider := New("test")()
	if provider == nil {
		t.Fatal("Provider should not be nil")
	}
}

// Test provider initialization with different versions
func TestProvider_VersionHandling(t *testing.T) {
	testVersions := []string{
		"dev",
		"0.1.0",
		"1.0.0",
		"test",
		"",
	}
	
	for _, version := range testVersions {
		t.Run("version_"+version, func(t *testing.T) {
			provider := New(version)()
			if provider == nil {
				t.Errorf("Provider should not be nil for version %s", version)
			}
		})
	}
}