import { useRouter } from '@tanstack/react-router';
import { ArrowLeft, FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export const NotFoundFallback = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="size-10 text-muted-foreground" />
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t('not_found_title', 'Page not found')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('not_found_description', 'The page you are looking for does not exist or has been moved.')}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.history.back()}>
          <ArrowLeft className="mr-2 size-4" />
          {t('go_back', 'Go back')}
        </Button>
        <Button onClick={() => router.navigate({ to: '/' })}>
          <Home className="mr-2 size-4" />
          {t('go_home', 'Go to Home')}
        </Button>
      </div>
    </div>
  );
};
