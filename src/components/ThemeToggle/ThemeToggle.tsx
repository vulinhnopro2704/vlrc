import Icons from '@/components/Icons';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  useGSAP(
    () => {
      if (!iconRef.current) return;

      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotate: -180 },
        { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }
      );
    },
    { dependencies: [isDark], scope: iconRef }
  );

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className='fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/50 dark:border-white/10 shadow-lg hover:scale-110 transition-transform duration-300'
      aria-label='Toggle theme'>
      <div ref={iconRef}>
        {isDark ? (
          <Icons.Sun className='w-5 h-5 text-amber-500' />
        ) : (
          <Icons.Moon className='w-5 h-5 text-slate-700' />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
