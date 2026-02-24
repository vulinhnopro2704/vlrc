'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import Icons from '@/components/Icons';

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface AppSidebarProps {
  links?: NavLink[];
  isLessonMode?: boolean;
  courseName?: string;
  lessonName?: string;
  onBackToCourse?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  links = [],
  isLessonMode = false,
  courseName,
  lessonName,
  onBackToCourse
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`glass-card h-screen border-r border-primary/20 transition-all duration-300 overflow-y-auto ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <div className="p-4 flex justify-between items-center border-b border-primary/20">
        {!isCollapsed && <h2 className="font-semibold text-sm">{t('learning_dashboard')}</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          <Icons.ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-2">
        {/* Lesson Mode Header */}
        {isLessonMode && (
          <div className="mb-6">
            {!isCollapsed && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                  onClick={onBackToCourse}
                >
                  <Icons.ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
                <div className="px-3 py-2 rounded bg-primary/10 border border-primary/20">
                  <p className="text-xs font-semibold text-primary">{courseName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lessonName}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Links */}
        {links.map((link, idx) => (
          <Button
            key={idx}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate({ to: link.href })}
          >
            {link.icon && <span className="mr-2">{link.icon}</span>}
            {!isCollapsed && <span className="text-sm">{link.label}</span>}
          </Button>
        ))}
      </nav>
    </aside>
  );
};
