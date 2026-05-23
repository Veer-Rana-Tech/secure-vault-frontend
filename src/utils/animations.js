/**
 * Reusable animation variants for Framer Motion
 * Optimized for performance and consistency across the application
 */

// Fade animations
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

// Slide animations
export const slideInFromLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

export const slideInFromRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

export const slideInFromTopVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

// Scale animations
export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

// Stagger animations
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }
};

// Hover animations
export const cardHoverVariants = {
  initial: {
    y: 0,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  },
  hover: {
    y: -8,
    boxShadow: '0 25px 50px rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

// Button animations
export const buttonHoverVariants = {
  hover: {
    y: -2,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
  },
  tap: {
    scale: 0.97,
    y: 0
  }
};

// Floating animations
export const floatingVariants = (duration = 4) => ({
  animate: {
    y: [0, -20, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
});

// Pulse animations
export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Rotate animations
export const rotateVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Shimmer/gradient animations
export const gradientShimmerVariants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Page transition animations
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

// Viewport-based animations (for scroll-triggered animations)
export const viewportAnimationConfig = {
  once: true,
  margin: '0px 0px -100px 0px'
};
