# @audacia/base-url-interceptor

This library is currently for use with RxJs 6+.

This library provides an `HttpInterceptor` which automatically adds the provided base URL.

> **Note:** This library can only be used with Angular 4.3 and higher because it relies on an `HttpInterceptor` from Angular's `HttpClient`. This feature is not available on lower versions.

## Installation

Install the package using the below.

```bash
# installation with npm
npm install @audacia/base-url-interceptor --save
```

## Usage: Injection

Import the `AudaciaBaseUrlModule` module and add it to your imports list. Call the `forRoot` method and provide a `baseUrl` property.

Be sure to import the `HttpClientModule` as well.

```ts
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AudaciaBaseUrlModule } from "@audacia/base-url-interceptor";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AudaciaBaseUrlModule.forRoot({
      config: {
        baseUrl: "http://www.omdbapi.com"
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Any requests sent using Angular's `HttpClient` will automatically have the base pre-pended

```ts
import { HttpClient } from "@angular/common/http";

export class AppComponent {
  constructor(public http: HttpClient) {}

  ping() {
    this.http
      .get("api/things")
      .subscribe(data => console.log(data), err => console.log(err));
  }
}
```

## Configuration Options

### `baseUrl: string`

The `tokenGetter` is a function which returns the user's token. This function simply needs to make a retrieval call to wherever the token is stored. In many cases, the token will be stored in local storage or session storage. This function can return either a `string` or `Promise<string>`. In the most likely scenario that the `Promise<string>` is because you are performing some form of request. You will want to add that route to the [doNotAttachRoutes](#donotattachroutes)

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    baseUrl: "https://my-api.com"
  }
});
```

## Using a Custom Options Factory Function

In some cases, you may need to provide a custom factory function to properly handle your configuration options. This is the case if your `baseUrl` property relies on a service or if you are using an asynchronous storage mechanism (like Ionic's `Storage`).

Import the `BASE_URL_OPTIONS` `InjectionToken` so that you can instruct it to use your custom factory function.

Create a factory function and specify the options as you normally would if you were using `AudaciaBaseUrlModule.forRoot` directly. If you need to use a service in the function, list it as a parameter in the function and pass it in the `deps` array when you provide the function.

```ts
import { AudaciaBaseUrlModule, BASE_URL_OPTIONS } from '@audacia/base-url-interceptor';

// ...

export function baseUrlOptionsFactory(configService) {
  return {
    baseUrl: configService.baseUrl
  }
}

// ...

@NgModule({
  // ...
  imports: [
    AudaciaBaseUrlModule.forRoot({
      provider: {
        provide: BASE_URL_OPTIONS,
        useFactory: baseUrlOptionsFactory,
        deps: [ConfigService]
      }
    })
  ],
  providers: [ConfigService]
})
```

NOTE: If a `baseUrlOptionsFactory` is defined, then `config` is ignored. _Both configuration alternatives can't be defined at the same time_.

# Contributing

We welcome contributions! Please feel free to check our [Contribution Guidlines](https://github.com/audaciaconsulting/.github/blob/main/CONTRIBUTING.md) for feature requests, issue reporting and guidelines.
