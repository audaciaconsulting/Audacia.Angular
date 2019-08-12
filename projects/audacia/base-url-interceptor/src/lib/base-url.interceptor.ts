import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseUrlOptions } from './base-url-options.model';

// THIS NEEDS TO GO ABOVE THE DEFINITION FOR THE INTERCEPTOR AS
// OTHERWISE IT BREAKS, BECAUSE WHY NOT?
export const BASE_URL_OPTIONS = new InjectionToken("BASE_URL_OPTIONS");

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private baseUrl: string;

  constructor(@Inject(BASE_URL_OPTIONS) config: BaseUrlOptions) {
    this.baseUrl = config.baseUrl;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // If the request that is being run does not have http(s) in the url
    // then it means that we should be going to the baseUrl
    if (
      request.url.indexOf("http://") === -1 &&
      request.url.indexOf("https://") === -1
    ) {
      let baseUrl = this.baseUrl;

      // If the last character of the baseUrl and the first character
      // of the request are /, then this means that we will have too many /s
      if (baseUrl[baseUrl.length - 1] === "/" && request.url[0] === "/") {
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
      }
      // If baseUrl does not end with a / and request url does not begin
      // with /, this means that we need to add one
      else if (baseUrl[baseUrl.length - 1] !== "/" && request.url[0] !== "/") {
        baseUrl = `${baseUrl}/`;
      }

      request = request.clone({ url: `${baseUrl}${request.url}` });
    }
    return next.handle(request);
  }
}
