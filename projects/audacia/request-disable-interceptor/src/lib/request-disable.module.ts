import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { REQUEST_DISABLE_OPTIONS, RequestDisableDirective } from './request-disable.directive';
import { RequestDisableInterceptor } from './request-disable.interceptor';
import { RequestDisableOptions } from './request-disable.options';
import { RequestDisableService } from './request-disable.service';

export interface IRequestDisableInterceptorModuleOptions {
    provider?: Provider;
    config?: RequestDisableOptions;
}

@NgModule({
    declarations: [RequestDisableDirective],
    exports: [RequestDisableDirective],
    providers: [RequestDisableService]
})
export class RequestDisableModule {
    static forRoot(
        options?: IRequestDisableInterceptorModuleOptions
    ): ModuleWithProviders<RequestDisableModule> {
        return {
            ngModule: RequestDisableModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: RequestDisableInterceptor,
                    multi: true
                },
                (options && options.provider) || {
                    provide: REQUEST_DISABLE_OPTIONS,
                    useValue: options && options.config
                }
            ]
        };
    }
}
