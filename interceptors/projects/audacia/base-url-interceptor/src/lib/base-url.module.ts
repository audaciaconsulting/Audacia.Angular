import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule, Provider } from '@angular/core';

import { BaseUrlOptions } from './base-url-options.model';
import { BASE_URL_OPTIONS, BaseUrlInterceptor } from './base-url.interceptor';

export class BaseUrlProviderOptions {
  provider?: Provider;
  config?: BaseUrlOptions;
}

@NgModule()
export class AudaciaBaseUrlModule {
  static forRoot(options: BaseUrlProviderOptions): ModuleWithProviders {
    return {
      ngModule: AudaciaBaseUrlModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BaseUrlInterceptor,
          multi: true
        },
        options.provider || {
          provide: BASE_URL_OPTIONS,
          useValue: options.config
        }
      ]
    };
  }
}
