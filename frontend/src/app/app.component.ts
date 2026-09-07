import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { PlayerApiService } from './player-api.service';
import { Player } from './player';
import { FailureApiService } from './failure-api.service';
import { Failure } from './failure';
import { AccessApiService } from './access-api.service';
import { BalanceEntryApiService } from './balance-entry-api.service';
import { BalanceEntry } from './balance-entry';

type Tab = 'balance' | 'podium' | 'settings';
type ProtectedTab = 'settings';

interface PodiumPlayer {
  id: number;
  name: string;
  total: number;
  unpaidTotal: number;
}

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly playerApi = inject(PlayerApiService);
  private readonly failureApi = inject(FailureApiService);
  private readonly accessApi = inject(AccessApiService);
  private readonly balanceEntryApi = inject(BalanceEntryApiService);

  protected readonly players = signal<Player[]>([]);
  protected readonly playerName = signal('');
  protected readonly failures = signal<Failure[]>([]);
  protected readonly failureName = signal('');
  protected readonly failureAmount = signal('');
  protected readonly balanceEntries = signal<BalanceEntry[]>([]);
  protected readonly podiumPlayers = computed<PodiumPlayer[]>(() => {
    const totalsInCents = new Map<number, number>();
    const unpaidTotalsInCents = new Map<number, number>();

    for (const entry of this.balanceEntries()) {
      const amountInCents = Math.round(Number(entry.failureAmount) * 100);
      totalsInCents.set(entry.playerId, (totalsInCents.get(entry.playerId) ?? 0) + amountInCents);
      if (!entry.paid) {
        unpaidTotalsInCents.set(entry.playerId, (unpaidTotalsInCents.get(entry.playerId) ?? 0) + amountInCents);
      }
    }

    return this.players()
      .map((player) => ({
        ...player,
        total: (totalsInCents.get(player.id) ?? 0) / 100,
        unpaidTotal: (unpaidTotalsInCents.get(player.id) ?? 0) / 100
      }))
      .sort((first, second) => second.total - first.total || first.name.localeCompare(second.name, 'fr'));
  });
  protected readonly podiumTotal = computed(() => {
    const totalInCents = this.balanceEntries().reduce(
      (total, entry) => total + Math.round(Number(entry.failureAmount) * 100),
      0
    );

    return totalInCents / 100;
  });
  protected readonly selectedPlayerId = signal('');
  protected readonly selectedFailureId = signal('');
  protected readonly activeTab = signal<Tab>('podium');
  protected readonly isPodiumLoading = signal(true);
  protected readonly passwordModalOpen = signal(false);
  protected readonly password = signal('');
  protected readonly passwordError = signal(false);
  protected readonly toastMessage = signal('');
  private protectedTab: ProtectedTab | null = null;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;
  protected balanceEntryIdPendingDeletion: number | null = null;
  protected balanceEntryIdPendingPayment: number | null = null;
  protected playerIdPendingDeletion: number | null = null;
  protected failureIdPendingDeletion: number | null = null;

  constructor() {
    this.loadPlayers();
    this.loadFailures();
    this.loadBalanceEntries();
  }

  protected updatePlayerName(event: Event): void {
    this.playerName.set((event.target as HTMLInputElement).value);
  }

  protected addPlayer(): void {
    const name = this.playerName().trim();
    if (!name) {
      return;
    }

    if (this.players().some((player) => player.name.localeCompare(name, 'fr', { sensitivity: 'accent' }) === 0)) {
      this.showToast('Ce prénom est déjà utilisé.');
      return;
    }

    this.playerApi.create(name).subscribe({
      next: (player) => {
        this.players.update((players) => [...players, player].sort((first, second) => first.name.localeCompare(second.name)));
        this.playerName.set('');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.showToast('Ce prénom est déjà utilisé.');
        }
      }
    });
  }

  protected closeToast(): void {
    if (this.toastTimeout !== null) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastMessage.set('');
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

    if (this.failures().some((failure) => failure.name.localeCompare(name, 'fr', { sensitivity: 'accent' }) === 0)) {
      this.showToast('Ce nom d’échec est déjà utilisé.');
      return;
    }

    this.failureApi.create(name, amount).subscribe({
      next: (failure) => {
        this.failures.update((failures) => [...failures, failure].sort((first, second) => first.name.localeCompare(second.name)));
        this.failureName.set('');
        this.failureAmount.set('');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.showToast('Ce nom d’échec est déjà utilisé.');
        }
      }
    });
  }

  protected updateSelectedPlayer(event: Event): void {
    this.selectedPlayerId.set((event.target as HTMLSelectElement).value);
  }

  protected updateSelectedFailure(event: Event): void {
    this.selectedFailureId.set((event.target as HTMLSelectElement).value);
  }

  protected addBalanceEntry(): void {
    const playerId = Number(this.selectedPlayerId());
    const failureId = Number(this.selectedFailureId());
    if (!Number.isInteger(playerId) || playerId <= 0 || !Number.isInteger(failureId) || failureId <= 0) {
      return;
    }

    this.balanceEntryApi.create(playerId, failureId).subscribe((entry) => {
      this.balanceEntries.update((entries) => [entry, ...entries]);
      this.selectedPlayerId.set('');
      this.selectedFailureId.set('');
    });
  }

  protected requestBalanceEntryDeletion(id: number): void {
    this.clearPendingDeletions();
    this.balanceEntryIdPendingDeletion = id;
    this.password.set('');
    this.passwordError.set(false);
    this.passwordModalOpen.set(true);
  }

  protected requestBalanceEntryPayment(id: number): void {
    this.clearPendingDeletions();
    this.balanceEntryIdPendingPayment = id;
    this.password.set('');
    this.passwordError.set(false);
    this.passwordModalOpen.set(true);
  }

  protected requestPlayerDeletion(id: number): void {
    this.clearPendingDeletions();
    this.playerIdPendingDeletion = id;
    this.password.set('');
    this.passwordError.set(false);
    this.passwordModalOpen.set(true);
  }

  protected requestFailureDeletion(id: number): void {
    this.clearPendingDeletions();
    this.failureIdPendingDeletion = id;
    this.password.set('');
    this.passwordError.set(false);
    this.passwordModalOpen.set(true);
  }

  protected updatePassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
    this.passwordError.set(false);
  }

  protected verifyPassword(): void {
    const password = this.password();
    if (!password || (!this.protectedTab && !this.hasPendingAction())) {
      return;
    }

    this.accessApi.verify(password).subscribe((response) => {
      if (!response.authorized) {
        this.passwordError.set(true);
        return;
      }

      if (this.balanceEntryIdPendingDeletion !== null) {
        this.deleteBalanceEntry(this.balanceEntryIdPendingDeletion, password);
        return;
      }

      if (this.balanceEntryIdPendingPayment !== null) {
        this.markBalanceEntryAsPaid(this.balanceEntryIdPendingPayment, password);
        return;
      }

      if (this.playerIdPendingDeletion !== null) {
        this.deletePlayer(this.playerIdPendingDeletion, password);
        return;
      }

      if (this.failureIdPendingDeletion !== null) {
        this.deleteFailure(this.failureIdPendingDeletion, password);
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
    this.clearPendingDeletions();
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

  private loadPlayers(): void {
    this.playerApi.list()
      .pipe(finalize(() => this.finishInitialPodiumLoad()))
      .subscribe((players) => this.players.set(players));
  }

  private loadFailures(): void {
    this.failureApi.list()
      .pipe(finalize(() => this.finishInitialPodiumLoad()))
      .subscribe((failures) => this.failures.set(failures));
  }

  private loadBalanceEntries(): void {
    this.balanceEntryApi.list()
      .pipe(finalize(() => this.finishInitialPodiumLoad()))
      .subscribe((entries) => this.balanceEntries.set(entries));
  }

  private initialPodiumRequestsPending = 3;

  private finishInitialPodiumLoad(): void {
    this.initialPodiumRequestsPending -= 1;
    if (this.initialPodiumRequestsPending === 0) {
      this.isPodiumLoading.set(false);
    }
  }

  private deleteBalanceEntry(id: number, password: string): void {
    this.balanceEntryApi.delete(id, password).subscribe({
      next: () => {
        this.balanceEntries.update((entries) => entries.filter((entry) => entry.id !== id));
        this.clearPendingDeletions();
        this.password.set('');
        this.passwordModalOpen.set(false);
      },
      error: () => {
        this.passwordError.set(true);
      }
    });
  }

  private markBalanceEntryAsPaid(id: number, password: string): void {
    this.balanceEntryApi.markAsPaid(id, password).subscribe({
      next: (updatedEntry) => {
        this.balanceEntries.update((entries) => entries.map((entry) => entry.id === id ? updatedEntry : entry));
        this.finishDeletion();
      },
      error: () => {
        this.passwordError.set(true);
      }
    });
  }

  private deletePlayer(id: number, password: string): void {
    this.playerApi.delete(id, password).subscribe({
      next: () => {
        this.players.update((players) => players.filter((player) => player.id !== id));
        this.balanceEntries.update((entries) => entries.filter((entry) => entry.playerId !== id));
        if (this.selectedPlayerId() === String(id)) {
          this.selectedPlayerId.set('');
        }
        this.finishDeletion();
      },
      error: () => {
        this.passwordError.set(true);
      }
    });
  }

  private deleteFailure(id: number, password: string): void {
    this.failureApi.delete(id, password).subscribe({
      next: () => {
        this.failures.update((failures) => failures.filter((failure) => failure.id !== id));
        this.balanceEntries.update((entries) => entries.filter((entry) => entry.failureId !== id));
        if (this.selectedFailureId() === String(id)) {
          this.selectedFailureId.set('');
        }
        this.finishDeletion();
      },
      error: () => {
        this.passwordError.set(true);
      }
    });
  }

  private finishDeletion(): void {
    this.clearPendingDeletions();
    this.password.set('');
    this.passwordModalOpen.set(false);
  }

  private clearPendingDeletions(): void {
    this.balanceEntryIdPendingDeletion = null;
    this.balanceEntryIdPendingPayment = null;
    this.playerIdPendingDeletion = null;
    this.failureIdPendingDeletion = null;
  }

  private hasPendingAction(): boolean {
    return this.balanceEntryIdPendingDeletion !== null
      || this.balanceEntryIdPendingPayment !== null
      || this.playerIdPendingDeletion !== null
      || this.failureIdPendingDeletion !== null;
  }

  private isProtectedTab(tab: Tab): tab is ProtectedTab {
    return tab === 'settings';
  }

  private showToast(message: string): void {
    this.closeToast();
    this.toastMessage.set(message);
    this.toastTimeout = setTimeout(() => this.closeToast(), 5000);
  }
}
