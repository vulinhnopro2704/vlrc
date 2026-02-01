import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { ValuePropsSection } from './ValuePropsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ScienceSection } from './ScienceSection';
import { ExperienceSection } from './ExperienceSection';
import { DashboardSection } from './DashboardSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LandingPage = () => {
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Smooth scroll animation for sections
    const sections = mainRef.current?.querySelectorAll('section');
    sections?.forEach((section) => {
      gsap.fromTo(section,
        { opacity: 0.8 },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 50%',
            scrub: true
          }
        }
      );
    });
  }, { scope: mainRef });

  return (
    <>
      <Header />
      <main ref={mainRef} className="min-h-screen bg-background pt-16">
        <HeroSection />
      <ValuePropsSection />
      <HowItWorksSection />
      <ScienceSection />
      <ExperienceSection />
      <DashboardSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
