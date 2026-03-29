/**
 * PracticeResults Component
 * Displays session summary and results
 * Pure UI component showing game state summary
 */

import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Star, Trophy, ArrowRight } from 'lucide-react';

interface PracticeResultsProps {
  session: ReturnType<typeof import('@/hooks/practice/useGameState').useGameState>;
  lessonId: number;
}

const PracticeResults: React.FC<PracticeResultsProps> = ({ session, lessonId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const summary = session.getSessionSummary();

  const accuracyColor = summary.accuracy >= 80 ? 'text-green-600' : summary.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{t('practice.session-complete')}</h1>
          <p className="text-muted-foreground">{t('practice.great-job')}</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Total Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                {t('exercise.total-score')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{summary.totalScore}</p>
            </CardContent>
          </Card>

          {/* Accuracy */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t('exercise.accuracy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${accuracyColor}`}>{summary.accuracy}%</p>
            </CardContent>
          </Card>

          {/* Best Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                {t('exercise.best-streak')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{summary.bestStreak}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <CardHeader>
            <CardTitle>{t('practice.session-summary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exercises */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t('exercise.exercises-completed')}</span>
                <span className="text-sm text-muted-foreground">
                  {summary.correctAnswers} / {summary.totalExercises}
                </span>
              </div>
              <Progress value={(summary.correctAnswers / summary.totalExercises) * 100} />
            </div>

            {/* Average Time */}
            <div>
              <span className="text-sm font-medium">{t('exercise.average-time')}</span>
              <p className="text-lg text-muted-foreground">{(summary.averageTimeMs / 1000).toFixed(1)}s</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: '/courses/$courseId',
                params: { courseId: '' },
              })
            }
            className="flex-1"
          >
            {t('action.back')}
          </Button>
          <Button onClick={() => window.location.reload()} className="flex-1 gap-2">
            {t('practice.practice-again')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Encouragement Message */}
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          {summary.accuracy >= 80 ? (
            <>
              <p className="font-semibold text-primary">{t('practice.excellent-performance')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('practice.keep-practicing')}</p>
            </>
          ) : summary.accuracy >= 60 ? (
            <>
              <p className="font-semibold text-primary">{t('practice.good-performance')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('practice.try-again-improve')}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-primary">{t('practice.room-for-improvement')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('practice.review-words-try-again')}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeResults;
