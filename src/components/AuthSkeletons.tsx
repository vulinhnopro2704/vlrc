import AuthCard from '@/components/AuthCard';
import LiquidBackground from '@/components/LiquidBackground';
import ThemeToggle from '@/components/ThemeToggle';

const Bar = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className ?? ''}`} />
);

export const AuthFormSkeleton = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />
      <AuthCard>
        <div className='space-y-6'>
          <div className='space-y-3 text-center'>
            <div className='mx-auto h-12 w-12 animate-pulse rounded-full bg-muted' />
            <Bar className='mx-auto h-6 w-44' />
            <Bar className='mx-auto h-4 w-64' />
          </div>
          <div className='space-y-4'>
            <Bar className='h-10 w-full' />
            <Bar className='h-10 w-full' />
            <Bar className='h-10 w-full' />
          </div>
          <Bar className='h-11 w-full' />
          <Bar className='mx-auto h-4 w-40' />
        </div>
      </AuthCard>
    </div>
  );
};

export const AuthStatusSkeleton = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />
      <AuthCard>
        <div className='space-y-5 text-center'>
          <div className='mx-auto h-16 w-16 animate-pulse rounded-full bg-muted' />
          <Bar className='mx-auto h-6 w-52' />
          <Bar className='mx-auto h-4 w-64' />
          <Bar className='mx-auto h-10 w-full' />
        </div>
      </AuthCard>
    </div>
  );
};
