
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, Inject, InjectionToken } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';

import { AudaciaResponseInterceptorOptions } from './response.interceptor.options';
import { handlingNotRequiredHeaderName } from './response.interceptor.helpers';

export const AUDACIA_RESPONSE_INTERCEPTOR_OPTIONS = new InjectionToken('Audacia_Response_Interceptor_Options');

@Injectable()
export class AudaciaResponseHandlingInterceptor implements HttpInterceptor {
    private excludedRoutes: Array<string | RegExp>;
    private customHandleSuccess: (response: any) => void;
    private customHandleUnauthorized: (url: string) => void;
    private customHandleForbidden: (url: string) => void;
    private customHandleNotFound: (url: string) => void;
    private customHandleTimeout: (url: string) => void;
    private customHandleServerError: (body: any, url: string) => void;
    private customHandleGeneric: (response: any, status: number, url: string) => void;

    constructor(@Inject(AUDACIA_RESPONSE_INTERCEPTOR_OPTIONS) config: AudaciaResponseInterceptorOptions) {
        this.excludedRoutes = (config && config.excludedRoutes) || [];
        this.customHandleSuccess = config.handleSuccess;
        this.customHandleUnauthorized = config.handleUnauthorized;
        this.customHandleForbidden = config.handleForbidden;
        this.customHandleNotFound = config.handleNotFound;
        this.customHandleTimeout = config.handleTimeout;
        this.customHandleServerError = config.handleServerError;
        this.customHandleGeneric = config.handleGeneric;
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
                            this.processErrors(error, JSON.parse(reader.result));
                          }
                        }

                        reader.readAsText(error.error);
                    }
                    else {
                        this.processErrors(error, error.error);
                    }
                }

                return throwError(error);
            }));
        } else {
            return next.handle(request);
        }
    }

    private processErrors(error: HttpErrorResponse, body: any) {
        const url = error.url;

        switch (error.status) {
            case 401:
                this.handleUnathorized(url);
                break;
            case 403:
                this.handleForbidden(url);
                break;
            case 404:
                this.handleNotFound(url);
                break;
            case 408:
                this.handleTimeout(url);
                break;
            case 500:
                this.handleServerError(body, url);
                break;
            default:
                this.handleGeneric(body, error.status, url);
                break;
        }
    }

    private handleSuccess(response: any) {
        if (this.customHandleSuccess) {
            this.customHandleSuccess(response);
        }
    }

    private handleUnathorized(url: string) {
        if (this.customHandleUnauthorized) {
            this.customHandleUnauthorized(url);
        }
    }

    private handleForbidden(url: string) {
        if (this.customHandleForbidden) {
            this.customHandleForbidden(url);
        }
    }

    private handleNotFound(url: string) {
        if (this.customHandleNotFound) {
            this.customHandleNotFound(url);
        }
    }

    private handleTimeout(url: string) {
        if (this.customHandleTimeout) {
            this.customHandleTimeout(url);
        }
    }

    private handleServerError(response: any, url: string) {
        if (this.customHandleServerError) {
            this.customHandleServerError(response, url);
        }
    }

    private handleGeneric(response: any, status: number, url: string) {
        if (this.customHandleGeneric) {
            this.customHandleGeneric(response, status, url);
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
