

export class PageResponse<T> {
  content: T;
  page: number;
  pageSize: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pagingCounter: number;
  prevPage: boolean;
  nextPage: boolean;

}
