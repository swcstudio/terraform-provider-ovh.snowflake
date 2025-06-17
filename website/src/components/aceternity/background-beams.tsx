"use client";
import React, { forwardRef, useRef } from "react";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface BackgroundBeamsProps {
  className?: string;
  children?: React.ReactNode;
  beamColor?: string;
  beamOpacity?: number;
  beamWidth?: string;
  numberOfBeams?: number;
  duration?: number;
  delay?: number;
}

export const BackgroundBeams = forwardRef<HTMLDivElement, BackgroundBeamsProps>(
  (
    {
      className,
      children,
      beamColor = "rgba(74, 95, 255, 0.3)",
      beamOpacity = 0.3,
      beamWidth = "2px",
      numberOfBeams = 5,
      duration = 8,
      delay = 2,
      ...props
    },
    ref
  ) => {
    const beams = Array.from({ length: numberOfBeams }, (_, i) => ({
      id: i,
      initialY: Math.random() * 100,
      initialX: Math.random() * 100,
      delay: Math.random() * delay,
      duration: duration + Math.random() * 4,
    }));

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Animated beams */}
        <div className="absolute inset-0 z-0">
          {beams.map((beam) => (
            <motion.div
              key={beam.id}
              className="absolute opacity-20"
              style={{
                background: `linear-gradient(90deg, transparent, ${beamColor}, transparent)`,
                width: beamWidth,
                height: "200%",
                left: `${beam.initialX}%`,
                top: "-50%",
              }}
              animate={{
                y: ["0%", "100%"],
                opacity: [0, beamOpacity, 0],
              }}
              transition={{
                duration: beam.duration,
                delay: beam.delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            />
          ))}
          
          {/* Diagonal beams for more visual interest */}
          {beams.slice(0, 3).map((beam) => (
            <motion.div
              key={`diagonal-${beam.id}`}
              className="absolute opacity-10"
              style={{
                background: `linear-gradient(45deg, transparent, ${beamColor}, transparent)`,
                width: beamWidth,
                height: "141%", // sqrt(2) * 100% for diagonal
                left: `${beam.initialX}%`,
                top: "-20%",
                transform: "rotate(45deg)",
                transformOrigin: "center",
              }}
              animate={{
                x: ["-50%", "150%"],
                opacity: [0, beamOpacity * 0.5, 0],
              }}
              transition={{
                duration: beam.duration * 1.5,
                delay: beam.delay + 1,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-gray-900/20" />
        
        {/* Content */}
        <div className="relative z-20 w-full">
          {children}
        </div>
      </div>
    );
  }
);

BackgroundBeams.displayName = "BackgroundBeams";

// Specialized version for hero sections
export const HeroBackgroundBeams = forwardRef<HTMLDivElement, BackgroundBeamsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BackgroundBeams
        ref={ref}
        className={cn("min-h-screen", className)}
        beamColor="rgba(41, 181, 232, 0.4)"
        numberOfBeams={8}
        duration={12}
        delay={3}
        {...props}
      >
        {children}
      </BackgroundBeams>
    );
  }
);

HeroBackgroundBeams.displayName = "HeroBackgroundBeams";

// Version optimized for documentation sections
export const DocsBackgroundBeams = forwardRef<HTMLDivElement, BackgroundBeamsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BackgroundBeams
        ref={ref}
        className={cn("min-h-[400px]", className)}
        beamColor="rgba(108, 92, 231, 0.2)"
        beamOpacity={0.15}
        numberOfBeams={4}
        duration={15}
        delay={4}
        {...props}
      >
        {children}
      </BackgroundBeams>
    );
  }
);

DocsBackgroundBeams.displayName = "DocsBackgroundBeams";

// Interactive version that responds to mouse movement
export const InteractiveBackgroundBeams = forwardRef<HTMLDivElement, BackgroundBeamsProps>(
  ({ className, children, ...props }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
    
    const rotateX = useTransform(springY, [-300, 300], [5, -5]);
    const rotateY = useTransform(springX, [-300, 300], [-5, 5]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    return (
      <motion.div
        ref={ref}
        className={cn("perspective-1000", className)}
        onMouseMove={handleMouseMove}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <BackgroundBeams
          beamColor="rgba(74, 95, 255, 0.3)"
          numberOfBeams={6}
          duration={10}
          delay={2}
          {...props}
        >
          {children}
        </BackgroundBeams>
      </motion.div>
    );
  }
);

InteractiveBackgroundBeams.displayName = "InteractiveBackgroundBeams";