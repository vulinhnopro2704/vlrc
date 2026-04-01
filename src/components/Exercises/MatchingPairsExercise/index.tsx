/**
 * MatchingPairsExercise Component
 * UI-only: Match words with their meanings
 * All logic delegated to practice library helpers
 */

import { useMemo, useState, useRef } from 'react';
import { useUpdateEffect } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { shuffleArray } from '@/lib/practice/exerciseCommon';

interface MatchingPairsExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
  words?: LearningManagement.Word[];
}

interface PairMatch {
  id: string;
  word: string;
  meaning: string;
}

const createPairs = (
  vocabulary: LearningManagement.Word,
  words: LearningManagement.Word[]
): PairMatch[] => {
  const correctPair = {
    id: String(vocabulary.id),
    word: vocabulary.word,
    meaning: vocabulary.meaning
  };

  const distractors = words
    .filter(w => w.id !== vocabulary.id)
    .slice(0, 2)
    .map(w => ({
      id: String(w.id),
      word: w.word,
      meaning: w.meaning
    }));

  return shuffleArray([correctPair, ...distractors]);
};

export const MatchingPairsExercise: React.FC<MatchingPairsExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false,
  words = []
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const startTimeRef = useRef(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const wordsSignature = useMemo(() => words.map(word => String(word.id)).join('|'), [words]);
  const [pairs, setPairs] = useState<PairMatch[]>(() => createPairs(vocabulary, words));

  useUpdateEffect(() => {
    setPairs(createPairs(vocabulary, words));
    setMatches(new Map());
    setSelectedWordId(null);
    setAttempts(0);
    startTimeRef.current = Date.now();
  }, [vocabulary.id, wordsSignature]);

  const wordsList = pairs.map(p => ({ id: p.id, word: p.word }));
  const meaningsList = pairs.map(p => ({ id: p.id, meaning: p.meaning }));

  const handleWordSelect = (wordId: string) => {
    setSelectedWordId(prev => (prev === wordId ? null : wordId));
  };

  const handleMeaningSelect = (meaningId: string) => {
    if (!selectedWordId) return;

    const newMatches = new Map(matches);
    newMatches.set(selectedWordId, meaningId);
    setMatches(newMatches);
    setSelectedWordId(null);
  };

  const handleClear = () => {
    setMatches(new Map());
    setSelectedWordId(null);
  };

  const handleSubmit = async () => {
    if (disabled || matches.size === 0) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    // Check if all matches are correct
    let allCorrect = true;
    for (const [wordId, meaningId] of matches) {
      if (wordId !== meaningId) {
        allCorrect = false;
        break;
      }
    }

    const isCorrect = allCorrect && matches.size === pairs.length;

    await triggerFeedbackAnimation(isCorrect);

    const timeSpent = Date.now() - startTimeRef.current;
    onExerciseComplete?.({
      wordId: vocabulary.id,
      exerciseType: 'matching-pairs',
      isCorrect,
      timeSpentMs: timeSpent,
      attempts: nextAttempts,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div ref={containerRef} className='flex flex-col gap-6 p-6 bg-card rounded-lg border'>
      <div className='text-center'>
        <p className='text-sm text-muted-foreground'>{t('exercise_match_words_meanings')}</p>
      </div>

      {/* Two Columns Layout */}
      <div className='grid grid-cols-2 gap-4'>
        {/* Words Column */}
        <div className='space-y-2'>
          <p className='text-sm font-semibold text-foreground mb-3'>{t('exercise_words')}</p>
          {wordsList.map(item => {
            const isSelected = selectedWordId === item.id;
            const isMatched = matches.has(item.id);
            return (
              <button
                key={`word-${item.id}`}
                onClick={() => handleWordSelect(item.id)}
                disabled={disabled || isMatched}
                className={`
                  w-full p-3 rounded-lg text-sm font-medium text-left transition-all
                  ${
                    isMatched
                      ? 'bg-green-500/20 text-green-700 border border-green-500'
                      : isSelected
                        ? 'bg-blue-500/20 text-blue-700 border-2 border-blue-500'
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-secondary'
                  }
                  ${disabled && !isMatched ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                {item.word}
              </button>
            );
          })}
        </div>

        {/* Meanings Column */}
        <div className='space-y-2'>
          <p className='text-sm font-semibold text-foreground mb-3'>{t('exercise_meanings')}</p>
          {meaningsList.map(item => {
            const matchedWord = Array.from(matches.entries()).find(([, meaningId]) => meaningId === item.id)?.[0];
            const isSelectable = selectedWordId !== null;
            return (
              <button
                key={`meaning-${item.id}`}
                onClick={() => handleMeaningSelect(item.id)}
                disabled={disabled || !!matchedWord || !isSelectable}
                className={`
                  w-full p-3 rounded-lg text-sm text-left transition-all line-clamp-2
                  ${
                    matchedWord
                      ? 'bg-green-500/20 text-green-700 border border-green-500'
                      : isSelectable && selectedWordId
                        ? 'bg-blue-500/10 text-foreground border border-blue-300 hover:bg-blue-500/20 cursor-pointer'
                        : 'bg-secondary text-secondary-foreground border border-secondary'
                  }
                  ${disabled || (!isSelectable && !matchedWord) ? 'opacity-50 cursor-not-allowed' : ''}
                `}>
                {item.meaning}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matched Pairs Display */}
      {matches.size > 0 && (
        <div className='space-y-2'>
          <p className='text-xs text-muted-foreground'>
            {t('exercise_matched')} ({matches.size})
          </p>
          {Array.from(matches.entries()).map(([wordId, meaningId]) => {
            const wordItem = pairs.find(p => p.id === wordId);
            const meaningItem = pairs.find(p => p.id === meaningId);
            return (
            <div
              key={`matched-${wordId}-${meaningId}`}
              className='flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30'>
              <span className='flex-1 text-sm font-medium'>{wordItem?.word ?? '-'}</span>
              <span className='text-green-600'>→</span>
              <span className='flex-1 text-sm text-right'>{meaningItem?.meaning ?? '-'}</span>
            </div>
          );
          })}
        </div>
      )}

      {/* Actions */}
      <div className='flex gap-3 justify-center'>
        <Button variant='outline' onClick={handleClear} disabled={disabled || matches.size === 0}>
          {t('action_clear')}
        </Button>
        <Button onClick={handleSubmit} disabled={disabled || matches.size === 0} data-exercise-submit='true'>
          {t('action_check')} ({matches.size}/{pairs.length})
        </Button>
      </div>
    </div>
  );
};

export default MatchingPairsExercise;
