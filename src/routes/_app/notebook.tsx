import { createFileRoute } from '@tanstack/react-router';

const UserNotebookPage = lazyLoad(() =>
  import('@/pages/UserNotebookPage').then(mod => ({ default: mod.UserNotebookPage }))
);

export const Route = createFileRoute('/_app/notebook')({
  component: UserNotebookPage
});
