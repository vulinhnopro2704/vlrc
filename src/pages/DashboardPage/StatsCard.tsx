'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import Icons from '@/components/Icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: 'primary' | 'accent' | 'success';
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, unit, color = 'primary' }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
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
      <Card className="p-6 glass-card border-border/50 hover:border-primary/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <div className={`${colorClass} opacity-70`}>
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold">{value}</p>
          {unit && <p className="text-muted-foreground text-sm">{unit}</p>}
        </div>
      </Card>
    </div>
  );
};
