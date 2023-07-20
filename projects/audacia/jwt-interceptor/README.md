# @audacia/jwt-interceptor

### **NOTE:** This library borrows heavily from the [@auth0/angular-jwt](https://github.com/auth0/angular2-jwt) library. The main change is that it deals a bit better with token getters that use `Http` requests

This library is currently for use with Angular4-5. A separate version will need to created for Angular 6, to then work with RxJs 6+. A template for this can be found at the link provided above.

This library provides an `HttpInterceptor` which automatically attaches a [JSON Web Token](https://jwt.io) to `HttpClient` requests.

This library does not have any functionality for implementing user authentication and retrieving JWTs to begin with. Those details will vary depending on your setup, but in most cases, you will use a regular HTTP request to authenticate your users and then save their JWTs in local storage or in a cookie if successful.

This library does also not have any functionality for implementing token refresh. Again, this will depend on your setup and should be configured accordingly.

> **Note:** This library can only be used with Angular 4.3 and higher because it relies on an `HttpInterceptor` from Angular's `HttpClient`. This feature is not available on lower versions.

## Installation

Install the package using the below.

```bash
# installation with npm
npm install @audacia/jwt-interceptor --save
```

## Usage: Injection

Import the `JwtModule` module and add it to your imports list. Call the `forRoot` method and provide a `tokenGetter` function. You must also whitelist any domains that you want to make requests to by specifying a `whitelistedDomains` array.

Be sure to import the `HttpClientModule` as well.

```ts
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    // ...
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3001']
      }
    })
  ]
})
export class AppModule {}
```

Any requests sent using Angular's `HttpClient` will automatically have a token attached as an `Authorization` header.

```ts
import { HttpClient } from '@angular/common/http';

export class AppComponent {
  constructor(public http: HttpClient) {}

  ping() {
    this.http
      .get('http://example.com/api/things')
      .subscribe(data => console.log(data), err => console.log(err));
  }
}
```

## Configuration Options

### `tokenGetter: () => string | null | Promise<string | null> | Observable<string | null>`

The `tokenGetter` is a function which returns the user's token. This function simply needs to make a retrieval call to wherever the token is stored. In many cases, the token will be stored in local storage or session storage. This function can return either a `string` or `Promise<string>`. In the most likely scenario that the `Promise<string>` is because you are performing some form of request. You will want to add that route to the [doNotAttachRoutes](#donotattachroutes)

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    tokenGetter: () => {
      return localStorage.getItem('access_token');
    }
  }
});
```

### `headerName: string`

This is the name of the header that you want the Auth token to be added to. If this is not specified then it is defaulted to `Authorization`.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    headerName: 'Your Header Name'
  }
});
```

### `authScheme: string`

This is the authentication scheme that you are using. If this is not set then it is defaulted to `Bearer `.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    authScheme: 'Your Auth Scheme'
  }
});
```

### `baseUrl: string`

This is the used to specify the URL that you want all request to be prefixed with (unless the URL provided already has `http://` or `https://` in it). It can have a trailing `/` if wanted, but it will work with or without one.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    baseUrl: 'https://my.api.com'
  }
});
```

**Example**

```ts
// baseUrl = 'https://my.api.com'
this.http.get('test');

// this will end up requesting https://my.api.com/test

// baseUrl = 'https://my.api.com/'
this.http.get('test');

// this will end up requesting https://my.api.com/test

// baseUrl = 'https://my.api.com'
this.http.get('/test');

// this will end up requesting https://my.api.com/test

// baseUrl = 'https://my.api.com/'
this.http.get('/test');

// this will end up requesting https://my.api.com/test
```

### `whitelistedDomains: Array<string | RegExp>`

Authenticated requests should only be sent to domains you know and trust. Many applications make requests to APIs from multiple domains, some of which are not controlled by the developer. Since there is no way to know what the API being called will do with the information contained in the request, it is best to not send the user's token any and all APIs in a blind fashion.

List any domains you wish to allow authenticated requests to be sent to by specifying them in the the `whitelistedDomains` array.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    whitelistedDomains: ['localhost:3001', 'foo.com', 'bar.com']
  }
});
```

If you are trying to perform a request to a domain that is not in this list you can use the `notWhitelistedCallback` to be informed of this. 

### `doNotAttachRoutes: Array<string | RegExp>` <a name="donotattachroutes"></a>

If you do not want to replace the authorization headers for specific routes, list them here. These are especially useful for the routes that you perform anonymous requests to. For example, logging in, refreshing, forgotten password, etc.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
        doNotAttachRoutes: [
            'localhost:3001/auth/',
            /\/connect\/token/,
        ] //strings and regular expressions
  }
});
```

### `throwNoTokenError: boolean`

Setting `throwNoTokenError` to `true` will result in an error being thrown if a token cannot be retrieved with the `tokenGetter` function. Defaults to `false`.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    throwNoTokenError: true
  }
});
```

**NOTE:**
In all honesty, I didn't see the point in this, but the library I based this package on had so I figured I may as well include it. Someone might use it.

### `skipWhenExpired: boolean`

By default, the user's JWT will be sent in `HttpClient` requests even if it is expired. You may choose to not allow the token to be sent if it is expired by setting `skipWhenExpired` to true.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    skipWhenExpired: true
  }
});
```

### `refreshWhenExpired: boolean` <a name="refreshwhenexpired"></a>

This means that when the token has expired it will try to get a new token with the [newTokenGetter](#newtokengetter) method. Defaults to `false`.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    refreshWhenExpired: true
  }
});
```

### <a name="newtokengetter"></a> `newTokenGetter: () => string | null | Promise<string | null> | Observable<string | null>`

This is the function that gets a new token. It takes the same form as the `tokenGetter`. This will only be run if the token has expired and the [refreshWhenExpired](#refreshwhenexpired) option is `true`. This function should refresh the token and return the new one.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    newTokenGetter: () => {
      // refresh the token and return the new one
    }
  }
});
```

### `tokenExpired: () => boolean`

This is a function that determines whether or not the token is expired. This is a required function. This is used in conjunction with the refreshing properties.

```ts
// ...
JwtModule.forRoot({
  config: {
    // ...
    tokenExpired: () => {
      return localStorage.getItem('token_expired') === 'true';
    }
  }
});
```


## Using a Custom Options Factory Function

In some cases, you may need to provide a custom factory function to properly handle your configuration options. This is the case if your `tokenGetter` or `newTokenGetter` function relies on a service or if you are using an asynchronous storage mechanism (like Ionic's `Storage`).

Import the `JWT_OPTIONS` `InjectionToken` so that you can instruct it to use your custom factory function.

Create a factory function and specify the options as you normally would if you were using `JwtModule.forRoot` directly. If you need to use a service in the function, list it as a parameter in the function and pass it in the `deps` array when you provide the function.

```ts
import { JwtModule, JWT_OPTIONS } from '@audacia/jwt-interceptor';
import { TokenService } from './app.tokenservice';

// ...

export function jwtOptionsFactory(tokenService) {
  return {
    tokenGetter: () => {
      return tokenService.getAsyncToken();
    }
  }
}

// ...

@NgModule({
  // ...
  imports: [
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenService]
      }
    })
  ],
  providers: [TokenService]
})
```

NOTE: If a `jwtOptionsFactory` is defined, then `config` is ignored. _Both configuration alternatives can't be defined at the same time_.

# Contributing

We welcome contributions! Please feel free to check our [Contribution Guidlines](https://github.com/audaciaconsulting/.github/blob/main/CONTRIBUTING.md) for feature requests, issue reporting and guidelines.
