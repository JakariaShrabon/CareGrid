import type { ApiError, ApiResponse } from "@/contracts/common";

import { getApiEnvironment } from "./environment";
import { CareGridApiError } from "./types";

type RequestOptions = {
  signal?: AbortSignal;
  headers?: HeadersInit;
};

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const { baseUrl } = getApiEnvironment();
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request<TResponse>(
  path: string,
  init: RequestInit = {},
): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init.headers,
    },
  });

  const payload = (await response.json()) as Partial<ApiResponse<TResponse>> & {
    error?: ApiError;
  };

  if (!response.ok || payload.error) {
    const error = payload.error ?? {
      code: "API_ERROR",
      message: "The CareGrid API request failed.",
      status: response.status,
    };

    throw new CareGridApiError(error);
  }

  return payload.data as TResponse;
}

export const apiClient = {
  get<TResponse>(path: string, options: RequestOptions = {}) {
    return request<TResponse>(path, {
      method: "GET",
      signal: options.signal,
      headers: options.headers,
    });
  },
  post<TBody, TResponse>(
    path: string,
    body: TBody,
    options: RequestOptions = {},
  ) {
    return request<TResponse>(path, {
      method: "POST",
      body: JSON.stringify(body),
      signal: options.signal,
      headers: options.headers,
    });
  },
  patch<TBody, TResponse>(
    path: string,
    body: TBody,
    options: RequestOptions = {},
  ) {
    return request<TResponse>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      signal: options.signal,
      headers: options.headers,
    });
  },
  put<TBody, TResponse>(
    path: string,
    body: TBody,
    options: RequestOptions = {},
  ) {
    return request<TResponse>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      signal: options.signal,
      headers: options.headers,
    });
  },
  delete<TResponse>(path: string, options: RequestOptions = {}) {
    return request<TResponse>(path, {
      method: "DELETE",
      signal: options.signal,
      headers: options.headers,
    });
  },
  async getBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
    const response = await fetch(buildUrl(path), {
      method: "GET",
      signal: options.signal,
      headers: {
        Accept: "application/pdf, application/octet-stream, */*",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new CareGridApiError({
        code: "API_ERROR",
        message: `Failed to download file: ${response.statusText}`,
        status: response.status,
      });
    }

    return response.blob();
  },
};
