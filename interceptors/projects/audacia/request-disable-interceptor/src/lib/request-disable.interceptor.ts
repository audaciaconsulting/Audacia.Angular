import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RequestDisableService } from './request-disable.service';

@Injectable()
export class RequestDisableInterceptor implements HttpInterceptor {
    constructor(private service: RequestDisableService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.service.addRunningRequest(req.urlWithParams);

        return next.handle(req).pipe(
            finalize(() => {
                this.service.removeRunningRequest(req.urlWithParams);
            })
        );
    }
}
