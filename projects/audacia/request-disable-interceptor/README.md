# @audacia/request-disable-interceptor

This library is currently for use with RxJs 6+.

This library provides an `HttpInterceptor` which keeps track of every Http Request and whether or not it is ongoing. This is then used to disable buttons and add an optional class to them.

> **Note:** This library can only be used with Angular 12.0.0 and higher.

## Installation

Install the package using the below.

```bash
# installation with npm
npm install @audacia/request-disable-interceptor --save
```

## Usage: Injection

Import the `AudaciaRequestDisableModule` module and add it to your imports list. Call the `forRoot` method and optionally provide a config value.

Be sure to import the `HttpClientModule` as well.

```ts
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AudaciaRequestDisableModule } from "@audacia/request-disable-interceptor";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AudaciaRequestDisableModule.forRoot({
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

Any requests sent using Angular's `HttpClient` will automatically count towards the application being in a "loading" state.

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

### `additionalClass?: string`

This is a class that gets applied to elements that have the directive `requestDisable` on them whilst the application is determined to be in the loading state.

This is useful for adding spinners on buttons whilst a submit process is ongoing for example.

```typescript
RequestDisableModule.forRoot({
        config: {
            additionalClass: 'loading'
        }
})
```

### `doNotAddRoutes: Array<string | RegExp>`

This is a list of routes that you do not want to count toward the application being in a loading state.

This is useful for requests that run frequently in the background, eg caching tasks.

```typescript
RequestDisableModule.forRoot({
    config: {
        doNotAddRoutes: ['doNotAttachRoute']
    }
})
```

## Using a Custom Options Factory Function

In some cases, you may need to provide a custom factory function to properly handle your configuration options. This is the case if any of your options reliy on a service or if you are using an asynchronous storage mechanism (like Ionic's `Storage`).

Import the `REQUEST_DISABLE_OPTIONS` `InjectionToken` so that you can instruct it to use your custom factory function.

Create a factory function and specify the options as you normally would if you were using `AudaciaRequestDisableModule.forRoot` directly. If you need to use a service in the function, list it as a parameter in the function and pass it in the `deps` array when you provide the function.

```ts
import { AudaciaRequestDisableModule, REQUEST_DISABLE_OPTIONS } from '@audacia/request-disable-interceptor';

// ...

export function requestDisableOptionsFactory(configService) {
  return {
    doNotAddRoutes: configService.getRequestDisableDoNotAddRoutes()
  }
}

// ...

@NgModule({
  // ...
  imports: [
    AudaciaRequestDisableModule.forRoot({
      provider: {
        provide: REQUEST_DISABLE_OPTIONS,
        useFactory: requestDisableOptionsFactory,
        deps: [ConfigService]
      }
    })
  ],
  providers: [ConfigService]
})
```

NOTE: If a `requestDisableOptionsFactory` is defined, then `config` is ignored. _Both configuration alternatives can't be defined at the same time_.

# Contributing

We welcome contributions! Please feel free to check our [Contribution Guidlines](https://github.com/audaciaconsulting/.github/blob/main/CONTRIBUTING.md) for feature requests, issue reporting and guidelines.
