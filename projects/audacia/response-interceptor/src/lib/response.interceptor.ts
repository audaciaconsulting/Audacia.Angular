import {defer, from, Observable, throwError} from 'rxjs';
import {catchError, map, mergeAll, mergeMap} from 'rxjs/operators';
import {Injectable, Inject, InjectionToken} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import {AudaciaResponseInterceptorOptions} from './response.interceptor.options';
import {handlingNotRequiredHeaderName} from './response.interceptor.helpers';
import {ResponseInterceptorRetryOptions} from './response.interceptor.retry.options';

export const AUDACIA_RESPONSE_INTERCEPTOR_OPTIONS = new InjectionToken('Audacia_Response_Interceptor_Options');

@Injectable()
export class AudaciaResponseHandlingInterceptor implements HttpInterceptor {
  private excludedRoutes: Array<string | RegExp>;
  private readonly customHandleSuccess: (response: any) => void;
  private readonly customHandleUnauthorized: (url: string) => Promise<void> | void;
  private readonly customHandleForbidden: (url: string) => Promise<void> | void;
  private readonly customHandleNotFound: (url: string) => Promise<void> | void;
  private readonly customHandleTimeout: (url: string) => Promise<void> | void;
  private readonly customHandleServerError: (body: any, url: string) => Promise<void> | void;
  private readonly customHandleGeneric: (response: any, status: number, url: string) => Promise<void> | void;
  private readonly retryConfiguration: ResponseInterceptorRetryOptions | null;

  constructor(@Inject(AUDACIA_RESPONSE_INTERCEPTOR_OPTIONS) config: AudaciaResponseInterceptorOptions) {
    this.excludedRoutes = (config && config.excludedRoutes) || [];
    this.customHandleSuccess = config.handleSuccess;
    this.customHandleUnauthorized = config.handleUnauthorized;
    this.customHandleForbidden = config.handleForbidden;
    this.customHandleNotFound = config.handleNotFound;
    this.customHandleTimeout = config.handleTimeout;
    this.customHandleServerError = config.handleServerError;
    this.customHandleGeneric = config.handleGeneric;
    this.retryConfiguration = config.retryConfiguration;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isExcludedRoute(request)) {
      return next.handle(request).pipe(map(event => {
        if (event instanceof HttpResponse && !this.handlingIsNotRequired(event)) {
          const body = event.body;
          switch (event.status) {
            case 200:
              this.handleSuccess(body);
              break;
          }
        }
        return event;
      }), catchError((error: any) => {
        if (error instanceof HttpErrorResponse && !this.handlingIsNotRequired(error)) {

          if (error.error != undefined && error.error.constructor.name.toUpperCase() === 'BLOB') {
            const reader = new FileReader();

            reader.onloadend = _ => {
              if (typeof reader.result === 'string') {
                return this.processErrors(error, JSON.parse(reader.result), next, request);
              }
            };

            reader.readAsText(error.error);
          } else {
            return this.processErrors(error, error.error, next, request);
          }
        }

        return throwError(error);
      }));
    } else {
      // This is an excluded route and can be handled as normal
      return next.handle(request);
    }
  }

  private processErrors(error: HttpErrorResponse, body: any, next: HttpHandler, request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const url = error.url;

    switch (error.status) {
      case 401:
        return this.handleUnauthorized(url, error, next, request);
      case 403:
        return this.handleForbidden(url, error, next, request);
      case 404:
        return this.handleNotFound(url, error, next, request);
      case 408:
        return this.handleTimeout(url, error, next, request);
      case 500:
        return this.handleServerError(body, error, url, next, request);
      default:
        return this.handleGeneric(body, error, url, next, request);
    }
  }

  private handleSuccess(response: any) {
    if (this.customHandleSuccess) {
      return this.customHandleSuccess(response);
    }
  }

  private handleUnauthorized(url: string,
                             error: HttpErrorResponse,
                             next: HttpHandler,
                             request: HttpRequest<any>): Observable<never> | Observable<HttpEvent<any>> {
    if (this.customHandleUnauthorized) {
      const result = this.customHandleUnauthorized(url);
      if (result) {
        const prom = result as Promise<void>;
        return this.toObservable(prom, error, next, request);
      }
    }

    return throwError(() => error);
  }

  private handleForbidden(url: string, error: HttpErrorResponse, next: HttpHandler, request: HttpRequest<any>) {
    if (this.customHandleForbidden) {
      const result = this.customHandleForbidden(url);
      if (result) {
        const prom = result as Promise<void>;
        return this.toObservable(prom, error, next, request);
      }
    }

    return throwError(() => error);
  }

  private handleNotFound(url: string, error: HttpErrorResponse, next: HttpHandler, request: HttpRequest<any>) {
    if (this.customHandleNotFound) {
      const result = this.customHandleNotFound(url);
      if (result) {
        const prom = result as Promise<void>;
        return this.toObservable(prom, error, next, request);
      }
    }

    return throwError(() => error);
  }

  private handleTimeout(url: string, error: HttpErrorResponse, next: HttpHandler, request: HttpRequest<any>) {
    if (this.customHandleTimeout) {
      const result = this.customHandleTimeout(url);
      if (result) {
        const prom = result as Promise<void>;
        return this.toObservable(prom, error, next, request);
      }
    }

    return throwError(() => error);
  }

  private handleServerError(response: any, error: HttpErrorResponse, url: string, next: HttpHandler, request: HttpRequest<any>) {
    if (this.customHandleServerError) {
      const result = this.customHandleServerError(response, url);
      if (result) {
        const prom = result as Promise<void>;
        return this.toObservable(prom, error, next, request);
      }
    }

    return throwError(() => error);
  }

  private handleGeneric(response: any, error: HttpErrorResponse, url: string, next: HttpHandler, request: HttpRequest<any>) {
    if (this.customHandleGeneric) {
      const result = this.customHandleGeneric(response, error.status, url);
      if (result) {
        const prom = result as Promise<void>;
        return this.toObservable(prom, error, next, request);
      }
    }

    return throwError(() => error);
  }


  private modifyRequest(request: HttpRequest<any>): Promise<HttpRequest<any>> {
    if (this.retryConfiguration && this.retryConfiguration.requestModifier) {
      return this.retryConfiguration.requestModifier(request);
    }

    return Promise.resolve(request);
  }

  // Converts a promise to an Observable and flattens Observable<Observable<HttpRequest<any> to Observable<HttpRequest<any>>
  private toObservable(prom: Promise<void>,
                       error: HttpErrorResponse,
                       next: HttpHandler,
                       request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return from(prom.then(() => this.modifyRequest(request)
      .then((modifiedRequest) => this.handleRetryRequest(error, next, modifiedRequest))))
      .pipe(mergeMap((val) => val));
  }

  private handleRetryRequest(error: HttpErrorResponse, next: HttpHandler, request: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.retryConfiguration
      && this.retryConfiguration.retryOnHandled
      && this.retryConfiguration.retryCodes.includes(error.status)) {
      return next.handle(request);
    } else {
      return throwError(() => error);
    }
  }

  isExcludedRoute(request: HttpRequest<any>): boolean {
    const url = request.url;

    return (
      this.excludedRoutes.findIndex(route =>
        typeof route === 'string' ? route === url
          : route instanceof RegExp ? route.test(url)
            : false
      ) > -1
    );
  }

  handlingIsNotRequired(response: HttpResponse<any> | HttpErrorResponse) {
    return response &&
      (response.headers instanceof HttpHeaders) &&
      response.headers.has(handlingNotRequiredHeaderName);
  }
}
