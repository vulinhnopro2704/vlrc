import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, BookOpen, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Review {
  nameKey: string;
  roleKey: string;
  contentKey: string;
  rating: number;
}

export const TestimonialsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const reviews: Review[] = [
    { nameKey: 'review1_name', roleKey: 'review1_role', contentKey: 'review1_content', rating: 5 },
    { nameKey: 'review2_name', roleKey: 'review2_role', contentKey: 'review2_content', rating: 5 },
    { nameKey: 'review3_name', roleKey: 'review3_role', contentKey: 'review3_content', rating: 5 }
  ];

  useGSAP(() => {
    const reviewCards = reviewsRef.current?.querySelectorAll('.review-card');
    if (reviewCards) {
      gsap.fromTo(reviewCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: reviewsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    const statItems = statsRef.current?.querySelectorAll('.stat-item');
    if (statItems) {
      gsap.fromTo(statItems,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-secondary/30 py-20 lg:py-28 dark:bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('testimonials_title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('testimonials_subtitle')}
          </p>
        </div>

        <div ref={statsRef} className="mx-auto mb-16 max-w-3xl">
          <div className="grid grid-cols-3 gap-8">
            <StatItem icon={Users} value="10,000+" label={t('users')} />
            <StatItem icon={BookOpen} value="2M+" label={t('words_learned_stat')} />
            <StatItem icon={Award} value="98%" label={t('satisfaction')} />
          </div>
        </div>

        <div ref={reviewsRef} className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) => (
  <div className="stat-item text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div className="text-3xl font-bold text-foreground">{value}</div>
    <div className="text-muted-foreground">{label}</div>
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => {
  const { t } = useTranslation();
  const name = t(review.nameKey);
  
  return (
    <Card className="review-card border-0 shadow-lg dark:bg-card/60 dark:backdrop-blur-md dark:border dark:border-white/10">
      <CardContent className="p-6">
        <div className="mb-4 flex gap-1">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
          ))}
        </div>
        <p className="mb-4 text-muted-foreground leading-relaxed">
          {`"${t(review.contentKey)}"`}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary/20">
            {name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-foreground">{name}</div>
            <div className="text-sm text-muted-foreground">{t(review.roleKey)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsSection;
