declare namespace Vocabulary {
  // ── Entities ──

  interface Note extends App.Base {
    wordId: App.ID;
    userId?: string;
    note?: string;
    isFavorite?: boolean;
    customExample?: string;
    word?: LearningManagement.Word;
  }

  // ── Query params ──

  interface NoteQueryParams extends App.CursorPaginationParams {
    search?: string;
    isFavorite?: boolean;
    sortBy?: 'createdAt' | 'updatedAt';
    sortOrder?: App.SortOrder;
  }

  // ── Payloads (reuse Note via Pick + Partial) ──

  type UpsertNotePayload = Pick<Note, 'wordId'> &
    Partial<Pick<Note, 'note' | 'isFavorite' | 'customExample'>>;

  type UpdateNotePayload = Partial<Pick<Note, 'note' | 'isFavorite' | 'customExample'>>;
}
