import { HeroSection } from './HeroSection';
import { ValuePropsSection } from './ValuePropsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ScienceSection } from './ScienceSection';
import { ExperienceSection } from './ExperienceSection';
import { DashboardSection } from './DashboardSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LandingPage = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Smooth scroll animation for sections
      const sections = mainRef.current?.querySelectorAll('section');
      sections?.forEach(section => {
        gsap.fromTo(
          section,
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
    },
    { scope: mainRef }
  );

  return (
    <div ref={mainRef} className='min-h-screen bg-background'>
      <HeroSection />
      <ValuePropsSection />
      <HowItWorksSection />
      <ScienceSection />
      <ExperienceSection />
      <DashboardSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;
