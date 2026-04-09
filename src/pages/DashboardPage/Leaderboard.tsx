'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icons from '@/components/Icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  streak: number;
  avatar?: string;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserRank?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUserRank }) => {
  const { t } = useTranslation();
  const leaderboardRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = leaderboardRef.current?.querySelectorAll('.leaderboard-row');
      rows?.forEach((row, index) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4, delay: index * 0.05 }
        );
      });
    },
    { scope: leaderboardRef }
  );

  return (
    <Card className='glass-card h-fit overflow-hidden border-border/60'>
      <div className='border-b border-border p-3'>
        <h3 className='font-bold flex items-center gap-2'>
          <Icons.Trophy className='h-5 w-5 text-accent' />
          {t('learning_leaderboard')}
        </h3>
      </div>

      <ScrollArea className='h-72'>
        <div ref={leaderboardRef} className='space-y-2 p-3'>
          {users.map(user => (
            <div
              key={user.rank}
              className={`leaderboard-row rounded-lg p-2.5 transition-all duration-300 ${
                user.rank === currentUserRank
                  ? 'bg-primary/10 border border-primary/50'
                  : 'hover:bg-muted/50'
              }`}>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                  <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20'>
                    {user.rank <= 3 ? (
                      <Icons.Star className='h-4 w-4 text-accent' />
                    ) : (
                      <span className='text-xs font-bold'>{user.rank}</span>
                    )}
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold'>{user.name}</p>
                    <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <Icons.Flame className='h-3 w-3' />
                      {user.streak} {t('days')}
                    </p>
                  </div>
                </div>
                <span className='shrink-0 text-sm font-bold text-primary'>{user.points}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
