'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { CourseGrid } from './CourseGrid';
import { FlashcardViewer } from './FlashcardViewer';
import { StatsCard } from './StatsCard';
import { Leaderboard } from './Leaderboard';
import Icons from '@/components/Icons';

interface Word {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  level: string;
}

interface Lesson {
  id: string;
  title: string;
  wordCount: number;
  completed: boolean;
  words: Word[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: Lesson[];
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Daily Vocabulary',
    description: 'Build your vocabulary with 50 essential words per day',
    progress: 65,
    lessons: [
      {
        id: 'l1',
        title: 'Common Verbs',
        wordCount: 20,
        completed: true,
        words: [
          {
            id: 'w1',
            word: 'Perseverance',
            meaning: 'Persistence, perseverance',
            pronunciation: 'pɜːsɪvɪərəns',
            example: 'Her perseverance led to success',
            level: 'B1'
          },
          {
            id: 'w2',
            word: 'Serendipity',
            meaning: 'Finding good things by luck',
            pronunciation: 'serəndɪpɪti',
            example: 'It was serendipity to meet her at the cafe',
            level: 'B2'
          },
          {
            id: 'w3',
            word: 'Eloquent',
            meaning: 'Speaking fluently and persuasively',
            pronunciation: 'eləkwənt',
            example: 'The speaker gave an eloquent speech',
            level: 'B2'
          }
        ]
      },
      {
        id: 'l2',
        title: 'Advanced Adjectives',
        wordCount: 25,
        completed: false,
        words: [
          {
            id: 'w4',
            word: 'Diligent',
            meaning: 'Showing careful effort in work',
            pronunciation: 'dɪlɪdʒənt',
            example: 'The diligent student finished all homework',
            level: 'B1'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Business English',
    description: 'Professional vocabulary for workplace communication',
    progress: 40,
    lessons: [
      {
        id: 'l3',
        title: 'Meeting Vocabulary',
        wordCount: 30,
        completed: false,
        words: []
      }
    ]
  }
];

const mockLeaderboard = [
  { rank: 1, name: 'Nguyen Linh', points: 2850, streak: 45, avatar: '👑' },
  { rank: 2, name: 'Tran Minh', points: 2720, streak: 38, avatar: '🥈' },
  { rank: 3, name: 'Hoang Nam', points: 2650, streak: 42, avatar: '🥉' },
  { rank: 4, name: 'You', points: 1890, streak: 12, avatar: '😊' },
  { rank: 5, name: 'Lan Phuong', points: 1750, streak: 25, avatar: '📚' }
];

const DashboardPage = () => {
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(mockCourses[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(mockCourses[0].lessons[0]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex gap-6 p-6">
        {/* Sidebar */}
        <Sidebar
          courses={mockCourses}
          selectedCourse={selectedCourse}
          onSelectCourse={setSelectedCourse}
        />

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              icon={<Icons.brain className="h-5 w-5" />}
              label={t('learning_memory_strength')}
              value="78"
              unit="%"
              color="primary"
            />
            <StatsCard
              icon={<Icons.flame className="h-5 w-5" />}
              label={t('learning_streak')}
              value="12"
              unit={t('days')}
              color="accent"
            />
            <StatsCard
              icon={<Icons.checkCircle2 className="h-5 w-5" />}
              label="Words Learned"
              value="284"
              color="success"
            />
            <StatsCard
              icon={<Icons.barChart3 className="h-5 w-5" />}
              label={t('learning_today')}
              value="28"
              unit="cards"
              color="primary"
            />
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {selectedLesson ? (
                <FlashcardViewer
                  words={selectedLesson.words}
                  lessonTitle={selectedLesson.title}
                />
              ) : (
                <CourseGrid
                  course={selectedCourse}
                  onSelectLesson={setSelectedLesson}
                />
              )}
            </div>

            {/* Leaderboard */}
            <Leaderboard users={mockLeaderboard} currentUserRank={4} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
