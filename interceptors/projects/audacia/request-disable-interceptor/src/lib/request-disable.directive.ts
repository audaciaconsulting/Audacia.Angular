import { Directive, ElementRef, Inject, InjectionToken, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { RequestDisableBusyService } from './request-disable-busy.service';
import { RequestDisableOptions } from './request-disable.options';

export const REQUEST_DISABLE_OPTIONS = new InjectionToken(
    'REQUEST_DISABLE_OPTIONS'
);

@Directive({
    selector: '[requestDisable]'
})
export class RequestDisableDirective implements OnInit, OnDestroy {
    subscription: Subscription;

    get additionalClass(): string {
        return this.options ? this.options.additionalClass : undefined;
    }

    constructor(
        private service: RequestDisableBusyService,
        private el: ElementRef,
        @Optional()
        @Inject(REQUEST_DISABLE_OPTIONS)
        private readonly options: RequestDisableOptions,
        private renderer: Renderer2
    ) {
        el.nativeElement.disabled = false;
    }

    ngOnInit() {
        this.subscription = this.service.busy$.subscribe(response => {
            if (response === true) {
                this.el.nativeElement.disabled = true;
                if (this.additionalClass != undefined) {
                    this.renderer.addClass(
                        this.el.nativeElement,
                        this.additionalClass
                    );
                }
            }

            if (response == false) {
                this.el.nativeElement.disabled = false;
                if (this.additionalClass != undefined) {
                    this.renderer.removeClass(
                        this.el.nativeElement,
                        this.additionalClass
                    );
                }
            }
        });
    }

    ngOnDestroy() {
        // prevent memory leak when directive is destroyed
        this.subscription.unsubscribe();
    }
}
