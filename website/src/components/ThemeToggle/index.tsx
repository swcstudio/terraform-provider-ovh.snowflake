import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'motion/react';
import styles from './styles.module.css';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      fill="currentColor"
    />
  </svg>
);

interface ThemeToggleProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'medium' 
}) => {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const toggleTheme = () => {
    setColorMode(isDark ? 'light' : 'dark');
  };

  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  };

  return (
    <motion.button
      className={`${styles.themeToggle} ${sizeClasses[size]} ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <motion.div
        className={styles.iconWrapper}
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 1 : 1
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <motion.div
          className={styles.iconContainer}
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <SunIcon className={styles.icon} />
        </motion.div>
        
        <motion.div
          className={`${styles.iconContainer} ${styles.moonContainer}`}
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <MoonIcon className={styles.icon} />
        </motion.div>
      </motion.div>
      
      <span className={styles.label}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;