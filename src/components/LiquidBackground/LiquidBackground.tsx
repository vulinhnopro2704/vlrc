import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

const LiquidBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const blob4Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const blobs = [blob1Ref.current, blob2Ref.current, blob3Ref.current, blob4Ref.current];

      blobs.forEach((blob, index) => {
        if (!blob) return;

        const duration = 15 + index * 5;
        const xRange = 100 + index * 50;
        const yRange = 80 + index * 40;

        gsap.to(blob, {
          x: `random(-${xRange}, ${xRange})`,
          y: `random(-${yRange}, ${yRange})`,
          scale: `random(0.8, 1.2)`,
          rotation: `random(-30, 30)`,
          duration: duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 2
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 -z-10 overflow-hidden bg-linear-to-r from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500'>
      {/* Blob 1 - Primary accent */}
      <div
        ref={blob1Ref}
        className='absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-linear-to-r from-violet-400/40 to-purple-600/30 dark:from-violet-600/20 dark:to-purple-800/15 blur-3xl'
      />

      {/* Blob 2 - Secondary accent */}
      <div
        ref={blob2Ref}
        className='absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-400/35 to-blue-500/25 dark:from-cyan-600/15 dark:to-blue-700/10 blur-3xl'
      />

      {/* Blob 3 - Tertiary accent */}
      <div
        ref={blob3Ref}
        className='absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-pink-400/30 to-rose-500/20 dark:from-pink-600/15 dark:to-rose-700/10 blur-3xl'
      />

      {/* Blob 4 - Subtle accent */}
      <div
        ref={blob4Ref}
        className='absolute top-1/3 right-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-emerald-400/25 to-teal-500/20 dark:from-emerald-600/10 dark:to-teal-700/10 blur-3xl'
      />

      {/* Noise texture overlay */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg viewBox=%270 0 400 400%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E")] opacity-[0.02] dark:opacity-[0.03]' />

      {/* Grid pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]' />
    </div>
  );
};

export default LiquidBackground;
