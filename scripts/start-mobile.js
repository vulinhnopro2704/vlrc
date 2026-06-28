import { spawn } from 'child_process';

const platform = process.argv[2] || 'android';

console.log(`\x1b[36m[System] Starting Vite dev server...\x1b[0m`);

// Start Vite dev server
const vite = spawn('pnpm', ['dev:host'], {
  shell: true,
  env: { ...process.env }
});

// Helper to kill processes on exit
const cleanup = () => {
  console.log(`\x1b[33m[System] Cleaning up processes...\x1b[0m`);
  vite.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

let capStarted = false;

vite.stdout.on('data', (data) => {
  const line = data.toString();
  process.stdout.write(`\x1b[32m[Vite]\x1b[0m ${line}`);

  // Once Vite is ready, start Capacitor
  if (!capStarted && (line.includes('Local:') || line.includes('ready in') || line.includes('localhost:'))) {
    capStarted = true;
    console.log(`\n\x1b[36m[System] Vite dev server is ready. Starting Capacitor for ${platform}...\x1b[0m\n`);
    
    const cap = spawn('npx', ['cap', 'run', platform], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, LIVE_RELOAD: 'true' }
    });

    cap.on('close', (code) => {
      if (code !== 0) {
        console.log(`\x1b[31m[System] Capacitor deployment failed with code ${code}. Cleaning up...\x1b[0m`);
        cleanup();
      } else {
        console.log(`\n\x1b[32m[System] App successfully deployed and launched! Vite dev server will continue running for Live Reload.\x1b[0m`);
        console.log(`\x1b[36m[System] Press Ctrl + C to stop the server.\x1b[0m\n`);
      }
    });
  }
});

vite.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[Vite Error]\x1b[0m ${data}`);
});
