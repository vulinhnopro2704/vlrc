import { createFileRoute } from '@tanstack/react-router';
import { lazyLoad } from '@platform-core/components';

const UserNotebookPage = lazyLoad(() =>
  import('@/pages/UserNotebookPage').then(mod => ({ default: mod.UserNotebookPage }))
);

export const Route = createFileRoute('/_app/notebook')({
  component: UserNotebookPage
});
