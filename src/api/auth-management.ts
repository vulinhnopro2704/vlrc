import apiClient from './api-client';

// ── Auth ──

export const login = (payload: Auth.LoginPayload) =>
  apiClient.post('auth/login', { json: payload }).json<Auth.AuthResponse>();

export const register = (payload: Auth.RegisterPayload) =>
  apiClient.post('auth/register', { json: payload }).json<Auth.AuthResponse>();

export const logout = () => apiClient.post('auth/logout').json<void>();

export const refreshToken = () => apiClient.post('auth/refresh').json<Auth.AuthTokens>();

export const getMe = () => apiClient.get('auth/me').json<Auth.UserProfile>();
