import { JwtHelperService } from './jwt-helper.service';
import { NgModule, ModuleWithProviders, SkipSelf, Provider, Optional } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor, JWT_OPTIONS } from './jwt.interceptor';

export interface JwtModuleOptions {
    jwtOptionsProvider?: Provider;
    config?: {
        tokenGetter: () => string | null | Promise<string | null>;
        headerName?: string;
        authScheme?: string;
        baseUrl: string;
        whitelistedDomains?: Array<string | RegExp>;
        doNotAttachRoutes?: Array<string | RegExp>;
        notWhitelistedCallback?: () => void;
        throwNoTokenError?: boolean;
        skipWhenExpired?: boolean;
        refreshWhenExpired?: boolean;
        newTokenGetter?: () => string | null | Promise<string | null>;
        tokenExpired: () => boolean;
    };
}

@NgModule()
export class JwtModule {
    static forRoot(options: JwtModuleOptions): ModuleWithProviders {
        return {
            ngModule: JwtModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInterceptor,
                    multi: true
                },
                options.jwtOptionsProvider ||
                {
                    provide: JWT_OPTIONS,
                    useValue: options.config
                },
                JwtHelperService
            ]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: JwtModule) {
        if (parentModule) {
            throw new Error('JwtModule is already loaded. It should only be imported in your application\'s main module.');
        }
    }
}