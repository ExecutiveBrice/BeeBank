import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Failure } from './failure';
import { getApiUrl } from './runtime-config';

@Injectable({ providedIn: 'root' })
export class FailureApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${getApiUrl()}/failures`;

  list(): Observable<Failure[]> {
    return this.http.get<Failure[]>(this.endpoint);
  }

  create(name: string, amount: number, freeAmount: boolean): Observable<Failure> {
    return this.http.post<Failure>(this.endpoint, { name, amount, freeAmount });
  }

  delete(id: number, password: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`, {
      headers: { 'X-Access-Password': password }
    });
  }
}
