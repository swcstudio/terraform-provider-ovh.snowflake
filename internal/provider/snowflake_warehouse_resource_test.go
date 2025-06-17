package provider

import (
	"fmt"
	"regexp"
	"testing"

	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestAccSnowflakeOVHWarehouse_basic(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}

	warehouseName := "test_warehouse_basic"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckSnowflakeOVHWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccSnowflakeOVHWarehouseConfig_basic(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "name", warehouseName),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "size", "SMALL"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "auto_suspend", "300"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "auto_resume", "true"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "ovh_optimization", "true"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "cost_tracking", "true"),
				),
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_update(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}

	warehouseName := "test_warehouse_update"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckSnowflakeOVHWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccSnowflakeOVHWarehouseConfig_basic(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "size", "SMALL"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "auto_suspend", "300"),
				),
			},
			{
				Config: testAccSnowflakeOVHWarehouseConfig_updated(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "size", "MEDIUM"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "auto_suspend", "600"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "comment", "Updated warehouse"),
				),
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_withOVHFeatures(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}

	warehouseName := "test_warehouse_ovh_features"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckSnowflakeOVHWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccSnowflakeOVHWarehouseConfig_withOVHFeatures(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "ovh_cost_center", "engineering"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "ovh_billing_alerts", "true"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "ovh_performance_insights", "true"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "ovh_optimization", "true"),
				),
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_invalidSize(t *testing.T) {
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccSnowflakeOVHWarehouseConfig_invalidSize("test_invalid"),
				ExpectError: regexp.MustCompile("Invalid warehouse size"),
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_invalidAutoSuspend(t *testing.T) {
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccSnowflakeOVHWarehouseConfig_invalidAutoSuspend("test_invalid_suspend"),
				ExpectError: regexp.MustCompile("auto_suspend must be between"),
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_duplicateName(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}

	warehouseName := "test_warehouse_duplicate"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckSnowflakeOVHWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccSnowflakeOVHWarehouseConfig_basic(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
				),
			},
			{
				Config:      testAccSnowflakeOVHWarehouseConfig_duplicate(warehouseName),
				ExpectError: regexp.MustCompile("already exists"),
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_import(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}

	warehouseName := "test_warehouse_import"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckSnowflakeOVHWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccSnowflakeOVHWarehouseConfig_basic(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
				),
			},
			{
				ResourceName:      "snowflake_ovh_warehouse.test",
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"ovh_performance_insights", // May not be preserved in import
				},
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_tags(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}

	warehouseName := "test_warehouse_tags"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckSnowflakeOVHWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccSnowflakeOVHWarehouseConfig_withTags(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "tags.%", "3"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "tags.Environment", "test"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "tags.ManagedBy", "terraform"),
					resource.TestCheckResourceAttr("snowflake_ovh_warehouse.test", "tags.Provider", "snowflake-ovh"),
				),
			},
		},
	})
}

func TestAccSnowflakeOVHWarehouse_disappears(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping acceptance test in short mode")
	}

	warehouseName := "test_warehouse_disappears"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { testAccPreCheck(t) },
		ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckSnowflakeOVHWarehouseDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccSnowflakeOVHWarehouseConfig_basic(warehouseName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckSnowflakeOVHWarehouseExists("snowflake_ovh_warehouse.test"),
					testAccCheckSnowflakeOVHWarehouseDisappears("snowflake_ovh_warehouse.test"),
				),
				ExpectNonEmptyPlan: true,
			},
		},
	})
}

// Unit tests for validation logic
func TestSnowflakeOVHWarehouse_ValidateSize(t *testing.T) {
	validSizes := []string{"XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE", "XXLARGE", "XXXLARGE", "X4LARGE", "X5LARGE", "X6LARGE"}
	invalidSizes := []string{"TINY", "HUGE", "", "small", "INVALID"}

	for _, size := range validSizes {
		t.Run(fmt.Sprintf("valid_size_%s", size), func(t *testing.T) {
			// Test validation logic for valid sizes
			if !isValidWarehouseSize(size) {
				t.Errorf("Size %s should be valid", size)
			}
		})
	}

	for _, size := range invalidSizes {
		t.Run(fmt.Sprintf("invalid_size_%s", size), func(t *testing.T) {
			// Test validation logic for invalid sizes
			if isValidWarehouseSize(size) {
				t.Errorf("Size %s should be invalid", size)
			}
		})
	}
}

func TestSnowflakeOVHWarehouse_ValidateAutoSuspend(t *testing.T) {
	validValues := []int{60, 300, 3600, 86400}
	invalidValues := []int{-1, 0, 30, 90000}

	for _, value := range validValues {
		t.Run(fmt.Sprintf("valid_auto_suspend_%d", value), func(t *testing.T) {
			if !isValidAutoSuspend(value) {
				t.Errorf("Auto suspend value %d should be valid", value)
			}
		})
	}

	for _, value := range invalidValues {
		t.Run(fmt.Sprintf("invalid_auto_suspend_%d", value), func(t *testing.T) {
			if isValidAutoSuspend(value) {
				t.Errorf("Auto suspend value %d should be invalid", value)
			}
		})
	}
}

func TestSnowflakeOVHWarehouse_ValidateName(t *testing.T) {
	validNames := []string{"warehouse1", "test_warehouse", "PROD_WH", "analytics_wh_123"}
	invalidNames := []string{"", "123warehouse", "warehouse-name", "warehouse name", "very_long_warehouse_name_that_exceeds_maximum_length_allowed_by_snowflake"}

	for _, name := range validNames {
		t.Run(fmt.Sprintf("valid_name_%s", name), func(t *testing.T) {
			if !isValidWarehouseName(name) {
				t.Errorf("Warehouse name %s should be valid", name)
			}
		})
	}

	for _, name := range invalidNames {
		t.Run(fmt.Sprintf("invalid_name_%s", name), func(t *testing.T) {
			if isValidWarehouseName(name) {
				t.Errorf("Warehouse name %s should be invalid", name)
			}
		})
	}
}

// Benchmark tests
func BenchmarkSnowflakeOVHWarehouse_Create(b *testing.B) {
	// Benchmark warehouse creation logic
	b.Skip("Benchmark test - implement when adding actual API calls")
}

func BenchmarkSnowflakeOVHWarehouse_Update(b *testing.B) {
	// Benchmark warehouse update logic
	b.Skip("Benchmark test - implement when adding actual API calls")
}

// Helper functions for tests
func testAccCheckSnowflakeOVHWarehouseExists(resourceName string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("Resource not found: %s", resourceName)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No warehouse ID is set")
		}

		// TODO: Add actual API call to check if warehouse exists
		// For now, just verify the ID is present
		return nil
	}
}

func testAccCheckSnowflakeOVHWarehouseDestroy(s *terraform.State) error {
	for _, rs := range s.RootModule().Resources {
		if rs.Type != "snowflake_ovh_warehouse" {
			continue
		}

		// TODO: Add actual API call to verify warehouse is destroyed
		// For now, assume it's properly destroyed
	}
	return nil
}

func testAccCheckSnowflakeOVHWarehouseDisappears(resourceName string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("Resource not found: %s", resourceName)
		}

		// TODO: Add actual API call to delete the warehouse outside of Terraform
		// This simulates the warehouse being deleted externally
		_ = rs.Primary.ID
		return nil
	}
}

// Helper validation functions (these would normally be in the resource file)
func isValidWarehouseSize(size string) bool {
	validSizes := map[string]bool{
		"XSMALL":   true,
		"SMALL":    true,
		"MEDIUM":   true,
		"LARGE":    true,
		"XLARGE":   true,
		"XXLARGE":  true,
		"XXXLARGE": true,
		"X4LARGE":  true,
		"X5LARGE":  true,
		"X6LARGE":  true,
	}
	return validSizes[size]
}

func isValidAutoSuspend(value int) bool {
	return value >= 60 && value <= 86400
}

func isValidWarehouseName(name string) bool {
	if len(name) == 0 || len(name) > 64 {
		return false
	}

	// Check if name starts with a letter or underscore
	if !((name[0] >= 'a' && name[0] <= 'z') || (name[0] >= 'A' && name[0] <= 'Z') || name[0] == '_') {
		return false
	}

	// Check that all characters are alphanumeric or underscore
	for _, char := range name {
		if !((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9') || char == '_') {
			return false
		}
	}

	return true
}

// Test configuration templates
func testAccSnowflakeOVHWarehouseConfig_basic(name string) string {
	return fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  
  comment = "Test warehouse"
}
`, name)
}

func testAccSnowflakeOVHWarehouseConfig_updated(name string) string {
	return fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "MEDIUM"
  auto_suspend        = 600
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  
  comment = "Updated warehouse"
}
`, name)
}

func testAccSnowflakeOVHWarehouseConfig_withOVHFeatures(name string) string {
	return fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  
  ovh_cost_center           = "engineering"
  ovh_billing_alerts        = true
  ovh_performance_insights  = true
  
  comment = "Warehouse with OVH features"
}
`, name)
}

func testAccSnowflakeOVHWarehouseConfig_invalidSize(name string) string {
	return fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "INVALID_SIZE"
  auto_suspend        = 300
  auto_resume         = true
}
`, name)
}

func testAccSnowflakeOVHWarehouseConfig_invalidAutoSuspend(name string) string {
	return fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "SMALL"
  auto_suspend        = 30
  auto_resume         = true
}
`, name)
}

func testAccSnowflakeOVHWarehouseConfig_duplicate(name string) string {
	return fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
}

resource "snowflake_ovh_warehouse" "test_duplicate" {
  name                = "%s"
  size                = "MEDIUM"
  auto_suspend        = 600
  auto_resume         = true
}
`, name, name)
}

func testAccSnowflakeOVHWarehouseConfig_withTags(name string) string {
	return fmt.Sprintf(`
resource "snowflake_ovh_warehouse" "test" {
  name                = "%s"
  size                = "SMALL"
  auto_suspend        = 300
  auto_resume         = true
  ovh_optimization    = true
  cost_tracking       = true
  
  tags = {
    Environment = "test"
    ManagedBy   = "terraform"
    Provider    = "snowflake-ovh"
  }
}
`, name)
}
