import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { PlayerApiService } from './player-api.service';
import { Player } from './player';
import { FailureApiService } from './failure-api.service';
import { Failure } from './failure';
import { AccessApiService } from './access-api.service';
import { BalanceEntryApiService } from './balance-entry-api.service';
import { BalanceEntry } from './balance-entry';

type Tab = 'balance' | 'podium' | 'settings';
type ProtectedTab = 'settings';
type BatchAction = 'payment' | 'deletion';

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
  protected readonly failureFreeAmount = signal(false);
  protected readonly pendingBalanceEntry = signal<{ player: Player; failure: Failure } | null>(null);
  protected readonly selectionModalOpen = signal(false);
  protected readonly selectedFailureQuantities = signal<Record<number, number>>({});
  protected readonly selectedFailureAmounts = signal<Record<number, number>>({});
  protected readonly selectionError = signal('');
  protected readonly selectedFineCount = computed(() =>
    Object.values(this.selectedFailureQuantities()).reduce((total, quantity) => total + quantity, 0)
  );
  protected readonly balanceEntryAmount = signal('');
  protected readonly balanceEntryAmountError = signal('');
  protected readonly isAddingBalanceEntry = signal(false);
  private readonly amountDialog = viewChild<ElementRef<HTMLDialogElement>>('amountDialog');
  private readonly selectionDialog = viewChild<ElementRef<HTMLDialogElement>>('selectionDialog');
  private readonly batchDialog = viewChild<ElementRef<HTMLDialogElement>>('batchDialog');
  protected readonly balanceEntries = signal<BalanceEntry[]>([]);
  protected readonly batchSelectionMode = signal<BatchAction | null>(null);
  protected readonly selectedBalanceEntryIds = signal<number[]>([]);
  protected readonly batchEligibleEntries = computed(() => this.balanceEntries().filter((entry) => !entry.paid));
  protected readonly isApplyingBatch = signal(false);
  protected readonly batchActionError = signal('');
  protected pendingBatchAction: BatchAction | null = null;
  private authorizedBatchPassword: string | null = null;
  protected readonly balanceEntryGroups = computed(() => [
    {
      paid: false,
      label: 'Amendes non payées',
      entries: this.balanceEntries().filter((entry) => !entry.paid),
      emptyMessage: 'Aucune amende à payer.'
    },
    {
      paid: true,
      label: 'Amendes payées',
      entries: this.balanceEntries().filter((entry) => entry.paid),
      emptyMessage: 'Aucune amende déjà payée.'
    }
  ]);
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
  protected readonly selectedPlayerName = computed(() =>
    this.players().find((player) => String(player.id) === this.selectedPlayerId())?.name ?? ''
  );
  protected readonly activeTab = signal<Tab>('podium');
  protected readonly isPodiumLoading = signal(true);
  protected readonly passwordModalOpen = signal(false);
  protected readonly password = signal('');
  protected readonly passwordError = signal(false);
  protected readonly toastMessage = signal('');
  private protectedTab: ProtectedTab | null = null;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;
  protected balanceEntryIdPendingDeletion: number | null = null;
  protected playerIdPendingDeletion: number | null = null;
  protected failureIdPendingDeletion: number | null = null;

  constructor() {
    effect(() => {
      const amountDialog = this.amountDialog()?.nativeElement;
      const selectionDialog = this.selectionDialog()?.nativeElement;
      const batchDialog = this.batchDialog()?.nativeElement;
      if (this.pendingBalanceEntry()) {
        if (selectionDialog?.open) {
          selectionDialog.close();
        }
        if (amountDialog && !amountDialog.open) {
          amountDialog.showModal();
        }
      } else if (this.selectionModalOpen()) {
        if (amountDialog?.open) {
          amountDialog.close();
        }
        if (selectionDialog && !selectionDialog.open) {
          selectionDialog.showModal();
        }
      } else {
        if (amountDialog?.open) {
          amountDialog.close();
        }
        if (selectionDialog?.open) {
          selectionDialog.close();
        }
      }
      if (this.batchSelectionMode()) {
        if (batchDialog && !batchDialog.open) {
          batchDialog.showModal();
        }
      } else if (batchDialog?.open) {
        batchDialog.close();
      }
    });
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

  protected updateFailureFreeAmount(event: Event): void {
    this.failureFreeAmount.set((event.target as HTMLInputElement).checked);
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

    this.failureApi.create(name, amount, this.failureFreeAmount()).subscribe({
      next: (failure) => {
        this.failures.update((failures) => [...failures, failure].sort((first, second) => first.name.localeCompare(second.name)));
        this.failureName.set('');
        this.failureAmount.set('');
        this.failureFreeAmount.set(false);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.showToast('Ce nom d’échec est déjà utilisé.');
        }
      }
    });
  }

  protected updateSelectedPlayer(event: Event): void {
    const playerId = (event.target as HTMLSelectElement).value;
    this.selectedPlayerId.set(playerId);
    this.selectedFailureQuantities.set({});
    this.selectedFailureAmounts.set({});
    this.selectionError.set('');
    this.selectionModalOpen.set(Boolean(playerId));
  }

  protected fineQuantity(failureId: number): number {
    return this.selectedFailureQuantities()[failureId] ?? 0;
  }

  protected changeFineQuantity(failure: Failure, change: number): void {
    if (this.isAddingBalanceEntry()) {
      return;
    }
    const current = this.fineQuantity(failure.id);
    const next = Math.max(0, Math.min(failure.freeAmount ? 1 : Number.MAX_SAFE_INTEGER, current + change));
    if (next === current) {
      return;
    }
    this.selectedFailureQuantities.update((quantities) => ({ ...quantities, [failure.id]: next }));
    if (next === 0) {
      this.selectedFailureAmounts.update((amounts) => {
        const updated = { ...amounts };
        delete updated[failure.id];
        return updated;
      });
    }
    this.selectionError.set('');
  }

  protected validateFineSelection(): void {
    if (this.isAddingBalanceEntry() || this.selectedFineCount() === 0) {
      return;
    }
    this.selectionError.set('');
    this.selectionModalOpen.set(false);
    this.promptNextFineAmount();
  }

  protected closeSelectionModal(event?: Event): void {
    event?.preventDefault();
    if (this.isAddingBalanceEntry()) {
      return;
    }
    this.resetFineSelection();
  }

  protected updateBalanceEntryAmount(event: Event): void {
    this.balanceEntryAmount.set((event.target as HTMLInputElement).value);
    this.balanceEntryAmountError.set('');
  }

  protected confirmBalanceEntry(): void {
    const pending = this.pendingBalanceEntry();
    const amount = Number(this.balanceEntryAmount());
    if (!pending || this.isAddingBalanceEntry() || !Number.isFinite(amount)
      || amount < 0.01 || amount > 99999999.99
      || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001) {
      return;
    }

    this.selectedFailureAmounts.update((amounts) => ({ ...amounts, [pending.failure.id]: amount }));
    this.amountDialog()?.nativeElement.close();
    this.pendingBalanceEntry.set(null);
    this.promptNextFineAmount();
  }

  protected closeAmountModal(event?: Event): void {
    event?.preventDefault();
    if (!this.isAddingBalanceEntry()) {
      this.resetFineSelection();
    }
  }

  protected onAmountDialogClick(event: MouseEvent): void {
    if (this.clickedOutsideDialog(event, this.amountDialog()!.nativeElement)) {
      this.closeAmountModal();
    }
  }

  protected onSelectionDialogClick(event: MouseEvent): void {
    if (this.clickedOutsideDialog(event, this.selectionDialog()!.nativeElement)) {
      this.closeSelectionModal();
    }
  }

  protected requestBatchSelection(mode: BatchAction): void {
    this.selectedBalanceEntryIds.set([]);
    this.pendingBatchAction = mode;
    this.authorizedBatchPassword = null;
    this.password.set('');
    this.passwordError.set(false);
    this.batchActionError.set('');
    this.passwordModalOpen.set(true);
  }

  protected toggleBalanceEntrySelection(id: number, event: Event): void {
    if (this.isApplyingBatch()) {
      return;
    }
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedBalanceEntryIds.update((ids) => checked ? [...ids, id] : ids.filter((entryId) => entryId !== id));
  }

  protected validateBatchSelection(): void {
    if (this.selectedBalanceEntryIds().length === 0 || this.isApplyingBatch() || !this.authorizedBatchPassword) {
      return;
    }
    this.batchActionError.set('');
    this.applyBatchAction(this.authorizedBatchPassword);
  }

  protected closeBatchSelection(event?: Event): void {
    event?.preventDefault();
    if (this.isApplyingBatch()) {
      return;
    }
    this.resetBatchSelection();
  }

  private resetBatchSelection(): void {
    this.batchSelectionMode.set(null);
    this.selectedBalanceEntryIds.set([]);
    this.authorizedBatchPassword = null;
    this.batchActionError.set('');
  }

  protected onBatchDialogClick(event: MouseEvent): void {
    if (this.clickedOutsideDialog(event, this.batchDialog()!.nativeElement)) {
      this.closeBatchSelection();
    }
  }

  private clickedOutsideDialog(event: MouseEvent, dialog: HTMLDialogElement): boolean {
    if (event.target !== event.currentTarget) {
      return false;
    }
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  private promptNextFineAmount(): void {
    const player = this.players().find((item) => String(item.id) === this.selectedPlayerId());
    if (!player) {
      this.resetFineSelection();
      return;
    }
    const failure = this.failures().find((item) => item.freeAmount && this.fineQuantity(item.id) > 0
      && this.selectedFailureAmounts()[item.id] === undefined);
    if (failure) {
      this.balanceEntryAmount.set(String(failure.amount));
      this.balanceEntryAmountError.set('');
      this.pendingBalanceEntry.set({ player, failure });
      return;
    }
    this.submitFineSelection(player.id);
  }

  private submitFineSelection(playerId: number): void {
    const selections = this.failures()
      .filter((failure) => this.fineQuantity(failure.id) > 0)
      .map((failure) => ({
        failureId: failure.id,
        quantity: this.fineQuantity(failure.id),
        amount: failure.freeAmount ? this.selectedFailureAmounts()[failure.id] : undefined
      }));
    if (selections.length === 0 || this.isAddingBalanceEntry()) {
      return;
    }
    this.balanceEntryAmountError.set('');
    this.isAddingBalanceEntry.set(true);
    this.balanceEntryApi.createBatch(playerId, selections)
      .pipe(finalize(() => this.isAddingBalanceEntry.set(false)))
      .subscribe({
        next: (createdEntries) => {
          this.balanceEntries.update((entries) => [...createdEntries].reverse().concat(entries));
          this.resetFineSelection();
        },
        error: () => {
          this.pendingBalanceEntry.set(null);
          this.selectionError.set('Impossible d’ajouter les amendes. Veuillez réessayer.');
          this.selectionModalOpen.set(true);
        }
      });
  }

  private resetFineSelection(): void {
    this.selectionModalOpen.set(false);
    this.pendingBalanceEntry.set(null);
    this.selectedPlayerId.set('');
    this.selectedFailureQuantities.set({});
    this.selectedFailureAmounts.set({});
    this.balanceEntryAmount.set('');
    this.balanceEntryAmountError.set('');
    this.selectionError.set('');
  }

  protected requestBalanceEntryDeletion(id: number): void {
    this.clearPendingDeletions();
    this.balanceEntryIdPendingDeletion = id;
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
    this.batchActionError.set('');
  }

  protected verifyPassword(): void {
    const password = this.password();
    if (!password || this.isApplyingBatch() || (!this.protectedTab && !this.hasPendingAction() && !this.pendingBatchAction)) {
      return;
    }

    this.accessApi.verify(password).subscribe((response) => {
      if (!response.authorized) {
        this.passwordError.set(true);
        return;
      }

      if (this.pendingBatchAction) {
        this.authorizedBatchPassword = password;
        this.batchSelectionMode.set(this.pendingBatchAction);
        this.pendingBatchAction = null;
        this.password.set('');
        this.passwordError.set(false);
        this.passwordModalOpen.set(false);
        return;
      }

      if (this.balanceEntryIdPendingDeletion !== null) {
        this.deleteBalanceEntry(this.balanceEntryIdPendingDeletion, password);
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
    this.pendingBatchAction = null;
    this.selectedBalanceEntryIds.set([]);
    this.authorizedBatchPassword = null;
    this.batchActionError.set('');
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

  private applyBatchAction(password: string): void {
    const ids = this.selectedBalanceEntryIds();
    const action = this.batchSelectionMode();
    if (!action || ids.length === 0) {
      return;
    }
    this.isApplyingBatch.set(true);
    const request: Observable<BalanceEntry[] | void> = action === 'payment'
      ? this.balanceEntryApi.markBatchAsPaid(ids, password)
      : this.balanceEntryApi.deleteBatch(ids, password);
    request.pipe(finalize(() => this.isApplyingBatch.set(false))).subscribe({
      next: (result) => {
        if (action === 'payment') {
          const updated = new Map((result as BalanceEntry[]).map((entry) => [entry.id, entry]));
          this.balanceEntries.update((entries) => entries.map((entry) => updated.get(entry.id) ?? entry));
        } else {
          const deleted = new Set(ids);
          this.balanceEntries.update((entries) => entries.filter((entry) => !deleted.has(entry.id)));
        }
        this.resetBatchSelection();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.pendingBatchAction = action;
          this.batchSelectionMode.set(null);
          this.authorizedBatchPassword = null;
          this.password.set('');
          this.passwordError.set(true);
          this.passwordModalOpen.set(true);
        } else {
          this.batchActionError.set('Impossible de modifier les amendes. Veuillez réessayer.');
        }
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
        this.selectedFailureQuantities.update((quantities) => {
          const updated = { ...quantities };
          delete updated[id];
          return updated;
        });
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
    this.playerIdPendingDeletion = null;
    this.failureIdPendingDeletion = null;
  }

  private hasPendingAction(): boolean {
    return this.balanceEntryIdPendingDeletion !== null
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
