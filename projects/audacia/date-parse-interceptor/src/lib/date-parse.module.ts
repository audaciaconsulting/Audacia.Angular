import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { DateParseOptions } from './date-parse-options.model';
import { DATE_PARSE_OPTIONS, DateParseInterceptor } from './date-parse.interceptor';

export class DateParseProviderOptions {
  provider?: Provider;
  config?: DateParseOptions;
}

@NgModule()
export class AudaciaDateParseModule {
  static forRoot(options: DateParseProviderOptions): ModuleWithProviders {
    return {
      ngModule: AudaciaDateParseModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DateParseInterceptor,
          multi: true
        },
        options.provider || {
          provide: DATE_PARSE_OPTIONS,
          useValue: options.config
        }
      ]
    };
  }
}
