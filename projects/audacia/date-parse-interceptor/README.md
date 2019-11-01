# @audacia/date-parse-interceptor

This library is currently for use with RxJs 6+.

This library provides an `HttpInterceptor` which automatically parses any dates coming from a request into the required object type.

> **Note:** This library can only be used with Angular 4.3 and higher because it relies on an `HttpInterceptor` from Angular's `HttpClient`. This feature is not available on lower versions.

## Pre-Installation

First thing that you will need to do is ensure that you have a registry entry for our NPM registry. To do this, follow the steps listed [here](https://audacia.visualstudio.com/Audacia/_wiki/wikis/Audacia.wiki?pagePath=%2FAudacia%20Wiki%2FCode%2FConfiguring%20a%20project%20to%20access%20the%20Audacia%20NPM%20registry&wikiVersion=GBwikiMaster).

## Installation

Now that you have the registries setup you can install the package.

```bash
# installation with npm
npm install @audacia/date-parse-interceptor --save
```

## Usage: Injection

Import the `AudaciaDateParseModule` module and add it to your imports list. Call the `forRoot` method and provide a `dateParseFunc` property.

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
    AudaciaDateParseModule.forRoot({
      config: {
        dateParseFunc: (val: string): any => {
          return new Date(val);
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Any requests sent using Angular's `HttpClient` will automatically have their responses converted appropriately.

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

### `dateParseFunc: (val: string): any`

The function that should be used to parse from an ISO formatted string into your required object type

```ts
// ...
AudaciaDateParseModule.forRoot({
  config: {
    // ...
    dateParseFunc: (val: string): any => {
          return new Date(val);
    }
  }
});
```

## Using a Custom Options Factory Function

In some cases, you may need to provide a custom factory function to properly handle your configuration options. This is the case if your `dateParseFunc` property relies on a service or if you are using an asynchronous storage mechanism (like Ionic's `Storage`).

Import the `DATE_PARSE_OPTIONS` `InjectionToken` so that you can instruct it to use your custom factory function.

Create a factory function and specify the options as you normally would if you were using `AudaciaDateParseModule.forRoot` directly. If you need to use a service in the function, list it as a parameter in the function and pass it in the `deps` array when you provide the function.

```ts
import { AudaciaDateParseModule, DATE_PARSE_OPTIONS } from '@audacia/base-url-interceptor';

// ...

export function dateParseOptionsFactory(configService) {
  return {
    dateParseFunc: configService.dateParseFunc
  }
}

// ...

@NgModule({
  // ...
  imports: [
    AudaciaDateParseModule.forRoot({
      provider: {
        provide: DATE_PARSE_OPTIONS,
        useFactory: dateParseOptionsFactory,
        deps: [ConfigService]
      }
    })
  ],
  providers: [ConfigService]
})
```

NOTE: If a `dateParseOptionsFactory` is defined, then `config` is ignored. _Both configuration alternatives can't be defined at the same time_.

## Issue Reporting

If you have found a bug or if you have a feature request, then please email me `liam.ward@audacia.co.uk` or add it to the `Audacia` VSTS board if that is allowed?

## Author

Liam Ward on behalf of Audacia.
