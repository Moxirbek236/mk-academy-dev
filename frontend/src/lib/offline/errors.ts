import axios from 'axios';
import { OFFLINE_MUTATION_MESSAGE } from '@/lib/offline/constants';

export type AppApiErrorCode =
  | 'OFFLINE'
  | 'OFFLINE_NO_CACHE'
  | 'OFFLINE_MUTATION'
  | 'CACHE_PARSE'
  | 'BACKEND'
  | 'UNKNOWN';

export interface AppApiErrorOptions {
  code: AppApiErrorCode;
  message: string;
  status?: number;
  cause?: unknown;
}

export class AppApiError extends Error {
  code: AppApiErrorCode;
  status?: number;
  cause?: unknown;

  constructor(options: AppApiErrorOptions) {
    super(options.message);
    this.name = 'AppApiError';
    this.code = options.code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

export function isAppApiError(error: unknown): error is AppApiError {
  return error instanceof AppApiError;
}

function extractBackendMessage(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data;

  if (typeof data === 'object') {
    const maybeMessage = (data as { message?: unknown }).message;
    if (typeof maybeMessage === 'string') return maybeMessage;
    if (Array.isArray(maybeMessage)) {
      const first = maybeMessage.find((item) => typeof item === 'string');
      return typeof first === 'string' ? first : null;
    }
  }

  return null;
}

export function normalizeApiError(error: unknown): AppApiError {
  if (isAppApiError(error)) return error;

  if (axios.isAxiosError(error)) {
    const backendMessage = extractBackendMessage(error.response?.data);

    if (error.response) {
      return new AppApiError({
        code: 'BACKEND',
        status: error.response.status,
        message: backendMessage || 'Server xatoligi yuz berdi',
        cause: error,
      });
    }

    if (error.code === 'ECONNABORTED') {
      return new AppApiError({
        code: 'OFFLINE',
        message: "Server bilan aloqa uzildi yoki timeout bo'ldi",
        cause: error,
      });
    }

    return new AppApiError({
      code: 'OFFLINE',
      message: "Internet mavjud emas yoki serverga ulanib bo'lmadi",
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new AppApiError({
      code: 'UNKNOWN',
      message: error.message || "Noma'lum xatolik yuz berdi",
      cause: error,
    });
  }

  return new AppApiError({
    code: 'UNKNOWN',
    message: "Noma'lum xatolik yuz berdi",
    cause: error,
  });
}

export function getUserFriendlyErrorMessage(error: unknown, fallback?: string): string {
  const normalized = normalizeApiError(error);

  switch (normalized.code) {
    case 'OFFLINE_MUTATION':
      return OFFLINE_MUTATION_MESSAGE;
    case 'OFFLINE_NO_CACHE':
      return "Internet mavjud emas va cache ma'lumot topilmadi";
    case 'OFFLINE':
      return normalized.message || "Internet mavjud emas yoki serverga ulanib bo'lmadi";
    case 'CACHE_PARSE':
      return "Cache ma'lumotini o'qishda xatolik yuz berdi";
    case 'BACKEND':
      return normalized.message || fallback || 'Server xatoligi yuz berdi';
    case 'UNKNOWN':
    default:
      return fallback || normalized.message || "Noma'lum xatolik yuz berdi";
  }
}

