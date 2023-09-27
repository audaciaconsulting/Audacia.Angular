import { NgModule, ModuleWithProviders, SkipSelf, Provider, Optional } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AudaciaResponseHandlingInterceptor, AUDACIA_RESPONSE_INTERCEPTOR_OPTIONS } from './response.interceptor';
import { AudaciaResponseInterceptorOptions } from './response.interceptor.options';

export interface IAudaciaResponseInterceptorModuleOptions {
    provider?: Provider;
    config?: AudaciaResponseInterceptorOptions;
}

@NgModule({
    imports: [
        BrowserModule
    ]
})
export class AudaciaResponseInterceptorModule {
    static forRoot(options?: IAudaciaResponseInterceptorModuleOptions): ModuleWithProviders<AudaciaResponseInterceptorModule> {
        return {
            ngModule: AudaciaResponseInterceptorModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AudaciaResponseHandlingInterceptor,
                    multi: true
                },
                (options && options.provider) ||
                {
                    provide: AUDACIA_RESPONSE_INTERCEPTOR_OPTIONS,
                    useValue: options && options.config
                }
            ]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: AudaciaResponseInterceptorModule) {
        if (parentModule) {
            throw new Error(`AudaciaResponseInterceptorModule is already
            loaded.It should only be imported in your application\'s main
            module.`);
        }
    }
}