import {ResponseInterceptorRetryOptions} from './response.interceptor.retry.options';

export class AudaciaResponseInterceptorOptions {
  excludedRoutes?: Array<string | RegExp>;
  handleSuccess?: (response: any) => void;
  handleUnauthorized?: (url: string) => Promise<void> | void;
  handleForbidden?: (url: string)  => Promise<void> | void;
  handleNotFound?: (url: string)  => Promise<void> | void;
  handleTimeout?: (url: string)  => Promise<void> | void;
  handleServerError?: (body: any, url: string) => Promise<void> | void;
  handleGeneric?: (response: any, status: number, url: string) => Promise<void> | void;
  retryConfiguration: ResponseInterceptorRetryOptions | null;
}
