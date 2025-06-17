import React from 'react';
import clsx from 'clsx';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: JSX.Element;
  gradient: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Infrastructure as Code Excellence',
    icon: '🏗️',
    gradient: 'linear-gradient(135deg, #4a5fff, #29b5e8)',
    description: (
      <>
        Complete Terraform provider with comprehensive resource management for Snowflake on OVH. 
        Define your entire data warehouse infrastructure declaratively with enterprise-grade reliability.
      </>
    ),
  },
  {
    title: 'Enterprise Security First',
    icon: '🔒',
    gradient: 'linear-gradient(135deg, #6c5ce7, #74b9ff)',
    description: (
      <>
        Multi-factor authentication, end-to-end encryption, role-based access control, and 
        comprehensive audit logging. Built to meet the most stringent enterprise security requirements.
      </>
    ),
  },
  {
    title: 'CNCF-Aligned Architecture',
    icon: '☁️',
    gradient: 'linear-gradient(135deg, #74b9ff, #29b5e8)',
    description: (
      <>
        Designed for cloud-native environments with Kubernetes integration, service mesh compatibility, 
        and observability standards that align with CNCF ecosystem best practices.
      </>
    ),
  },
  {
    title: 'Global Scale Performance',
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #29b5e8, #00d4aa)',
    description: (
      <>
        Optimized API connections, intelligent caching, connection pooling, and regional failover. 
        Built for global enterprises requiring sub-second response times across all regions.
      </>
    ),
  },
  {
    title: 'Web3 Native Integration',
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    description: (
      <>
        Purpose-built for Web3 and distributed systems with blockchain data ingestion capabilities, 
        decentralized storage integration, and crypto-native data processing workflows.
      </>
    ),
  },
  {
    title: 'Developer Experience Focus',
    icon: '👨‍💻',
    gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)',
    description: (
      <>
        Comprehensive documentation, auto-generated schemas, intelligent error handling, 
        and debugging tools. Built by developers, for developers who demand excellence.
      </>
    ),
  },
];

function Feature({title, icon, description, gradient, index}: FeatureItem & {index: number}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div className={clsx('col col--4', styles.feature)}>
      <motion.div 
        className={styles.featureCard}
        ref={ref}
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2 + (index * 0.2),
          ease: [0.25, 0.4, 0.25, 1]
        }}
        whileHover={{ 
          y: -12, 
          scale: 1.02,
          transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <motion.div 
          className={styles.featureIcon}
          style={{background: gradient}}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: { duration: 0.3 }
          }}
        >
          <motion.span 
            className={styles.iconEmoji}
            whileHover={{ 
              scale: 1.2,
              transition: { duration: 0.2 }
            }}
          >
            {icon}
          </motion.span>
        </motion.div>
        <div className={styles.featureContent}>
          <motion.h3 
            className={styles.featureTitle}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + (index * 0.2) }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className={styles.featureDescription}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + (index * 0.2) }}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const titleRef = useRef(null);
  const ctaRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-20%" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-20%" });

  return (
    <motion.section 
      className={styles.features}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-10%" }}
    >
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--xl">
              <motion.h2 
                className={styles.featuresTitle}
                ref={titleRef}
                initial={{ opacity: 0, y: 40 }}
                animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Enterprise-Grade Features
              </motion.h2>
              <motion.p 
                className={styles.featuresSubtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Built by Spectrum Web Co for modern cloud-native enterprises
              </motion.p>
            </div>
          </div>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} index={idx} />
          ))}
        </div>
        <div className="row margin-top--xl">
          <div className="col col--12">
            <motion.div 
              className={styles.ctaSection}
              ref={ctaRef}
              initial={{ opacity: 0, y: 50 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.div 
                className={styles.ctaContent}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Ready to Get Started?
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  Join forward-thinking enterprises who trust Spectrum Web Co's 
                  infrastructure solutions for their mission-critical data workloads.
                </motion.p>
                <motion.div 
                  className={styles.ctaButtons}
                  initial={{ opacity: 0, y: 20 }}
                  animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <motion.a 
                    href="/docs/getting-started/installation" 
                    className="button button--primary button--lg"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Install Provider
                  </motion.a>
                  <motion.a 
                    href="/docs/resources/overview" 
                    className="button button--secondary button--lg"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Resources
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}