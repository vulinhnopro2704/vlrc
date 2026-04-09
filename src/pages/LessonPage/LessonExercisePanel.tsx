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
    <div className='flex flex-1 items-center justify-center'>
      <div className='w-full'>
        <div className='mb-3 grid grid-cols-1 gap-1.5 text-xs sm:mb-4 sm:flex sm:items-center sm:justify-between sm:text-sm'>
          <span className='inline-flex w-fit rounded-full bg-primary/10 px-2 py-1 text-muted-foreground'>
            {t('lesson_progress_word', {
              current: currentIndex + 1,
              total: totalWords
            })}
          </span>
          <span className='inline-flex w-fit rounded-full bg-accent/10 px-2 py-1 text-muted-foreground sm:ml-auto'>
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
