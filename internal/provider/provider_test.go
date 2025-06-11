package provider

import (
	"os"
	"testing"

	"github.com/hashicorp/terraform-plugin-framework/providerserver"
	"github.com/hashicorp/terraform-plugin-go/tfprotov6"
)

func TestAccProvider(t *testing.T) {
	os.Setenv("SNOWFLAKE_ACCOUNT", "")
	os.Setenv("SNOWFLAKE_USER", "")

	testAccProtoV6ProviderFactories = map[string]func() (tfprotov6.ProviderServer, error){
		"snowflake-ovh": providerserver.NewProtocol6WithError(New("test")()),
	}
}

var testAccProtoV6ProviderFactories map[string]func() (tfprotov6.ProviderServer, error)
