import apiClient from './api-client';

// ── Streak ──

export const getStreak = () => apiClient.get('streak').json<Streak.StreakData>();

export const recordActivity = () => apiClient.post('streak/activity').json<void>();
