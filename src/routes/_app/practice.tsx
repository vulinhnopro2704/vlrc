import { createFileRoute } from '@tanstack/react-router';
import { lazyLoad } from '@platform-core/components';

const PracticePage = lazyLoad(() => import('@/pages/PracticePage/PracticePage'));

export const Route = createFileRoute('/_app/practice')({
  component: PracticePage
});
