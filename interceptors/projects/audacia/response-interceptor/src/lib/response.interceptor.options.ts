export class AudaciaResponseInterceptorOptions {
    excludedRoutes?: Array<string | RegExp>;
    handleSuccess?: (response: any) => void;
    handleUnauthorized?: (url: string) => void;
    handleForbidden?: (url: string) => void;
    handleNotFound?: (url: string) => void;
    handleTimeout?: (url: string) => void;
    handleServerError?: (body: any, url: string) => void;
    handleGeneric?: (response: any, status: number, url: string) => void;
}