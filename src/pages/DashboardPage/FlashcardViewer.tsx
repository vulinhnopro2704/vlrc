'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlipCard } from '@/components/FlipCard';
import Icons from '@/components/Icons';

interface Word {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  level: string;
}

interface FlashcardViewerProps {
  words: Word[];
  lessonTitle: string;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ words, lessonTitle }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentWord = words[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">{t('learning_select_lesson')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{lessonTitle}</h2>
        <p className="text-muted-foreground">{currentIndex + 1} / {words.length}</p>
      </div>

      <FlipCard.Root
        flipOnHover
        flipOnClick
        direction="horizontal"
        animation={{ duration: 700, easing: 'ease' }}
        className="flex justify-center"
      >
        <FlipCard.Front className="bg-gradient-to-br from-primary/90 to-primary/70 dark:from-primary/80 dark:to-primary/60 rounded-xl p-12 min-h-80 flex flex-col items-center justify-center border border-primary/40">
          <div className="text-center space-y-6">
            <div>
              <p className="text-sm text-primary-foreground/80 mb-2">{t('learning_pronunciation')}</p>
              <p className="text-4xl font-bold text-primary-foreground mb-4">{currentWord.word}</p>
              <p className="text-lg text-primary-foreground/90 font-medium italic">/{currentWord.pronunciation}/</p>
            </div>
            <p className="text-primary-foreground/70 text-sm">{t('learning_flip_to_reveal')}</p>
          </div>
        </FlipCard.Front>

        <FlipCard.Back className="bg-gradient-to-br from-accent/90 to-accent/70 dark:from-accent/80 dark:to-accent/60 rounded-xl p-12 min-h-80 flex flex-col items-center justify-center border border-accent/40">
          <div className="space-y-6 text-left w-full">
            <div>
              <p className="text-sm text-accent-foreground/80 mb-2">Meaning:</p>
              <p className="text-2xl font-semibold text-accent-foreground">{currentWord.meaning}</p>
            </div>
            <div>
              <p className="text-sm text-accent-foreground/80 mb-2">{t('learning_example')}:</p>
              <p className="text-base italic text-accent-foreground/90">{currentWord.example}</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs px-3 py-1 rounded-full bg-accent-foreground/20 text-accent-foreground font-semibold">
                {currentWord.level}
              </span>
            </div>
          </div>
        </FlipCard.Back>
      </FlipCard.Root>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded-lg"
        >
          <Icons.ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex gap-2">
          <Button variant="ghost" className="flex-1 rounded-lg">
            <Icons.Undo2 className="h-4 w-4 mr-2" />
            Forgot
          </Button>
          <Button variant="ghost" className="flex-1 rounded-lg">
            <Icons.Clock className="h-4 w-4 mr-2" />
            Hard
          </Button>
          <Button variant="default" className="flex-1 rounded-lg">
            <Icons.CheckCircle2 className="h-4 w-4 mr-2" />
            Good
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          className="rounded-lg"
        >
          <Icons.ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
