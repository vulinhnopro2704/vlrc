import Icons from '@/components/Icons';

const ICONS: Record<string, keyof typeof Icons> = {
  learned_words: 'BookOpen',
  user_words: 'PenTool',
  user_lessons: 'BarChart3',
  user_courses: 'Award',
  dictionary: 'Search'
};

export const NotebookSegmentedTabs: FC<{
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onChange: (tab: string) => void;
}> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className='overflow-x-auto pb-1'>
      <div className='inline-flex min-w-max rounded-xl border bg-card/50 p-1'>
        {tabs.map(tab => {
          const Icon = Icons[ICONS[tab.id] ?? 'BookOpen'];
          const isActive = tab.id === activeTab;

          return (
            <Button
              key={tab.id}
              variant='ghost'
              className={cn(
                'h-8 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs sm:h-9 sm:gap-2 sm:px-3 sm:text-sm',
                isActive && 'bg-background shadow-sm text-primary'
              )}
              onClick={() => onChange(tab.id)}>
              <Icon className='h-4 w-4' />
              <span className='whitespace-nowrap'>{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
