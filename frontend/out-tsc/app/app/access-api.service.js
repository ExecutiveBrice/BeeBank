import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './runtime-config';
import * as i0 from "@angular/core";
export class AccessApiService {
    constructor() {
        this.http = inject(HttpClient);
        this.endpoint = `${getApiUrl()}/access/verify`;
    }
    verify(password) {
        return this.http.post(this.endpoint, { password });
    }
    static { this.ɵfac = function AccessApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AccessApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AccessApiService, factory: AccessApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AccessApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=access-api.service.js.map