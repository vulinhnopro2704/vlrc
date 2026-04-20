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
        className='inline-flex items-center gap-2 text-3xl font-bold bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent'>
        <div className='relative'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-r from-primary to-accent text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30'>
            <span className='font-bold text-lg'>V</span>
          </div>
          <div className='absolute -inset-1 rounded-xl bg-linear-to-r from-primary to-accent blur opacity-30 -z-10' />
        </div>
        LRC
      </a>
    </div>
  );
};

export default AnimatedLogo;
