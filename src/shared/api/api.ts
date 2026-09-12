import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import instance from './instance';

export const api = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    instance.get<TResponse>(url, config).then((res) => res.data),

  post: <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ) =>
    instance
      .post<TResponse, AxiosResponse<TResponse>, TRequest>(url, data, config)
      .then((res) => res.data),

  put: <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ) =>
    instance
      .put<TResponse, AxiosResponse<TResponse>, TRequest>(url, data, config)
      .then((res) => res.data),

  patch: <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ) =>
    instance
      .patch<TResponse, AxiosResponse<TResponse>, TRequest>(url, data, config)
      .then((res) => res.data),

  delete: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<TResponse>(url, config).then((res) => res.data),
};
