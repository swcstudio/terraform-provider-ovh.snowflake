import React from 'react';
import { motion } from 'motion/react';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer, AnimationVariants, ScrollAnimationOptions } from '../../hooks/useScrollAnimation';

export interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'stagger' | AnimationVariants;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

const animationVariants = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  stagger: staggerContainer
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeInUp',
  className = '',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  as: Component = 'div',
  style = {},
  ...props
}) => {
  const scrollOptions: ScrollAnimationOptions = {
    threshold,
    triggerOnce,
    delay
  };

  const { ref, controls } = useScrollAnimation(scrollOptions);

  // Get animation variants
  let variants: AnimationVariants;
  if (typeof animation === 'string') {
    variants = animationVariants[animation];
  } else {
    variants = animation;
  }

  // Override duration if provided
  if (duration !== 0.6) {
    variants = {
      ...variants,
      hidden: {
        ...variants.hidden,
        transition: {
          ...variants.hidden.transition,
          duration
        }
      },
      visible: {
        ...variants.visible,
        transition: {
          ...variants.visible.transition,
          duration
        }
      }
    };
  }

  return (
    <motion.div
      ref={ref}
      as={Component}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Specific animated components for common use cases
export const AnimatedHeading: React.FC<AnimatedSectionProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }> = ({
  level = 2,
  ...props
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  return <AnimatedSection as={HeadingTag} animation="fadeInUp" {...props} />;
};

export const AnimatedParagraph: React.FC<AnimatedSectionProps> = (props) => {
  return <AnimatedSection as="p" animation="fadeInUp" delay={0.1} {...props} />;
};

export const AnimatedCard: React.FC<AnimatedSectionProps> = ({ className = '', ...props }) => {
  return (
    <AnimatedSection
      animation="scaleIn"
      className={`card ${className}`}
      {...props}
    />
  );
};

export const AnimatedCodeBlock: React.FC<AnimatedSectionProps> = ({ className = '', ...props }) => {
  return (
    <AnimatedSection
      animation="fadeInLeft"
      className={`code-block ${className}`}
      delay={0.2}
      {...props}
    />
  );
};

export const AnimatedList: React.FC<AnimatedSectionProps & { ordered?: boolean }> = ({
  ordered = false,
  ...props
}) => {
  const ListTag = ordered ? 'ol' : 'ul';
  return <AnimatedSection as={ListTag} animation="stagger" {...props} />;
};

export const AnimatedListItem: React.FC<AnimatedSectionProps> = (props) => {
  return <AnimatedSection as="li" animation="fadeInUp" {...props} />;
};

// Higher-order component for wrapping existing components with animations
export const withAnimation = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  animationProps: Partial<AnimatedSectionProps> = {}
) => {
  const AnimatedComponent = React.forwardRef<any, P & Partial<AnimatedSectionProps>>((props, ref) => {
    const { animation, delay, duration, threshold, triggerOnce, ...componentProps } = props;
    
    return (
      <AnimatedSection
        animation={animation || animationProps.animation}
        delay={delay || animationProps.delay}
        duration={duration || animationProps.duration}
        threshold={threshold || animationProps.threshold}
        triggerOnce={triggerOnce ?? animationProps.triggerOnce}
      >
        <WrappedComponent ref={ref} {...(componentProps as P)} />
      </AnimatedSection>
    );
  });

  AnimatedComponent.displayName = `withAnimation(${WrappedComponent.displayName || WrappedComponent.name})`;
  return AnimatedComponent;
};

export default AnimatedSection;