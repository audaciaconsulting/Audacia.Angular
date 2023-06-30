import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

export const handlingNotRequiredHeaderName = 'Audacia-Response-Handling-Not-Required';

export function markResponseHandlingNotRequired(response: any) {
  if (response instanceof HttpResponse) {
    const modifiedHeaders = response.headers.append(handlingNotRequiredHeaderName, 'true');
    return response.clone({headers: modifiedHeaders});
  }
  if (response instanceof HttpErrorResponse) {
    const modifiedHeaders = response.headers.append(handlingNotRequiredHeaderName, 'true');
    return new HttpErrorResponse({
      error: response.error,
      headers: modifiedHeaders,
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
  }
}
