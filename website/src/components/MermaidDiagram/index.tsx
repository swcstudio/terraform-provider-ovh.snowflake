import React, { useEffect, useRef, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'motion/react';
import { useScrollAnimation, fadeInUp } from '../../hooks/useScrollAnimation';
import { cn } from '../../lib/utils';

interface MermaidDiagramProps {
  children: string;
  className?: string;
  title?: string;
  id?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  children,
  className = '',
  title,
  id
}) => {
  const { colorMode } = useColorMode();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const { ref: animationRef, controls } = useScrollAnimation({ threshold: 0.3 });
  const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  // Mermaid configuration based on theme
  const getMermaidConfig = (theme: 'light' | 'dark') => {
    const baseConfig = {
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'base',
      themeVariables: {},
      fontFamily: 'Mona Sans, system-ui, sans-serif',
      fontSize: 14,
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
      },
      gantt: {
        gridLineStartPadding: 350,
        fontSize: 11,
        sectionFontSize: 11,
        numberSectionStyles: 4,
      },
    };

    if (theme === 'light') {
      baseConfig.themeVariables = {
        primaryColor: '#29b5e8',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#4a5fff',
        lineColor: '#6b7280',
        secondaryColor: '#e5e7eb',
        tertiaryColor: '#f3f4f6',
        background: 'transparent',
        mainBkg: 'transparent',
        secondBkg: 'rgba(229, 231, 235, 0.1)',
        tertiaryBkg: 'rgba(243, 244, 246, 0.1)',
        nodeBorder: '#4a5fff',
        clusterBkg: 'rgba(74, 95, 255, 0.1)',
        clusterBorder: '#4a5fff',
        textColor: '#1f2937',
        labelTextColor: '#1f2937',
        gridColor: 'rgba(107, 114, 128, 0.2)',
        c0: 'rgba(74, 95, 255, 0.1)',
        c1: 'rgba(41, 181, 232, 0.1)',
        c2: 'rgba(108, 92, 231, 0.1)',
        c3: 'rgba(16, 185, 129, 0.1)',
        // Actor colors for sequence diagrams
        actor0: 'rgba(74, 95, 255, 0.1)',
        actor1: 'rgba(41, 181, 232, 0.1)',
        actor2: 'rgba(108, 92, 231, 0.1)',
        actor3: 'rgba(16, 185, 129, 0.1)',
        actorBorder0: '#4a5fff',
        actorBorder1: '#29b5e8',
        actorBorder2: '#6c5ce7',
        actorBorder3: '#10b981',
      };
    } else {
      baseConfig.themeVariables = {
        primaryColor: '#47c1ed',
        primaryTextColor: '#f9fafb',
        primaryBorderColor: '#6a7fff',
        lineColor: '#9ca3af',
        secondaryColor: '#4b5563',
        tertiaryColor: '#374151',
        background: 'transparent',
        mainBkg: 'transparent',
        secondBkg: 'rgba(75, 85, 99, 0.1)',
        tertiaryBkg: 'rgba(55, 65, 81, 0.1)',
        nodeBorder: '#6a7fff',
        clusterBkg: 'rgba(106, 127, 255, 0.1)',
        clusterBorder: '#6a7fff',
        textColor: '#f9fafb',
        labelTextColor: '#f9fafb',
        gridColor: 'rgba(156, 163, 175, 0.2)',
        c0: 'rgba(106, 127, 255, 0.2)',
        c1: 'rgba(71, 193, 237, 0.2)',
        c2: 'rgba(162, 155, 254, 0.2)',
        c3: 'rgba(52, 211, 153, 0.2)',
        // Actor colors for sequence diagrams
        actor0: 'rgba(106, 127, 255, 0.2)',
        actor1: 'rgba(71, 193, 237, 0.2)',
        actor2: 'rgba(162, 155, 254, 0.2)',
        actor3: 'rgba(52, 211, 153, 0.2)',
        actorBorder0: '#6a7fff',
        actorBorder1: '#47c1ed',
        actorBorder2: '#a29bfe',
        actorBorder3: '#34d399',
      };
    }

    return baseConfig;
  };

  const renderMermaid = async () => {
    if (!mermaidRef.current || !children) return;

    try {
      setError(null);
      
      // Dynamically import mermaid to avoid SSR issues
      const mermaid = (await import('mermaid')).default;
      
      // Initialize mermaid with current theme
      const config = getMermaidConfig(colorMode as 'light' | 'dark');
      mermaid.initialize(config);

      // Clear previous content
      mermaidRef.current.innerHTML = '';

      // Render the diagram
      const { svg } = await mermaid.render(diagramId, children.trim());
      
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;
        
        // Ensure transparent backgrounds
        const svgElement = mermaidRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.background = 'transparent';
          svgElement.style.backgroundColor = 'transparent';
          
          // Add loaded class for animation
          setTimeout(() => {
            mermaidRef.current?.classList.add('loaded');
            setIsLoaded(true);
          }, 100);
        }
      }
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      setError(err instanceof Error ? err.message : 'Failed to render diagram');
    }
  };

  // Re-render when theme changes or content changes
  useEffect(() => {
    setIsLoaded(false);
    renderMermaid();
  }, [colorMode, children]);

  // Handle intersection observer for animations
  useEffect(() => {
    const currentRef = animationRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          renderMermaid();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [animationRef, isLoaded]);

  if (error) {
    return (
      <motion.div
        ref={animationRef}
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className={cn(
          "mermaid-error p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-700",
          className
        )}
      >
        <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Diagram Error</span>
        </div>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
        <details className="mt-2">
          <summary className="text-sm cursor-pointer text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
            Show diagram source
          </summary>
          <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs overflow-x-auto">
            <code>{children}</code>
          </pre>
        </details>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={animationRef}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className={cn("mermaid-wrapper", className)}
    >
      {title && (
        <h4 className="text-lg font-semibold mb-3 text-center text-gray-800 dark:text-gray-200">
          {title}
        </h4>
      )}
      
      <div
        ref={mermaidRef}
        className={cn(
          "mermaid",
          !isLoaded && "opacity-0",
          isLoaded && "loaded"
        )}
        style={{
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isLoaded ? 'auto' : '200px',
        }}
      >
        {!isLoaded && !error && (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
            <span>Loading diagram...</span>
          </div>
        )}
      </div>
      
      {title && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
          {title}
        </p>
      )}
    </motion.div>
  );
};

export default MermaidDiagram;