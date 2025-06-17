import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useScrollAnimation, fadeInUp, scaleIn, staggerContainer } from '../../hooks/useScrollAnimation';

// Mock UI Components (These would normally come from Aceternity UI / Magic UI)
// For demonstration purposes, I'm creating simplified versions

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const GlowingCard: React.FC<GlowingCardProps> = ({ 
  children, 
  className,
  glowColor = "rgba(74, 95, 255, 0.5)" 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={cn(
        "relative p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className,
  onClick
}) => {
  return (
    <motion.button
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#29b5e8_0%,#4a5fff_50%,#6c5ce7_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </motion.button>
  );
};

interface FloatingCardsProps {
  cards: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
}

const FloatingCards: React.FC<FloatingCardsProps> = ({ cards }) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={scaleIn}
          className="group"
        >
          <GlowingCard className="h-full transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
            {card.icon && (
              <div className="mb-4 text-2xl text-blue-400">
                {card.icon}
              </div>
            )}
            <h3 className="text-xl font-semibold text-white mb-2">
              {card.title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {card.description}
            </p>
          </GlowingCard>
        </motion.div>
      ))}
    </motion.div>
  );
};

interface CodeHighlightProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({
  code,
  language = "hcl",
  title
}) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className="relative"
    >
      <GlowingCard className="overflow-hidden" glowColor="rgba(41, 181, 232, 0.3)">
        {title && (
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700/50">
            <h4 className="text-lg font-medium text-white">{title}</h4>
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {language}
            </span>
          </div>
        )}
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </GlowingCard>
    </motion.div>
  );
};

interface StatsCardProps {
  label: string;
  value: string;
  trend?: number;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon }) => {
  return (
    <GlowingCard className="text-center">
      {icon && (
        <div className="text-3xl mb-2 text-blue-400 flex justify-center">
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-400 mb-2">
        {label}
      </div>
      {trend !== undefined && (
        <div className={cn(
          "text-xs font-medium",
          trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-gray-400"
        )}>
          {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} {Math.abs(trend)}%
        </div>
      )}
    </GlowingCard>
  );
};

// Main Showcase Component
const UIShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cards');

  const terraformCode = `resource "ovh_cloud_project_database" "snowflake_db" {
  service_name = var.service_name
  description  = "Snowflake Database via OVH"
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
}`;

  const exampleCards = [
    {
      title: "Provider Configuration",
      description: "Learn how to configure the OVH provider for Snowflake resources with authentication and region settings.",
      icon: "⚙️"
    },
    {
      title: "Resource Management",
      description: "Manage Snowflake databases, warehouses, and user permissions through OVH's infrastructure.",
      icon: "🗄️"
    },
    {
      title: "Data Sources", 
      description: "Query existing Snowflake resources and use them in your Terraform configurations.",
      icon: "📊"
    },
    {
      title: "Best Practices",
      description: "Follow security and performance best practices for production Snowflake deployments.",
      icon: "✨"
    },
    {
      title: "Monitoring",
      description: "Set up monitoring and alerting for your Snowflake resources using OVH monitoring tools.",
      icon: "📈"
    },
    {
      title: "Scaling",
      description: "Configure auto-scaling and resource optimization for cost-effective Snowflake operations.",
      icon: "🚀"
    }
  ];

  const stats = [
    { label: "Active Resources", value: "1,234", trend: 12, icon: "📈" },
    { label: "Monthly Queries", value: "2.5M", trend: 8, icon: "🔍" },
    { label: "Data Processed", value: "45TB", trend: 15, icon: "💾" },
    { label: "Uptime", value: "99.9%", trend: 0, icon: "⚡" }
  ];

  const tabs = [
    { id: 'cards', label: 'Feature Cards' },
    { id: 'code', label: 'Code Examples' },
    { id: 'stats', label: 'Statistics' },
    { id: 'buttons', label: 'Interactive Elements' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          UI Component Showcase
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Demonstrating the integration of modern UI libraries like Aceternity UI and Magic UI 
          with our OVH Snowflake Terraform Provider documentation.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'cards' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Feature Cards</h2>
            <FloatingCards cards={exampleCards} />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Code Examples</h2>
            <CodeHighlight
              code={terraformCode}
              language="hcl"
              title="Terraform Configuration Example"
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Usage Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <StatsCard {...stat} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Interactive Elements</h2>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <ShimmerButton onClick={() => alert('Get Started clicked!')}>
                  Get Started
                </ShimmerButton>
                <ShimmerButton onClick={() => alert('View Documentation clicked!')}>
                  View Documentation
                </ShimmerButton>
                <ShimmerButton onClick={() => alert('Try Examples clicked!')}>
                  Try Examples
                </ShimmerButton>
              </div>
              
              <GlowingCard className="text-center max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Ready to get started?
                </h3>
                <p className="text-gray-300 mb-4">
                  These components can be easily integrated into your documentation pages.
                </p>
                <ShimmerButton className="w-full">
                  Explore Provider →
                </ShimmerButton>
              </GlowingCard>
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center text-gray-400 text-sm border-t border-gray-700/50 pt-8"
      >
        <p>
          These components demonstrate the integration capabilities of modern UI libraries 
          with Docusaurus and the Motion library for enhanced user experience.
        </p>
      </motion.div>
    </div>
  );
};

export default UIShowcase;