# @audacia/response-interceptor

This library provides an `HttpInterceptor` which automatically displays pop up notifications for success/errors. This depends on you utilising the `ApiResponse` class that is in most projects API.

> **Note:** This library can only be used with Angular 4.3 and higher because it relies on an `HttpInterceptor` from Angular's `HttpClient`. This feature is not available on lower versions.

## Pre-Installation

First thing that you will need to do is ensure that you have a registry entry for our NPM registry. To do this, follow the steps listed [here](https://audacia.visualstudio.com/Audacia/Audacia%20Team/_wiki/wikis/Audacia.wiki?wikiVersion=GBwikiMaster&pagePath=%2FAudacia%20Wiki%2FCode%2FConfiguring%20a%20local%20machine%20to%20access%20the%20Audacia%20NPM%20registry).

## Installation

Now that you have the registries setup you can install the package.

```bash
# installation with npm
npm install @audacia/response-interceptor --save
```

## Usage: Injection

Import the `AudaciaResponseInterceptorModule` module and add it to your imports list. Call the `forRoot` method.

Be sure to import the `HttpClientModule` as well.

You will also need to make sure that the `angular2-notifications` package is set up properly. This can be done by importing the `SimpleNotificationsModule`

```ts
import { AudaciaResponseInterceptorModule } from '@audacia/response-interceptor';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    // ...
    HttpClientModule,
    SimpleNotificationsModule.forRoot(),
    AudaciaResponseInterceptorModule.forRoot(options?: {
      provider?: Provider;
      config?: {
      	excludedRoutes?: Array<string | RegExp>;
      }
    })
  ]
})
export class AppModule {}
```

You will also need to add an outlet for the notifications somewhere.

```html
<simple-notifications></simple-notifications>
```

If you want to see how to configure this package look [here](https://github.com/flauc/angular2-notifications).

## Configuration Options

### `excludedRoutes?: Array<string | RegExp>;`

Error handling will not be applied if the route exactly matches one of these strings or passes a test against one of these RegExps.

### `handleSuccess?: (response: any) => void`

A function to run on returning a success status.

### `handleUnauthorized: (url: string) => void`

A function to run on returning an unauthorized status.

### `handleForbidden: (url: string) => void`

A function to run on returning a forbidden status.

### `handleNotFound: (url: string) => void`

A function to run on returning not found.

### `handleTimeout: (url: string) => void`

A function to run on receiving a timeout.

### `handleServerError: (body: any, url: string) => void`

A function to run on receiving a server error.

### `handleGeneric: (response: any, status: number, url: string) => void`

A function to run on receiving an error that is unable to handled based on the currently handled statuses.

## Other Features

### `markResponseHandlingNotRequired`

The `excludedRoutes` array prevents error handling for a set of routes. Sometimes, you may want to skip error handling in a more specific set of cases, using the response body to decide.

To do this, use a custom interceptor and register it against the `HTTP_INTERCEPTORS` token after the AudaciaResponseHandlingInterceptor - so that it reads request responses before AudaciaResponseHandlingInterceptor.

In this custom interceptor, you can pass the response to the exported `markResponseHandlingNotRequired` function. This sets an `Audacia-Response-Handling-Not-Required` header on the response, indicating to this package not to run error handling for this request.

Example:
```
import { markResponseHandlingNotRequired } from '@audacia/response-interceptor';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (condition) {
            return next.handle(request).pipe(
                map(response => {
                    customResponseHandling(response);
                    markResponseHandlingNotRequired(response);
                    return response;
                }),
                catchError(error => {
                    customErrorHandling(error);
                    markResponseHandlingNotRequired(error);
                    return throwError(error);
                }));
        } else {
            return next.handle(request);
        }
    }
}
```
## Issue Reporting

If you have found a bug or if you have a feature request, then please email me `liam.ward@audacia.co.uk` or add it to the `Audacia` VSTS board if that is allowed?

## Author

Liam Ward on behalf of Audacia.

## Contributors

Tom Pearson on behalf of Audacia.