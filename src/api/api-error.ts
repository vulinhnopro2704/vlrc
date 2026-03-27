import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse, ApiFieldError } from '@english-learning/api-error-types';
import { DEFAULT_ERROR_CODE_BY_STATUS } from '@english-learning/api-error-types';

const DEFAULT_ERROR_MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'The request is invalid. Please review and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with the current data state.',
  422: 'Some fields are invalid. Please review your input.',
  429: 'Too many requests. Please wait and try again.',
  500: 'The server encountered an unexpected error.',
  502: 'The service is temporarily unavailable. Please try again soon.',
  503: 'The service is under maintenance. Please try again later.'
};

const FALLBACK_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isApiFieldError = (value: unknown): value is ApiFieldError =>
  isObject(value) && typeof value.field === 'string' && typeof value.message === 'string';

export const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!isObject(value)) {
    return false;
  }

  const errors = value.errors;
  const hasValidErrors =
    errors === undefined || (Array.isArray(errors) && errors.every(item => isApiFieldError(item)));

  return (
    typeof value.statusCode === 'number' &&
    typeof value.errorCode === 'string' &&
    typeof value.message === 'string' &&
    value.message.length > 0 &&
    hasValidErrors &&
    typeof value.timestamp === 'string' &&
    (value.traceId === undefined || typeof value.traceId === 'string')
  );
};

export const getDefaultErrorMessageByStatus = (statusCode: number) =>
  DEFAULT_ERROR_MESSAGE_BY_STATUS[statusCode] ?? FALLBACK_ERROR_MESSAGE;

export const normalizeApiErrorResponse = (
  responsePayload: unknown,
  responseStatusCode: number
): ApiErrorResponse => {
  if (isApiErrorResponse(responsePayload)) {
    return responsePayload;
  }

  return {
    statusCode: responseStatusCode,
    errorCode: DEFAULT_ERROR_CODE_BY_STATUS[responseStatusCode] ?? 'UNEXPECTED_ERROR',
    message: getDefaultErrorMessageByStatus(responseStatusCode),
    errors: [],
    timestamp: new Date().toISOString()
  };
};

type AppApiErrorParams = {
  statusCode: number;
  errorCode: string;
  message: string;
  errors?: ApiFieldError[];
  timestamp: string;
  traceId?: string;
  url?: string;
  response?: Response;
};

export class AppApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly errors: ApiFieldError[];
  readonly timestamp: string;
  readonly traceId?: string;
  readonly url?: string;
  readonly response?: Response;

  constructor({
    statusCode,
    errorCode,
    message,
    errors = [],
    timestamp,
    traceId,
    url,
    response
  }: AppApiErrorParams) {
    super(message);
    this.name = 'AppApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.timestamp = timestamp;
    this.traceId = traceId;
    this.url = url;
    this.response = response;
  }
}

export const isAppApiError = (error: unknown): error is AppApiError => error instanceof AppApiError;

export const hasApiErrorStatus = (error: unknown, statusCode: number) =>
  isAppApiError(error) && error.statusCode === statusCode;

export const getErrorMessage = (error: unknown, fallbackMessage = FALLBACK_ERROR_MESSAGE) => {
  if (error instanceof Error && typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }
  return fallbackMessage;
};

export const applyApiFieldErrors = <TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>
) => {
  if (!isAppApiError(error) || ![400, 422].includes(error.statusCode)) {
    return false;
  }

  if (!error.errors.length) {
    return false;
  }

  error.errors.forEach(fieldError => {
    if (fieldError.field) {
      setError(fieldError.field as FieldPath<TFieldValues>, {
        type: 'server',
        message: fieldError.message
      });
    }
  });

  return true;
};
