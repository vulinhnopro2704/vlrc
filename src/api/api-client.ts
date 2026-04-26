import ky from 'ky';
import { AppApiError, normalizeApiErrorResponse } from './api-error';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const isAuthEndpoint = (url: URL) =>
  url.pathname.includes('/auth/login') ||
  url.pathname.includes('/auth/register') ||
  url.pathname.includes('/auth/refresh') ||
  url.pathname.includes('/auth/logout');

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

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

        if (normalizedError.statusCode === 401 && !isAuthEndpoint(url)) {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
              });

              if (!refreshResponse.ok) {
                throw new Error('Refresh failed');
              }

              isRefreshing = false;
              processQueue(null);

              return ky(request);
            } catch (err) {
              isRefreshing = false;
              processQueue(err);
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              throw err;
            }
          } else {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: () => resolve(ky(request)),
                reject: err => reject(err)
              });
            });
          }
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
