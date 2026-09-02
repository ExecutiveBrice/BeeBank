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

  create(name: string, amount: number): Observable<Failure> {
    return this.http.post<Failure>(this.endpoint, { name, amount });
  }
}
