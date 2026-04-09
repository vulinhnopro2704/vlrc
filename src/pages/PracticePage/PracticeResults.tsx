/**
 * PracticeResults Component
 * Displays session summary and results
 * Pure UI component showing game state summary
 */

import Icons from '@/components/Icons';
import { useTranslation } from 'react-i18next';

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
    <div className='flex min-h-screen items-center justify-center bg-background p-3 sm:p-4'>
      <div className='w-full max-w-2xl space-y-4 sm:space-y-6'>
        {/* Header */}
        <div className='space-y-2 text-center sm:space-y-3'>
          <div className='flex justify-center mb-4'>
            <Icons.Trophy className='h-12 w-12 animate-bounce text-yellow-500 sm:h-16 sm:w-16' />
          </div>
          <h1 className='text-2xl font-bold text-foreground sm:text-4xl'>
            {t('practice_session_complete')}
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base'>{t('practice_great_job')}</p>
        </div>

        {/* Main Stats Cards */}
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4'>
          {/* Total Score */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Icons.Star className='w-4 h-4 text-yellow-500' />
                {t('exercise_total_score')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-foreground sm:text-3xl'>{summary.totalScore}</p>
            </CardContent>
          </Card>

          {/* Accuracy */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium'>{t('exercise_accuracy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold sm:text-3xl ${accuracyColor}`}>
                {summary.accuracy}%
              </p>
            </CardContent>
          </Card>

          {/* Best Streak */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Icons.Flame className='w-4 h-4 text-orange-500' />
                {t('exercise_best_streak')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-orange-600 sm:text-3xl'>{summary.bestStreak}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <CardHeader>
            <CardTitle>{t('practice_session_summary')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Exercises */}
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm font-medium'>{t('exercise_exercises_completed')}</span>
                <span className='text-sm text-muted-foreground'>
                  {summary.correctAnswers} / {summary.totalExercises}
                </span>
              </div>
              <Progress
                value={
                  summary.totalExercises > 0
                    ? (summary.correctAnswers / summary.totalExercises) * 100
                    : 0
                }
              />
            </div>

            {/* Average Time */}
            <div>
              <span className='text-sm font-medium'>{t('exercise_average_time')}</span>
              <p className='text-lg text-muted-foreground'>
                {(summary.averageTimeMs / 1000).toFixed(1)}s
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reviewed Words Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t('practice_reviewed_words_details')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {reviewItems.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                {t('practice_no_reviewed_words_details')}
              </p>
            ) : (
              reviewItems.map(item => (
                <div key={item.wordId} className='rounded-lg border p-3 space-y-2'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-semibold text-foreground'>{item.word}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.isCorrect
                          ? 'bg-green-500/15 text-green-700'
                          : 'bg-red-500/15 text-red-700'
                      }`}>
                      {item.isCorrect ? t('exercise_correct') : t('exercise_wrong')}
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-foreground'>
                      {t('practice_meaning_vi_label')}:
                    </span>{' '}
                    {item.meaningVi}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-foreground'>
                      {t('practice_attempts_label')}:
                    </span>{' '}
                    {item.attempts}
                  </p>
                  {item.example ? (
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium text-foreground'>
                        {t('practice_example_label')}:
                      </span>{' '}
                      {item.example}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex justify-center gap-3'>
          <Button
            variant='outline'
            onClick={() => navigate({ to: '/dashboard' })}
            className='h-10 w-full max-w-xs'>
            {t('action_back')}
          </Button>
        </div>

        {/* Encouragement Message */}
        <div className='text-center p-4 bg-primary/10 rounded-lg'>
          {summary.accuracy >= 80 ? (
            <>
              <p className='font-semibold text-primary'>{t('practice_excellent_performance')}</p>
              <p className='text-sm text-muted-foreground mt-1'>{t('practice_keep_practicing')}</p>
            </>
          ) : summary.accuracy >= 60 ? (
            <>
              <p className='font-semibold text-primary'>{t('practice_good_performance')}</p>
              <p className='text-sm text-muted-foreground mt-1'>
                {t('practice_try_again_improve')}
              </p>
            </>
          ) : (
            <>
              <p className='font-semibold text-primary'>{t('practice_room_for_improvement')}</p>
              <p className='text-sm text-muted-foreground mt-1'>
                {t('practice_review_words_try_again')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeResults;
