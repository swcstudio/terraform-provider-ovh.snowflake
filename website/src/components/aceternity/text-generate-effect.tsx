"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
  mode?: "words" | "characters" | "lines";
  startOnView?: boolean;
  repeat?: boolean;
  repeatDelay?: number;
  highlightWords?: string[];
  highlightColor?: string;
  onComplete?: () => void;
  pauseOnHover?: boolean;
  cursor?: boolean;
  cursorColor?: string;
  speed?: "slow" | "normal" | "fast";
  variant?: "fade" | "slide" | "scale" | "typewriter";
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0.1,
  mode = "words",
  startOnView = true,
  repeat = false,
  repeatDelay = 2,
  highlightWords = [],
  highlightColor = "text-blue-500",
  onComplete,
  pauseOnHover = false,
  cursor = false,
  cursorColor = "border-blue-500",
  speed = "normal",
  variant = "fade",
}: TextGenerateEffectProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnView);

  // Speed configurations
  const speedConfig = {
    slow: { duration: 0.8, delay: 0.15 },
    normal: { duration: 0.5, delay: 0.1 },
    fast: { duration: 0.3, delay: 0.05 },
  };

  const { duration: speedDuration, delay: speedDelay } = speedConfig[speed];

  // Split text based on mode
  const getTextUnits = useCallback(() => {
    switch (mode) {
      case "characters":
        return words.split("");
      case "lines":
        return words.split("\n");
      case "words":
      default:
        return words.split(" ");
    }
  }, [words, mode]);

  const textUnits = getTextUnits();

  // Animation variants
  const getVariants = () => {
    switch (variant) {
      case "slide":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      case "typewriter":
        return {
          hidden: { width: 0, opacity: 0 },
          visible: { width: "auto", opacity: 1 },
        };
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  const variants = getVariants();

  // Check if word should be highlighted
  const isHighlighted = (word: string) => {
    return highlightWords.some(hw => 
      word.toLowerCase().includes(hw.toLowerCase())
    );
  };

  // Animation control
  useEffect(() => {
    if (!isVisible || isPaused || isComplete) return;

    const timer = setTimeout(() => {
      if (currentIndex < textUnits.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
        onComplete?.();
        
        if (repeat) {
          setTimeout(() => {
            setCurrentIndex(0);
            setIsComplete(false);
          }, repeatDelay * 1000);
        }
      }
    }, (speedDelay * 1000));

    return () => clearTimeout(timer);
  }, [currentIndex, textUnits.length, isVisible, isPaused, isComplete, speedDelay, repeat, repeatDelay, onComplete]);

  // Intersection observer for start on view
  useEffect(() => {
    if (!startOnView) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`text-generate-${words.slice(0, 10)}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [startOnView, words]);

  const renderText = () => {
    if (mode === "characters") {
      return (
        <span className="inline-block">
          {textUnits.map((char, i) => (
            <motion.span
              key={i}
              variants={variants}
              initial="hidden"
              animate={i < currentIndex ? "visible" : "hidden"}
              transition={{
                duration: speedDuration,
                delay: i * speedDelay,
              }}
              className={cn(
                char === " " ? "w-2 inline-block" : "inline-block",
                filter && "filter blur-sm",
                i < currentIndex && "filter-none"
              )}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      );
    }

    if (mode === "lines") {
      return (
        <div className="space-y-2">
          {textUnits.map((line, i) => (
            <motion.div
              key={i}
              variants={variants}
              initial="hidden"
              animate={i < currentIndex ? "visible" : "hidden"}
              transition={{
                duration: speedDuration,
                delay: i * speedDelay,
              }}
              className={cn(
                filter && "filter blur-sm",
                i < currentIndex && "filter-none"
              )}
            >
              {line}
            </motion.div>
          ))}
        </div>
      );
    }

    // Words mode (default)
    return (
      <span className="inline">
        {textUnits.map((word, i) => (
          <motion.span
            key={i}
            variants={variants}
            initial="hidden"
            animate={i < currentIndex ? "visible" : "hidden"}
            transition={{
              duration: speedDuration,
              delay: i * speedDelay,
            }}
            className={cn(
              "inline-block mr-1",
              filter && "filter blur-sm",
              i < currentIndex && "filter-none",
              isHighlighted(word) && highlightColor
            )}
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <div
      id={`text-generate-${words.slice(0, 10)}`}
      className={cn("font-bold", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {renderText()}
      
      {/* Cursor */}
      {cursor && (
        <motion.span
          animate={{
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "inline-block w-0.5 h-5 ml-1 border-r-2",
            cursorColor
          )}
        />
      )}
    </div>
  );
};

// Specialized version for code snippets
export const CodeGenerateEffect = ({
  code,
  language = "typescript",
  className,
  ...props
}: Omit<TextGenerateEffectProps, 'words'> & {
  code: string;
  language?: string;
}) => {
  return (
    <div className={cn("font-mono text-sm", className)}>
      <TextGenerateEffect
        words={code}
        mode="characters"
        variant="typewriter"
        cursor={true}
        speed="fast"
        {...props}
      />
    </div>
  );
};

// Version for headings
export const HeadingGenerateEffect = ({
  heading,
  level = 1,
  className,
  ...props
}: Omit<TextGenerateEffectProps, 'words'> & {
  heading: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const headingClasses = {
    1: "text-4xl md:text-6xl",
    2: "text-3xl md:text-5xl",
    3: "text-2xl md:text-4xl",
    4: "text-xl md:text-3xl",
    5: "text-lg md:text-2xl",
    6: "text-base md:text-xl",
  };

  return (
    <HeadingTag className={cn(headingClasses[level], className)}>
      <TextGenerateEffect
        words={heading}
        mode="words"
        variant="slide"
        speed="normal"
        {...props}
      />
    </HeadingTag>
  );
};

// Interactive version that starts on click
export const InteractiveTextGenerate = ({
  words,
  buttonText = "Start Animation",
  resetText = "Reset",
  className,
  ...props
}: TextGenerateEffectProps & {
  buttonText?: string;
  resetText?: string;
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [key, setKey] = useState(0);

  const handleStart = () => {
    setIsStarted(true);
    setKey(prev => prev + 1);
  };

  const handleReset = () => {
    setIsStarted(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {buttonText}
        </button>
        {isStarted && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {resetText}
          </button>
        )}
      </div>
      
      {isStarted && (
        <TextGenerateEffect
          key={key}
          words={words}
          startOnView={false}
          {...props}
        />
      )}
    </div>
  );
};

// Documentation-specific component with common presets
export const DocTextGenerate = ({
  text,
  type = "description",
  className,
  ...props
}: Omit<TextGenerateEffectProps, 'words'> & {
  text: string;
  type?: "title" | "description" | "feature" | "code" | "quote";
}) => {
  const typeConfigs = {
    title: {
      mode: "words" as const,
      variant: "slide" as const,
      speed: "normal" as const,
      className: "text-3xl font-bold",
    },
    description: {
      mode: "words" as const,
      variant: "fade" as const,
      speed: "fast" as const,
      className: "text-lg text-gray-600 dark:text-gray-300",
    },
    feature: {
      mode: "words" as const,
      variant: "scale" as const,
      speed: "normal" as const,
      className: "text-xl font-semibold",
    },
    code: {
      mode: "characters" as const,
      variant: "typewriter" as const,
      speed: "fast" as const,
      cursor: true,
      className: "font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded",
    },
    quote: {
      mode: "words" as const,
      variant: "fade" as const,
      speed: "slow" as const,
      className: "text-lg italic text-gray-700 dark:text-gray-400 border-l-4 border-blue-500 pl-4",
    },
  };

  const config = typeConfigs[type];

  return (
    <TextGenerateEffect
      words={text}
      className={cn(config.className, className)}
      {...config}
      {...props}
    />
  );
};