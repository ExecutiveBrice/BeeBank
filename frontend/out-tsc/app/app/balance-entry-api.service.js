import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './runtime-config';
import * as i0 from "@angular/core";
export class BalanceEntryApiService {
    constructor() {
        this.http = inject(HttpClient);
        this.endpoint = `${getApiUrl()}/balance-entries`;
    }
    list() {
        return this.http.get(this.endpoint);
    }
    create(playerId, failureId) {
        return this.http.post(this.endpoint, { playerId, failureId });
    }
    delete(id, password) {
        return this.http.delete(`${this.endpoint}/${id}`, {
            headers: { 'X-Access-Password': password }
        });
    }
    static { this.ɵfac = function BalanceEntryApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BalanceEntryApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: BalanceEntryApiService, factory: BalanceEntryApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BalanceEntryApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=balance-entry-api.service.js.map