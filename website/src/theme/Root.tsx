import React, { useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import Root from '@theme-original/Root';

// Mermaid configuration factory
const createMermaidConfig = (theme: 'light' | 'dark') => ({
  startOnLoad: false,
  theme: theme === 'dark' ? 'dark' : 'base',
  themeVariables: theme === 'light' ? {
    // Light theme with transparent backgrounds
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
    // Node colors
    c0: 'rgba(74, 95, 255, 0.1)',
    c1: 'rgba(41, 181, 232, 0.1)',
    c2: 'rgba(108, 92, 231, 0.1)',
    c3: 'rgba(16, 185, 129, 0.1)',
    c4: 'rgba(245, 158, 11, 0.1)',
    c5: 'rgba(239, 68, 68, 0.1)',
    c6: 'rgba(168, 85, 247, 0.1)',
    c7: 'rgba(6, 182, 212, 0.1)',
    // Actor styling for sequence diagrams
    actor0: 'rgba(74, 95, 255, 0.1)',
    actor1: 'rgba(41, 181, 232, 0.1)',
    actor2: 'rgba(108, 92, 231, 0.1)',
    actor3: 'rgba(16, 185, 129, 0.1)',
    actorBorder0: '#4a5fff',
    actorBorder1: '#29b5e8',
    actorBorder2: '#6c5ce7',
    actorBorder3: '#10b981',
    actorTextColor: '#1f2937',
    actorLineColor: '#6b7280',
    signalColor: '#6b7280',
    signalTextColor: '#1f2937',
    labelBoxBkgColor: 'rgba(229, 231, 235, 0.1)',
    labelBoxBorderColor: '#4a5fff',
    labelTextColor: '#1f2937',
    loopTextColor: '#1f2937',
    noteBorderColor: '#4a5fff',
    noteBkgColor: 'rgba(74, 95, 255, 0.1)',
    noteTextColor: '#1f2937',
    activationBorderColor: '#29b5e8',
    activationBkgColor: 'rgba(41, 181, 232, 0.1)',
    // Flowchart styling
    edgeLabelBackground: 'transparent',
    // Gantt chart styling
    section0: 'rgba(74, 95, 255, 0.2)',
    section1: 'rgba(41, 181, 232, 0.2)',
    section2: 'rgba(108, 92, 231, 0.2)',
    section3: 'rgba(16, 185, 129, 0.2)',
    altSection0: 'rgba(74, 95, 255, 0.1)',
    altSection1: 'rgba(41, 181, 232, 0.1)',
    altSection2: 'rgba(108, 92, 231, 0.1)',
    altSection3: 'rgba(16, 185, 129, 0.1)',
    gridColor: 'rgba(107, 114, 128, 0.2)',
    taskBkgColor: 'rgba(74, 95, 255, 0.1)',
    taskTextColor: '#1f2937',
    taskTextLightColor: '#1f2937',
    taskTextOutsideColor: '#1f2937',
    taskTextClickableColor: '#4a5fff',
    activeTaskBkgColor: 'rgba(74, 95, 255, 0.2)',
    activeTaskBorderColor: '#4a5fff',
    doneTaskBkgColor: 'rgba(16, 185, 129, 0.2)',
    doneTaskBorderColor: '#10b981',
    critBkgColor: 'rgba(239, 68, 68, 0.2)',
    critBorderColor: '#ef4444',
    todayLineColor: '#29b5e8',
  } : {
    // Dark theme with transparent backgrounds
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
    // Node colors
    c0: 'rgba(106, 127, 255, 0.2)',
    c1: 'rgba(71, 193, 237, 0.2)',
    c2: 'rgba(162, 155, 254, 0.2)',
    c3: 'rgba(52, 211, 153, 0.2)',
    c4: 'rgba(251, 191, 36, 0.2)',
    c5: 'rgba(248, 113, 113, 0.2)',
    c6: 'rgba(196, 181, 253, 0.2)',
    c7: 'rgba(103, 232, 249, 0.2)',
    // Actor styling for sequence diagrams
    actor0: 'rgba(106, 127, 255, 0.2)',
    actor1: 'rgba(71, 193, 237, 0.2)',
    actor2: 'rgba(162, 155, 254, 0.2)',
    actor3: 'rgba(52, 211, 153, 0.2)',
    actorBorder0: '#6a7fff',
    actorBorder1: '#47c1ed',
    actorBorder2: '#a29bfe',
    actorBorder3: '#34d399',
    actorTextColor: '#f9fafb',
    actorLineColor: '#9ca3af',
    signalColor: '#9ca3af',
    signalTextColor: '#f9fafb',
    labelBoxBkgColor: 'rgba(75, 85, 99, 0.1)',
    labelBoxBorderColor: '#6a7fff',
    labelTextColor: '#f9fafb',
    loopTextColor: '#f9fafb',
    noteBorderColor: '#6a7fff',
    noteBkgColor: 'rgba(106, 127, 255, 0.1)',
    noteTextColor: '#f9fafb',
    activationBorderColor: '#47c1ed',
    activationBkgColor: 'rgba(71, 193, 237, 0.1)',
    // Flowchart styling
    edgeLabelBackground: 'transparent',
    // Gantt chart styling
    section0: 'rgba(106, 127, 255, 0.3)',
    section1: 'rgba(71, 193, 237, 0.3)',
    section2: 'rgba(162, 155, 254, 0.3)',
    section3: 'rgba(52, 211, 153, 0.3)',
    altSection0: 'rgba(106, 127, 255, 0.2)',
    altSection1: 'rgba(71, 193, 237, 0.2)',
    altSection2: 'rgba(162, 155, 254, 0.2)',
    altSection3: 'rgba(52, 211, 153, 0.2)',
    gridColor: 'rgba(156, 163, 175, 0.2)',
    taskBkgColor: 'rgba(106, 127, 255, 0.2)',
    taskTextColor: '#f9fafb',
    taskTextLightColor: '#f9fafb',
    taskTextOutsideColor: '#f9fafb',
    taskTextClickableColor: '#6a7fff',
    activeTaskBkgColor: 'rgba(106, 127, 255, 0.3)',
    activeTaskBorderColor: '#6a7fff',
    doneTaskBkgColor: 'rgba(52, 211, 153, 0.3)',
    doneTaskBorderColor: '#34d399',
    critBkgColor: 'rgba(248, 113, 113, 0.3)',
    critBorderColor: '#f87171',
    todayLineColor: '#47c1ed',
  },
  fontFamily: 'Mona Sans, system-ui, -apple-system, sans-serif',
  fontSize: 14,
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: true,
    diagramPadding: 8,
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
    mirrorActors: true,
    bottomMarginAdj: 1,
    useMaxWidth: true,
    rightAngles: false,
    showSequenceNumbers: false,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    fontFamily: 'Mona Sans, system-ui, sans-serif',
    fontSize: 11,
    sectionFontSize: 11,
    numberSectionStyles: 4,
    gridLineStartPadding: 350,
    todayMarker: 'stroke-width:2px,stroke:#29b5e8,opacity:0.8',
  },
  journey: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    leftMargin: 150,
    width: 150,
    height: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    bottomMarginAdj: 1,
  },
  gitGraph: {
    diagramPadding: 8,
    nodeLabel: {
      width: 75,
      height: 100,
      x: -25,
      y: -8,
    },
  },
  c4: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    c4ShapeMargin: 50,
    c4ShapePadding: 20,
    width: 216,
    height: 60,
    boxMargin: 10,
    useMaxWidth: true,
  },
  securityLevel: 'loose',
  wrap: true,
  maxTextSize: 50000,
  maxEdges: 500,
});

const MermaidThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorMode } = useColorMode();

  useEffect(() => {
    let mermaidModule: any = null;

    const initializeMermaid = async () => {
      try {
        // Only load mermaid on client side
        if (typeof window !== 'undefined') {
          mermaidModule = (await import('mermaid')).default;
          
          // Initialize with current theme
          const config = createMermaidConfig(colorMode as 'light' | 'dark');
          mermaidModule.initialize(config);

          // Force re-render of existing diagrams when theme changes
          const existingDiagrams = document.querySelectorAll('.mermaid svg');
          if (existingDiagrams.length > 0) {
            // Trigger re-render by dispatching a custom event
            window.dispatchEvent(new CustomEvent('mermaid-theme-change', { 
              detail: { theme: colorMode } 
            }));
          }
        }
      } catch (error) {
        console.warn('Failed to initialize Mermaid:', error);
      }
    };

    initializeMermaid();
  }, [colorMode]);

  // Add global styles for mermaid diagrams
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = `
      .mermaid {
        background: transparent !important;
      }
      .mermaid svg {
        background: transparent !important;
        background-color: transparent !important;
      }
      .mermaid .node rect,
      .mermaid .node circle,
      .mermaid .node ellipse,
      .mermaid .node polygon {
        fill: ${colorMode === 'dark' ? 'rgba(106, 127, 255, 0.2)' : 'rgba(74, 95, 255, 0.1)'} !important;
        stroke: ${colorMode === 'dark' ? '#6a7fff' : '#4a5fff'} !important;
      }
      .mermaid text {
        fill: ${colorMode === 'dark' ? '#f9fafb' : '#1f2937'} !important;
        font-family: 'Mona Sans', system-ui, sans-serif !important;
      }
      .mermaid .edgePath path {
        stroke: ${colorMode === 'dark' ? '#9ca3af' : '#6b7280'} !important;
      }
      .mermaid .cluster rect {
        fill: ${colorMode === 'dark' ? 'rgba(106, 127, 255, 0.1)' : 'rgba(74, 95, 255, 0.05)'} !important;
        stroke: ${colorMode === 'dark' ? 'rgba(106, 127, 255, 0.4)' : 'rgba(74, 95, 255, 0.3)'} !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [colorMode]);

  return <>{children}</>;
};

export default function RootWrapper(props: any): JSX.Element {
  return (
    <Root {...props}>
      <MermaidThemeProvider>
        {props.children}
      </MermaidThemeProvider>
    </Root>
  );
}