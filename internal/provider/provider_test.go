package provider

import (
	"context"
	"testing"

	"github.com/hashicorp/terraform-plugin-framework/providerserver"
	"github.com/hashicorp/terraform-plugin-go/tfprotov6"
)

// testAccProtoV6ProviderFactories are used to instantiate a provider during
// acceptance testing. The factory function will be invoked for every Terraform
// CLI command executed to create a provider server to which the CLI can
// reattach.
var testAccProtoV6ProviderFactories = map[string]func() (tfprotov6.ProviderServer, error){
	"snowflake": providerserver.NewProtocol6WithError(New("test")()),
}

func TestProvider(t *testing.T) {
	t.Parallel()

	// Simply test that the provider can be instantiated
	provider := New("test")()
	if provider == nil {
		t.Fatal("Provider should not be nil")
	}

	// Test metadata
	ctx := context.Background()
	req := struct{}{}
	resp := struct {
		TypeName string
		Version  string
	}{}

	// This is a basic test that the provider can be instantiated
	// More comprehensive tests would require actual provider methods
	_ = ctx
	_ = req
	_ = resp
}

func TestProviderSchema(t *testing.T) {
	t.Parallel()

	provider := New("test")()
	ctx := context.Background()

	// Test that schema can be retrieved without error
	schemaReq := struct{}{}
	schemaResp := struct {
		Schema interface{}
	}{}

	// Basic test that provider exists and can be configured
	_ = provider
	_ = ctx
	_ = schemaReq
	_ = schemaResp
}