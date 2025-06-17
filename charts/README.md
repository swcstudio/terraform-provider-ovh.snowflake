# Charts Directory

This directory contains Helm charts and deployment configurations related to the OVH Snowflake Terraform Provider.

## Purpose

The charts in this directory serve several purposes:

- **Example Deployments**: Helm charts that demonstrate how to deploy infrastructure using this Terraform provider
- **CI/CD Integration**: Charts used in continuous integration pipelines for testing provider functionality
- **Reference Implementations**: Complete deployment examples that showcase best practices

## Structure

```
charts/
├── terraform-provider-ovh-snowflake/    # Main provider chart
├── examples/                            # Example deployment charts
└── testing/                            # Charts used for testing
```

## Usage

### Prerequisites

- Helm 3.x installed
- Access to a Kubernetes cluster
- OVH API credentials configured
- Snowflake credentials configured

### Installing Charts

```bash
# Add any required Helm repositories
helm repo add <repo-name> <repo-url>
helm repo update

# Install a chart
helm install <release-name> ./charts/<chart-name>
```

### Development

When developing new charts:

1. Follow Helm best practices
2. Include comprehensive values.yaml files
3. Add appropriate labels and annotations
4. Test charts thoroughly before committing

## Contributing

When contributing charts to this directory:

- Ensure charts are well-documented
- Include example values files
- Test charts in multiple environments
- Follow the repository's contributing guidelines

## Support

For issues related to the charts in this directory, please open an issue in the main repository with the `charts` label.