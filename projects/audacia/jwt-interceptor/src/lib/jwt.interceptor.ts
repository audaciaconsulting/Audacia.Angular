import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { from, isObservable, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { parse } from 'url';

import { JwtInterceptorOptions } from './jwt-interceptor.options';

export const JWT_OPTIONS = new InjectionToken("JWT_Options");

// Heavily based on the following - https://github.com/auth0/angular2-jwt/blob/master/src/jwt.interceptor.ts
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private tokenGetter: () =>
    | string
    | null
    | Promise<string | null>
    | Observable<string | null>;
  private headerName: string;
  private authScheme: string;
  private whitelistedDomains: Array<string | RegExp>;
  private doNotAttachRoutes: Array<string | RegExp>;
  private throwNoTokenError: boolean;
  private skipWhenExpired: boolean;
  private refreshWhenExpired: boolean;
  private newTokenGetter: () =>
    | string
    | null
    | Promise<string | null>
    | Observable<string | null>;
  private tokenExpired: () => boolean;

  constructor(@Inject(JWT_OPTIONS) config: JwtInterceptorOptions) {
    this.tokenGetter = config.tokenGetter;
    this.headerName = config.headerName || "Authorization";
    this.authScheme =
      config.authScheme || config.authScheme === ""
        ? config.authScheme
        : "Bearer";
    this.whitelistedDomains = config.whitelistedDomains || [];
    this.doNotAttachRoutes = config.doNotAttachRoutes || [];
    this.throwNoTokenError = config.throwNoTokenError || false;
    this.skipWhenExpired = config.skipWhenExpired;
    this.refreshWhenExpired = config.refreshWhenExpired || false;
    this.newTokenGetter = config.newTokenGetter;
    this.tokenExpired = config.tokenExpired;
  }

  isWhitelistedDomain(request: HttpRequest<any>): boolean {
    const requestUrl: any = parse(request.url, false, true);

    return (
      requestUrl.host === null ||
      this.whitelistedDomains.findIndex(domain =>
        typeof domain === "string"
          ? domain === requestUrl.host ||
            domain === `http://${requestUrl.host}` ||
            domain === `https://${requestUrl.host}`
          : domain instanceof RegExp
          ? domain.test(requestUrl.host)
          : false
      ) > -1
    );
  }

  isDoNotAttachRoute(request: HttpRequest<any>): boolean {
    const url = request.url;

    return (
      this.doNotAttachRoutes.findIndex(route =>
        typeof route === "string"
          ? route === url
          : route instanceof RegExp
          ? route.test(url)
          : false
      ) > -1
    );
  }

  handleInterception(
    token: string | null,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!token && this.throwNoTokenError) {
      throw new Error("Could not get token from tokenGetter function.");
    }

    // If the token is not present then it has expired
    // Otherwise the expiry time can be retrieved from the function for it
    // This way people can decide on their own if the token is expired
    const tokenIsExpired = token ? this.tokenExpired() : true;

    // If the token is present, expired and you should skip when expired and not refresh
    // Then you just need to clone the request, ie keep the exact same request
    if (
      token &&
      tokenIsExpired &&
      this.skipWhenExpired &&
      !this.refreshWhenExpired
    ) {
      request = request.clone();
    }
    // If the token is present, expired, should be refreshed when expired and there is a new token getter
    // This means that we should get a new token
    // We can then run this exact same function with the refreshed token
    else if (
      token &&
      tokenIsExpired &&
      this.refreshWhenExpired &&
      this.newTokenGetter
    ) {
      const newToken = this.newTokenGetter();

      if (newToken instanceof Promise) {
        return from(newToken).pipe(
          mergeMap((asyncToken: string | null) => {
            return this.handleInterception(asyncToken, request, next);
          })
        );
      } else if (isObservable(newToken)) {
        return newToken.pipe(
          mergeMap((token: string) => {
            return this.handleInterception(token, request, next);
          })
        );
      } else {
        return this.handleInterception(newToken, request, next);
      }
    }
    // If the token is present and either
    // 1. Expired and should not refresh or skip, then attach it and probably get an error
    // 2. Not expired
    // Then the token should be attached to a header for the request
    else {
      request = request.clone({
        setHeaders: {
          [this.headerName]: `${this.authScheme} ${token}`
        }
      });
    }

    return next.handle(request);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.isWhitelistedDomain(request) &&
      !this.isDoNotAttachRoute(request)
    ) {
      const token = this.tokenGetter();

      if (token instanceof Promise) {
        return from(token).pipe(
          mergeMap((asyncToken: string | null) => {
            return this.handleInterception(asyncToken, request, next);
          })
        );
      } else if (isObservable(token)) {
        return token.pipe(
          mergeMap((token: string) => {
            return this.handleInterception(token, request, next);
          })
        );
      } else {
        return this.handleInterception(token, request, next);
      }
    }

    // If the route is one that the auth token should not be attached
    // to then we just continue and don't do anything extra
    return next.handle(request);
  }
}
