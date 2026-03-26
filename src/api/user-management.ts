import apiClient from './api-client';

// ── Users (admin) ──

const USER_BASE_PATH = 'auth/user';

const buildSearchParams = (params?: Auth.UserQueryParams) =>
  params
    ? (Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
      ) as Record<string, string | number | boolean>)
    : undefined;

export const getUsers = (params?: Auth.UserQueryParams) =>
  apiClient
    .get(USER_BASE_PATH, { searchParams: buildSearchParams(params) })
    .json<App.CursorPaginationResponse<Auth.UserProfile>>();

export const getUser = (id: string) =>
  apiClient.get(`${USER_BASE_PATH}/${id}`).json<Auth.UserProfile>();

export const createUser = (payload: Auth.CreateUserPayload) =>
  apiClient.post(USER_BASE_PATH, { json: payload }).json<Auth.UserProfile>();

export const updateUser = (id: string, payload: Auth.UpdateUserPayload) =>
  apiClient.patch(`${USER_BASE_PATH}/${id}`, { json: payload }).json<Auth.UserProfile>();

export const deleteUser = (id: string) => apiClient.delete(`${USER_BASE_PATH}/${id}`).json<void>();
