import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageApiService } from './message-api.service';
import { Message } from './message';
import { PlayerApiService } from './player-api.service';
import { Player } from './player';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly messageApi = inject(MessageApiService);
  private readonly playerApi = inject(PlayerApiService);

  protected readonly messages = signal<Message[]>([]);
  protected readonly text = signal('');
  protected readonly players = signal<Player[]>([]);
  protected readonly playerName = signal('');
  protected readonly playerTeam = signal('');
  protected readonly activeTab = signal<'balance' | 'podium' | 'players' | 'settings'>('balance');

  constructor() {
    this.loadMessages();
    this.loadPlayers();
  }

  protected updateText(event: Event): void {
    this.text.set((event.target as HTMLInputElement).value);
  }

  protected addMessage(): void {
    const text = this.text().trim();
    if (!text) {
      return;
    }

    this.messageApi.create(text).subscribe((message) => {
      this.messages.update((messages) => [message, ...messages]);
      this.text.set('');
    });
  }

  protected deleteMessage(id: number): void {
    this.messageApi.delete(id).subscribe(() => {
      this.messages.update((messages) => messages.filter((message) => message.id !== id));
    });
  }

  protected updatePlayerName(event: Event): void {
    this.playerName.set((event.target as HTMLInputElement).value);
  }

  protected updatePlayerTeam(event: Event): void {
    this.playerTeam.set((event.target as HTMLInputElement).value);
  }

  protected addPlayer(): void {
    const name = this.playerName().trim();
    const team = this.playerTeam().trim();
    if (!name || !team) {
      return;
    }

    this.playerApi.create(name, team).subscribe((player) => {
      this.players.update((players) => [...players, player].sort((first, second) => first.name.localeCompare(second.name)));
      this.playerName.set('');
      this.playerTeam.set('');
    });
  }

  protected selectTab(tab: 'balance' | 'podium' | 'players' | 'settings'): void {
    this.activeTab.set(tab);
  }

  private loadMessages(): void {
    this.messageApi.list().subscribe((messages) => this.messages.set(messages));
  }

  private loadPlayers(): void {
    this.playerApi.list().subscribe((players) => this.players.set(players));
  }
}
