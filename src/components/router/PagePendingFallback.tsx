import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from 'react-i18next';

export const PagePendingFallback = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Spinner className="size-8 text-primary" />
      <p className="animate-pulse text-sm font-medium">{t('loading', 'Loading...')}</p>
    </div>
  );
};
