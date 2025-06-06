# Contributing to Terraform Provider Snowflake OVH

Thank you for your interest in contributing to the Terraform Provider for Snowflake on OVH! This document provides guidelines and information for contributors.

## Development Environment

### Prerequisites

- Go 1.19 or later
- Terraform 1.0 or later
- Make
- Git

### Setting Up

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/terraform-provider-snowflake-ovh.git
   cd terraform-provider-snowflake-ovh
   ```

3. Install dependencies:
   ```bash
   go mod download
   ```

4. Build the provider:
   ```bash
   make build
   ```

## Development Workflow

### Building

```bash
make build
```

### Testing

Run unit tests:
```bash
make test
```

Run acceptance tests (requires valid credentials):
```bash
make testacc
```

### Installing Locally

```bash
make install
```

This installs the provider to your local Terraform plugins directory.

### Code Formatting

```bash
make fmt
```

### Documentation Generation

```bash
make docs
```

## Contributing Guidelines

### Code Style

- Follow standard Go conventions
- Use `gofmt` for formatting
- Write clear, descriptive variable and function names
- Add comments for complex logic

### Testing

- Write unit tests for all new functionality
- Include acceptance tests for resources and data sources
- Ensure all tests pass before submitting

### Documentation

- Update documentation for any new resources or data sources
- Include examples in documentation
- Update the CHANGELOG.md for significant changes

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Update documentation
5. Run `make test` and `make testacc`
6. Submit a pull request

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Include examples of usage
- Ensure CI checks pass

## Resource Development

### Adding a New Resource

1. Create the resource file in `internal/provider/`
2. Implement the CRUD operations
3. Add the resource to the provider schema
4. Write tests
5. Add documentation

### Resource Structure

```go
func resourceExample() *schema.Resource {
    return &schema.Resource{
        Description: "Manages an example resource",
        
        CreateContext: resourceExampleCreate,
        ReadContext:   resourceExampleRead,
        UpdateContext: resourceExampleUpdate,
        DeleteContext: resourceExampleDelete,
        
        Importer: &schema.ResourceImporter{
            StateContext: schema.ImportStatePassthroughContext,
        },
        
        Schema: map[string]*schema.Schema{
            // Define schema here
        },
    }
}
```

## Testing

### Unit Tests

Place unit tests in the same package as the code being tested:

```go
func TestResourceExample(t *testing.T) {
    // Test implementation
}
```

### Acceptance Tests

Acceptance tests should be placed in `*_test.go` files:

```go
func TestAccResourceExample_basic(t *testing.T) {
    resource.Test(t, resource.TestCase{
        PreCheck:          func() { testAccPreCheck(t) },
        ProviderFactories: testAccProviderFactories,
        Steps: []resource.TestStep{
            {
                Config: testAccResourceExampleConfig(),
                Check: resource.ComposeTestCheckFunc(
                    resource.TestCheckResourceAttr("example_resource.test", "name", "test"),
                ),
            },
        },
    })
}
```

## Documentation

Documentation is generated using `tfplugindocs`. Place documentation templates in the `templates/` directory and examples in the `examples/` directory.

## Release Process

Releases are handled by maintainers using GitHub Actions and GoReleaser.

## Getting Help

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues and discussions first

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## License

By contributing to this project, you agree that your contributions will be licensed under the Apache 2.0 License.
