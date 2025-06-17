import React from 'react';
import { motion } from 'motion/react';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerItem } from '../../hooks/useScrollAnimation';

interface AnimatedMDXProps {
  children: React.ReactNode;
  className?: string;
}

// Animation mapping for different MDX elements
const elementAnimations = {
  h1: { variant: fadeInUp, delay: 0 },
  h2: { variant: fadeInUp, delay: 0.1 },
  h3: { variant: fadeInUp, delay: 0.1 },
  h4: { variant: fadeInUp, delay: 0.1 },
  h5: { variant: fadeInUp, delay: 0.1 },
  h6: { variant: fadeInUp, delay: 0.1 },
  p: { variant: fadeInUp, delay: 0.2 },
  pre: { variant: fadeInLeft, delay: 0.3 },
  blockquote: { variant: fadeInRight, delay: 0.2 },
  ul: { variant: staggerItem, delay: 0.2 },
  ol: { variant: staggerItem, delay: 0.2 },
  li: { variant: fadeInUp, delay: 0.1 },
  table: { variant: scaleIn, delay: 0.3 },
  img: { variant: scaleIn, delay: 0.2 },
  div: { variant: fadeInUp, delay: 0.1 }
};

// Animated wrapper for individual elements
interface AnimatedElementProps {
  children: React.ReactNode;
  elementType: keyof typeof elementAnimations;
  index?: number;
  className?: string;
  [key: string]: any;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  elementType,
  index = 0,
  className = '',
  ...props
}) => {
  const animationConfig = elementAnimations[elementType] || elementAnimations.div;
  const dynamicDelay = animationConfig.delay + (index * 0.05); // Stagger based on index
  
  const { ref, controls } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    delay: dynamicDelay * 1000 // Convert to milliseconds
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationConfig.variant}
      className={className}
      style={{ width: '100%' }}
    >
      {React.createElement(elementType, props, children)}
    </motion.div>
  );
};

// Recursive function to wrap elements with animations
const wrapWithAnimation = (element: React.ReactElement, index: number = 0): React.ReactElement => {
  if (!React.isValidElement(element)) {
    return element;
  }

  const elementType = element.type as string;
  
  // Skip animation for certain elements
  const skipAnimation = [
    'span', 'a', 'strong', 'em', 'code', 'small', 'sub', 'sup', 'br', 'hr'
  ];

  if (skipAnimation.includes(elementType)) {
    return element;
  }

  // Check if element type should be animated
  if (elementAnimations[elementType as keyof typeof elementAnimations]) {
    return (
      <AnimatedElement
        key={`animated-${index}-${elementType}`}
        elementType={elementType as keyof typeof elementAnimations}
        index={index}
        {...element.props}
      >
        {element.props.children}
      </AnimatedElement>
    );
  }

  // If element has children, recursively wrap them
  if (element.props?.children) {
    const animatedChildren = React.Children.map(element.props.children, (child, childIndex) => {
      if (React.isValidElement(child)) {
        return wrapWithAnimation(child, childIndex);
      }
      return child;
    });

    return React.cloneElement(element, {
      ...element.props,
      children: animatedChildren
    });
  }

  return element;
};

// Main MDX wrapper component
export const AnimatedMDX: React.FC<AnimatedMDXProps> = ({ 
  children, 
  className = '' 
}) => {
  const processedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return wrapWithAnimation(child, index);
    }
    return child;
  });

  return (
    <div className={`animated-mdx-wrapper ${className}`}>
      {processedChildren}
    </div>
  );
};

// MDX components with built-in animations
export const mdxComponents = {
  h1: (props: any) => (
    <AnimatedElement elementType="h1" {...props} />
  ),
  h2: (props: any) => (
    <AnimatedElement elementType="h2" {...props} />
  ),
  h3: (props: any) => (
    <AnimatedElement elementType="h3" {...props} />
  ),
  h4: (props: any) => (
    <AnimatedElement elementType="h4" {...props} />
  ),
  h5: (props: any) => (
    <AnimatedElement elementType="h5" {...props} />
  ),
  h6: (props: any) => (
    <AnimatedElement elementType="h6" {...props} />
  ),
  p: (props: any) => (
    <AnimatedElement elementType="p" {...props} />
  ),
  pre: (props: any) => (
    <AnimatedElement elementType="pre" {...props} />
  ),
  blockquote: (props: any) => (
    <AnimatedElement elementType="blockquote" {...props} />
  ),
  ul: (props: any) => (
    <AnimatedElement elementType="ul" {...props} />
  ),
  ol: (props: any) => (
    <AnimatedElement elementType="ol" {...props} />
  ),
  li: (props: any) => (
    <AnimatedElement elementType="li" {...props} />
  ),
  table: (props: any) => (
    <AnimatedElement elementType="table" {...props} />
  ),
  img: (props: any) => (
    <AnimatedElement elementType="img" {...props} />
  ),
};

// Higher-order component for wrapping MDX pages
export const withMDXAnimation = (WrappedComponent: React.ComponentType<any>) => {
  const AnimatedMDXPage = (props: any) => {
    return (
      <AnimatedMDX>
        <WrappedComponent {...props} />
      </AnimatedMDX>
    );
  };

  AnimatedMDXPage.displayName = `withMDXAnimation(${WrappedComponent.displayName || WrappedComponent.name})`;
  return AnimatedMDXPage;
};

export default AnimatedMDX;