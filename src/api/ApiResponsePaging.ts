import { ApiResponse } from "./ApiResponse";

export class ApiResponsePaging<T> extends ApiResponse<T> {
  totalCount: number = 0;
  pageSize: number = 0;
  pageNumber: number = 0;

  constructor (initializer: Partial<ApiResponse<T>> = {}) {
    super(initializer);
    Object.assign(this, initializer);
  }
}