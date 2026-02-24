import ky from 'ky';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  retry: 0,
  hooks: {
    beforeRequest: [
      request => {
        const accessToken = sessionStorage.getItem('access_token');
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        console.log('🚀 API Request:', {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          body: request.body
        });
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        const url = new URL(request.url);
        const isAuthEndpoint =
          url.pathname.includes('/auth/login') ||
          url.pathname.includes('/auth/register') ||
          url.pathname.includes('/auth/refresh');

        if (response.status === 401 && !isAuthEndpoint) {
          const refreshToken = sessionStorage.getItem('refresh_token');
          if (!refreshToken) {
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            window.location.href = '/auth';
            return response;
          }

          try {
            await ensureRefresh(refreshToken);

            const newAccess = sessionStorage.getItem('access_token');
            const relativePath = request.url.replace(API_BASE_URL + '/', '');
            return apiClient(relativePath, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newAccess}`
              }
            });
          } catch (err) {
            console.error('Failed to refresh token:', err);
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            window.location.href = '/auth';
            return response;
          }
        }

        return response;
      }
    ]
  }
});

let refreshPromise: Promise<void> | null = null;

async function ensureRefresh(refreshToken: string): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const tokens = await ky
      .post(`${API_BASE_URL}/auth/refresh`, {
        json: { refreshToken },
        timeout: 10_000
      })
      .json<{ accessToken: string; refreshToken: string }>();

    sessionStorage.setItem('access_token', tokens.accessToken);
    sessionStorage.setItem('refresh_token', tokens.refreshToken);
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export default apiClient;
