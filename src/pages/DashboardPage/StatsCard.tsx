'use client';

export const StatsCard: FC<{
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: 'primary' | 'accent' | 'success';
}> = ({ icon, label, value, unit, color = 'primary' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5 }
      );
    }
  });

  const colorClass = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-green-500'
  }[color];

  return (
    <div ref={cardRef}>
      <Card className='glass-card border-border/50 p-4 transition-all duration-300 hover:border-primary/30'>
        <div className='mb-2 flex items-center justify-between'>
          <p className='text-xs font-medium text-muted-foreground sm:text-sm'>{label}</p>
          <div className={`${colorClass} opacity-70 [&_svg]:h-4 [&_svg]:w-4`}>{icon}</div>
        </div>
        <div className='flex items-end gap-1'>
          <p className='text-2xl font-bold leading-none'>{value}</p>
          {unit && <p className='pb-0.5 text-xs text-muted-foreground'>{unit}</p>}
        </div>
      </Card>
    </div>
  );
};
