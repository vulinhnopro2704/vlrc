'use client';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from '@tanstack/react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AppLayout, AppSidebar } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icons from '@/components/Icons';

gsap.registerPlugin(useGSAP);

// Mock data - replace with API call
const mockCourses: Record<number, LearningManagement.Course> = {
  1: {
    id: 1,
    title: 'Daily Vocabulary',
    description: 'Build your vocabulary with 50 essential words per day',
    icon: '📘',
    progress: 65,
    lessons: [
      { id: 101, title: 'Common Verbs', wordCount: 20, completed: true, words: [] },
      { id: 102, title: 'Advanced Adjectives', wordCount: 25, completed: false, words: [] }
    ]
  },
  2: {
    id: 2,
    title: 'Business English',
    description: 'Professional vocabulary for workplace communication',
    icon: '💼',
    progress: 40,
    lessons: [
      { id: 201, title: 'Meeting Vocabulary', wordCount: 30, completed: false, words: [] }
    ]
  }
};

const CourseDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courseId } = useParams({ from: '/courses/$courseId' });
  const pageRef = useRef<HTMLDivElement>(null);

  const course = mockCourses[parseInt(courseId)];
  const lessons = course?.lessons ?? [];

  useGSAP(() => {
    const items = pageRef.current?.querySelectorAll('.lesson-item');
    items?.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, delay: index * 0.1 }
      );
    });
  }, { scope: pageRef });

  const sidebarLinks = [
    { label: t('learning_my_courses'), href: '/courses', icon: <Icons.BookOpen className="h-4 w-4" /> },
    { label: t('learning_dashboard'), href: '/dashboard', icon: <Icons.BarChart3 className="h-4 w-4" /> }
  ];

  if (!course) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">{t('learning_select_course')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div ref={pageRef} className="flex h-screen bg-background">
        <AppSidebar links={sidebarLinks} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => navigate({ to: '/courses' })}
            >
              <Icons.ChevronLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>

            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">{course.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">{t('learning_completion')}</span>
                    <span className="text-sm font-semibold text-primary">{course.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-primary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {lessons.length} {t('learning_lessons')}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">{t('learning_lessons')}</h2>

            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-item">
                  <Card className="glass-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{lesson.title}</h3>
                          {lesson.completed && (
                            <Icons.CheckCircle2 className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lesson.wordCount} {t('learning_vocabulary')}
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          navigate({
                            to: '/lessons/$lessonId',
                            params: { lessonId: String(lesson.id) },
                          })
                        }
                        className="group-hover:shadow-lg"
                      >
                        Study
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

export default CourseDetailPage;
