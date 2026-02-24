'use client';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AppLayout, AppSidebar } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icons from '@/components/Icons';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Mock data - replace with API call
const mockCourses: LearningManagement.Course[] = [
  {
    id: 1,
    title: 'Daily Vocabulary',
    description: 'Build your vocabulary with 50 essential words per day',
    icon: '📘',
    progress: 65,
    lessons: []
  },
  {
    id: 2,
    title: 'Business English',
    description: 'Professional vocabulary for workplace communication',
    icon: '💼',
    progress: 40,
    lessons: []
  }
];

const CoursesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = pageRef.current?.querySelectorAll('.course-card');
    cards?.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
      );
    });
  }, { scope: pageRef });

  const sidebarLinks = [
    { label: t('learning_my_courses'), href: '/courses', icon: <Icons.BookOpen className="h-4 w-4" /> },
    { label: t('learning_dashboard'), href: '/dashboard', icon: <Icons.BarChart3 className="h-4 w-4" /> }
  ];

  return (
    <AppLayout>
      <div ref={pageRef} className="flex h-screen bg-background">
        <AppSidebar links={sidebarLinks} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{t('learning_courses')}</h1>
            <p className="text-muted-foreground mb-8">{t('learning_select_course')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <Card className="glass-card h-full flex flex-col cursor-pointer hover:shadow-lg hover:glow-primary transition-all duration-300 hover:border-primary/50 overflow-hidden">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-4xl mb-4">{course.icon}</div>
                      <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                      <p className="text-sm text-muted-foreground flex-1">{course.description}</p>
                      <div className="mt-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-semibold">{t('learning_progress')}</span>
                          <span className="text-xs font-semibold text-primary">{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-primary/20">
                      <Button
                        className="w-full"
                        onClick={() => navigate({ to: `/courses/${course.id}` })}
                      >
                        {course.progress > 0 ? t('learning_continue') : t('learning_start_course')}
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default CoursesPage;
