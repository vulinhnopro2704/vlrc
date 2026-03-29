'use client';

import FlipCardExercise from './FlipCardExercise';
import ListenAndFillExercise from './ListenAndFillExercise';
import FillBlankExercise from './FillBlankExercise';
import MeaningLookupExercise from './MeaningLookupExercise';
import ScrambledWordExercise from './ScrambledWordExercise';
import SpeedChallengeExercise from './SpeedChallengeExercise';
import WordPuzzleExercise from './WordPuzzleExercise';
import MatchingPairsExercise from './MatchingPairsExercise';
import StreakChallengeExercise from './StreakChallengeExercise';

type ExerciseType = LearningManagement.ActivityType | Practice.PracticeActivityType;

interface ExerciseManagerProps {
  vocabulary: LearningManagement.Word;
  allVocabularies?: LearningManagement.Word[];
  activityType?: ExerciseType;
  exerciseType?: ExerciseType;
  onComplete?: (result: LearningManagement.ActivityResult | Practice.ExerciseResult) => void;
  disabled?: boolean;
  words?: LearningManagement.Word[];
  currentStreak?: number;
}

export default function ExerciseManager({
  vocabulary,
  allVocabularies = [],
  activityType,
  exerciseType,
  onComplete,
  disabled = false,
  words = [],
  currentStreak = 0,
}: ExerciseManagerProps) {
  // Support both exerciseType and activityType for backward compatibility
  const type = (activityType || exerciseType) as ExerciseType;

  switch (type) {
    // Existing exercises
    case 'flip':
      return <FlipCardExercise vocabulary={vocabulary} onComplete={onComplete} disabled={disabled} />;
    case 'listen-fill':
      return <ListenAndFillExercise vocabulary={vocabulary} onComplete={onComplete} disabled={disabled} />;
    case 'fill-blank':
      return <FillBlankExercise vocabulary={vocabulary} onComplete={onComplete} disabled={disabled} />;
    case 'meaning-lookup':
      return (
        <MeaningLookupExercise
          vocabulary={vocabulary}
          allVocabularies={allVocabularies}
          onComplete={onComplete}
          disabled={disabled}
        />
      );

    // New practice exercises
    case 'scrambled-word':
      return <ScrambledWordExercise vocabulary={vocabulary} onExerciseComplete={onComplete} disabled={disabled} />;
    case 'speed-challenge':
      return <SpeedChallengeExercise vocabulary={vocabulary} onExerciseComplete={onComplete} disabled={disabled} />;
    case 'word-puzzle':
      return <WordPuzzleExercise vocabulary={vocabulary} onExerciseComplete={onComplete} disabled={disabled} />;
    case 'matching-pairs':
      return (
        <MatchingPairsExercise
          vocabulary={vocabulary}
          onExerciseComplete={onComplete}
          disabled={disabled}
          words={words || allVocabularies}
        />
      );
    case 'streak-challenge':
      return (
        <StreakChallengeExercise
          vocabulary={vocabulary}
          onExerciseComplete={onComplete}
          disabled={disabled}
          currentStreak={currentStreak}
        />
      );

    default:
      return null;
  }
}
