"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "featured" | "minimal" | "gradient";
  badge?: string;
  badgeColor?: "blue" | "green" | "yellow" | "red" | "purple";
  isNew?: boolean;
  isComingSoon?: boolean;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
  href,
  target,
  onClick,
  size = "md",
  variant = "default",
  badge,
  badgeColor = "blue",
  isNew = false,
  isComingSoon = false,
}: BentoGridItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "md:col-span-1 md:row-span-1",
    md: "md:col-span-1 md:row-span-1",
    lg: "md:col-span-2 md:row-span-1",
    xl: "md:col-span-2 md:row-span-2",
  };

  const variantClasses = {
    default: "bg-white dark:bg-black border border-gray-200 dark:border-white/[0.2]",
    featured: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800/50",
    minimal: "bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800",
    gradient: "bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 border border-neutral-300 dark:border-neutral-700",
  };

  const badgeColors = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
  };

  const itemContent = (
    <motion.div
      className={cn(
        "rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden",
        sizeClasses[size],
        variantClasses[variant],
        isComingSoon && "opacity-60 cursor-not-allowed",
        (href || onClick) && !isComingSoon && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Background Effects */}
      {variant === "featured" && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {isNew && (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-full">
            New
          </span>
        )}
        {isComingSoon && (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 rounded-full">
            Coming Soon
          </span>
        )}
        {badge && (
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            badgeColors[badgeColor]
          )}>
            {badge}
          </span>
        )}
      </div>

      {/* Header/Visual Content */}
      {header && (
        <div className="relative">
          {header}
        </div>
      )}

      {/* Content */}
      <div className="group-hover/bento:translate-x-2 transition duration-200 relative z-10">
        {/* Icon */}
        {icon && (
          <div className="mb-3 text-neutral-600 dark:text-neutral-300">
            {icon}
          </div>
        )}

        {/* Title */}
        {title && (
          <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2">
            {title}
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
            {description}
          </div>
        )}

        {/* Custom Children */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>

      {/* Hover Effect Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300"
        animate={{
          x: isHovered ? "100%" : "-100%",
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      />

      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Coming Soon
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              We're working on this feature
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (href && !isComingSoon) {
    return (
      <a href={href} target={target} className="block">
        {itemContent}
      </a>
    );
  }

  if (onClick && !isComingSoon) {
    return (
      <div onClick={onClick}>
        {itemContent}
      </div>
    );
  }

  return itemContent;
};

// Specialized components for documentation

export const DocsBentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[16rem] grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const FeatureBentoItem = ({
  title,
  description,
  icon,
  href,
  isNew,
  className,
  ...props
}: Omit<BentoGridItemProps, 'variant'>) => {
  return (
    <BentoGridItem
      title={title}
      description={description}
      icon={icon}
      href={href}
      isNew={isNew}
      variant="featured"
      className={cn("group/feature", className)}
      {...props}
    />
  );
};

export const QuickStartBentoItem = ({
  title,
  description,
  icon,
  href,
  badge = "Start Here",
  className,
  ...props
}: Omit<BentoGridItemProps, 'variant' | 'badgeColor'>) => {
  return (
    <BentoGridItem
      title={title}
      description={description}
      icon={icon}
      href={href}
      badge={badge}
      badgeColor="green"
      variant="gradient"
      size="lg"
      className={cn("group/quickstart", className)}
      {...props}
    />
  );
};

export const APIDocs BentoItem = ({
  title,
  description,
  icon,
  href,
  badge = "API",
  className,
  ...props
}: Omit<BentoGridItemProps, 'variant' | 'badgeColor'>) => {
  return (
    <BentoGridItem
      title={title}
      description={description}
      icon={icon}
      href={href}
      badge={badge}
      badgeColor="blue"
      variant="minimal"
      className={cn("group/api", className)}
      {...props}
    />
  );
};

export const ExampleBentoItem = ({
  title,
  description,
  icon,
  href,
  badge = "Example",
  className,
  ...props
}: Omit<BentoGridItemProps, 'variant' | 'badgeColor'>) => {
  return (
    <BentoGridItem
      title={title}
      description={description}
      icon={icon}
      href={href}
      badge={badge}
      badgeColor="purple"
      variant="default"
      className={cn("group/example", className)}
      {...props}
    />
  );
};

// Animation wrapper for staggered grid animations
export const AnimatedBentoGrid = ({ className, children }: BentoGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};