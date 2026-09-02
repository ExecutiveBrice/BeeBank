import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message';
import { getApiUrl } from './runtime-config';

@Injectable({ providedIn: 'root' })
export class MessageApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${getApiUrl()}/messages`;

  list(): Observable<Message[]> {
    return this.http.get<Message[]>(this.endpoint);
  }

  create(text: string): Observable<Message> {
    return this.http.post<Message>(this.endpoint, { text });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
