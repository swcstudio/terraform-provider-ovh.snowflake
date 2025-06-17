# OVH Snowflake Terraform Provider Documentation

This directory contains the source code for the [OVH Snowflake Terraform Provider](https://ovh.github.io/terraform-provider-ovh-snowflake/) documentation website, built with [Docusaurus 3](https://docusaurus.io/).

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** for version control

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```
   
   This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

3. **Access the site:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## 📁 Project Structure

```
website/
├── blog/                    # Blog posts
├── docs/                    # Documentation markdown files
│   ├── getting-started/     # Getting started guides
│   ├── resources/           # Resource documentation
│   ├── data-sources/        # Data source documentation
│   ├── examples/            # Usage examples
│   ├── security/            # Security guides
│   └── ...                  # Other documentation sections
├── src/                     # Custom React components and pages
│   ├── components/          # Reusable React components
│   ├── css/                 # Custom CSS styles
│   └── pages/               # Custom pages
├── static/                  # Static assets (images, files)
│   ├── img/                 # Images and icons
│   └── files/               # Downloadable files
├── docusaurus.config.ts     # Docusaurus configuration
├── sidebars.ts              # Sidebar navigation configuration
├── package.json             # Node.js dependencies and scripts
└── README.md                # This file
```

## 📝 Writing Documentation

### Markdown Guidelines

- Use **clear, concise language** that's accessible to both beginners and experts
- Follow the **established structure** for consistency
- Include **code examples** with proper syntax highlighting
- Add **frontmatter** to control page metadata

### Frontmatter Example

```markdown
---
sidebar_position: 1
title: Custom Page Title
description: Page description for SEO
keywords: [terraform, provider, ovh, snowflake]
---

# Page Content
```

### Code Block Syntax

Use language-specific syntax highlighting:

```hcl
resource "ovh-snowflake_database" "example" {
  name    = "EXAMPLE_DB"
  comment = "Example database"
}
```

### Admonitions

Use admonitions to highlight important information:

```markdown
:::tip Pro Tip
This is a helpful tip for users.
:::

:::warning Important
This is important information users should be aware of.
:::

:::danger Critical
This is critical information that could cause issues if ignored.
:::

:::info Note
This is additional information that might be useful.
:::
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run serve` | Serve production build locally |
| `npm run clear` | Clear cache and generated files |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript checks |

## 🎨 Customization

### Theming

The site uses a custom theme with OVH and Snowflake branding. Theme configuration is in:

- `src/css/custom.css` - Custom CSS variables and styles
- `docusaurus.config.ts` - Theme configuration

### Adding New Sections

1. **Create markdown files** in the appropriate `docs/` subdirectory
2. **Update sidebar configuration** in `sidebars.ts`
3. **Add navigation links** in `docusaurus.config.ts` if needed

### Custom Components

Create reusable React components in `src/components/`:

```typescript
// src/components/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

## 📖 Documentation Sections

### Core Documentation

- **Getting Started** - Installation, setup, and first steps
- **Configuration** - Provider configuration options
- **Resources** - Complete resource reference
- **Data Sources** - Available data sources
- **Examples** - Practical usage examples

### Advanced Topics

- **Security** - Security best practices and compliance
- **Monitoring** - Observability and monitoring setup
- **Best Practices** - Recommended patterns and approaches
- **Enterprise** - Enterprise-specific features and guidance

### Community

- **Contributing** - How to contribute to the provider
- **Development** - Development environment setup
- **Support** - Getting help and community resources

## 🚀 Deployment

### GitHub Pages (Automated)

The documentation is automatically deployed to GitHub Pages when changes are merged to the `main` branch. The deployment is handled by GitHub Actions in `.github/workflows/docs.yml`.

### Manual Deployment

To manually deploy to GitHub Pages:

```bash
npm run gh-pages
```

This requires proper Git configuration and GitHub Pages setup.

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `static/` directory
2. Configure DNS settings
3. Update `url` and `baseUrl` in `docusaurus.config.ts`

## 🔍 Search

The site includes search functionality powered by Algolia DocSearch. Configuration is in `docusaurus.config.ts` under the `algolia` section.

To update search indexing:
1. Ensure content is deployed to production
2. Algolia will automatically crawl and index the site
3. Search results will be updated within 24 hours

## 📊 Analytics

The site includes Google Analytics for usage tracking. Configuration is in `docusaurus.config.ts` under the `gtag` section.

## 🧪 Testing

### Build Testing

Test that the site builds correctly:

```bash
npm run build
npm run serve
```

### Link Checking

Check for broken links:

```bash
# Install htmlproofer (Ruby gem)
gem install html-proofer

# Check build for broken links
htmlproofer build --disable-external
```

### Accessibility Testing

Test accessibility with axe-core:

```bash
# Install axe-cli
npm install -g @axe-core/cli

# Test accessibility
axe http://localhost:3000
```

## 🤝 Contributing

### Documentation Contributions

1. **Fork the repository**
2. **Create a feature branch** for your changes
3. **Write clear, helpful documentation**
4. **Test your changes locally**
5. **Submit a pull request**

### Style Guide

- Use **sentence case** for headings
- Include **code examples** for all concepts
- Write in **second person** ("you can do this")
- Keep **paragraphs short** and scannable
- Use **active voice** when possible

### Review Process

All documentation changes go through:

1. **Automated checks** (linting, building, accessibility)
2. **Peer review** by maintainers
3. **Preview deployment** for testing
4. **Merge and deployment** to production

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
npm run clear
npm install
npm run build
```

#### Port Already in Use

```bash
# Start on different port
npm start -- --port 3001
```

#### Node.js Version Issues

```bash
# Check Node.js version
node --version

# Use Node Version Manager (nvm)
nvm use 18
```

### Getting Help

- **Documentation Issues** - Open an issue in the GitHub repository
- **Technical Support** - Join our Discord community
- **Feature Requests** - Use GitHub Discussions

## 📚 Resources

### Docusaurus

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [Theming Guide](https://docusaurus.io/docs/styling-layout)

### Terraform

- [Terraform Documentation](https://www.terraform.io/docs)
- [Provider Development](https://www.terraform.io/docs/extend/writing-custom-providers.html)
- [HCL Syntax](https://www.terraform.io/docs/language/syntax/configuration.html)

### OVH & Snowflake

- [OVH API Documentation](https://api.ovh.com/)
- [Snowflake Documentation](https://docs.snowflake.com/)
- [Snowflake SQL Reference](https://docs.snowflake.com/en/sql-reference.html)

## 📄 License

This documentation is licensed under the same license as the OVH Snowflake Terraform Provider. See the [LICENSE](../LICENSE) file for details.

---

**Made with ❤️ by the OVH Team**

For questions or support, please open an issue or join our community discussions.