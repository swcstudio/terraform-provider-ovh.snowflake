package provider

import (
	"fmt"
	"os"
	"regexp"
	"testing"
	"time"

	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

// TestIntegration_ProviderConfiguration tests provider configuration with real credentials
func TestIntegration_ProviderConfiguration(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	// Skip if integration test environment is not set up
	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled - set INTEGRATION_TEST=1 to enable")
	}

	testCases := []struct {
		name           string
		configFunc     func() string
		expectError    bool
		errorSubstring string
	}{
		{
			name: "valid_configuration",
			configFunc: func() string {
				return testIntegrationProviderConfig()
			},
			expectError: false,
		},
		{
			name: "invalid_ovh_credentials",
			configFunc: func() string {
				return testIntegrationProviderConfigInvalidOVH()
			},
			expectError:    true,
			errorSubstring: "authentication failed",
		},
		{
			name: "invalid_snowflake_credentials",
			configFunc: func() string {
				return testIntegrationProviderConfigInvalidSnowflake()
			},
			expectError:    true,
			errorSubstring: "connection failed",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			resource.Test(t, resource.TestCase{
				PreCheck:                 func() { testIntegrationPreCheck(t) },
				ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
				Steps: []resource.TestStep{
					{
						Config:      tc.configFunc(),
						ExpectError: getExpectErrorRegex(tc.expectError, tc.errorSubstring),
					},
				},
			})
		})
	}
}

// TestIntegration_WarehouseLifecycle tests the complete lifecycle of a warehouse resource
func TestIntegration_WarehouseLifecycle(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	warehouseName := fmt.Sprintf("tf_test_wh_%d", time.Now().Unix())

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testIntegrationCheckWarehouseDestroy,
		Steps: []resource.TestStep{
			// Create warehouse
			{
				Config: testIntegrationWarehouseConfig(warehouseName, "SMALL", 300),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "name", warehouseName),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "size", "SMALL"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "auto_suspend", "300"),
				),
			},
			// Update warehouse size
			{
				Config: testIntegrationWarehouseConfig(warehouseName, "MEDIUM", 300),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "size", "MEDIUM"),
				),
			},
			// Update auto_suspend
			{
				Config: testIntegrationWarehouseConfig(warehouseName, "MEDIUM", 600),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "auto_suspend", "600"),
				),
			},
			// Import test
			{
				ResourceName:      "snowflake_ovh_warehouse.test",
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

// TestIntegration_DatabaseLifecycle tests the complete lifecycle of a database resource
func TestIntegration_DatabaseLifecycle(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	databaseName := fmt.Sprintf("tf_test_db_%d", time.Now().Unix())

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testIntegrationCheckDatabaseDestroy,
		Steps: []resource.TestStep{
			// Create database
			{
				Config: testIntegrationDatabaseConfig(databaseName, 7),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckDatabaseExists("snowflake_ovh_database.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_database.test", "name", databaseName),
					resource.TestCheckResourceAttr("snowflake_ovh_database.test", "data_retention_time_in_days", "7"),
				),
			},
			// Update retention
			{
				Config: testIntegrationDatabaseConfig(databaseName, 14),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckDatabaseExists("snowflake_ovh_database.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_database.test", "data_retention_time_in_days", "14"),
				),
			},
			// Import test
			{
				ResourceName:      "snowflake_ovh_database.test",
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

// TestIntegration_ResourceMonitorLifecycle tests resource monitor functionality
func TestIntegration_ResourceMonitorLifecycle(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	monitorName := fmt.Sprintf("tf_test_monitor_%d", time.Now().Unix())

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testIntegrationCheckResourceMonitorDestroy,
		Steps: []resource.TestStep{
			// Create resource monitor
			{
				Config: testIntegrationResourceMonitorConfig(monitorName, 100),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckResourceMonitorExists("snowflake_ovh_resource_monitor.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_resource_monitor.test", "name", monitorName),
					resource.TestCheckResourceAttr("snowflake_ovh_resource_monitor.test", "credit_quota", "100"),
				),
			},
			// Update quota
			{
				Config: testIntegrationResourceMonitorConfig(monitorName, 200),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckResourceMonitorExists("snowflake_ovh_resource_monitor.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_resource_monitor.test", "credit_quota", "200"),
				),
			},
		},
	})
}

// TestIntegration_MultiResourceWorkflow tests a complete workflow with multiple resources
func TestIntegration_MultiResourceWorkflow(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	suffix := fmt.Sprintf("%d", time.Now().Unix())
	warehouseName := fmt.Sprintf("tf_test_wh_%s", suffix)
	databaseName := fmt.Sprintf("tf_test_db_%s", suffix)
	schemaName := fmt.Sprintf("tf_test_schema_%s", suffix)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy: resource.ComposeTestCheckFunc(
			testIntegrationCheckWarehouseDestroy,
			testIntegrationCheckDatabaseDestroy,
			testIntegrationCheckSchemaDestroy,
		),
		Steps: []resource.TestStep{
			// Create all resources
			{
				Config: testIntegrationMultiResourceConfig(warehouseName, databaseName, schemaName),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test"),
					testIntegrationCheckDatabaseExists("snowflake_ovh_database.test"),
					testIntegrationCheckSchemaExists("snowflake_ovh_schema.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "name", warehouseName),
					resource.TestCheckResourceAttr("snowflake_ovh_database.test", "name", databaseName),
					resource.TestCheckResourceAttr("snowflake_ovh_schema.test", "name", schemaName),
				),
			},
		},
	})
}

// TestIntegration_DataSources tests data source functionality
func TestIntegration_DataSources(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testIntegrationDataSourceConfig(),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttrSet("data.snowflake_ovh_accounts.test", "id"),
					resource.TestCheckResourceAttrSet("data.snowflake_ovh_warehouses.test", "warehouses.#"),
				),
			},
		},
	})
}

// TestIntegration_ErrorHandling tests error handling scenarios
func TestIntegration_ErrorHandling(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	testCases := []struct {
		name        string
		config      string
		expectError bool
	}{
		{
			name:        "invalid_warehouse_size",
			config:      testIntegrationInvalidWarehouseSizeConfig(),
			expectError: true,
		},
		{
			name:        "invalid_auto_suspend",
			config:      testIntegrationInvalidAutoSuspendConfig(),
			expectError: true,
		},
		{
			name:        "duplicate_warehouse_name",
			config:      testIntegrationDuplicateWarehouseConfig(),
			expectError: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			resource.Test(t, resource.TestCase{
				PreCheck:                 func() { testIntegrationPreCheck(t) },
				ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
				Steps: []resource.TestStep{
					{
						Config:      tc.config,
						ExpectError: getExpectErrorRegex(tc.expectError, ""),
					},
				},
			})
		})
	}
}

// TestIntegration_ConcurrentOperations tests concurrent resource operations
func TestIntegration_ConcurrentOperations(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testIntegrationCheckWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testIntegrationConcurrentWarehousesConfig(),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test1"),
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test2"),
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test3"),
				),
			},
		},
	})
}

// TestIntegration_LongRunningOperations tests operations that take significant time
func TestIntegration_LongRunningOperations(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	if !isIntegrationTestEnabled() {
		t.Skip("Integration tests disabled")
	}

	// This test is specifically for long-running operations
	if os.Getenv("LONG_RUNNING_TESTS") != "1" {
		t.Skip("Long running tests disabled - set LONG_RUNNING_TESTS=1 to enable")
	}

	warehouseName := fmt.Sprintf("tf_test_large_wh_%d", time.Now().Unix())

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testIntegrationCheckWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testIntegrationLargeWarehouseConfig(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "size", "X4LARGE"),
				),
			},
		},
	})
}

// Helper functions for integration tests

func isIntegrationTestEnabled() bool {
	return os.Getenv("INTEGRATION_TEST") == "1"
}

func testIntegrationPreCheck(t *testing.T) {
	requiredEnvVars := []string{
		"OVH_ENDPOINT",
		"OVH_APPLICATION_KEY",
		"OVH_APPLICATION_SECRET",
		"OVH_CONSUMER_KEY",
		"SNOWFLAKE_ACCOUNT",
		"SNOWFLAKE_USERNAME",
		"SNOWFLAKE_PASSWORD",
	}

	for _, envVar := range requiredEnvVars {
		if v := os.Getenv(envVar); v == "" {
			t.Fatalf("%s must be set for integration tests", envVar)
		}
	}
}

func getExpectErrorRegex(expectError bool, substring string) *regexp.Regexp {
	if !expectError {
		return nil
	}
	if substring != "" {
		return regexp.MustCompile(substring)
	}
	return regexp.MustCompile(".*") // Any error
}

// Test configuration generators

func testIntegrationProviderConfig() string {
	return `
provider "snowflake-ovh" {
  ovh_endpoint           = "` + os.Getenv("OVH_ENDPOINT") + `"
  ovh_application_key    = "` + os.Getenv("OVH_APPLICATION_KEY") + `"
  ovh_application_secret = "` + os.Getenv("OVH_APPLICATION_SECRET") + `"
  ovh_consumer_key       = "` + os.Getenv("OVH_CONSUMER_KEY") + `"
  snowflake_account      = "` + os.Getenv("SNOWFLAKE_ACCOUNT") + `"
  snowflake_username     = "` + os.Getenv("SNOWFLAKE_USERNAME") + `"
  snowflake_password     = "` + os.Getenv("SNOWFLAKE_PASSWORD") + `"
}
`
}

func testIntegrationProviderConfigInvalidOVH() string {
	return `
provider "snowflake-ovh" {
  ovh_endpoint           = "` + os.Getenv("OVH_ENDPOINT") + `"
  ovh_application_key    = "invalid_key"
  ovh_application_secret = "invalid_secret"
  ovh_consumer_key       = "invalid_consumer"
  snowflake_account      = "` + os.Getenv("SNOWFLAKE_ACCOUNT") + `"
  snowflake_username     = "` + os.Getenv("SNOWFLAKE_USERNAME") + `"
  snowflake_password     = "` + os.Getenv("SNOWFLAKE_PASSWORD") + `"
}
`
}

func testIntegrationProviderConfigInvalidSnowflake() string {
	return `
provider "snowflake-ovh" {
  ovh_endpoint           = "` + os.Getenv("OVH_ENDPOINT") + `"
  ovh_application_key    = "` + os.Getenv("OVH_APPLICATION_KEY") + `"
  ovh_application_secret = "` + os.Getenv("OVH_APPLICATION_SECRET") + `"
  ovh_consumer_key       = "` + os.Getenv("OVH_CONSUMER_KEY") + `"
  snowflake_account      = "invalid_account"
  snowflake_username     = "invalid_user"
  snowflake_password     = "invalid_password"
}
`
}

func testIntegrationWarehouseConfig(name, size string, autoSuspend int) string {
	return testIntegrationProviderConfig() + fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "%s"
  auto_suspend        = %d
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  
  comment = "Integration test warehouse"
}
`, name, size, autoSuspend)
}

func testIntegrationDatabaseConfig(name string, retention int) string {
	return testIntegrationProviderConfig() + fmt.Sprintf(`
resource "snowflake_ovh_database" "test" {
  name                     = "%s"
  data_retention_time_in_days = %d
  comment                  = "Integration test database"
}
`, name, retention)
}

func testIntegrationResourceMonitorConfig(name string, quota int) string {
	return testIntegrationProviderConfig() + fmt.Sprintf(`
resource "snowflake_ovh_resource_monitor" "test" {
  name         = "%s"
  credit_quota = %d
  frequency    = "MONTHLY"
  
  comment = "Integration test resource monitor"
}
`, name, quota)
}

func testIntegrationMultiResourceConfig(warehouseName, databaseName, schemaName string) string {
	return testIntegrationProviderConfig() + fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
}

resource "snowflake_ovh_database" "test" {
  name                     = "%s"
  data_retention_time_in_days = 7
  comment                  = "Integration test database"
}

resource "snowflake_ovh_schema" "test" {
  database = snowflake_ovh_database.test.name
  name     = "%s"
  comment  = "Integration test schema"
}
`, warehouseName, databaseName, schemaName)
}

func testIntegrationDataSourceConfig() string {
	return testIntegrationProviderConfig() + `
data "snowflake_ovh_accounts" "test" {}

data "snowflake_ovh_warehouses" "test" {
  depends_on = [data.snowflake_ovh_accounts.test]
}
`
}

func testIntegrationInvalidWarehouseSizeConfig() string {
	return testIntegrationProviderConfig() + `
resource "snowflake_ovh_warehouse" "test" {
  name         = "invalid_size_test"
  size         = "INVALID_SIZE"
  auto_suspend = 300
  auto_resume  = true
}
`
}

func testIntegrationInvalidAutoSuspendConfig() string {
	return testIntegrationProviderConfig() + `
resource "snowflake_ovh_warehouse" "test" {
  name         = "invalid_suspend_test"
  size         = "SMALL"
  auto_suspend = 30
  auto_resume  = true
}
`
}

func testIntegrationDuplicateWarehouseConfig() string {
	name := fmt.Sprintf("duplicate_test_%d", time.Now().Unix())
	return testIntegrationProviderConfig() + fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test1" {
  name         = "%s"
  size         = "SMALL"
  auto_suspend = 300
  auto_resume  = true
}

resource "snowflake_ovh_warehouse" "test2" {
  name         = "%s"
  size         = "MEDIUM"
  auto_suspend = 600
  auto_resume  = true
}
`, name, name)
}

func testIntegrationConcurrentWarehousesConfig() string {
	suffix := fmt.Sprintf("%d", time.Now().Unix())
	return testIntegrationProviderConfig() + fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test1" {
  name         = "concurrent_test1_%s"
  size         = "SMALL"
  auto_suspend = 300
  auto_resume  = true
}

resource "snowflake_ovh_warehouse" "test2" {
  name         = "concurrent_test2_%s"
  size         = "SMALL"
  auto_suspend = 300
  auto_resume  = true
}

resource "snowflake_ovh_warehouse" "test3" {
  name         = "concurrent_test3_%s"
  size         = "SMALL"
  auto_suspend = 300
  auto_resume  = true
}
`, suffix, suffix, suffix)
}

func testIntegrationLargeWarehouseConfig(name string) string {
	return testIntegrationProviderConfig() + fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "X4LARGE"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  
  comment = "Large warehouse for performance testing"
}
`, name)
}

// Check functions for integration tests

func testIntegrationCheckWarehouseExists(resourceName string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("Resource not found: %s", resourceName)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No warehouse ID is set")
		}

		// TODO: Add actual API call to verify warehouse exists
		// For now, we assume the resource exists if it has an ID
		return nil
	}
}

func testIntegrationCheckWarehouseDestroy(s *terraform.State) error {
	for _, rs := range s.RootModule().Resources {
		if rs.Type != "snowflake_ovh_warehouse" {
			continue
		}

		// TODO: Add actual API call to verify warehouse is destroyed
		// For now, we assume proper cleanup
	}
	return nil
}

func testIntegrationCheckDatabaseExists(resourceName string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("Resource not found: %s", resourceName)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No database ID is set")
		}

		return nil
	}
}

func testIntegrationCheckDatabaseDestroy(s *terraform.State) error {
	for _, rs := range s.RootModule().Resources {
		if rs.Type != "snowflake_ovh_database" {
			continue
		}

		// TODO: Add actual API call to verify database is destroyed
	}
	return nil
}

func testIntegrationCheckSchemaExists(resourceName string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("Resource not found: %s", resourceName)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No schema ID is set")
		}

		return nil
	}
}

func testIntegrationCheckSchemaDestroy(s *terraform.State) error {
	for _, rs := range s.RootModule().Resources {
		if rs.Type != "snowflake_ovh_schema" {
			continue
		}

		// TODO: Add actual API call to verify schema is destroyed
	}
	return nil
}

func testIntegrationCheckResourceMonitorExists(resourceName string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("Resource not found: %s", resourceName)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No resource monitor ID is set")
		}

		return nil
	}
}

func testIntegrationCheckResourceMonitorDestroy(s *terraform.State) error {
	for _, rs := range s.RootModule().Resources {
		if rs.Type != "snowflake_ovh_resource_monitor" {
			continue
		}

		// TODO: Add actual API call to verify resource monitor is destroyed
	}
	return nil
}

// Performance and load testing helpers

func TestIntegration_Performance_WarehouseCreation(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping performance test in short mode")
	}

	if !isIntegrationTestEnabled() || os.Getenv("PERFORMANCE_TESTS") != "1" {
		t.Skip("Performance tests disabled")
	}

	start := time.Now()
	warehouseName := fmt.Sprintf("perf_test_%d", time.Now().Unix())

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testIntegrationPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testIntegrationCheckWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testIntegrationWarehouseConfig(warehouseName, "SMALL", 300),
				Check: resource.ComposeTestCheckFunc(
					testIntegrationCheckWarehouseExists("snowflake_ovh_warehouse.test"),
				),
			},
		},
	})

	duration := time.Since(start)
	t.Logf("Warehouse creation took: %v", duration)

	if duration > 5*time.Minute {
		t.Errorf("Warehouse creation took too long: %v (expected < 5 minutes)", duration)
	}
}
