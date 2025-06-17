import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

export interface ScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  delay?: number;
}

export interface AnimationVariants {
  hidden: Record<string, string | number | boolean>;
  visible: Record<string, string | number | boolean>;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px 0px -100px 0px',
    delay = 0
  } = options;

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: rootMargin as any,
    amount: threshold
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, delay]);

  return {
    ref,
    isInView: hasAnimated,
    controls: hasAnimated ? 'visible' : 'hidden'
  };
};

// Common animation variants
export const fadeInUp: AnimationVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const fadeInLeft: AnimationVariants = {
  hidden: {
    opacity: 0,
    x: -40,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const fadeInRight: AnimationVariants = {
  hidden: {
    opacity: 0,
    x: 40,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const scaleIn: AnimationVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: AnimationVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Utility hook for staggered animations
export const useStaggeredAnimation = (itemCount: number, options: ScrollAnimationOptions = {}) => {
  const { ref, isInView, controls } = useScrollAnimation(options);
  
  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  return {
    ref,
    isInView,
    controls,
    containerVariants: staggerVariants,
    itemVariants: staggerItem
  };
};