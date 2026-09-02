import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BalanceEntry } from './balance-entry';
import { getApiUrl } from './runtime-config';

@Injectable({ providedIn: 'root' })
export class BalanceEntryApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${getApiUrl()}/balance-entries`;

  list(): Observable<BalanceEntry[]> {
    return this.http.get<BalanceEntry[]>(this.endpoint);
  }

  create(playerId: number, failureId: number): Observable<BalanceEntry> {
    return this.http.post<BalanceEntry>(this.endpoint, { playerId, failureId });
  }

  markAsPaid(id: number, password: string): Observable<BalanceEntry> {
    return this.http.patch<BalanceEntry>(`${this.endpoint}/${id}/paid`, null, {
      headers: { 'X-Access-Password': password }
    });
  }

  delete(id: number, password: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`, {
      headers: { 'X-Access-Password': password }
    });
  }
}
