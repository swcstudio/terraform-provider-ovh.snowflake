import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { useRef } from 'react';
import styles from './index.module.css';

function HomepageBanner() {
  return (
    <motion.div 
      className="banner-placeholder"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <span>🚀 Enterprise-Grade Terraform Provider for Snowflake/OVHcloud Integration</span>
    </motion.div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(titleRef, { 
    once: true, 
    margin: "-50% 0px -50% 0px" // Trigger when title is in center of viewport
  });

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <motion.header 
      className={clsx('hero hero--primary', styles.heroBanner)}
      ref={containerRef}
      style={{ y, opacity }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col col--6">
            <div className={styles.heroContent}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className={styles.spectrumBranding}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                >
                  Spectrum Web Co
                </motion.div>
              </motion.div>
              
              <motion.h1 
                className="hero__title"
                ref={titleRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1,
                  delay: 0.4,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Snowflake/OVHcloud
                </motion.span>
                <br />
                <motion.span 
                  className={styles.heroAccent}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Terraform Provider
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="hero__subtitle"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Enterprise-grade infrastructure as code for Snowflake on OVH Cloud. 
                Built by Web3 cloud-native specialists who believe in accessible, 
                globally distributed cloud infrastructure.
              </motion.p>
              
              <motion.div 
                className={styles.heroButtons}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    className="button button--primary button--lg margin-right--md"
                    to="/docs/intro">
                    Get Started
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    className="button button--secondary button--lg"
                    to="/docs/getting-started/installation">
                    View Installation Guide
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
          <div className="col col--6">
            <motion.div 
              className={styles.heroDiagram}
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.8,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              whileHover={{ 
                scale: 1.02, 
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/img/diagrams/provider-architecture.svg" 
                alt="Snowflake/OVHcloud Provider Architecture"
                className={styles.heroImage}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function WhySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.section 
      className={styles.whySection}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--xl">
              <motion.h2 
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Why We Built This
              </motion.h2>
              <motion.p 
                className={styles.sectionSubtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Breaking the monopoly of basic cloud service providers
              </motion.p>
            </div>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col col--6">
            <motion.div 
              className={styles.whyContent}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.h3
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                The Problem
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                We grew tired of software vendors only supporting basic Cloud Service Providers. 
                As a Web3 cloud-native distributed systems architecture firm, we needed a CSP 
                who believes in this vision.
              </motion.p>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Our Solution
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                We took it upon ourselves to introduce a more accessible CSP: <strong>OVH</strong>. 
                OVH is a globally accessible CSP that is part of the CNCF, and we're striving 
                to create better bridges for CNCF Projects.
              </motion.p>
            </motion.div>
          </div>
          <div className="col col--6">
            <motion.div 
              className={styles.benefitsCard}
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 50, rotateY: -10 }}
              transition={{ duration: 1, delay: 0.8 }}
              whileHover={{ 
                scale: 1.02, 
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
            >
              <h4>Why OVH?</h4>
              <ul className={styles.benefitsList}>
                {[
                  "Competitively priced with transparent billing",
                  "Fantastic billing cycles & generous data removal policies", 
                  "Local expertise for every region",
                  "Most realistic startup programs (US & APAC)",
                  "Flexible compute with annual commitment",
                  "Better than AWS & Azure for aligned startups"
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                    whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  >
                    ✨ {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function WhoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.section 
      className={styles.whoSection}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--xl">
              <motion.h2 
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Who We Are
              </motion.h2>
              <motion.p 
                className={styles.sectionSubtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Spectrum Web Co - Web3 Cloud-Native Specialists
              </motion.p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--8 col--offset-2">
            <motion.div 
              className={styles.whoCard}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 1, delay: 0.6 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <div className={styles.whoContent}>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Spectrum Web Co
                </motion.h3>
                <motion.p 
                  className={styles.whoDescription}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  We're a Software Engineering Firm specializing in <strong>Web3 Cloud-Native 
                  Distributed System architecture</strong>. Our expertise spans the entire 
                  spectrum of modern cloud infrastructure, from container orchestration 
                  to serverless computing.
                </motion.p>
                <div className={styles.credentials}>
                  {[
                    {
                      title: "🏆 OVH US Startup Program",
                      description: "Coveted member of the exclusive US startup program"
                    },
                    {
                      title: "🌏 APAC Partner Program", 
                      description: "Strategic partner in the Asia-Pacific region"
                    },
                    {
                      title: "🤖 AGi Runtime Ecosystem",
                      description: "Creating specialized high-level architecture for next-gen systems"
                    }
                  ].map((credential, index) => (
                    <motion.div 
                      key={index}
                      className={styles.credentialItem}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 1.2 + (index * 0.2) }}
                      whileHover={{ 
                        y: -4, 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <h4>{credential.title}</h4>
                      <p>{credential.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function TechStackSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const techCards = [
    {
      icon: "🏗️",
      title: "Infrastructure as Code",
      description: "Terraform-native provider with comprehensive resource management"
    },
    {
      icon: "🔒", 
      title: "Enterprise Security",
      description: "Multi-factor authentication, encryption, and compliance-ready"
    },
    {
      icon: "⚡",
      title: "High Performance", 
      description: "Optimized API calls, connection pooling, and intelligent caching"
    }
  ];

  return (
    <motion.section 
      className={styles.techSection}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--xl">
              <motion.h2 
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Enterprise-Grade Technology Stack
              </motion.h2>
            </div>
          </div>
        </div>
        <div className="row">
          {techCards.map((card, index) => (
            <div key={index} className="col col--4">
              <motion.div 
                className={styles.techCard}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.4 + (index * 0.2) }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
              >
                <motion.div 
                  className={styles.techIcon}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {card.icon}
                </motion.div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const { scrollYProgress } = useScroll();
  
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Enterprise-grade Terraform Provider for Snowflake/OVHcloud integration. Built by Spectrum Web Co - Web3 cloud-native specialists.">
      
      {/* Scroll progress indicator */}
      <motion.div
        className={styles.scrollProgress}
        style={{ scaleX: scrollYProgress }}
      />
      
      <HomepageBanner />
      <HomepageHeader />
      <main>
        <WhySection />
        <WhoSection />
        <TechStackSection />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}