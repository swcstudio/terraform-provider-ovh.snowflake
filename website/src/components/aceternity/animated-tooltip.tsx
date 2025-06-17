"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

export interface AnimatedTooltipProps {
  items: {
    id: number;
    name: string;
    designation?: string;
    image?: string;
    description?: string;
    icon?: React.ReactNode;
    href?: string;
  }[];
  className?: string;
  delay?: number;
}

export const AnimatedTooltip = ({
  items,
  className,
  delay = 0.5,
}: AnimatedTooltipProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className={cn("flex flex-row items-center justify-center", className)}>
      {items.map((item, idx) => (
        <div
          className="relative group"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
                <div className="font-bold text-white relative z-30 text-base">
                  {item.name}
                </div>
                {item.designation && (
                  <div className="text-white text-xs">{item.designation}</div>
                )}
                {item.description && (
                  <div className="text-white text-xs mt-1 max-w-xs text-center">
                    {item.description}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={handleMouseMove}
            className={cn(
              "object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500",
              item.image ? "bg-cover bg-center" : "bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
            )}
            style={item.image ? { backgroundImage: `url(${item.image})` } : {}}
          >
            {!item.image && item.icon && (
              <div className="text-white text-xl">{item.icon}</div>
            )}
            {!item.image && !item.icon && (
              <div className="text-white text-sm font-bold">
                {item.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple tooltip for documentation links and buttons
export interface SimpleTooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  delay?: number;
  offset?: number;
}

export const SimpleTooltip = ({
  content,
  children,
  side = "top",
  className,
  delay = 0.3,
  offset = 8,
}: SimpleTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    setTimeout(() => setIsVisible(true), delay * 1000);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (side) {
        case "top":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - offset;
          break;
        case "right":
          x = triggerRect.right + offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case "bottom":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + offset;
          break;
        case "left":
          x = triggerRect.left - tooltipRect.width - offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      setPosition({ x, y });
    }
  }, [isVisible, side, offset]);

  const getArrowClasses = () => {
    const baseClasses = "absolute w-0 h-0 border-solid";
    switch (side) {
      case "top":
        return `${baseClasses} border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-100 top-full left-1/2 transform -translate-x-1/2`;
      case "right":
        return `${baseClasses} border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-900 dark:border-r-gray-100 right-full top-1/2 transform -translate-y-1/2`;
      case "bottom":
        return `${baseClasses} border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-100 bottom-full left-1/2 transform -translate-x-1/2`;
      case "left":
        return `${baseClasses} border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-900 dark:border-l-gray-100 left-full top-1/2 transform -translate-y-1/2`;
      default:
        return "";
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className={cn(
              "fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg shadow-lg pointer-events-none max-w-xs",
              className
            )}
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {content}
            <div className={getArrowClasses()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Documentation-specific tooltip for code snippets and technical terms
export interface DocTooltipProps {
  term: string;
  definition: string;
  example?: string;
  children: React.ReactNode;
  className?: string;
}

export const DocTooltip = ({
  term,
  definition,
  example,
  children,
  className,
}: DocTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help border-b border-dashed border-blue-500 hover:border-solid transition-all duration-200"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50",
              className
            )}
          >
            <div className="space-y-2">
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {term}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {definition}
              </div>
              {example && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200">
                  <div className="text-gray-500 dark:text-gray-400 mb-1">Example:</div>
                  {example}
                </div>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Feature tooltip for highlighting new features or important information
export interface FeatureTooltipProps {
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "blue" | "green" | "yellow" | "red" | "purple";
  children: React.ReactNode;
  className?: string;
}

export const FeatureTooltip = ({
  title,
  description,
  badge,
  badgeColor = "blue",
  children,
  className,
}: FeatureTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const badgeColors = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50",
              className
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </div>
                {badge && (
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    badgeColors[badgeColor]
                  )}>
                    {badge}
                  </span>
                )}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {description}
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};