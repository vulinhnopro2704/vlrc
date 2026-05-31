import AuthCard from '@/components/AuthCard';
import LiquidBackground from '@/components/LiquidBackground';
import ThemeToggle from '@/components/ThemeToggle';

interface AuthStatusCardProps {
  title: string;
  description: string;
  state: 'loading' | 'success' | 'error';
  actions?: React.ReactNode;
}

const AuthStatusCard = ({ title, description, state, actions }: AuthStatusCardProps) => {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <LiquidBackground />
      <ThemeToggle />
      <AuthCard>
        <div className='space-y-5 text-center'>
          <div className='mx-auto w-16 h-16 rounded-full bg-linear-to-r from-primary to-accent text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30'>
            {state === 'loading' && <Icons.LoaderCircleIcon className='w-8 h-8 animate-spin' />}
            {state === 'success' && <Icons.CheckIcon className='w-8 h-8' />}
            {state === 'error' && <Icons.XIcon className='w-8 h-8' />}
          </div>
          <div className='space-y-2'>
            <h1 className='text-2xl font-bold text-foreground'>{title}</h1>
            <p className='text-sm text-muted-foreground'>{description}</p>
          </div>
          {actions ? <div className='space-y-2'>{actions}</div> : null}
        </div>
      </AuthCard>
    </div>
  );
};

export default AuthStatusCard;
