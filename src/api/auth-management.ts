import apiClient from './api-client';

export const login = (payload: Auth.LoginPayload) =>
  apiClient.post('auth/login', { json: payload }).json<Auth.AuthResponse>();

export const register = (payload: Auth.RegisterPayload) =>
  apiClient.post('auth/register', { json: payload }).json<Auth.AuthResponse>();

export const logout = () => apiClient.post('auth/logout').json<void>();

export const refreshToken = () => apiClient.post('auth/refresh').json<Auth.AuthTokens>();

export const getMe = () => apiClient.get('auth/me').json<Auth.UserProfile>();

export const verifyEmail = (payload: Auth.VerifyEmailPayload) =>
  apiClient.post('auth/verify-email', { json: payload }).json<Auth.MessageResponse>();

export const resendVerifyEmail = (payload: Auth.ResendVerificationPayload) =>
  apiClient.post('auth/verify-email/resend', { json: payload }).json<Auth.MessageResponse>();

export const forgotPassword = (payload: Auth.ForgotPasswordPayload) =>
  apiClient.post('auth/forgot-password', { json: payload }).json<Auth.MessageResponse>();

export const resetPassword = (payload: Auth.ResetPasswordPayload) =>
  apiClient.post('auth/reset-password', { json: payload }).json<Auth.MessageResponse>();

export const getGoogleOAuthStartUrl = () => `${import.meta.env.VITE_BACKEND_API_URL}/auth/google`;
