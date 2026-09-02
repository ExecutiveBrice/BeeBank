import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from './runtime-config';
import { Player } from './player';

@Injectable({ providedIn: 'root' })
export class PlayerApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${getApiUrl()}/players`;

  list(): Observable<Player[]> {
    return this.http.get<Player[]>(this.endpoint);
  }

  create(name: string): Observable<Player> {
    return this.http.post<Player>(this.endpoint, { name });
  }
}
