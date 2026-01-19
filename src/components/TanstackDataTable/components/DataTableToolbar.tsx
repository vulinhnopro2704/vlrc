import { debounce, isEmpty } from 'lodash-es';
import type { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

export const DataTableToolbar = <TData,>({
  table,
  placeholder,
  debounceMs,
  right
}: {
  table: Table<TData>;
  placeholder: string;
  debounceMs: number;
  right: ReactNode;
}) => {
  const current = table.getState().globalFilter;
  const currentValue = typeof current === 'string' ? current : '';

  const debouncedSetRef = useRef(
    debounce((value: string) => {
      table.setGlobalFilter(value);
    }, debounceMs)
  );

  useEffect(() => {
    debouncedSetRef.current = debounce((value: string) => {
      table.setGlobalFilter(value);
    }, debounceMs);
    return () => {
      debouncedSetRef.current.cancel();
    };
  }, [table, debounceMs]);

  useEffect(() => {
    return () => {
      debouncedSetRef.current.cancel();
    };
  }, []);

  return (
    <div className='flex items-center gap-2 py-4'>
      <Input
        placeholder={placeholder}
        defaultValue={currentValue}
        onChange={event => {
          const value = event.target.value;
          if (isEmpty(value)) {
            debouncedSetRef.current('');
            return;
          }
          debouncedSetRef.current(value);
        }}
        className='max-w-sm'
      />
      {right}
    </div>
  );
};
