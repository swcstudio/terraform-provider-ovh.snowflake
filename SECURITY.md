# Security Policy

## Supported Versions

We support the latest major version of the Terraform Provider for Snowflake OVH with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Email security@spectrumweb.co with details
3. Include steps to reproduce if possible
4. Allow time for investigation and fix

## Security Considerations

### Credentials Management

- Never commit credentials to version control
- Use environment variables or secure credential stores
- Rotate credentials regularly
- Use least-privilege access principles

### Provider Configuration

- Use HTTPS endpoints only
- Validate SSL certificates
- Use secure authentication methods
- Monitor access logs

### Infrastructure Security

- Keep Terraform and provider versions updated
- Use secure state storage
- Implement proper access controls
- Regular security audits

## Response Process

1. **Acknowledgment**: We'll acknowledge receipt within 24 hours
2. **Investigation**: We'll investigate and assess the impact
3. **Fix Development**: We'll develop and test a fix
4. **Release**: We'll release a security update
5. **Disclosure**: We'll coordinate responsible disclosure

## Security Updates

Security updates will be released as patch versions and announced via:

- GitHub Security Advisories
- Release notes
- Email notifications to maintainers

## Best Practices

### For Users

- Keep the provider updated to the latest version
- Use secure credential management
- Follow Terraform security best practices
- Monitor for security advisories

### For Contributors

- Follow secure coding practices
- Validate all inputs
- Use parameterized queries
- Implement proper error handling
- Review code for security issues

## Contact

For security-related questions or concerns:
- Email: security@spectrumweb.co
- PGP Key: Available on request

Thank you for helping keep our project secure!
