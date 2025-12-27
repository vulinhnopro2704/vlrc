import { createFileRoute } from '@tanstack/react-router';

import { DataTableShowcaseDemo } from '@/components/TanstackDataTable';

export const Route = createFileRoute('/')({
  component: Index
});

function Index() {
  return (
    <div className='space-y-4 p-4'>
      <h3 className='text-lg font-semibold'>DataTable Showcase</h3>
      <DataTableShowcaseDemo />
    </div>
  );
}
