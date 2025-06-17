---
sidebar_position: 1
---

# Contributing to OVH Snowflake Terraform Provider

Thank you for your interest in contributing to the OVH Snowflake Terraform Provider! This document provides guidelines and information for contributors.

## 🤝 Ways to Contribute

There are many ways to contribute to this project:

### 📝 **Documentation**
- Improve existing documentation
- Add new examples and use cases
- Fix typos and unclear explanations
- Translate documentation

### 🐛 **Bug Reports**
- Report bugs and issues
- Provide detailed reproduction steps
- Share error logs and stack traces

### ✨ **Feature Requests**
- Suggest new features
- Propose API improvements
- Share use case scenarios

### 💻 **Code Contributions**
- Fix bugs and issues
- Implement new features
- Improve performance
- Add tests and examples

### 🧪 **Testing**
- Write and improve tests
- Test on different platforms
- Validate edge cases

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Go** >= 1.21
- **Terraform** >= 1.0
- **Git** for version control
- **Make** for build automation
- **Node.js** >= 18 (for documentation)

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/terraform-provider-ovh-snowflake.git
   cd terraform-provider-ovh-snowflake
   ```

2. **Install dependencies:**
   ```bash
   go mod download
   make install-docs-tools
   ```

3. **Set up development environment:**
   ```bash
   # Install provider locally for testing
   make install
   
   # Set up documentation environment
   cd website && npm install
   ```

4. **Verify setup:**
   ```bash
   make test
   make lint
   make docs
   ```

## 🏗️ Development Workflow

### Branch Strategy

- **Main branch**: `main` - stable, production-ready code
- **Feature branches**: `feature/description` - new features
- **Bug fix branches**: `bugfix/description` - bug fixes
- **Documentation branches**: `docs/description` - documentation updates

### Creating a Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Development Process

1. **Write code** following our coding standards
2. **Add tests** for new functionality
3. **Update documentation** as needed
4. **Run tests** and ensure they pass
5. **Commit changes** with clear messages
6. **Push branch** and create pull request

## 📋 Coding Standards

### Go Code Standards

- Follow [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `gofmt` for code formatting
- Use `golangci-lint` for linting
- Write clear, self-documenting code
- Add comments for exported functions and types

### Code Structure

```
internal/
├── provider/          # Provider configuration and setup
│   ├── provider.go    # Main provider definition
│   └── ...
├── resources/         # Resource implementations
│   ├── resource_database.go
│   ├── resource_schema.go
│   └── ...
├── datasources/       # Data source implementations
│   └── ...
├── client/           # API client implementations
│   ├── ovh_client.go
│   ├── snowflake_client.go
│   └── ...
└── utils/            # Utility functions
    └── ...
```

### Resource Implementation Guidelines

1. **Resource Schema**: Define clear, comprehensive schemas
2. **CRUD Operations**: Implement Create, Read, Update, Delete
3. **Error Handling**: Provide meaningful error messages
4. **State Management**: Ensure proper state tracking
5. **Validation**: Validate input parameters

Example resource structure:
```go
func resourceDatabase() *schema.Resource {
    return &schema.Resource{
        CreateContext: resourceDatabaseCreate,
        ReadContext:   resourceDatabaseRead,
        UpdateContext: resourceDatabaseUpdate,
        DeleteContext: resourceDatabaseDelete,
        
        Schema: map[string]*schema.Schema{
            "name": {
                Type:        schema.TypeString,
                Required:    true,
                Description: "Name of the database",
            },
            // ... other fields
        },
    }
}
```

## 🧪 Testing Requirements

### Types of Tests

1. **Unit Tests**: Test individual functions and methods
2. **Integration Tests**: Test provider integration with APIs
3. **Acceptance Tests**: Test complete Terraform workflows

### Writing Tests

- Place tests in `*_test.go` files
- Use table-driven tests where appropriate
- Mock external dependencies
- Test both success and failure scenarios

### Running Tests

```bash
# Run unit tests
make test

# Run acceptance tests (requires API credentials)
make testacc

# Run specific test
go test -run TestResourceDatabase ./internal/resources/
```

### Test Coverage

- Aim for >80% test coverage
- Ensure all new code has tests
- Test edge cases and error conditions

## 📚 Documentation Standards

### Documentation Types

1. **Code Documentation**: Inline comments and godoc
2. **User Documentation**: Guides and examples
3. **API Documentation**: Resource and data source reference
4. **Architecture Documentation**: Design and implementation details

### Writing Guidelines

- Use clear, concise language
- Include practical examples
- Follow established formatting
- Update diagrams when needed

### Generating Documentation

```bash
# Generate provider documentation
make docs

# Start documentation server
make docs-dev

# Build documentation for production
make docs-build
```

## 🔍 Pull Request Process

### Before Submitting

1. **Test thoroughly**: Ensure all tests pass
2. **Update documentation**: Include relevant updates
3. **Run linting**: Fix any linting issues
4. **Write clear commit messages**: Follow conventional commit format

### Pull Request Template

When creating a pull request, include:

- **Description**: Clear explanation of changes
- **Type**: Feature, bugfix, documentation, etc.
- **Testing**: How you tested the changes
- **Breaking Changes**: Any breaking changes
- **Checklist**: Completed tasks

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review the code
3. **Feedback**: Address any requested changes
4. **Approval**: Get approval from maintainers
5. **Merge**: Changes are merged to main branch

## 🌟 Code Review Guidelines

### For Contributors

- **Be responsive**: Address feedback promptly
- **Be open**: Accept constructive criticism
- **Be thorough**: Test changes thoroughly
- **Be collaborative**: Work with reviewers

### For Reviewers

- **Be constructive**: Provide helpful feedback
- **Be specific**: Point out exact issues
- **Be timely**: Review within reasonable time
- **Be encouraging**: Recognize good work

## 🏷️ Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(resources): add database resource support
fix(auth): resolve authentication timeout issue
docs(readme): update installation instructions
test(database): add comprehensive database tests
```

## 🐛 Reporting Issues

### Bug Reports

Include the following information:

1. **Environment**: OS, Terraform version, provider version
2. **Configuration**: Relevant Terraform configuration
3. **Steps to Reproduce**: Clear reproduction steps
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Logs**: Error messages and debug output

### Feature Requests

Include the following information:

1. **Use Case**: Why is this feature needed
2. **Proposed Solution**: How it should work
3. **Alternatives**: Other solutions considered
4. **Examples**: Usage examples

## 💬 Community Guidelines

### Code of Conduct

- **Be respectful**: Treat everyone with respect
- **Be inclusive**: Welcome diverse perspectives
- **Be collaborative**: Work together constructively
- **Be professional**: Maintain professional standards

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code contributions and reviews
- **Discord**: Real-time community chat

## 🆘 Getting Help

### Development Help

- **Documentation**: Check existing documentation first
- **GitHub Discussions**: Ask questions in discussions
- **Discord**: Join our Discord community
- **Issues**: Create an issue for bugs

### Resources

- **Terraform Provider Development**: [Official Guide](https://developer.hashicorp.com/terraform/tutorials/providers)
- **Go Documentation**: [golang.org](https://golang.org/doc/)
- **OVH API**: [api.ovh.com](https://api.ovh.com/)
- **Snowflake Documentation**: [docs.snowflake.com](https://docs.snowflake.com/)

## 🎯 Good First Issues

New contributors can start with issues labeled:

- `good first issue`: Easy issues for beginners
- `documentation`: Documentation improvements
- `help wanted`: Issues where help is needed
- `bug`: Simple bug fixes

## 🔄 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Schedule

- **Regular releases**: Monthly minor releases
- **Patch releases**: As needed for critical bugs
- **Major releases**: When breaking changes are needed

## 🏆 Recognition

We appreciate all contributions! Contributors are recognized through:

- **Contributors file**: Listed in CONTRIBUTORS.md
- **Release notes**: Mentioned in release announcements
- **Community highlights**: Featured in community updates

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (see [LICENSE](../LICENSE) file).

---

Thank you for contributing to the OVH Snowflake Terraform Provider! Your efforts help make this project better for everyone. 🙏

For questions about contributing, please reach out through our community channels or create an issue.