import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  questionKey: string;
  answerKey: string;
}

export const FAQSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const questions: FAQItem[] = [
    { questionKey: 'faq1_question', answerKey: 'faq1_answer' },
    { questionKey: 'faq2_question', answerKey: 'faq2_answer' },
    { questionKey: 'faq3_question', answerKey: 'faq3_answer' },
    { questionKey: 'faq4_question', answerKey: 'faq4_answer' }
  ];

  useGSAP(() => {
    gsap.fromTo(accordionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('faq_title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('faq_subtitle')}
          </p>
        </div>

        <div ref={accordionRef} className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {questions.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border-0 bg-card px-6 shadow-md dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  {t(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {t(item.answerKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
