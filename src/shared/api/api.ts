import type { AxiosRequestConfig } from 'axios';

import instance from './instance';

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config).then((res) => res.data),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.post<T>(url, data, config).then((res) => res.data),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.put<T>(url, data, config).then((res) => res.data),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.patch<T>(url, data, config).then((res) => res.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config).then((res) => res.data),
};
