/**
 * PracticeResults Component
 * Displays session summary and results
 * Pure UI component showing game state summary
 */


interface PracticeReviewDetailItem {
  wordId: App.ID;
  word: string;
  meaningVi: string;
  example: string;
  isCorrect: boolean;
  attempts: number;
}

const PracticeResults = ({
  session,
  reviewItems
}: {
  session: ReturnType<typeof import('@/hooks/practice/useGameState').useGameState>;
  reviewItems: PracticeReviewDetailItem[];
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const summary = session.getSessionSummary();

  const accuracyColor =
    summary.accuracy >= 80
      ? 'text-green-600'
      : summary.accuracy >= 60
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div className='flex h-screen items-center justify-center bg-background p-3 sm:p-4 overflow-hidden'>
      <div className='w-full max-w-xl flex flex-col max-h-full space-y-3'>
        {/* Header */}
        <div className='space-y-1 text-center flex-shrink-0'>
          <div className='flex justify-center mb-1'>
            <Icons.Trophy className='h-10 w-10 animate-bounce text-yellow-500 sm:h-12 sm:w-12' />
          </div>
          <h1 className='text-lg font-bold text-foreground sm:text-xl'>
            {t('practice_session_complete')}
          </h1>
          <p className='text-xs text-muted-foreground'>{t('practice_great_job')}</p>
        </div>

        {/* Main Stats Cards */}
        <div className='grid grid-cols-3 gap-2 flex-shrink-0'>
          {/* Total Score */}
          <Card>
            <CardContent className='p-2.5 text-center'>
              <div className='flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground mb-0.5'>
                <Icons.Star className='w-3 h-3 text-yellow-500' />
                {t('exercise_total_score')}
              </div>
              <p className='text-lg font-bold text-foreground'>{summary.totalScore}</p>
            </CardContent>
          </Card>

          {/* Accuracy */}
          <Card>
            <CardContent className='p-2.5 text-center'>
              <div className='text-[11px] font-medium text-muted-foreground mb-0.5'>
                {t('exercise_accuracy')}
              </div>
              <p className={`text-lg font-bold ${accuracyColor}`}>
                {summary.accuracy}%
              </p>
            </CardContent>
          </Card>

          {/* Best Streak */}
          <Card>
            <CardContent className='p-2.5 text-center'>
              <div className='flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground mb-0.5'>
                <Icons.Flame className='w-3 h-3 text-orange-500' />
                {t('exercise_best_streak')}
              </div>
              <p className='text-lg font-bold text-orange-600'>{summary.bestStreak}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <CardContent className='p-3 space-y-2.5 flex-shrink-0'>
            <div className='flex items-center justify-between text-xs font-semibold border-b pb-1.5'>
              <span>{t('practice_session_summary')}</span>
            </div>
            {/* Exercises */}
            <div className='space-y-1'>
              <div className='flex justify-between text-[11px]'>
                <span className='font-medium text-muted-foreground'>{t('exercise_exercises_completed')}</span>
                <span className='font-semibold text-foreground'>
                  {summary.correctAnswers} / {summary.totalExercises}
                </span>
              </div>
              <Progress
                className='h-1.5'
                value={
                  summary.totalExercises > 0
                    ? (summary.correctAnswers / summary.totalExercises) * 100
                    : 0
                }
              />
            </div>

            {/* Average Time */}
            <div className='flex items-center justify-between text-[11px]'>
              <span className='font-medium text-muted-foreground'>{t('exercise_average_time')}</span>
              <span className='font-semibold text-foreground'>
                {(summary.averageTimeMs / 1000).toFixed(1)}s
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reviewed Words Details */}
        <Card className='flex flex-col min-h-0 flex-1 overflow-hidden'>
          <CardHeader className='py-2 px-3 flex-shrink-0'>
            <CardTitle className='text-xs font-semibold'>{t('practice_reviewed_words_details')}</CardTitle>
          </CardHeader>
          <CardContent className='flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-0'>
            {reviewItems.length === 0 ? (
              <p className='text-xs text-muted-foreground'>
                {t('practice_no_reviewed_words_details')}
              </p>
            ) : (
              reviewItems.map(item => (
                <div key={item.wordId} className='rounded-lg border p-2 space-y-1 text-xs'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-semibold text-foreground text-sm'>{item.word}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        item.isCorrect
                          ? 'bg-green-500/15 text-green-700'
                          : 'bg-red-500/15 text-red-700'
                      }`}>
                      {item.isCorrect ? t('exercise_correct') : t('exercise_wrong')}
                    </span>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    <span className='font-medium text-foreground'>
                      {t('practice_meaning_vi_label')}:
                    </span>{' '}
                    {item.meaningVi}
                  </p>
                  <p className='text-[11px] text-muted-foreground'>
                    <span className='font-medium text-foreground'>
                      {t('practice_attempts_label')}:
                    </span>{' '}
                    {item.attempts}
                  </p>
                  {item.example ? (
                    <p className='text-[11px] text-muted-foreground italic'>
                      <span className='font-medium text-foreground not-italic'>
                        {t('practice_example_label')}:
                      </span>{' '}
                      "{item.example}"
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Encouragement Message */}
        <div className='text-center p-2 bg-primary/5 border rounded-lg text-[11px] leading-relaxed flex-shrink-0'>
          {summary.accuracy >= 80 ? (
            <p className='font-medium text-primary'>
              {t('practice_excellent_performance')} • <span className='text-muted-foreground'>{t('practice_keep_practicing')}</span>
            </p>
          ) : summary.accuracy >= 60 ? (
            <p className='font-medium text-primary'>
              {t('practice_good_performance')} • <span className='text-muted-foreground'>{t('practice_try_again_improve')}</span>
            </p>
          ) : (
            <p className='font-medium text-primary'>
              {t('practice_room_for_improvement')} • <span className='text-muted-foreground'>{t('practice_review_words_try_again')}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className='flex justify-center flex-shrink-0'>
          <Button
            variant='outline'
            onClick={() => navigate({ to: '/dashboard' })}
            className='h-9 w-full max-w-xs text-xs font-semibold'>
            {t('action_back')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeResults;
