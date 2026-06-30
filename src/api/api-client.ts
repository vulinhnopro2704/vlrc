import ky from 'ky';
import type { Options } from 'ky';
import { AppApiError, normalizeApiErrorResponse } from './api-error';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const isAuthEndpoint = (url: URL) =>
  url.pathname.includes('/auth/login') ||
  url.pathname.includes('/auth/register') ||
  url.pathname.includes('/auth/refresh') ||
  url.pathname.includes('/auth/logout') ||
  url.pathname.includes('/auth/verify-email') ||
  url.pathname.includes('/auth/forgot-password') ||
  url.pathname.includes('/auth/reset-password');

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (options: Options) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, options?: Options) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (options) {
      prom.resolve(options);
    }
  });
  failedQueue = [];
};

const apiClient = ky.create({
  prefix: API_BASE_URL,
  timeout: 10_000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  retry: 0,
  hooks: {
    afterResponse: [
      async ({ request, options: _options, response }) => {
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

        const hasRetryHeader = request.headers.get('x-retry') === 'true';

        if (normalizedError.statusCode === 401 && !isAuthEndpoint(url) && !hasRetryHeader) {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const refreshPath = new URL('/auth/refresh', API_BASE_URL).href;
              const refreshResponse = await fetch(refreshPath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
              });

              if (!refreshResponse.ok) {
                throw new Error('Refresh failed');
              }

              isRefreshing = false;

              const retryHeaders = new Headers(_options.headers);
              retryHeaders.set('x-retry', 'true');
              const retryOptions = {
                ..._options,
                headers: retryHeaders
              };

              processQueue(null, retryOptions);

              return apiClient(request.url, retryOptions);
            } catch (err) {
              isRefreshing = false;
              processQueue(err);

              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
              }

              throw err;
            }
          } else {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (options) => resolve(apiClient(request.url, options)),
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
