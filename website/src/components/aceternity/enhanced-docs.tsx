"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "../../lib/utils";
import { CardContainer, CardBody, CardItem } from "./3d-card";
import { BackgroundBeams, DocsBackgroundBeams, HeroBackgroundBeams } from "./background-beams";
import { AnimatedTooltip, SimpleTooltip, DocTooltip, FeatureTooltip } from "./animated-tooltip";
import { BentoGrid, BentoGridItem, AnimatedBentoGrid, FeatureBentoItem, QuickStartBentoItem } from "./bento-grid";
import { TextGenerateEffect, HeadingGenerateEffect, DocTextGenerate, CodeGenerateEffect } from "./text-generate-effect";

// Enhanced Hero Section for Documentation
export interface DocsHeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  badges?: Array<{
    text: string;
    variant: "beta" | "new" | "stable" | "deprecated";
  }>;
  version?: string;
  lastUpdated?: string;
  className?: string;
}

export const DocsHero = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badges = [],
  version,
  lastUpdated,
  className,
}: DocsHeroProps) => {
  const badgeVariants = {
    beta: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    new: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    stable: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    deprecated: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  };

  return (
    <HeroBackgroundBeams className={cn("py-20 px-4", className)}>
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badges */}
        {badges.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {badges.map((badge, index) => (
              <span
                key={index}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full",
                  badgeVariants[badge.variant]
                )}
              >
                {badge.text}
              </span>
            ))}
          </motion.div>
        )}

        {/* Title */}
        <div className="space-y-4">
          <HeadingGenerateEffect
            heading={title}
            level={1}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white"
            speed="normal"
            highlightWords={["Terraform", "OVH", "Snowflake"]}
            highlightColor="text-blue-500"
          />
          
          {subtitle && (
            <DocTextGenerate
              text={subtitle}
              type="description"
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
              delay={0.5}
            />
          )}
        </div>

        {/* Description */}
        <DocTextGenerate
          text={description}
          type="description"
          className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          delay={1}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {primaryCTA && (
            <a
              href={primaryCTA.href}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {primaryCTA.text}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          
          {secondaryCTA && (
            <a
              href={secondaryCTA.href}
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {secondaryCTA.text}
            </a>
          )}
        </motion.div>

        {/* Meta Information */}
        {(version || lastUpdated) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
          >
            {version && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Version {version}
              </span>
            )}
            {lastUpdated && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated {lastUpdated}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </HeroBackgroundBeams>
  );
};

// Interactive Code Example Component
export interface CodeExampleProps {
  title: string;
  description?: string;
  code: string;
  language?: string;
  filename?: string;
  copyable?: boolean;
  runnable?: boolean;
  onRun?: () => void;
  highlightLines?: number[];
  className?: string;
}

export const CodeExample = ({
  title,
  description,
  code,
  language = "hcl",
  filename,
  copyable = true,
  runnable = false,
  onRun,
  highlightLines = [],
  className,
}: CodeExampleProps) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    await onRun?.();
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <CardContainer className={cn("w-full", className)}>
      <CardBody className="w-full h-auto min-h-96 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
        {/* Header */}
        <CardItem translateZ="50" className="w-full mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {filename && (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {filename}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {copyable && (
                <SimpleTooltip content={copied ? "Copied!" : "Copy code"}>
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {copied ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </SimpleTooltip>
              )}
              
              {runnable && (
                <SimpleTooltip content="Run example">
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="p-2 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors disabled:opacity-50"
                  >
                    {isRunning ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </SimpleTooltip>
              )}
            </div>
          </div>
          
          {description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {description}
            </p>
          )}
        </CardItem>

        {/* Code Block */}
        <CardItem translateZ="100" className="w-full">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <CodeGenerateEffect
              code={code}
              language={language}
              className="text-sm"
              speed="fast"
            />
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

// Feature Showcase Grid
export interface FeatureShowcaseProps {
  title: string;
  description?: string;
  features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    href?: string;
    isNew?: boolean;
    badge?: string;
  }>;
  className?: string;
}

export const FeatureShowcase = ({
  title,
  description,
  features,
  className,
}: FeatureShowcaseProps) => {
  return (
    <DocsBackgroundBeams className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <HeadingGenerateEffect
            heading={title}
            level={2}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          />
          {description && (
            <DocTextGenerate
              text={description}
              type="description"
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              delay={0.5}
            />
          )}
        </div>

        {/* Features Grid */}
        <AnimatedBentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureBentoItem
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              isNew={feature.isNew}
              badge={feature.badge}
              className="group/feature-item"
            />
          ))}
        </AnimatedBentoGrid>
      </div>
    </DocsBackgroundBeams>
  );
};

// Quick Start Guide Component
export interface QuickStartProps {
  title: string;
  steps: Array<{
    title: string;
    description: string;
    code?: string;
    language?: string;
    action?: {
      text: string;
      href: string;
    };
  }>;
  completionReward?: {
    title: string;
    description: string;
    action: {
      text: string;
      href: string;
    };
  };
  className?: string;
}

export const QuickStart = ({
  title,
  steps,
  completionReward,
  className,
}: QuickStartProps) => {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const handleStepComplete = (index: number) => {
    setCompletedSteps(prev => {
      const newCompleted = [...prev];
      newCompleted[index] = !newCompleted[index];
      return newCompleted;
    });
  };

  const allCompleted = completedSteps.every(Boolean);
  const completionPercentage = (completedSteps.filter(Boolean).length / steps.length) * 100;

  return (
    <div className={cn("py-16 px-4", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <div className="text-center mb-12">
          <HeadingGenerateEffect
            heading={title}
            level={2}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          />
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className="relative">
                  <motion.div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                      completedSteps[index]
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                    )}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleStepComplete(index)}
                  >
                    {completedSteps[index] ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {step.description}
                  </p>
                  
                  {step.code && (
                    <div className="mb-4">
                      <CodeExample
                        title="Example"
                        code={step.code}
                        language={step.language}
                        copyable
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {step.action && (
                    <a
                      href={step.action.href}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      {step.action.text}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completion Reward */}
        {allCompleted && completionReward && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {completionReward.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {completionReward.description}
              </p>
              <a
                href={completionReward.action.href}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {completionReward.action.text}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// API Reference Component
export interface APIReferenceProps {
  endpoint: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    description: string;
  };
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  response?: {
    example: string;
    schema?: string;
  };
  examples?: Array<{
    title: string;
    description: string;
    code: string;
    language?: string;
  }>;
  className?: string;
}

export const APIReference = ({
  endpoint,
  parameters = [],
  response,
  examples = [],
  className,
}: APIReferenceProps) => {
  const [activeTab, setActiveTab] = useState<"parameters" | "response" | "examples">("parameters");

  const methodColors = {
    GET: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    POST: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
    PATCH: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Endpoint Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1 text-sm font-medium rounded-full",
            methodColors[endpoint.method]
          )}>
            {endpoint.method}
          </span>
          <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
            {endpoint.path}
          </code>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {endpoint.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {["parameters", "response", "examples"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors",
                activeTab === tab
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "parameters" && (
            <div className="space-y-4">
              {parameters.length > 0 ? (
                parameters.map((param, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono font-bold">{param.name}</code>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {param.type}
                      </span>
                      {param.required && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {param.description}
                    </p>
                    {param.example && (
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Example: </span>
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                          {param.example}
                        </code>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No parameters required
                </p>
              )}
            </div>
          )}

          {activeTab === "response" && response && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Response Example</h4>
              <CodeExample
                title="Response"
                code={response.example}
                language="json"
                copyable
                className="w-full"
              />
            </div>
          )}

          {activeTab === "examples" && (
            <div className="space-y-6">
              {examples.map((example, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {example.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {example.description}
                  </p>
                  <CodeExample
                    title={example.title}
                    code={example.code}
                    language={example.language}
                    copyable
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Navigation Breadcrumbs with Animation
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface AnimatedBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const AnimatedBreadcrumbs = ({ items, className }: AnimatedBreadcrumbsProps) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          <div className="flex items-center gap-1">
            {item.icon && (
              <span className="text-gray-500 dark:text-gray-400">
                {item.icon}
              </span>
            )}
            
            {item.href ? (
              <a
                href={item.href}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </nav>
  );
};

// Section Divider with Animation
export interface SectionDividerProps {
  title?: string;
  description?: string;
  className?: string;
}

export const SectionDivider = ({
  title,
  description,
  className,
}: SectionDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className={cn("relative py-12", className)}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      
      {(title || description) && (
        <div className="relative flex justify-center">
          <div className="bg-white dark:bg-gray-900 px-6">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Documentation Search Component
export interface DocSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
  className?: string;
}

export const DocSearch = ({
  placeholder = "Search documentation...",
  onSearch,
  suggestions = [],
  className,
}: DocSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setIsOpen(filtered.length > 0);
    } else {
      setIsOpen(false);
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-md last:rounded-b-md transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Status Badge Component
export interface StatusBadgeProps {
  status: "stable" | "beta" | "deprecated" | "new" | "experimental";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    stable: {
      color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
      icon: "✓",
      label: "Stable",
    },
    beta: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
      icon: "β",
      label: "Beta",
    },
    deprecated: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
      icon: "⚠",
      label: "Deprecated",
    },
    new: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
      icon: "✨",
      label: "New",
    },
    experimental: {
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
      icon: "🧪",
      label: "Experimental",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
      config.color,
      className
    )}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};