import { Observable } from 'rxjs';

export class JwtInterceptorOptions {
  tokenGetter: () =>
    | string
    | null
    | Promise<string | null>
    | Observable<string | null>;
  headerName: string;
  authScheme: string;
  baseUrl: string;
  whitelistedDomains: Array<string | RegExp>;
  doNotAttachRoutes: Array<string | RegExp>;
  throwNoTokenError: boolean;
  skipWhenExpired: boolean;
  refreshWhenExpired: boolean;
  newTokenGetter: () =>
    | string
    | null
    | Promise<string | null>
    | Observable<string | null>;
  tokenExpired: () => boolean;
}
