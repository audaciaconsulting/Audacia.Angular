import { Inject, Injectable, Optional } from '@angular/core';

import { RequestDisableBusyService } from './request-disable-busy.service';
import { REQUEST_DISABLE_OPTIONS } from './request-disable.directive';
import { RequestDisableOptions } from './request-disable.options';

@Injectable()
export class RequestDisableService {
    private runningRequests: string[] = [];

    private doNotAddRoutes: Array<string | RegExp>;

    constructor(
        @Optional()
        @Inject(REQUEST_DISABLE_OPTIONS)
        options: RequestDisableOptions,
        private readonly busyService: RequestDisableBusyService
    ) {
        this.doNotAddRoutes =
            options && options.doNotAddRoutes ? options.doNotAddRoutes : [];
    }

    private changeBusy() {
        const val = this.runningRequests.length > 0;
        this.busyService.setBusySource(val);
    }

    addRunningRequest(request: string): void {
        if (
            !this.runningRequests.includes(request) &&
            !this.isDoNotAddRoute(request)
        ) {
            this.runningRequests.push(request);
        }

        this.changeBusy();
    }

    removeRunningRequest(request: string): void {
        const requestIndex = this.runningRequests.indexOf(request);

        if (requestIndex > -1) {
            this.runningRequests.splice(requestIndex, 1);
        }

        this.changeBusy();
    }

    private isDoNotAddRoute(url: string): boolean {
        return (
            this.doNotAddRoutes.findIndex(route =>
                typeof route === 'string'
                    ? route === url
                    : route instanceof RegExp
                    ? route.test(url)
                    : false
            ) > -1
        );
    }
}
