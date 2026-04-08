import Icons from '@/components/Icons';

export const NotebookTabState: FC<{
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyText?: string;
  loadingText?: string;
}> = ({ isLoading, isError, errorMessage, isEmpty, emptyText, loadingText }) => {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12 text-muted-foreground'>
        <Icons.LoaderCircleIcon className='mr-2 h-4 w-4 animate-spin' />
        {loadingText}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className='border border-destructive/30 bg-destructive/5 p-6'>
        <p className='text-sm text-destructive'>{errorMessage}</p>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className='p-6'>
        <p className='text-center text-sm text-muted-foreground'>{emptyText}</p>
      </Card>
    );
  }

  return null;
};
