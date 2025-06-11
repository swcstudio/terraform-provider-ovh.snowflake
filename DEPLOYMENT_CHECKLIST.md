# Deployment Checklist for terraform-provider-snowflake-ovh

This checklist ensures a smooth deployment of the Snowflake-OVH Terraform provider to the public registry.

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] **Go 1.18+** is installed and configured
- [ ] **GoReleaser** is installed (`brew install goreleaser` or equivalent)
- [ ] **Git** is configured with your name and email
- [ ] **GPG key** is set up and configured for signing
- [ ] **GitHub Personal Access Token** is created with `repo` permissions
- [ ] **OVH API credentials** are available for testing
- [ ] **Snowflake credentials** are available for testing

### Repository State
- [ ] All changes are committed and pushed to `main` branch
- [ ] Working directory is clean (`git status` shows no changes)
- [ ] All tests are passing (`make test`)
- [ ] Code is properly formatted (`make fmt`)
- [ ] Linting passes (`make lint`)
- [ ] No outstanding security vulnerabilities
- [ ] Documentation is up to date

### Configuration Verification
- [ ] `go.mod` uses correct module path: `github.com/swcstudio/terraform-provider-snowflake-ovh`
- [ ] `main.go` has correct provider address: `registry.terraform.io/swcstudio/snowflake-ovh`
- [ ] All references to old organization (`spectrumwebco`) are updated to `swcstudio`
- [ ] `.goreleaser.yml` is configured with version 2
- [ ] `README.md` has correct installation instructions
- [ ] Examples use correct provider source

## 🔑 Environment Variables

Set these environment variables before deployment:

```bash
export GPG_TTY=$(tty)
export GPG_FINGERPRINT=4B2412305828FBD7
export GITHUB_TOKEN=your_github_token_here
```

- [ ] `GPG_TTY` is set
- [ ] `GPG_FINGERPRINT` points to your signing key
- [ ] `GITHUB_TOKEN` is valid and has appropriate permissions

## 🚀 Deployment Process

### Step 1: Final Testing
- [ ] Run full test suite: `make test`
- [ ] Build provider successfully: `make build`
- [ ] Install locally and test: `make install`
- [ ] Test with example configuration in `examples/local-dev/`
- [ ] Verify provider loads without errors

### Step 2: Version and Release
- [ ] Decide on version number (following semantic versioning)
- [ ] Update version references if needed
- [ ] Create and test release using script: `./scripts/release.sh v0.1.0`
- [ ] Verify GitHub release was created successfully
- [ ] Check that all platform binaries were uploaded
- [ ] Verify GPG signature is present and valid

### Step 3: Registry Registration
- [ ] Navigate to [registry.terraform.io](https://registry.terraform.io)
- [ ] Sign in with GitHub account
- [ ] Click "Publish" → "Provider"
- [ ] Select repository: `swcstudio/terraform-provider-snowflake-ovh`
- [ ] Add GPG public key for verification
- [ ] Wait for registry processing to complete
- [ ] Verify provider appears in search results

### Step 4: Post-Deployment Verification
- [ ] Provider is visible at: `https://registry.terraform.io/providers/swcstudio/snowflake-ovh`
- [ ] Documentation is generated correctly
- [ ] Download links work for all platforms
- [ ] GPG signatures verify correctly
- [ ] Test installation in fresh Terraform project:
  ```hcl
  terraform {
    required_providers {
      snowflake-ovh = {
        source  = "swcstudio/snowflake-ovh"
        version = "~> 0.1.0"
      }
    }
  }
  ```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Release Script Fails
- [ ] Check Git state is clean
- [ ] Verify GPG key is accessible
- [ ] Confirm GitHub token has correct permissions
- [ ] Check GoReleaser configuration syntax

#### GPG Signing Issues
- [ ] Run `gpg --list-secret-keys` to verify key exists
- [ ] Check `GPG_TTY` is set: `export GPG_TTY=$(tty)`
- [ ] Test manual signing: `echo "test" | gpg --clearsign`
- [ ] Restart GPG agent: `gpg-connect-agent reloadagent /bye`

#### Registry Registration Problems
- [ ] Verify repository name matches expected format
- [ ] Check that GitHub App permissions are granted
- [ ] Ensure latest release has proper GPG signatures
- [ ] Contact HashiCorp support if namespace conflicts exist

#### Build Failures
- [ ] Run `go mod tidy` to clean dependencies
- [ ] Check for import path issues
- [ ] Verify Go version compatibility
- [ ] Clear module cache: `go clean -modcache`

#### Snowflake Connection Issues
- [ ] Verify Snowflake credentials are correct
- [ ] Check network connectivity to Snowflake
- [ ] Ensure account name format is correct
- [ ] Verify user has necessary permissions

## 📞 Support Contacts

- **HashiCorp Registry Issues**: [support.hashicorp.com](https://support.hashicorp.com)
- **GitHub Issues**: Repository issue tracker
- **Snowflake Issues**: Snowflake support portal
- **Technical Questions**: Team communication channels

## 🎯 Success Criteria

The deployment is considered successful when:

- [ ] ✅ Provider is live on Terraform Registry
- [ ] ✅ All platform binaries are available
- [ ] ✅ Documentation is properly rendered
- [ ] ✅ GPG signatures verify correctly
- [ ] ✅ Test installation works from fresh project
- [ ] ✅ Provider shows up in registry search
- [ ] ✅ Version badges and metadata are correct
- [ ] ✅ Snowflake resources can be managed via provider

## 📝 Post-Deployment Tasks

After successful deployment:

- [ ] Update internal documentation
- [ ] Notify team of successful release
- [ ] Create announcement (if applicable)
- [ ] Monitor for any immediate issues
- [ ] Update project roadmap with next planned features
- [ ] Create GitHub release notes
- [ ] Update any dependent projects
- [ ] Test with real Snowflake resources (if safe to do so)

## 🔄 For Future Releases

- [ ] Keep this checklist updated
- [ ] Document any new issues discovered
- [ ] Improve automation scripts based on learnings
- [ ] Update version references in examples
- [ ] Consider automating more steps with GitHub Actions
- [ ] Monitor Snowflake API changes for compatibility

## 🔒 Security Considerations

- [ ] Ensure no credentials are hardcoded in examples
- [ ] Verify sensitive data is properly handled
- [ ] Check that secrets are not logged
- [ ] Confirm encryption is used for data in transit
- [ ] Validate input sanitization

## 📊 Provider-Specific Checks

### Snowflake Integration
- [ ] Snowflake SDK integration is working
- [ ] Connection pooling is configured correctly
- [ ] Error handling for Snowflake API is implemented
- [ ] Resource state management is correct
- [ ] Snowflake-specific validations are in place

### OVH Integration
- [ ] OVH API integration is functional
- [ ] Cost tracking features are working
- [ ] OVH-specific optimizations are enabled
- [ ] Billing integration is configured

---

**Last Updated**: December 2024  
**Next Review**: Before each major release  
**Provider Focus**: Snowflake Data Warehousing on OVH Infrastructure