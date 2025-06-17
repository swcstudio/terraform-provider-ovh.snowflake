import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import { AnimatedSection, AnimatedHeading, AnimatedParagraph, AnimatedCard, AnimatedCodeBlock, AnimatedList, AnimatedListItem } from '../components/Animated/AnimatedSection';
import { mdxComponents } from '../components/Animated/AnimatedMDX';
import MermaidDiagram from '../components/MermaidDiagram';
import { motion } from 'motion/react';
import { useScrollAnimation, fadeInUp, fadeInLeft, scaleIn } from '../hooks/useScrollAnimation';

// Aceternity UI Components
import {
  AceternityComponents,
  DocumentationComponents,
  InteractiveComponents,
  DocsHero,
  FeatureShowcase,
  QuickStart,
  CodeExample,
  APIReference,
  AnimatedBreadcrumbs,
  SectionDivider,
  DocSearch,
  StatusBadge,
  BentoGrid,
  BentoGridItem,
  AnimatedBentoGrid,
  FeatureBentoItem,
  QuickStartBentoItem,
  CardContainer,
  CardBody,
  CardItem,
  BackgroundBeams,
  HeroBackgroundBeams,
  DocsBackgroundBeams,
  InteractiveBackgroundBeams,
  AnimatedTooltip,
  SimpleTooltip,
  DocTooltip,
  FeatureTooltip,
  TextGenerateEffect,
  HeadingGenerateEffect,
  DocTextGenerate,
  CodeGenerateEffect,
} from '../components/aceternity';

// Animated wrapper for code blocks
const AnimatedPre: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className, ...props }) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.2, delay: 200 });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInLeft}
      className="animated-code-wrapper"
    >
      <pre className={className} {...props}>
        {children}
      </pre>
    </motion.div>
  );
};

// Animated wrapper for blockquotes
const AnimatedBlockquote: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className, ...props }) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.2, delay: 100 });
  
  return (
    <motion.blockquote
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: -20, borderLeftColor: 'transparent' },
        visible: { 
          opacity: 1, 
          x: 0, 
          borderLeftColor: 'var(--ifm-color-primary)',
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.blockquote>
  );
};

// Animated wrapper for tables
const AnimatedTable: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className, ...props }) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.2, delay: 150 });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={scaleIn}
      className="animated-table-wrapper"
    >
      <table className={className} {...props}>
        {children}
      </table>
    </motion.div>
  );
};

// Animated wrapper for images
const AnimatedImg: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt, className, ...props }) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.3, delay: 100 });
  
  return (
    <motion.img
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
        visible: { 
          opacity: 1, 
          scale: 1, 
          filter: 'blur(0px)',
          transition: { 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
            filter: { duration: 0.4 }
          }
        }
      }}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

// Animated wrapper for divs (commonly used in MDX)
const AnimatedDiv: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className, ...props }) => {
  // Only animate divs with specific classes to avoid over-animating
  const shouldAnimate = className && (
    className.includes('admonition') ||
    className.includes('card') ||
    className.includes('alert') ||
    className.includes('tabs') ||
    className.includes('codeBlockContainer')
  );

  if (!shouldAnimate) {
    return <div className={className} {...props}>{children}</div>;
  }

  const { ref, controls } = useScrollAnimation({ threshold: 0.2, delay: 50 });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered animation for list items
const AnimatedLi: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className, ...props }) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <motion.li
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.li>
  );
};

// Animated heading components with different delays for hierarchy
const createAnimatedHeading = (level: 1 | 2 | 3 | 4 | 5 | 6, delay: number = 0) => {
  const HeadingComponent: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ 
    children, 
    className, 
    id,
    ...props 
  }) => {
    const { ref, controls } = useScrollAnimation({ threshold: 0.3, delay });
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { 
            opacity: 0, 
            y: 20,
            scale: 0.98
          },
          visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
              duration: 0.5, 
              ease: [0.4, 0, 0.2, 1],
              delay: delay / 1000
            }
          }
        }}
      >
        <HeadingTag className={className} id={id} {...props}>
          {children}
        </HeadingTag>
      </motion.div>
    );
  };

  HeadingComponent.displayName = `AnimatedH${level}`;
  return HeadingComponent;
};

// Create all heading components
const AnimatedH1 = createAnimatedHeading(1, 0);
const AnimatedH2 = createAnimatedHeading(2, 50);
const AnimatedH3 = createAnimatedHeading(3, 100);
const AnimatedH4 = createAnimatedHeading(4, 100);
const AnimatedH5 = createAnimatedHeading(5, 100);
const AnimatedH6 = createAnimatedHeading(6, 100);

// Animated paragraph with smart delay based on position
const AnimatedP: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className, ...props }) => {
  const { ref, controls } = useScrollAnimation({ threshold: 0.2, delay: 100 });
  
  return (
    <motion.p
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.p>
  );
};

// Enhanced MDX components with animations
const AnimatedMDXComponents = {
  // Keep original components for fallback
  ...MDXComponents,
  
  // Override with animated versions
  h1: AnimatedH1,
  h2: AnimatedH2,
  h3: AnimatedH3,
  h4: AnimatedH4,
  h5: AnimatedH5,
  h6: AnimatedH6,
  p: AnimatedP,
  pre: AnimatedPre,
  blockquote: AnimatedBlockquote,
  table: AnimatedTable,
  img: AnimatedImg,
  div: AnimatedDiv,
  li: AnimatedLi,
  
  // Custom components that can be used in MDX
  AnimatedSection,
  AnimatedCard,
  AnimatedCodeBlock,
  AnimatedList,
  AnimatedListItem,
  
  // Enhanced Mermaid diagram component
  mermaid: MermaidDiagram,
  Mermaid: MermaidDiagram,
  MermaidDiagram,
  
  // Utility motion component for custom animations
  Motion: motion.div,
  
  // Wrapper for creating custom animated components
  Animate: AnimatedSection,
  
  // Aceternity UI Components - Documentation focused
  DocsHero,
  FeatureShowcase,
  QuickStart,
  CodeExample,
  APIReference,
  AnimatedBreadcrumbs,
  SectionDivider,
  DocSearch,
  StatusBadge,
  
  // Aceternity UI Components - Layout & Grid
  BentoGrid,
  BentoGridItem,
  AnimatedBentoGrid,
  FeatureBentoItem,
  QuickStartBentoItem,
  
  // Aceternity UI Components - 3D Effects
  CardContainer,
  CardBody,
  CardItem,
  Card3D: {
    Container: CardContainer,
    Body: CardBody,
    Item: CardItem,
  },
  
  // Aceternity UI Components - Background Effects
  BackgroundBeams,
  HeroBackgroundBeams,
  DocsBackgroundBeams,
  InteractiveBackgroundBeams,
  
  // Aceternity UI Components - Tooltips
  AnimatedTooltip,
  SimpleTooltip,
  DocTooltip,
  FeatureTooltip,
  
  // Aceternity UI Components - Text Effects
  TextGenerateEffect,
  HeadingGenerateEffect,
  DocTextGenerate,
  CodeGenerateEffect,
  
  // Pre-configured component sets
  AceternityComponents,
  DocumentationComponents,
  InteractiveComponents,
};

export default AnimatedMDXComponents;