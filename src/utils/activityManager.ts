export class ActivityManager {
  private activities: LearningManagement.ActivityResult[] = [];
  private defaultActivityType: LearningManagement.ActivityType;

  constructor(defaultActivityType: LearningManagement.ActivityType = 'flip') {
    this.defaultActivityType = defaultActivityType;
  }

  /**
   * Get the activity type for a word at a given index
   * Cycles through different activity types to provide variety
   */
  getActivityTypeForWord(
    wordIndex: number,
    lessonActivities?: LearningManagement.ActivityType[]
  ): LearningManagement.ActivityType {
    if (lessonActivities && lessonActivities.length > 0) {
      return lessonActivities[wordIndex % lessonActivities.length];
    }

    const activitySequence: LearningManagement.ActivityType[] = [
      this.defaultActivityType,
      'listen-fill',
      'fill-blank',
      'meaning-lookup',
      this.defaultActivityType
    ];

    return activitySequence[wordIndex % activitySequence.length];
  }

  /**
   * Record a learning activity result
   */
  recordActivity(result: LearningManagement.ActivityResult): void {
    this.activities.push({
      ...result,
      timestamp: new Date().toISOString() as LearningManagement.DateTime
    });
  }

  /**
   * Get all activities for a specific word
   */
  getWordActivities(wordId: number): LearningManagement.ActivityResult[] {
    return this.activities.filter(a => a.wordId === wordId);
  }

  /**
   * Calculate success rate for a word
   */
  getWordSuccessRate(wordId: number): number {
    const activities = this.getWordActivities(wordId);
    if (activities.length === 0) return 0;

    const correctCount = activities.filter(a => a.isCorrect).length;
    return Math.round((correctCount / activities.length) * 100);
  }

  /**
   * Get total time spent on a word
   */
  getWordTimeSpent(wordId: number): number {
    return this.getWordActivities(wordId).reduce(
      (total, activity) => total + activity.timeSpent,
      0
    );
  }

  /**
   * Get average attempts per word
   */
  getAverageAttempts(wordId: number): number {
    const activities = this.getWordActivities(wordId);
    if (activities.length === 0) return 0;
    return activities.reduce((sum, a) => sum + a.attempts, 0) / activities.length;
  }

  /**
   * Get recommended next activity type based on performance
   */
  getRecommendedNextActivityType(wordId: number): LearningManagement.ActivityType {
    const successRate = this.getWordSuccessRate(wordId);

    // If the user is struggling, stick with easier activities
    if (successRate < 50) {
      return this.defaultActivityType; // Basic review
    }

    // If moderate success, try fill-in-the-blank
    if (successRate < 75) {
      return 'fill-blank';
    }

    // If high success, challenge with listen-and-fill
    return 'listen-fill';
  }

  /**
   * Get statistics for all activities
   */
  getStatistics() {
    if (this.activities.length === 0) {
      return {
        totalActivities: 0,
        correctActivities: 0,
        successRate: 0,
        averageTimePerActivity: 0,
        uniqueWords: 0
      };
    }

    const correct = this.activities.filter(a => a.isCorrect).length;
    const totalTime = this.activities.reduce((sum, a) => sum + a.timeSpent, 0);
    const uniqueWords = new Set(this.activities.map(a => a.wordId)).size;

    return {
      totalActivities: this.activities.length,
      correctActivities: correct,
      successRate: Math.round((correct / this.activities.length) * 100),
      averageTimePerActivity: Math.round(totalTime / this.activities.length),
      uniqueWords
    };
  }

  /**
   * Clear all recorded activities
   */
  clearActivities(): void {
    this.activities = [];
  }

  /**
   * Export activities as JSON
   */
  exportActivities(): string {
    return JSON.stringify(this.activities, null, 2);
  }

  /**
   * Import activities from JSON
   */
  importActivities(json: string): void {
    try {
      this.activities = JSON.parse(json);
    } catch (error) {
      console.error('[ActivityManager] Failed to import activities:', error);
    }
  }
}

// Create a singleton instance
export const activityManager = new ActivityManager();
