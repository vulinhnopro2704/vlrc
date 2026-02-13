'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icons from '@/components/Icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Lesson {
  id: string;
  title: string;
  wordCount: number;
  completed: boolean;
}

interface CourseGridProps {
  course: {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
  } | null;
  onSelectLesson: (lesson: Lesson) => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ course, onSelectLesson }) => {
  const { t } = useTranslation();
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gridRef.current?.querySelectorAll('.lesson-card');
    cards?.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
      );
    });
  }, { scope: gridRef });

  if (!course) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Icons.bookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('learning_select_course')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {course.lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card group cursor-pointer"
            onClick={() => onSelectLesson(lesson)}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 glass-card border-primary/20 hover:border-primary/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Icons.brain className="h-4 w-4" />
                    {lesson.wordCount} words
                  </p>
                </div>
                {lesson.completed && (
                  <Icons.checkCircle2 className="h-6 w-6 text-primary" />
                )}
              </div>

              <div className="mb-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: lesson.completed ? '100%' : '0%' }}
                  />
                </div>
              </div>

              <Button
                size="sm"
                className="w-full rounded-lg gap-2"
                variant={lesson.completed ? 'outline' : 'default'}
              >
                <Icons.play className="h-4 w-4" />
                {lesson.completed ? t('learning_continue') : 'Start'}
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
