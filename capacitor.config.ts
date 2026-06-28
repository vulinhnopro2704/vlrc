import type { CapacitorConfig } from '@capacitor/cli';
import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const isLiveReload = process.env.LIVE_RELOAD === 'true';

const config: CapacitorConfig = {
  appId: 'com.vlrc.app',
  appName: 'vlrc',
  webDir: 'dist',
  server: isLiveReload
    ? {
        url: `http://${getLocalIP()}:5173`,
        cleartext: true,
      }
    : {
        androidScheme: 'https',
      },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
