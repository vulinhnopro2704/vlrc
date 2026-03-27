import ky from 'ky';
import { AppApiError, normalizeApiErrorResponse } from './api-error';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const isAuthEndpoint = (url: URL) =>
  url.pathname.includes('/auth/login') ||
  url.pathname.includes('/auth/register') ||
  url.pathname.includes('/auth/me') ||
  url.pathname.includes('/auth/logout');

const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10_000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  retry: 0,
  hooks: {
    afterResponse: [
      async (request, _options, response) => {
        if (response.ok) {
          return response;
        }

        let payload: unknown;
        try {
          payload = await response.clone().json();
        } catch {
          payload = undefined;
        }

        const normalizedError = normalizeApiErrorResponse(payload, response.status);

        if (normalizedError.traceId) {
          console.error(
            `[API_ERROR][${normalizedError.traceId}] ${normalizedError.errorCode}: ${normalizedError.message}`
          );
        }

        const url = new URL(request.url);
        if (
          normalizedError.statusCode === 401 &&
          !isAuthEndpoint(url) &&
          typeof window !== 'undefined'
        ) {
          window.location.href = '/login';
        }

        throw new AppApiError({
          statusCode: normalizedError.statusCode,
          errorCode: normalizedError.errorCode,
          message: normalizedError.message,
          errors: normalizedError.errors,
          timestamp: normalizedError.timestamp,
          traceId: normalizedError.traceId,
          url: request.url,
          response
        });
      }
    ]
  }
});

export default apiClient;
