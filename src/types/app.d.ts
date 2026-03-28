declare namespace App {
  type ID = number | string;

  interface ModalProps<T = void> {
    id?: ID;
    open: boolean;
    onCancel: () => void;
    onSuccess?: T extends void ? () => void : (data: T) => void;
  }

  interface Base {
    id?: ID;
    createdAt?: string;
    updatedAt?: string;
  }

  // ── Pagination (cursor-based) ──

  type SortOrder = 'asc' | 'desc';

  interface CursorPaginationParams {
    cursor?: number;
    take?: number;
  }

  interface CursorPaginationResponse<T> {
    data: T[];
    nextCursor: number | null;
    hasMore: boolean;
  }
}
