const AnimatedLogo = ({ className }: { className?: string }) => {
  const logoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!logoRef.current) return;

      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotate: -20, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    },
    { scope: logoRef }
  );

  return (
    <div ref={logoRef} className={className}>
      <a
        href='/'
        className='inline-flex items-center gap-2 text-3xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent'>
        <div className='relative'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30'>
            <span className='text-white font-bold text-lg'>V</span>
          </div>
          <div className='absolute -inset-1 rounded-xl bg-linear-to-r from-violet-500 to-purple-600 blur opacity-30 -z-10' />
        </div>
        LRC
      </a>
    </div>
  );
};

export default AnimatedLogo;
