declare namespace App {
  type ID = number | string;

  interface ModalProps<T = void> {
    id?: ID;
    onCancel: () => void;
    onSuccess: T extends void ? () => void : (data: T) => void;
  }

  interface Base {
    id?: ID;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface QueryParams {
    q?: string;
    page?: number;
    size?: number;
    sort?: string;
  }

  interface PaginationResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }
}
