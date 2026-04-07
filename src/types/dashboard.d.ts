declare namespace Dashboard {
  type FsrsWindow = '7d' | '30d' | '90d';

  interface WorkloadForecast {
    next7dDue: number;
    dueTomorrow: number;
  }

  interface MasteryDistribution {
    new: number;
    learning: number;
    review: number;
    relearning: number;
  }

  interface Trend {
    vsPreviousWindow: number;
  }

  interface InsightsMetrics {
    memoryScore: number;
    retentionRate: number;
    workloadForecast: WorkloadForecast;
    masteryDistribution: MasteryDistribution;
    trend: Trend;
  }

  interface InsightsResponse {
    metrics: InsightsMetrics;
    narrative: string[];
  }

  interface DailyPoint {
    date: string;
    reviews: number;
    accuracy: number;
    avgResponseMs: number;
    dueCreated: number;
    dueCompleted: number;
  }

  interface DailyReportResponse {
    metrics: {
      days: DailyPoint[];
    };
    narrative: string[];
  }

  interface RecommendationsMetrics {
    overdueGt3d: number;
    speedDeltaPct: number;
    accuracyDeltaPct: number;
    suggestedDailyLimit: number;
  }

  interface RecommendationsResponse {
    metrics: RecommendationsMetrics;
    narrative: string[];
  }

  interface RiskItem {
    wordId: App.ID;
    riskScore: number;
    retrievability: number;
    daysOverdue: number;
  }

  interface RiskCardsResponse {
    metrics: {
      items: RiskItem[];
    };
    narrative: string[];
  }
}
