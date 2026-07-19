import { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';

import instance from './instance';

export enum HTTPMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method: HTTPMethod;
  url: string;
  query?: AxiosRequestConfig['params'];
  body?: unknown;
}

interface ErrorResponseBody {
  message?: string;
}

export const request = async <T>({
  method,
  url,
  query,
  body,
}: RequestOptions): Promise<T> => {
  try {
    const response = await instance.request<T>({
      method,
      url,
      params: query,
      data: body,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const data = error.response?.data as ErrorResponseBody | undefined;
      throw new ApiError(
        data?.message ?? '요청 처리 중 오류가 발생했습니다.',
        error.response?.status ?? 0,
        data,
      );
    }
    throw error;
  }
};
