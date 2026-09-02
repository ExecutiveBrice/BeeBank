import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MessageApiService } from './message-api.service';
import { Message } from './message';
import { PlayerApiService } from './player-api.service';
import { Player } from './player';
import { FailureApiService } from './failure-api.service';
import { Failure } from './failure';
import { AccessApiService } from './access-api.service';

type Tab = 'balance' | 'podium' | 'players' | 'settings';
type ProtectedTab = 'players' | 'settings';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly messageApi = inject(MessageApiService);
  private readonly playerApi = inject(PlayerApiService);
  private readonly failureApi = inject(FailureApiService);
  private readonly accessApi = inject(AccessApiService);

  protected readonly messages = signal<Message[]>([]);
  protected readonly text = signal('');
  protected readonly players = signal<Player[]>([]);
  protected readonly playerName = signal('');
  protected readonly failures = signal<Failure[]>([]);
  protected readonly failureName = signal('');
  protected readonly failureAmount = signal('');
  protected readonly activeTab = signal<Tab>('balance');
  protected readonly passwordModalOpen = signal(false);
  protected readonly password = signal('');
  protected readonly passwordError = signal(false);
  private protectedTab: ProtectedTab | null = null;

  constructor() {
    this.loadMessages();
    this.loadPlayers();
    this.loadFailures();
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

  protected addPlayer(): void {
    const name = this.playerName().trim();
    if (!name) {
      return;
    }

    this.playerApi.create(name).subscribe((player) => {
      this.players.update((players) => [...players, player].sort((first, second) => first.name.localeCompare(second.name)));
      this.playerName.set('');
    });
  }

  protected updateFailureName(event: Event): void {
    this.failureName.set((event.target as HTMLInputElement).value);
  }

  protected updateFailureAmount(event: Event): void {
    this.failureAmount.set((event.target as HTMLInputElement).value);
  }

  protected addFailure(): void {
    const name = this.failureName().trim();
    const amount = Number(this.failureAmount());
    if (!name || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    this.failureApi.create(name, amount).subscribe((failure) => {
      this.failures.update((failures) => [...failures, failure].sort((first, second) => first.name.localeCompare(second.name)));
      this.failureName.set('');
      this.failureAmount.set('');
    });
  }

  protected updatePassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
    this.passwordError.set(false);
  }

  protected verifyPassword(): void {
    const password = this.password();
    if (!password || !this.protectedTab) {
      return;
    }

    this.accessApi.verify(password).subscribe((response) => {
      if (!response.authorized) {
        this.passwordError.set(true);
        return;
      }

      this.activeTab.set(this.protectedTab!);
      this.protectedTab = null;
      this.password.set('');
      this.passwordModalOpen.set(false);
    });
  }

  protected closePasswordModal(): void {
    this.protectedTab = null;
    this.password.set('');
    this.passwordError.set(false);
    this.passwordModalOpen.set(false);
  }

  protected selectTab(tab: Tab): void {
    if (this.isProtectedTab(tab)) {
      this.protectedTab = tab;
      this.password.set('');
      this.passwordError.set(false);
      this.passwordModalOpen.set(true);
      return;
    }

    this.activeTab.set(tab);
  }

  private loadMessages(): void {
    this.messageApi.list().subscribe((messages) => this.messages.set(messages));
  }

  private loadPlayers(): void {
    this.playerApi.list().subscribe((players) => this.players.set(players));
  }

  private loadFailures(): void {
    this.failureApi.list().subscribe((failures) => this.failures.set(failures));
  }

  private isProtectedTab(tab: Tab): tab is ProtectedTab {
    return tab === 'players' || tab === 'settings';
  }
}
