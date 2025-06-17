// Aceternity UI Components for OVH Snowflake Terraform Provider Documentation
// State-of-the-art UI components with purpose-driven design

// 3D Card Components
export {
  CardContainer,
  CardBody,
  CardItem,
  useMouseEnter,
} from './3d-card';

// Background Effects
export {
  BackgroundBeams,
  HeroBackgroundBeams,
  DocsBackgroundBeams,
  InteractiveBackgroundBeams,
} from './background-beams';

// Tooltip Components
export {
  AnimatedTooltip,
  SimpleTooltip,
  DocTooltip,
  FeatureTooltip,
} from './animated-tooltip';

// Grid Layouts
export {
  BentoGrid,
  BentoGridItem,
  DocsBentoGrid,
  FeatureBentoItem,
  QuickStartBentoItem,
  APIDocsBentoItem,
  ExampleBentoItem,
  AnimatedBentoGrid,
} from './bento-grid';

// Text Animation Effects
export {
  TextGenerateEffect,
  CodeGenerateEffect,
  HeadingGenerateEffect,
  InteractiveTextGenerate,
  DocTextGenerate,
} from './text-generate-effect';

// Enhanced Documentation Components
export {
  DocsHero,
  CodeExample,
  FeatureShowcase,
  QuickStart,
  APIReference,
  AnimatedBreadcrumbs,
  SectionDivider,
  DocSearch,
  StatusBadge,
} from './enhanced-docs';

// Component Type Exports
export type {
  BackgroundBeamsProps,
  AnimatedTooltipProps,
  SimpleTooltipProps,
  DocTooltipProps,
  FeatureTooltipProps,
  BentoGridProps,
  BentoGridItemProps,
  TextGenerateEffectProps,
  DocsHeroProps,
  CodeExampleProps,
  FeatureShowcaseProps,
  QuickStartProps,
  APIReferenceProps,
  BreadcrumbItem,
  AnimatedBreadcrumbsProps,
  SectionDividerProps,
  DocSearchProps,
  StatusBadgeProps,
} from './enhanced-docs';

// Utility exports for consistent usage
export const AceternityComponents = {
  // Layout Components
  DocsHero,
  FeatureShowcase,
  QuickStart,
  SectionDivider,
  
  // Interactive Components
  CodeExample,
  APIReference,
  DocSearch,
  
  // Grid Systems
  BentoGrid,
  AnimatedBentoGrid,
  FeatureBentoItem,
  
  // Visual Effects
  BackgroundBeams,
  HeroBackgroundBeams,
  DocsBackgroundBeams,
  
  // Text Effects
  TextGenerateEffect,
  HeadingGenerateEffect,
  DocTextGenerate,
  
  // Navigation
  AnimatedBreadcrumbs,
  StatusBadge,
  
  // Tooltips
  SimpleTooltip,
  DocTooltip,
  FeatureTooltip,
  
  // 3D Effects
  CardContainer,
  CardBody,
  CardItem,
} as const;

// Pre-configured component sets for common use cases
export const DocumentationComponents = {
  Hero: DocsHero,
  Features: FeatureShowcase,
  QuickStart: QuickStart,
  CodeExample: CodeExample,
  APIReference: APIReference,
  Search: DocSearch,
  StatusBadge: StatusBadge,
  Breadcrumbs: AnimatedBreadcrumbs,
  SectionDivider: SectionDivider,
} as const;

export const InteractiveComponents = {
  Card3D: {
    Container: CardContainer,
    Body: CardBody,
    Item: CardItem,
  },
  Grid: {
    Bento: BentoGrid,
    Animated: AnimatedBentoGrid,
    Feature: FeatureBentoItem,
  },
  Tooltips: {
    Simple: SimpleTooltip,
    Doc: DocTooltip,
    Feature: FeatureTooltip,
  },
  Text: {
    Generate: TextGenerateEffect,
    Heading: HeadingGenerateEffect,
    Doc: DocTextGenerate,
    Code: CodeGenerateEffect,
  },
  Backgrounds: {
    Beams: BackgroundBeams,
    Hero: HeroBackgroundBeams,
    Docs: DocsBackgroundBeams,
    Interactive: InteractiveBackgroundBeams,
  },
} as const;

// Default export for convenient importing
export default AceternityComponents;