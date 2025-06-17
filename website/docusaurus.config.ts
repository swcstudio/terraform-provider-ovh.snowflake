import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'The Snowflake Terraform Provider for OVHcloud',
  tagline: 'Snowflake/OVHcloud by swcstudio • Manage Snowflake resources through OVH infrastructure with Terraform',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: 'https://swcstudio.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/terraform-provider-ovh-snowflake/',

  // GitHub pages deployment config.
  organizationName: 'swcstudio',
  projectName: 'terraform-provider-ovh-snowflake',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake/tree/main/website/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
          versions: {
            current: {
              label: 'Latest',
              path: '',
            },
          },
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake/tree/main/website/',
          blogTitle: 'Snowflake/OVHcloud Provider Blog',
          blogDescription: 'Updates, tutorials, and best practices for the Snowflake/OVHcloud Terraform Provider',
          postsPerPage: 'ALL',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Spectrum Web Co`,
            createFeedItems: async (params) => {
              const {blogPosts, defaultCreateFeedItems, ...rest} = params;
              return defaultCreateFeedItems({
                blogPosts: blogPosts.filter((item, index) => index < 10),
                ...rest,
              });
            },
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-XXXXXXXXXX', // Replace with your GA4 tracking ID
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: './sidebarsCommunity.ts',
        editUrl: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake/tree/main/website/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: './sidebarsApi.ts',
        editUrl: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake/tree/main/website/',
      },
    ],
    async function tailwindPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig: {
    image: 'img/ovh-snowflake-social-card.jpg',
    navbar: {
      title: 'The Snowflake Terraform Provider for OVHcloud',
      logo: {
        alt: 'Spectrum Web Co - Snowflake/OVHcloud Provider',
        src: 'img/spectrumwebco-light.png',
        srcDark: 'img/spectrumwebco-dark.png',
        href: '/',
        target: '_self',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/api/intro',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/community/contributing',
          label: 'Community',
          position: 'left',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://registry.terraform.io/providers/swcstudio/snowflake/latest',
          label: 'Terraform Registry',
          position: 'right',
        },
        {
          href: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Resources',
              to: '/docs/resources/overview',
            },
            {
              label: 'Data Sources',
              to: '/docs/data-sources/accounts',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Contributing',
              to: '/community/contributing',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake/discussions',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/terraform-provider-ovh-snowflake',
            },
            {
              label: 'Issues',
              href: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake/issues',
            },
          ],
        },
        {
          title: 'Resources',
          items: [

            {
              label: 'Terraform Registry',
              href: 'https://registry.terraform.io/providers/swcstudio/snowflake/latest',
            },
            {
              label: 'OVH API',
              href: 'https://api.ovh.com/',
            },
            {
              label: 'Snowflake Docs',
              href: 'https://docs.snowflake.com/',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              href: 'https://www.ovhcloud.com/en/personal-data-protection/',
            },
            {
              label: 'Terms of Service',
              href: 'https://www.ovhcloud.com/en/terms-and-conditions/',
            },
            {
              label: 'License',
              href: 'https://github.com/swcstudio/terraform-provider-ovh-snowflake/blob/main/LICENSE',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Spectrum Web Co. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['json', 'yaml', 'bash', 'powershell'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'YOUR_ALGOLIA_APP_ID',
      // Public API key: it is safe to commit it
      apiKey: 'YOUR_ALGOLIA_API_KEY',
      indexName: 'ovh-snowflake-provider',
      // Optional: see doc section below
      contextualSearch: true,
      // Optional: Specify domains where the navigation should occur through window.location instead on history.push
      externalUrlRegex: 'external\\.com|domain\\.com',
      // Optional: Replace parts of the item URLs from Algolia
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },
      // Optional: Algolia search parameters
      searchParameters: {},
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',
    },
    metadata: [
      {
        name: 'keywords',
        content: 'terraform, provider, ovh, snowflake, infrastructure, cloud, iac',
      },
      {
        name: 'description',
        content: 'Official documentation for the OVH Snowflake Terraform Provider - manage Snowflake resources through OVH infrastructure',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'OVH Snowflake Terraform Provider',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:site',
        content: '@ovhcloud',
      },
    ],
    announcementBar: {
      id: 'provider_beta',
      content:
        '🚀 The Snowflake/OVHcloud Terraform Provider is now in beta! <a target="_blank" rel="noopener noreferrer" href="https://github.com/swcstudio/terraform-provider-ovh-snowflake/releases">Check out the latest release</a>',
      backgroundColor: '#4a5fff',
      textColor: '#fff',
      isCloseable: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    blog: {
      sidebar: {
        groupByYear: true,
      },
    },
  } satisfies Preset.ThemeConfig,

  // Custom fields for additional configuration
  customFields: {
    description: 'Manage Snowflake resources through OVH infrastructure with Terraform',
    keywords: ['terraform', 'provider', 'ovh', 'snowflake', 'infrastructure', 'cloud'],
  },



  // Markdown configuration
  markdown: {
    mermaid: true,
  },

  // Theme configuration
  themes: ['@docusaurus/theme-mermaid'],

  // Mermaid configuration for transparent backgrounds and dark mode compatibility
  mermaid: {
    theme: {
      light: 'base',
      dark: 'dark',
    },
    options: {
      theme: 'base',
      themeVariables: {
        // Light theme colors with transparent backgrounds
        primaryColor: '#29b5e8',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#4a5fff',
        lineColor: '#6b7280',
        secondaryColor: '#e5e7eb',
        tertiaryColor: '#f3f4f6',
        background: 'transparent',
        mainBkg: 'transparent',
        secondBkg: 'rgba(229, 231, 235, 0.1)',
        tertiaryBkg: 'rgba(243, 244, 246, 0.1)',
        // Node styling
        nodeBorder: '#4a5fff',
        clusterBkg: 'rgba(74, 95, 255, 0.1)',
        clusterBorder: '#4a5fff',
        // Text colors
        textColor: '#1f2937',
        labelTextColor: '#1f2937',
        // Grid and axis
        gridColor: 'rgba(107, 114, 128, 0.2)',
        c0: 'rgba(74, 95, 255, 0.1)',
        c1: 'rgba(41, 181, 232, 0.1)',
        c2: 'rgba(108, 92, 231, 0.1)',
        c3: 'rgba(16, 185, 129, 0.1)',
      },
    },
    darkOptions: {
      theme: 'dark',
      themeVariables: {
        // Dark theme colors with transparent backgrounds
        primaryColor: '#47c1ed',
        primaryTextColor: '#f9fafb',
        primaryBorderColor: '#6a7fff',
        lineColor: '#9ca3af',
        secondaryColor: '#4b5563',
        tertiaryColor: '#374151',
        background: 'transparent',
        mainBkg: 'transparent',
        secondBkg: 'rgba(75, 85, 99, 0.1)',
        tertiaryBkg: 'rgba(55, 65, 81, 0.1)',
        // Node styling
        nodeBorder: '#6a7fff',
        clusterBkg: 'rgba(106, 127, 255, 0.1)',
        clusterBorder: '#6a7fff',
        // Text colors
        textColor: '#f9fafb',
        labelTextColor: '#f9fafb',
        // Grid and axis
        gridColor: 'rgba(156, 163, 175, 0.2)',
        c0: 'rgba(106, 127, 255, 0.2)',
        c1: 'rgba(71, 193, 237, 0.2)',
        c2: 'rgba(162, 155, 254, 0.2)',
        c3: 'rgba(52, 211, 153, 0.2)',
      },
    },
  },

  // Scripts to include
  scripts: [
    {
      src: 'https://plausible.io/js/script.js',
      defer: true,
      'data-domain': 'ovh.github.io',
    },
  ],

  // Stylesheets to include
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;