import apiClient from './api-client';

// ── Users (admin) ──

export const getUsers = (params?: Auth.UserQueryParams) =>
  apiClient
    .get('users', { searchParams: params as Record<string, string | number | boolean> })
    .json<App.CursorPaginationResponse<Auth.UserProfile>>();

export const getUser = (id: string) => apiClient.get(`users/${id}`).json<Auth.UserProfile>();

export const createUser = (payload: Auth.CreateUserPayload) =>
  apiClient.post('users', { json: payload }).json<Auth.UserProfile>();

export const updateUser = (id: string, payload: Auth.UpdateUserPayload) =>
  apiClient.patch(`users/${id}`, { json: payload }).json<Auth.UserProfile>();

export const deleteUser = (id: string) => apiClient.delete(`users/${id}`).json<void>();
