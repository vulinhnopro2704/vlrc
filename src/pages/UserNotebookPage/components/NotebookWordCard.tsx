import Icons from '@/components/Icons';

export const NotebookWordCard: FC<{
  word: Partial<LearningManagement.Word> | null | undefined;
  createdAt?: string;
  lessonTitle?: string;
  onEdit?: () => void;
}> = ({ word, createdAt, lessonTitle, onEdit }) => {
  if (!word) {
    return null;
  }

  return (
    <div className='note-card rounded-lg border bg-card/40 p-3.5 transition-colors sm:p-4'>
      <div className='mb-2.5 flex items-start justify-between gap-2 sm:mb-3'>
        <div className='flex-1'>
          <h3 className='text-base font-semibold text-foreground transition-colors sm:text-lg'>
            {word.word ?? 'N/A'}
          </h3>
          {word.cefr && (
            <span className='mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
              {word.cefr}
            </span>
          )}
        </div>
        {onEdit && (
          <Button variant='ghost' size='icon' className='h-8 w-8' onClick={onEdit}>
            <Icons.PenTool className='h-4 w-4' />
          </Button>
        )}
      </div>

      {word.meaning && (
        <p className='mb-2.5 line-clamp-2 text-xs text-muted-foreground sm:mb-3 sm:text-sm'>
          {word.meaning}
        </p>
      )}

      {word.example && (
        <p className='mb-3 line-clamp-2 border-l-2 border-primary/30 pl-2 text-xs italic text-muted-foreground'>
          "{word.example}"
        </p>
      )}

      {lessonTitle && (
        <div className='mb-3 flex items-center gap-1 text-xs text-muted-foreground'>
          <Icons.BookOpen className='h-3 w-3' />
          {lessonTitle}
        </div>
      )}

      {createdAt && (
        <div className='flex items-center gap-1 border-t border-border/30 pt-2.5 text-xs text-muted-foreground sm:pt-3'>
          <Icons.Calendar className='h-3 w-3' />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
