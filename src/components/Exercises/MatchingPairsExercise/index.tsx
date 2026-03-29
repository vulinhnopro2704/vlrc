/**
 * MatchingPairsExercise Component
 * UI-only: Match words with their meanings
 * All logic delegated to utilities
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAnimationTriggers } from '@/hooks/practice/useAnimationTriggers';
import { checkAnswer } from '@/utilities/practice/exerciseHandlers';
import { shuffleArray } from '@/utilities/practice/exerciseCommon';

interface MatchingPairsExerciseProps extends LearningManagement.ActivityCardProps {
  exerciseData?: Practice.ExerciseVariant;
  onExerciseComplete?: (result: Practice.ExerciseResult) => void;
  words?: LearningManagement.Word[];
}

interface PairMatch {
  word: string;
  meaning: string;
}

export const MatchingPairsExercise: React.FC<MatchingPairsExerciseProps> = ({
  vocabulary,
  onExerciseComplete,
  disabled = false,
  exerciseData,
  words = [],
}) => {
  const { t } = useTranslation();
  const { containerRef, triggerFeedbackAnimation } = useAnimationTriggers();
  const startTimeRef = useRef(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Generate pairs from current word + some distractors
  const pairs: PairMatch[] = useMemo(() => {
    const correctPair = { word: vocabulary.word, meaning: vocabulary.meaning };

    // Get some distractors from other words
    const distractors = words
      .filter((w) => w.id !== vocabulary.id)
      .slice(0, 2)
      .map((w) => ({
        word: w.word,
        meaning: w.meaning,
      }));

    return shuffleArray([correctPair, ...distractors]);
  }, [vocabulary, words]);

  const wordsList = shuffleArray(pairs.map((p) => p.word));
  const meaningsList = pairs.map((p) => p.meaning);

  const handleWordSelect = useCallback((word: string) => {
    setSelectedWord((prev) => (prev === word ? null : word));
  }, []);

  const handleMeaningSelect = useCallback(
    (meaning: string) => {
      if (!selectedWord) return;

      const newMatches = new Map(matches);
      newMatches.set(selectedWord, meaning);
      setMatches(newMatches);
      setSelectedWord(null);
    },
    [selectedWord, matches]
  );

  const handleClear = useCallback(() => {
    setMatches(new Map());
    setSelectedWord(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (disabled || matches.size === 0) return;

    setAttempts((prev) => prev + 1);

    // Check if all matches are correct
    let allCorrect = true;
    for (const [word, meaning] of matches) {
      const pair = pairs.find((p) => p.word === word);
      if (!pair || pair.meaning !== meaning) {
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
      attempts,
      timestamp: new Date().toISOString(),
    });
  }, [disabled, matches, pairs, triggerFeedbackAnimation, attempts, onExerciseComplete]);

  return (
    <div ref={containerRef} className="flex flex-col gap-6 p-6 bg-card rounded-lg border">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{t('exercise.match-words-meanings')}</p>
      </div>

      {/* Two Columns Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Words Column */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground mb-3">{t('exercise.words')}</p>
          {wordsList.map((word) => {
            const isSelected = selectedWord === word;
            const isMatched = matches.has(word);
            return (
              <button
                key={word}
                onClick={() => handleWordSelect(word)}
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
                `}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* Meanings Column */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground mb-3">{t('exercise.meanings')}</p>
          {meaningsList.map((meaning) => {
            const matchedWord = Array.from(matches.entries()).find(([, m]) => m === meaning)?.[0];
            const isSelectable = selectedWord !== null;
            return (
              <button
                key={meaning}
                onClick={() => handleMeaningSelect(meaning)}
                disabled={disabled || !!matchedWord || !isSelectable}
                className={`
                  w-full p-3 rounded-lg text-sm text-left transition-all line-clamp-2
                  ${
                    matchedWord
                      ? 'bg-green-500/20 text-green-700 border border-green-500'
                      : isSelectable && selectedWord
                        ? 'bg-blue-500/10 text-foreground border border-blue-300 hover:bg-blue-500/20 cursor-pointer'
                        : 'bg-secondary text-secondary-foreground border border-secondary'
                  }
                  ${disabled || (!isSelectable && !matchedWord) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {meaning}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matched Pairs Display */}
      {matches.size > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t('exercise.matched')} ({matches.size})</p>
          {Array.from(matches.entries()).map(([word, meaning]) => (
            <div key={word} className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
              <span className="flex-1 text-sm font-medium">{word}</span>
              <span className="text-green-600">→</span>
              <span className="flex-1 text-sm text-right">{meaning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={handleClear} disabled={disabled || matches.size === 0}>
          {t('action.clear')}
        </Button>
        <Button onClick={handleSubmit} disabled={disabled || matches.size === 0}>
          {t('action.check')} ({matches.size}/{pairs.length})
        </Button>
      </div>
    </div>
  );
};

export default MatchingPairsExercise;
