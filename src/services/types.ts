import type { FormData } from "../types/form";

export type ApiRequest = FormData & { prompt?: string };

export interface ApiResponse {
  content: string;
}

export interface ApiError {
  message: string;
  status?: number;
  retryable: boolean;
}
