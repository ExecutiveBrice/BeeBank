import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from './runtime-config';
import * as i0 from "@angular/core";
export class PlayerApiService {
    constructor() {
        this.http = inject(HttpClient);
        this.endpoint = `${getApiUrl()}/players`;
    }
    list() {
        return this.http.get(this.endpoint);
    }
    create(name) {
        return this.http.post(this.endpoint, { name });
    }
    static { this.ɵfac = function PlayerApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlayerApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PlayerApiService, factory: PlayerApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlayerApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=player-api.service.js.map