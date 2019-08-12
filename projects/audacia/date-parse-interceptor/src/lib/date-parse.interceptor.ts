import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DateParseOptions } from './date-parse-options.model';

// THIS NEEDS TO GO ABOVE THE DEFINITION FOR THE INTERCEPTOR AS
// OTHERWISE IT BREAKS, BECAUSE WHY NOT?
export const DATE_PARSE_OPTIONS = new InjectionToken("DATE_PARSE_OPTIONS");

@Injectable()
export class DateParseInterceptor implements HttpInterceptor {
  // tslint:disable-next-line:max-line-length
  private dateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
  private dateParseFunc: (val: string) => any;

  constructor(@Inject(DATE_PARSE_OPTIONS) config: DateParseOptions) {
    this.dateParseFunc = config.dateParseFunc;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.convertDates(event.body);
        }
      })
    );
  }

  private convertDates(object: Object) {
    if (!object || !(object instanceof Object)) {
      return;
    }

    if (object instanceof Array) {
      for (const item of object) {
        this.convertDates(item);
      }
    }

    for (const key of Object.keys(object)) {
      const value = (object as any)[key];

      if (value instanceof Array) {
        for (const item of value) {
          this.convertDates(item);
        }
      }

      if (value instanceof Object) {
        this.convertDates(value);
      }

      if (typeof value === "string" && this.dateRegex.test(value)) {
        (object as any)[key] = this.dateParseFunc(value);
      }
    }
  }
}
