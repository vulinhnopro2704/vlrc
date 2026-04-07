import { useQuery } from '@tanstack/react-query';
import apiClient from './api-client';

const DEFAULT_RISK_TAKE = 20;

export const getFsrsInsights = (window: Dashboard.FsrsWindow = '30d') =>
  apiClient
    .get('fsrs-ai/api/v1/fsrs/insights', { searchParams: { window } })
    .json<Dashboard.InsightsResponse>();

export const getFsrsDailyReport = (from: string, to: string) =>
  apiClient
    .get('fsrs-ai/api/v1/fsrs/report/daily', { searchParams: { from, to } })
    .json<Dashboard.DailyReportResponse>();

export const getFsrsRecommendations = () =>
  apiClient.get('fsrs-ai/api/v1/fsrs/recommendations').json<Dashboard.RecommendationsResponse>();

export const getFsrsRiskCards = (take = DEFAULT_RISK_TAKE) =>
  apiClient
    .get('practice/fsrs/risk', { searchParams: { take } })
    .json<Dashboard.RiskCardsResponse>();

export const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard-fsrs'] as const,
  insights: (window: Dashboard.FsrsWindow) => [...DASHBOARD_QUERY_KEYS.all, 'insights', window] as const,
  daily: (from: string, to: string) => [...DASHBOARD_QUERY_KEYS.all, 'daily', from, to] as const,
  recommendations: () => [...DASHBOARD_QUERY_KEYS.all, 'recommendations'] as const,
  risk: (take: number) => [...DASHBOARD_QUERY_KEYS.all, 'risk', take] as const
};

export const useFsrsInsightsQuery = (window: Dashboard.FsrsWindow) =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.insights(window),
    queryFn: () => getFsrsInsights(window),
    staleTime: 60_000
  });

export const useFsrsDailyReportQuery = (from: string, to: string) =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.daily(from, to),
    queryFn: () => getFsrsDailyReport(from, to),
    staleTime: 5 * 60_000
  });

export const useFsrsRecommendationsQuery = () =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.recommendations(),
    queryFn: getFsrsRecommendations,
    staleTime: 60_000
  });

export const useFsrsRiskCardsQuery = (take = DEFAULT_RISK_TAKE) =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.risk(take),
    queryFn: () => getFsrsRiskCards(take),
    staleTime: 60_000
  });
