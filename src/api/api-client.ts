import ky from 'ky';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

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
        const url = new URL(request.url);
        const isAuthEndpoint =
          url.pathname.includes('/auth/login') ||
          url.pathname.includes('/auth/register') ||
          url.pathname.includes('/auth/me') ||
          url.pathname.includes('/auth/logout');

        if (response.status === 401 && !isAuthEndpoint) {
          window.location.href = '/login';
        }

        return response;
      }
    ]
  }
});

export default apiClient;
