import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { motion } from 'framer-motion';

// Aceternity UI Components
import {
  DocsHero,
  FeatureShowcase,
  QuickStart,
  CodeExample,
  BentoGrid,
  FeatureBentoItem,
  QuickStartBentoItem,
  CardContainer,
  CardBody,
  CardItem,
  HeroBackgroundBeams,
  DocsBackgroundBeams,
  InteractiveBackgroundBeams,
  TextGenerateEffect,
  HeadingGenerateEffect,
  DocTextGenerate,
  AnimatedTooltip,
  SimpleTooltip,
  StatusBadge,
  SectionDivider,
} from '@site/src/components/aceternity';

// Enhanced Homepage with Aceternity UI
export default function EnhancedHomepage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  // Hero Section Data
  const heroData = {
    title: "The Snowflake Terraform Provider for OVHcloud",
    subtitle: "Enterprise Infrastructure as Code",
    description: "Manage Snowflake resources through OVH infrastructure with state-of-the-art Terraform automation. Built by Spectrum Web Co for enterprise-grade cloud deployments.",
    primaryCTA: {
      text: "Get Started →",
      href: "/docs/intro"
    },
    secondaryCTA: {
      text: "View Examples",
      href: "/docs/examples/architecture-diagrams"
    },
    badges: [
      { text: "v1.0.0", variant: "stable" as const },
      { text: "Enterprise Ready", variant: "new" as const },
      { text: "Open Source", variant: "beta" as const }
    ],
    version: "1.0.0",
    lastUpdated: "December 2024"
  };

  // Features Data
  const features = [
    {
      title: "🚀 Enterprise-Grade Infrastructure",
      description: "Deploy and manage Snowflake resources on OVH Cloud with enterprise-level reliability, security, and performance optimization.",
      icon: <div className="text-4xl">🏗️</div>,
      href: "/docs/getting-started/installation",
      isNew: true,
    },
    {
      title: "🔧 Terraform Native",
      description: "Fully integrated with Terraform ecosystem. Use familiar HCL syntax and Terraform workflows for all your Snowflake deployments.",
      icon: <div className="text-4xl">⚙️</div>,
      href: "/docs/resources/overview",
    },
    {
      title: "🌐 Global Cloud Distribution",
      description: "Leverage OVH's global infrastructure to deploy Snowflake closer to your users worldwide with optimal performance.",
      icon: <div className="text-4xl">🌍</div>,
      href: "/docs/getting-started/authentication",
    },
    {
      title: "📊 Advanced Monitoring",
      description: "Built-in monitoring, alerting, and analytics for your Snowflake deployments with real-time insights and performance metrics.",
      icon: <div className="text-4xl">📈</div>,
      href: "/docs/resources/resource_monitor",
      badge: "Pro Feature",
    },
    {
      title: "🔒 Security First",
      description: "Enterprise security with role-based access control, encryption at rest and in transit, and compliance with industry standards.",
      icon: <div className="text-4xl">🛡️</div>,
      href: "/docs/resources/role",
    },
    {
      title: "🤖 Automated Scaling",
      description: "Intelligent auto-scaling based on workload patterns, cost optimization, and performance requirements.",
      icon: <div className="text-4xl">📈</div>,
      href: "/docs/resources/warehouse",
      badge: "AI-Powered",
    },
  ];

  // Quick Start Steps
  const quickStartSteps = [
    {
      title: "Install the Provider",
      description: "Add the OVH Snowflake provider to your Terraform configuration and initialize your project.",
      code: `terraform {
  required_providers {
    ovh = {
      source  = "swcstudio/snowflake"
      version = "~> 1.0"
    }
  }
}

provider "ovh" {
  endpoint         = var.ovh_endpoint
  application_key  = var.ovh_application_key
  application_secret = var.ovh_application_secret
  consumer_key     = var.ovh_consumer_key
}`,
      language: "hcl",
      action: {
        text: "Installation Guide",
        href: "/docs/getting-started/installation"
      }
    },
    {
      title: "Configure Authentication",
      description: "Set up secure authentication for both OVH and Snowflake services with best practices.",
      code: `# Configure OVH authentication
export OVH_ENDPOINT="ovh-eu"
export OVH_APPLICATION_KEY="your_app_key"
export OVH_APPLICATION_SECRET="your_app_secret"
export OVH_CONSUMER_KEY="your_consumer_key"

# Configure Snowflake authentication
export SNOWFLAKE_ACCOUNT="your_account"
export SNOWFLAKE_USER="your_user"
export SNOWFLAKE_PASSWORD="your_password"`,
      language: "bash",
      action: {
        text: "Authentication Guide",
        href: "/docs/getting-started/authentication"
      }
    },
    {
      title: "Deploy Your First Resource",
      description: "Create your first Snowflake database on OVH infrastructure with a simple Terraform configuration.",
      code: `resource "ovh_cloud_project_database" "snowflake_db" {
  service_name = var.service_name
  description  = "Production Snowflake Database"
  engine       = "snowflake"
  version      = "latest"
  plan         = "business"
  
  nodes {
    region     = "GRA"
    node_type  = "db1-7"
    number     = 1
  }
  
  tags = [
    "environment:production",
    "managed-by:terraform"
  ]
}

output "snowflake_endpoint" {
  value = ovh_cloud_project_database.snowflake_db.endpoints
}`,
      language: "hcl",
      action: {
        text: "View More Examples",
        href: "/docs/examples/architecture-diagrams"
      }
    }
  ];

  // Team Data for Animated Tooltip
  const team = [
    {
      id: 1,
      name: "Oveshen Govender",
      designation: "Lead Developer",
      image: "/img/team/oveshen.jpg",
      description: "Full-stack developer specializing in cloud infrastructure and Terraform providers."
    },
    {
      id: 2,
      name: "Spectrum Web Co",
      designation: "Development Studio",
      icon: "🚀",
      description: "State-of-the-art web development studio focused on enterprise cloud solutions."
    },
    {
      id: 3,
      name: "OVHcloud",
      designation: "Cloud Partner",
      icon: "☁️",
      description: "Global cloud infrastructure provider with enterprise-grade services."
    },
    {
      id: 4,
      name: "Snowflake",
      designation: "Data Platform",
      icon: "❄️",
      description: "Cloud-native data platform for analytics and machine learning workloads."
    }
  ];

  return (
    <Layout
      title={`${siteConfig.title} - Enterprise Infrastructure as Code`}
      description="Manage Snowflake resources through OVH infrastructure with state-of-the-art Terraform automation. Built by Spectrum Web Co for enterprise cloud deployments."
    >
      {/* Hero Section with Background Beams */}
      <DocsHero
        title={heroData.title}
        subtitle={heroData.subtitle}
        description={heroData.description}
        primaryCTA={heroData.primaryCTA}
        secondaryCTA={heroData.secondaryCTA}
        badges={heroData.badges}
        version={heroData.version}
        lastUpdated={heroData.lastUpdated}
        className="relative"
      />

      {/* Quick Start Section */}
      <QuickStart
        title="Get Started in Minutes"
        steps={quickStartSteps}
        completionReward={{
          title: "🎉 Congratulations!",
          description: "You've successfully deployed your first Snowflake resource on OVH infrastructure. Ready to explore advanced features?",
          action: {
            text: "Explore Advanced Features →",
            href: "/docs/resources/overview"
          }
        }}
        className="py-20 bg-gray-50 dark:bg-gray-900/50"
      />

      {/* Features Showcase */}
      <FeatureShowcase
        title="Why Choose Our Provider?"
        description="Enterprise-grade features designed for modern cloud infrastructure teams"
        features={features}
        className="py-20"
      />

      {/* Interactive Demo Section */}
      <DocsBackgroundBeams className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <HeadingGenerateEffect
              heading="See It In Action"
              level={2}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            />
            <DocTextGenerate
              text="Explore real-world examples and interactive demonstrations of the provider capabilities"
              type="description"
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            />
          </div>

          {/* Interactive Code Examples Grid */}
          <BentoGrid className="grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureBentoItem
              title="Database Configuration"
              description="Complete setup for production Snowflake databases with monitoring and backup strategies."
              icon={<div className="text-2xl">🗄️</div>}
              href="/docs/resources/database"
              size="lg"
              className="md:col-span-2"
              header={
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                  <CodeExample
                    title="Production Database Setup"
                    code={`resource "ovh_cloud_project_database" "main" {
  service_name = "production-snowflake"
  description  = "Main production database"
  engine       = "snowflake"
  version      = "latest"
  plan         = "business"
  
  nodes {
    region    = "GRA"
    node_type = "db1-15"
    number    = 3
  }
  
  backup_time = "02:00:00"
  maintenance_time = "sunday:03:00:00"
  
  tags = [
    "environment:production",
    "team:data-engineering",
    "cost-center:analytics"
  ]
}`}
                    language="hcl"
                    copyable
                    className="w-full"
                  />
                </div>
              }
            />

            <FeatureBentoItem
              title="User Management"
              description="Automated user provisioning with role-based access control and security policies."
              icon={<div className="text-2xl">👥</div>}
              href="/docs/resources/user"
              badge="Security"
            />

            <FeatureBentoItem
              title="Warehouse Scaling"
              description="Dynamic warehouse scaling based on workload patterns and cost optimization."
              icon={<div className="text-2xl">⚡</div>}
              href="/docs/resources/warehouse"
              badge="Performance"
            />
          </BentoGrid>
        </div>
      </DocsBackgroundBeams>

      {/* 3D Feature Cards Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <HeadingGenerateEffect
              heading="Enterprise-Grade Capabilities"
              level={2}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            />
            <DocTextGenerate
              text="Discover the advanced features that make this provider suitable for enterprise deployments"
              type="description"
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "High Availability",
                description: "Multi-region deployment with automatic failover and disaster recovery capabilities.",
                icon: "🔄",
                features: ["99.9% SLA", "Auto-failover", "Geo-replication"]
              },
              {
                title: "Cost Optimization",
                description: "Intelligent resource management with cost tracking and optimization recommendations.",
                icon: "💰",
                features: ["Cost monitoring", "Resource optimization", "Budget alerts"]
              },
              {
                title: "Compliance Ready",
                description: "Built-in compliance features for GDPR, SOC2, and other industry standards.",
                icon: "🛡️",
                features: ["GDPR compliant", "SOC2 certified", "Audit logging"]
              }
            ].map((feature, index) => (
              <CardContainer key={index} className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[350px] h-auto rounded-xl p-6 border">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{feature.icon}</span>
                      {feature.title}
                    </div>
                  </CardItem>
                  
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 mb-4"
                  >
                    {feature.description}
                  </CardItem>
                  
                  <CardItem translateZ="100" className="w-full mt-4">
                    <div className="space-y-2">
                      {feature.features.map((feat, featIndex) => (
                        <div key={featIndex} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Community Section */}
      <InteractiveBackgroundBeams className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HeadingGenerateEffect
            heading="Built by Cloud Experts"
            level={2}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8"
          />
          
          <DocTextGenerate
            text="Developed by a team of cloud infrastructure specialists with deep expertise in Terraform, OVH, and Snowflake technologies"
            type="description"
            className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
          />

          <div className="flex justify-center mb-8">
            <AnimatedTooltip items={team} />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <StatusBadge status="stable" className="text-sm" />
            <StatusBadge status="new" className="text-sm" />
            <SimpleTooltip content="Built with TypeScript for type safety">
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-sm font-medium rounded-full">
                TypeScript
              </span>
            </SimpleTooltip>
            <SimpleTooltip content="Open source and community driven">
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 text-sm font-medium rounded-full">
                Open Source
              </span>
            </SimpleTooltip>
          </div>
        </div>
      </InteractiveBackgroundBeams>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HeadingGenerateEffect
            heading="Ready to Transform Your Infrastructure?"
            level={2}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          />
          
          <DocTextGenerate
            text="Join hundreds of enterprises using our provider to manage their Snowflake infrastructure on OVH Cloud with confidence and efficiency."
            type="description"
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="/docs/intro"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Building Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>
            
            <motion.a
              href="https://github.com/swcstudio/terraform-provider-ovh-snowflake"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View on GitHub
              <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      <SectionDivider 
        title="Built with ❤️ by Spectrum Web Co" 
        description="State-of-the-art infrastructure solutions for the modern enterprise"
      />
    </Layout>
  );
}