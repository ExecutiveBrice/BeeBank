import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './runtime-config';
import * as i0 from "@angular/core";
export class FailureApiService {
    constructor() {
        this.http = inject(HttpClient);
        this.endpoint = `${getApiUrl()}/failures`;
    }
    list() {
        return this.http.get(this.endpoint);
    }
    create(name, amount) {
        return this.http.post(this.endpoint, { name, amount });
    }
    static { this.ɵfac = function FailureApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FailureApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: FailureApiService, factory: FailureApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FailureApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=failure-api.service.js.map