'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icons from '@/components/Icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Course {
  id: string;
  title: string;
  progress: number;
  icon?: string;
}

interface SidebarProps {
  courses: Course[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ courses, selectedCourse, onSelectCourse }) => {
  const { t } = useTranslation();
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = sidebarRef.current?.querySelectorAll('.course-item');
    items?.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, delay: index * 0.1 }
      );
    });
  }, { scope: sidebarRef });

  return (
    <div
      ref={sidebarRef}
      className="w-64 bg-card border-r border-border rounded-2xl h-screen sticky top-0 overflow-hidden flex flex-col glass-card"
    >
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Icons.bookOpen className="h-5 w-5 text-primary" />
          {t('learning_my_courses')}
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {courses.map((course, index) => (
            <div key={course.id} className="course-item">
              <Button
                variant={selectedCourse?.id === course.id ? 'default' : 'ghost'}
                className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl transition-all duration-300"
                onClick={() => onSelectCourse(course)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">{course.title}</p>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{course.progress}%</p>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button className="w-full rounded-lg gap-2" variant="outline">
          <Icons.plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>
    </div>
  );
};
