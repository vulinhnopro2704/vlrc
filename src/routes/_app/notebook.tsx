import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

const UserNotebookPage = lazy(() =>
  import('@/pages/UserNotebookPage').then(mod => ({ default: mod.UserNotebookPage }))
);

export const Route = createFileRoute('/_app/notebook')({
  component: UserNotebookPage
});
