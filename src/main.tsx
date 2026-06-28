import './i18n';
import ReactDOM from 'react-dom/client';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { App as CapApp } from '@capacitor/app';

import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

if (typeof window !== 'undefined' && (window as any).Capacitor) {
  CapApp.addListener('appUrlOpen', (data) => {
    try {
      // If it is our custom scheme, replace the protocol to parse it as standard https pathname
      const parsedUrl = data.url.startsWith('vlrc://')
        ? data.url.replace('vlrc://', 'https://placeholder-host/')
        : data.url;
      const url = new URL(parsedUrl);
      const pathAndSearch = url.pathname + url.search + url.hash;
      router.navigate({ to: pathAndSearch });
    } catch (e) {
      console.error('Failed to parse deep link URL:', e);
    }
  });
}

const queryClient = new QueryClient();

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}

if (typeof window !== 'undefined' && !(window as any).Capacitor && 'serviceWorker' in navigator) {
  registerSW({ immediate: true });
}
