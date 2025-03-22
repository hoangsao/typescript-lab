export class ApiResponse<T> {
  data: T | null = null;
  error: string | null = null;
  ok: boolean = false;
  status: number = 0;
  headers: Record<string, string | null> = {};

  constructor (initializer: Partial<ApiResponse<T>> = {}) {
    Object.assign(this, initializer);
  }
}