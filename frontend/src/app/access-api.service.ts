import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from './runtime-config';

interface AccessResponse {
  authorized: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccessApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${getApiUrl()}/access/verify`;

  verify(password: string): Observable<AccessResponse> {
    return this.http.post<AccessResponse>(this.endpoint, { password });
  }
}
