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

  create(playerId: number, failureId: number, amount?: number): Observable<BalanceEntry> {
    return this.http.post<BalanceEntry>(this.endpoint, { playerId, failureId, amount });
  }

  createBatch(playerId: number, selections: { failureId: number; quantity: number; amount?: number }[]): Observable<BalanceEntry[]> {
    return this.http.post<BalanceEntry[]>(`${this.endpoint}/batch`, { playerId, selections });
  }

  markBatchAsPaid(ids: number[], password: string): Observable<BalanceEntry[]> {
    return this.http.post<BalanceEntry[]>(`${this.endpoint}/batch/paid`, { ids }, {
      headers: { 'X-Access-Password': password }
    });
  }

  deleteBatch(ids: number[], password: string): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/batch/delete`, { ids }, {
      headers: { 'X-Access-Password': password }
    });
  }

  delete(id: number, password: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`, {
      headers: { 'X-Access-Password': password }
    });
  }
}
