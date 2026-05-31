
export const PageErrorFallback = ({ error, reset }: { error: any; reset: () => void }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <Icons.AlertCircle className="size-10 text-destructive" />
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t('error_title', 'Something went wrong!')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {error?.message || t('error_description', 'An unexpected error occurred while loading this page.')}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          <Icons.RefreshCcw className="mr-2 size-4" />
          {t('try_again', 'Try again')}
        </Button>
        <Button onClick={() => router.navigate({ to: '/' })}>
          <Icons.Home className="mr-2 size-4" />
          {t('go_home', 'Go to Home')}
        </Button>
      </div>
    </div>
  );
};
