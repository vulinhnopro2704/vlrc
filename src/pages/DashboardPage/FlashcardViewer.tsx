'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icons from '@/components/Icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const currentWord = words[currentIndex];

  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, rotateY: -90 },
        { opacity: 1, rotateY: 0, duration: 0.6, ease: 'back.out' }
      );
    }
  }, [currentIndex]);

  const handleFlip = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: isFlipped ? 0 : 180,
        duration: 0.6,
        ease: 'back.inOut'
      });
      setIsFlipped(!isFlipped);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
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

      <div ref={cardRef} className="perspective">
        <Card
          onClick={handleFlip}
          className="p-12 min-h-80 flex flex-col items-center justify-center cursor-pointer glass-card border-primary/30 hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:glow-primary"
        >
          <div className="text-center">
            {!isFlipped ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('learning_pronunciation')}</p>
                  <p className="text-3xl font-bold text-primary mb-4">{currentWord.word}</p>
                  <p className="text-lg text-accent font-medium italic">/{currentWord.pronunciation}/</p>
                </div>
                <p className="text-muted-foreground">{t('learning_flip_to_reveal')}</p>
              </div>
            ) : (
              <div className="space-y-4 text-left w-full">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Meaning:</p>
                  <p className="text-xl font-semibold">{currentWord.meaning}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('learning_example')}:</p>
                  <p className="text-base italic">{currentWord.example}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {currentWord.level}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded-lg"
        >
          <Icons.chevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex gap-2">
          <Button variant="ghost" className="flex-1 rounded-lg">
            <Icons.undo2 className="h-4 w-4 mr-2" />
            Forgot
          </Button>
          <Button variant="ghost" className="flex-1 rounded-lg">
            <Icons.clock className="h-4 w-4 mr-2" />
            Hard
          </Button>
          <Button variant="default" className="flex-1 rounded-lg">
            <Icons.checkCircle2 className="h-4 w-4 mr-2" />
            Good
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          className="rounded-lg"
        >
          <Icons.chevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
