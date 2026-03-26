'use client';

import FlipCardExercise from './FlipCardExercise';
import ListenAndFillExercise from './ListenAndFillExercise';
import FillBlankExercise from './FillBlankExercise';
import MeaningLookupExercise from './MeaningLookupExercise';

export default function ExerciseManager({
  vocabulary,
  allVocabularies,
  exerciseType,
  onComplete
}: {
  vocabulary: LearningManagement.Word;
  allVocabularies: LearningManagement.Word[];
  exerciseType: LearningManagement.ActivityType;
  onComplete?: (result: LearningManagement.ActivityResult) => void;
}) {
  switch (exerciseType) {
    case 'flip':
      return <FlipCardExercise vocabulary={vocabulary} onComplete={onComplete} />;
    case 'listen-fill':
      return <ListenAndFillExercise vocabulary={vocabulary} onComplete={onComplete} />;
    case 'fill-blank':
      return <FillBlankExercise vocabulary={vocabulary} onComplete={onComplete} />;
    case 'meaning-lookup':
      return (
        <MeaningLookupExercise
          vocabulary={vocabulary}
          allVocabularies={allVocabularies}
          onComplete={onComplete}
        />
      );
    default:
      return null;
  }
}
