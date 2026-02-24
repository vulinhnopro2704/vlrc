import { useState, useCallback, useEffect } from 'react';

interface ProgressMetrics {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  reviewingWords: number;
  masteryPercentage: number;
}

export const useVocabularyProgress = (lessonId?: number) => {
  const [progress, setProgress] = useState<Map<number, LearningManagement.VocabularyProgress>>(new Map());
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    totalWords: 0,
    masteredWords: 0,
    learningWords: 0,
    reviewingWords: 0,
    masteryPercentage: 0
  });

  const recordActivity = useCallback((activity: LearningManagement.ActivityResult) => {
    setProgress(prev => {
      const updated = new Map(prev);
      const wordId = activity.wordId;
      
      const current = updated.get(wordId) || {
        wordId,
        reviewCount: 0,
        correctCount: 0,
        proficiencyLevel: 1,
        masteryScore: 0
      } as LearningManagement.VocabularyProgress;

      current.reviewCount += 1;
      if (activity.isCorrect) {
        current.correctCount += 1;
      }
      
      // Calculate proficiency level (1-5 scale)
      const correctRate = current.correctCount / current.reviewCount;
      current.proficiencyLevel = Math.ceil(correctRate * 5);
      
      // Calculate mastery score (0-100)
      current.masteryScore = Math.min(100, (correctRate * 80) + (current.reviewCount * 2));
      current.lastReviewedAt = activity.timestamp;
      
      // Set next review time (spaced repetition)
      const daysUntilReview = Math.max(1, 7 - Math.floor(current.masteryScore / 20));
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + daysUntilReview);
      current.nextReviewAt = nextReview.toISOString();

      updated.set(wordId, current);
      return updated;
    });
  }, []);

  const getProgressForWord = useCallback((wordId: number): LearningManagement.VocabularyProgress | null => {
    return progress.get(wordId) ?? null;
  }, [progress]);

  const updateMetrics = useCallback((totalWords: number) => {
    const progressArray = Array.from(progress.values());
    
    const masteredWords = progressArray.filter(p => p.masteryScore >= 80).length;
    const learningWords = progressArray.filter(p => p.masteryScore >= 40 && p.masteryScore < 80).length;
    const reviewingWords = progressArray.filter(p => p.masteryScore < 40).length;

    setMetrics({
      totalWords,
      masteredWords,
      learningWords,
      reviewingWords,
      masteryPercentage: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0
    });
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress(new Map());
    setMetrics({
      totalWords: 0,
      masteredWords: 0,
      learningWords: 0,
      reviewingWords: 0,
      masteryPercentage: 0
    });
  }, []);

  return {
    progress,
    metrics,
    recordActivity,
    getProgressForWord,
    updateMetrics,
    resetProgress
  };
};
