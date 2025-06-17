import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/authentication',
      ],
    },
    {
      type: 'category',
      label: '📦 Resources',
      items: [
        'resources/overview',
        'resources/database',
        'resources/schema',
        'resources/table',
        'resources/user',
        'resources/role',
        'resources/grant',
        'resources/warehouse',
        'resources/resource_monitor',
      ],
    },
    {
      type: 'category',
      label: '📊 Data Sources',
      items: [
        'data-sources/accounts',
      ],
    },
    {
      type: 'category',
      label: '🎨 Examples',
      items: [
        'examples/architecture-diagrams',
        'examples/aceternity-showcase',
      ],
    },
  ],
};

export default sidebars;