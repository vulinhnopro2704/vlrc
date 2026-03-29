import { ExerciseManager } from '@/components/Exercises';

const LessonExercisePanel = ({
  currentIndex,
  currentExerciseTypeIndex,
  totalExerciseTypes,
  currentWord,
  lessonWords,
  exerciseType,
  onComplete
}: {
  currentIndex: number;
  currentExerciseTypeIndex: number;
  totalExerciseTypes: number;
  currentWord: LearningManagement.Word;
  lessonWords: LearningManagement.Word[];
  exerciseType: LearningManagement.ActivityType;
  onComplete: (result: LearningManagement.ActivityResult) => void;
}) => {
  const { t } = useTranslation();
  const totalWords = size(lessonWords);

  return (
    <div className='flex-1 flex items-center justify-center'>
      <div className='w-full'>
        <div className='mb-4 flex items-center justify-between text-sm'>
          <span className='text-muted-foreground'>
            {t('lesson_progress_word', {
              current: currentIndex + 1,
              total: totalWords
            })}
          </span>
          <span className='text-muted-foreground'>
            {t('lesson_progress_exercise', {
              current: currentExerciseTypeIndex + 1,
              total: totalExerciseTypes
            })}
          </span>
        </div>
        <ExerciseManager
          vocabulary={currentWord}
          allVocabularies={lessonWords}
          exerciseType={exerciseType}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

export default LessonExercisePanel;
