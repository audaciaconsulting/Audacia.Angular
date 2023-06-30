import {HttpRequest} from '@angular/common/http';

export class ResponseInterceptorRetryOptions {
  retryOnHandled = false;
  retryCodes: number[] = [];
  requestModifier: (request: HttpRequest<any>) => Promise<HttpRequest<any>>;
}
