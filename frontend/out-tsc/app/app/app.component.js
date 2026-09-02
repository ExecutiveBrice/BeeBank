import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PlayerApiService } from './player-api.service';
import { FailureApiService } from './failure-api.service';
import { AccessApiService } from './access-api.service';
import { BalanceEntryApiService } from './balance-entry-api.service';
import * as i0 from "@angular/core";
const _c0 = a0 => [a0, "EUR", "symbol", "1.2-2", "fr-FR"];
const _forTrack0 = ($index, $item) => $item.id;
function AppComponent_Conditional_25_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "option", 21);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const player_r3 = ctx.$implicit;
    i0.ɵɵdomProperty("value", player_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(player_r3.name);
} }
function AppComponent_Conditional_25_For_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "option", 21);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const failure_r4 = ctx.$implicit;
    i0.ɵɵdomProperty("value", failure_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", failure_r4.name, " \u2014 ", i0.ɵɵpipeBindV(2, 3, i0.ɵɵpureFunction1(9, _c0, failure_r4.amount)));
} }
function AppComponent_Conditional_25_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p");
    i0.ɵɵtext(1, "Aucune entr\u00E9e dans le journal.");
    i0.ɵɵdomElementEnd();
} }
function AppComponent_Conditional_25_Conditional_26_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "li")(1, "div")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 26)(7, "div", 27)(8, "span");
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "currency");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(11, "time");
    i0.ɵɵtext(12);
    i0.ɵɵpipe(13, "date");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(14, "button", 28);
    i0.ɵɵdomListener("click", function AppComponent_Conditional_25_Conditional_26_For_2_Template_button_click_14_listener() { const entry_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.requestBalanceEntryDeletion(entry_r6.id)); });
    i0.ɵɵnamespaceSVG();
    i0.ɵɵdomElementStart(15, "svg", 2);
    i0.ɵɵdomElement(16, "path", 29);
    i0.ɵɵdomElementEnd()()()();
} if (rf & 2) {
    const entry_r6 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r6.playerName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u2014 ", entry_r6.failureName);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBindV(10, 6, i0.ɵɵpureFunction1(17, _c0, entry_r6.failureAmount)));
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("datetime", entry_r6.createdAt);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(13, 12, entry_r6.createdAt, "dd/MM/yyyy \u00E0 HH:mm", undefined, "fr-FR"));
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-label", "Supprimer l\u2019entr\u00E9e de " + entry_r6.playerName);
} }
function AppComponent_Conditional_25_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "ul", 25);
    i0.ɵɵrepeaterCreate(1, AppComponent_Conditional_25_Conditional_26_For_2_Template, 17, 19, "li", null, _forTrack0);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.balanceEntries());
} }
function AppComponent_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "section", 10)(1, "h1", 15);
    i0.ɵɵtext(2, "Balance");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "form", 16);
    i0.ɵɵdomListener("submit", function AppComponent_Conditional_25_Template_form_submit_3_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.addBalanceEntry(); return i0.ɵɵresetView($event.preventDefault()); });
    i0.ɵɵdomElementStart(4, "div", 17)(5, "div")(6, "label", 18);
    i0.ɵɵtext(7, "Joueur");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(8, "select", 19);
    i0.ɵɵdomListener("change", function AppComponent_Conditional_25_Template_select_change_8_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updateSelectedPlayer($event)); });
    i0.ɵɵdomElementStart(9, "option", 20);
    i0.ɵɵtext(10, "Choisir un joueur");
    i0.ɵɵdomElementEnd();
    i0.ɵɵrepeaterCreate(11, AppComponent_Conditional_25_For_12_Template, 2, 2, "option", 21, _forTrack0);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(13, "div")(14, "label", 22);
    i0.ɵɵtext(15, "\u00C9chec");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(16, "select", 23);
    i0.ɵɵdomListener("change", function AppComponent_Conditional_25_Template_select_change_16_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updateSelectedFailure($event)); });
    i0.ɵɵdomElementStart(17, "option", 20);
    i0.ɵɵtext(18, "Choisir un \u00E9chec");
    i0.ɵɵdomElementEnd();
    i0.ɵɵrepeaterCreate(19, AppComponent_Conditional_25_For_20_Template, 3, 11, "option", 21, _forTrack0);
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(21, "button", 24);
    i0.ɵɵtext(22, "Ajouter au journal");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(23, "h2");
    i0.ɵɵtext(24, "Journal");
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(25, AppComponent_Conditional_25_Conditional_25_Template, 2, 0, "p")(26, AppComponent_Conditional_25_Conditional_26_Template, 3, 0, "ul", 25);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵdomProperty("value", ctx_r1.selectedPlayerId());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.players());
    i0.ɵɵadvance(5);
    i0.ɵɵdomProperty("value", ctx_r1.selectedFailureId());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.failures());
    i0.ɵɵadvance(2);
    i0.ɵɵdomProperty("disabled", ctx_r1.players().length === 0 || ctx_r1.failures().length === 0);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.balanceEntries().length === 0 ? 25 : 26);
} }
function AppComponent_Conditional_26_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p");
    i0.ɵɵtext(1, "Aucun joueur enregistr\u00E9.");
    i0.ɵɵdomElementEnd();
} }
function AppComponent_Conditional_26_Conditional_14_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li")(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const player_r8 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(player_r8.name);
} }
function AppComponent_Conditional_26_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "ul", 35);
    i0.ɵɵrepeaterCreate(1, AppComponent_Conditional_26_Conditional_14_For_2_Template, 3, 1, "li", null, _forTrack0);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.players());
} }
function AppComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "section", 11)(1, "h1", 30);
    i0.ɵɵtext(2, "Joueurs");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "form", 16);
    i0.ɵɵdomListener("submit", function AppComponent_Conditional_26_Template_form_submit_3_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.addPlayer(); return i0.ɵɵresetView($event.preventDefault()); });
    i0.ɵɵdomElementStart(4, "div", 31)(5, "div")(6, "label", 32);
    i0.ɵɵtext(7, "Pr\u00E9nom ou surnom");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(8, "input", 33);
    i0.ɵɵdomListener("input", function AppComponent_Conditional_26_Template_input_input_8_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updatePlayerName($event)); });
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(9, "button", 34);
    i0.ɵɵtext(10, "Ajouter le joueur");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(11, "h2");
    i0.ɵɵtext(12, "Joueurs enregistr\u00E9s");
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(13, AppComponent_Conditional_26_Conditional_13_Template, 2, 0, "p")(14, AppComponent_Conditional_26_Conditional_14_Template, 3, 0, "ul", 35);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵdomProperty("value", ctx_r1.playerName());
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.players().length === 0 ? 13 : 14);
} }
function AppComponent_Conditional_27_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p");
    i0.ɵɵtext(1, "Aucun \u00E9chec enregistr\u00E9.");
    i0.ɵɵdomElementEnd();
} }
function AppComponent_Conditional_27_Conditional_18_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li")(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "span", 43);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "currency");
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const failure_r10 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(failure_r10.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBindV(5, 2, i0.ɵɵpureFunction1(8, _c0, failure_r10.amount)));
} }
function AppComponent_Conditional_27_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "ul", 42);
    i0.ɵɵrepeaterCreate(1, AppComponent_Conditional_27_Conditional_18_For_2_Template, 6, 10, "li", null, _forTrack0);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.failures());
} }
function AppComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "section", 12)(1, "h1", 36);
    i0.ɵɵtext(2, "Param\u00E9trage");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "form", 16);
    i0.ɵɵdomListener("submit", function AppComponent_Conditional_27_Template_form_submit_3_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.addFailure(); return i0.ɵɵresetView($event.preventDefault()); });
    i0.ɵɵdomElementStart(4, "div", 37)(5, "div")(6, "label", 38);
    i0.ɵɵtext(7, "\u00C9chec");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(8, "input", 39);
    i0.ɵɵdomListener("input", function AppComponent_Conditional_27_Template_input_input_8_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updateFailureName($event)); });
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(9, "div")(10, "label", 40);
    i0.ɵɵtext(11, "Valeur (\u20AC)");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(12, "input", 41);
    i0.ɵɵdomListener("input", function AppComponent_Conditional_27_Template_input_input_12_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updateFailureAmount($event)); });
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(13, "button", 34);
    i0.ɵɵtext(14, "Ajouter l\u2019\u00E9chec");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(15, "h2");
    i0.ɵɵtext(16, "\u00C9checs enregistr\u00E9s");
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(17, AppComponent_Conditional_27_Conditional_17_Template, 2, 0, "p")(18, AppComponent_Conditional_27_Conditional_18_Template, 3, 0, "ul", 42);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵdomProperty("value", ctx_r1.failureName());
    i0.ɵɵadvance(4);
    i0.ɵɵdomProperty("value", ctx_r1.failureAmount());
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.failures().length === 0 ? 17 : 18);
} }
function AppComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "section", 13)(1, "h1");
    i0.ɵɵtext(2, "Podium");
    i0.ɵɵdomElementEnd()();
} }
function AppComponent_Conditional_29_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 47);
    i0.ɵɵtext(1, "Saisissez le mot de passe pour supprimer cette entr\u00E9e.");
    i0.ɵɵdomElementEnd();
} }
function AppComponent_Conditional_29_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 50);
    i0.ɵɵtext(1, "Mot de passe incorrect.");
    i0.ɵɵdomElementEnd();
} }
function AppComponent_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "div", 44);
    i0.ɵɵdomListener("click", function AppComponent_Conditional_29_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePasswordModal()); });
    i0.ɵɵdomElementStart(1, "section", 45);
    i0.ɵɵdomListener("click", function AppComponent_Conditional_29_Template_section_click_1_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵdomElementStart(2, "h2", 46);
    i0.ɵɵtext(3, "Acc\u00E8s prot\u00E9g\u00E9");
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(4, AppComponent_Conditional_29_Conditional_4_Template, 2, 0, "p", 47);
    i0.ɵɵdomElementStart(5, "form", 16);
    i0.ɵɵdomListener("submit", function AppComponent_Conditional_29_Template_form_submit_5_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.verifyPassword(); return i0.ɵɵresetView($event.preventDefault()); });
    i0.ɵɵdomElementStart(6, "label", 48);
    i0.ɵɵtext(7, "Mot de passe");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(8, "input", 49);
    i0.ɵɵdomListener("input", function AppComponent_Conditional_29_Template_input_input_8_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updatePassword($event)); });
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(9, AppComponent_Conditional_29_Conditional_9_Template, 2, 0, "p", 50);
    i0.ɵɵdomElementStart(10, "div", 51)(11, "button", 52);
    i0.ɵɵdomListener("click", function AppComponent_Conditional_29_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePasswordModal()); });
    i0.ɵɵtext(12, "Annuler");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(13, "button", 34);
    i0.ɵɵtext(14, "Valider");
    i0.ɵɵdomElementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.balanceEntryIdPendingDeletion !== null ? 4 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵdomProperty("value", ctx_r1.password());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.passwordError() ? 9 : -1);
} }
export class AppComponent {
    constructor() {
        this.playerApi = inject(PlayerApiService);
        this.failureApi = inject(FailureApiService);
        this.accessApi = inject(AccessApiService);
        this.balanceEntryApi = inject(BalanceEntryApiService);
        this.players = signal([], /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "players" }] : /* istanbul ignore next */ []));
        this.playerName = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "playerName" }] : /* istanbul ignore next */ []));
        this.failures = signal([], /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "failures" }] : /* istanbul ignore next */ []));
        this.failureName = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "failureName" }] : /* istanbul ignore next */ []));
        this.failureAmount = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "failureAmount" }] : /* istanbul ignore next */ []));
        this.balanceEntries = signal([], /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "balanceEntries" }] : /* istanbul ignore next */ []));
        this.selectedPlayerId = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "selectedPlayerId" }] : /* istanbul ignore next */ []));
        this.selectedFailureId = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "selectedFailureId" }] : /* istanbul ignore next */ []));
        this.activeTab = signal('balance', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "activeTab" }] : /* istanbul ignore next */ []));
        this.passwordModalOpen = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "passwordModalOpen" }] : /* istanbul ignore next */ []));
        this.password = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "password" }] : /* istanbul ignore next */ []));
        this.passwordError = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "passwordError" }] : /* istanbul ignore next */ []));
        this.protectedTab = null;
        this.balanceEntryIdPendingDeletion = null;
        this.loadPlayers();
        this.loadFailures();
        this.loadBalanceEntries();
    }
    updatePlayerName(event) {
        this.playerName.set(event.target.value);
    }
    addPlayer() {
        const name = this.playerName().trim();
        if (!name) {
            return;
        }
        this.playerApi.create(name).subscribe((player) => {
            this.players.update((players) => [...players, player].sort((first, second) => first.name.localeCompare(second.name)));
            this.playerName.set('');
        });
    }
    updateFailureName(event) {
        this.failureName.set(event.target.value);
    }
    updateFailureAmount(event) {
        this.failureAmount.set(event.target.value);
    }
    addFailure() {
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
    updateSelectedPlayer(event) {
        this.selectedPlayerId.set(event.target.value);
    }
    updateSelectedFailure(event) {
        this.selectedFailureId.set(event.target.value);
    }
    addBalanceEntry() {
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
    requestBalanceEntryDeletion(id) {
        this.balanceEntryIdPendingDeletion = id;
        this.password.set('');
        this.passwordError.set(false);
        this.passwordModalOpen.set(true);
    }
    updatePassword(event) {
        this.password.set(event.target.value);
        this.passwordError.set(false);
    }
    verifyPassword() {
        const password = this.password();
        if (!password || (!this.protectedTab && this.balanceEntryIdPendingDeletion === null)) {
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
            this.activeTab.set(this.protectedTab);
            this.protectedTab = null;
            this.password.set('');
            this.passwordModalOpen.set(false);
        });
    }
    closePasswordModal() {
        this.protectedTab = null;
        this.balanceEntryIdPendingDeletion = null;
        this.password.set('');
        this.passwordError.set(false);
        this.passwordModalOpen.set(false);
    }
    selectTab(tab) {
        if (this.isProtectedTab(tab)) {
            this.protectedTab = tab;
            this.password.set('');
            this.passwordError.set(false);
            this.passwordModalOpen.set(true);
            return;
        }
        this.activeTab.set(tab);
    }
    loadPlayers() {
        this.playerApi.list().subscribe((players) => this.players.set(players));
    }
    loadFailures() {
        this.failureApi.list().subscribe((failures) => this.failures.set(failures));
    }
    loadBalanceEntries() {
        this.balanceEntryApi.list().subscribe((entries) => this.balanceEntries.set(entries));
    }
    deleteBalanceEntry(id, password) {
        this.balanceEntryApi.delete(id, password).subscribe({
            next: () => {
                this.balanceEntries.update((entries) => entries.filter((entry) => entry.id !== id));
                this.balanceEntryIdPendingDeletion = null;
                this.password.set('');
                this.passwordModalOpen.set(false);
            },
            error: () => {
                this.passwordError.set(true);
            }
        });
    }
    isProtectedTab(tab) {
        return tab === 'players' || tab === 'settings';
    }
    static { this.ɵfac = function AppComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppComponent, selectors: [["app-root"]], decls: 30, vars: 14, consts: [["aria-label", "Navigation principale", 1, "tabs"], ["type", "button", 1, "tab", 3, "click"], ["aria-hidden", "true", "viewBox", "0 0 24 24"], ["d", "M12 3v18M5 7h14M7 7l-3 6h6L7 7Zm10 0-3 6h6l-3-6ZM4 13a3 3 0 0 0 6 0m4 0a3 3 0 0 0 6 0"], ["d", "M4 20h16M5 20v-6h5v6m1 0V9h5v11M17 20v-9h3v9M7.5 5.5l1 2 2.2.2-1.7 1.5.5 2.2-2-1.1-2 1.1.5-2.2-1.7-1.5 2.2-.2 1-2Z"], ["cx", "9", "cy", "8", "r", "3"], ["cx", "17", "cy", "9", "r", "2"], ["d", "M3 20a6 6 0 0 1 12 0M15 14.5a5 5 0 0 1 5 5.5"], ["cx", "12", "cy", "12", "r", "3"], ["d", "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3.5h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V13h-.2a1.7 1.7 0 0 0-1.5 1Z"], ["aria-labelledby", "balance-heading", 1, "balance"], ["aria-labelledby", "players-heading", 1, "players"], ["aria-labelledby", "settings-heading", 1, "settings"], [1, "empty-tab"], [1, "modal-backdrop"], ["id", "balance-heading"], [3, "submit"], [1, "balance-form-fields"], ["for", "balance-player"], ["id", "balance-player", "required", "", 3, "change", "value"], ["value", "", "disabled", ""], [3, "value"], ["for", "balance-failure"], ["id", "balance-failure", "required", "", 3, "change", "value"], ["type", "submit", 3, "disabled"], [1, "balance-entries-list"], [1, "balance-entry-actions"], [1, "balance-entry-details"], ["type", "button", 1, "delete-button", 3, "click"], ["d", "M4 7h16M10 11v6M14 11v6M9 7l1-3h4l1 3M6 7l1 13h10l1-13"], ["id", "players-heading"], [1, "player-form-fields"], ["for", "player-name"], ["id", "player-name", "type", "text", "maxlength", "100", "autocomplete", "name", "required", "", 3, "input", "value"], ["type", "submit"], [1, "players-list"], ["id", "settings-heading"], [1, "failure-form-fields"], ["for", "failure-name"], ["id", "failure-name", "type", "text", "maxlength", "100", "required", "", 3, "input", "value"], ["for", "failure-amount"], ["id", "failure-amount", "type", "number", "min", "0.01", "step", "0.01", "inputmode", "decimal", "required", "", 3, "input", "value"], [1, "failures-list"], [1, "failure-amount"], [1, "modal-backdrop", 3, "click"], ["role", "dialog", "aria-modal", "true", "aria-labelledby", "password-modal-heading", 1, "password-modal", 3, "click"], ["id", "password-modal-heading"], [1, "password-hint"], ["for", "access-password"], ["id", "access-password", "type", "password", "autocomplete", "current-password", "autofocus", "", "required", "", 3, "input", "value"], [1, "password-error"], [1, "modal-actions"], ["type", "button", 3, "click"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "main")(1, "nav", 0)(2, "button", 1);
            i0.ɵɵdomListener("click", function AppComponent_Template_button_click_2_listener() { return ctx.selectTab("balance"); });
            i0.ɵɵnamespaceSVG();
            i0.ɵɵdomElementStart(3, "svg", 2);
            i0.ɵɵdomElement(4, "path", 3);
            i0.ɵɵdomElementEnd();
            i0.ɵɵnamespaceHTML();
            i0.ɵɵdomElementStart(5, "span");
            i0.ɵɵtext(6, "Balance");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(7, "button", 1);
            i0.ɵɵdomListener("click", function AppComponent_Template_button_click_7_listener() { return ctx.selectTab("podium"); });
            i0.ɵɵnamespaceSVG();
            i0.ɵɵdomElementStart(8, "svg", 2);
            i0.ɵɵdomElement(9, "path", 4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵnamespaceHTML();
            i0.ɵɵdomElementStart(10, "span");
            i0.ɵɵtext(11, "Podium");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(12, "button", 1);
            i0.ɵɵdomListener("click", function AppComponent_Template_button_click_12_listener() { return ctx.selectTab("players"); });
            i0.ɵɵnamespaceSVG();
            i0.ɵɵdomElementStart(13, "svg", 2);
            i0.ɵɵdomElement(14, "circle", 5)(15, "circle", 6)(16, "path", 7);
            i0.ɵɵdomElementEnd();
            i0.ɵɵnamespaceHTML();
            i0.ɵɵdomElementStart(17, "span");
            i0.ɵɵtext(18, "Joueurs");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(19, "button", 1);
            i0.ɵɵdomListener("click", function AppComponent_Template_button_click_19_listener() { return ctx.selectTab("settings"); });
            i0.ɵɵnamespaceSVG();
            i0.ɵɵdomElementStart(20, "svg", 2);
            i0.ɵɵdomElement(21, "circle", 8)(22, "path", 9);
            i0.ɵɵdomElementEnd();
            i0.ɵɵnamespaceHTML();
            i0.ɵɵdomElementStart(23, "span");
            i0.ɵɵtext(24, "Param\u00E9trage");
            i0.ɵɵdomElementEnd()()();
            i0.ɵɵconditionalCreate(25, AppComponent_Conditional_25_Template, 27, 4, "section", 10)(26, AppComponent_Conditional_26_Template, 15, 2, "section", 11)(27, AppComponent_Conditional_27_Template, 19, 3, "section", 12)(28, AppComponent_Conditional_28_Template, 3, 0, "section", 13);
            i0.ɵɵconditionalCreate(29, AppComponent_Conditional_29_Template, 15, 3, "div", 14);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("tab--active", ctx.activeTab() === "balance");
            i0.ɵɵattribute("aria-selected", ctx.activeTab() === "balance");
            i0.ɵɵadvance(5);
            i0.ɵɵclassProp("tab--active", ctx.activeTab() === "podium");
            i0.ɵɵattribute("aria-selected", ctx.activeTab() === "podium");
            i0.ɵɵadvance(5);
            i0.ɵɵclassProp("tab--active", ctx.activeTab() === "players");
            i0.ɵɵattribute("aria-selected", ctx.activeTab() === "players");
            i0.ɵɵadvance(7);
            i0.ɵɵclassProp("tab--active", ctx.activeTab() === "settings");
            i0.ɵɵattribute("aria-selected", ctx.activeTab() === "settings");
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.activeTab() === "balance" ? 25 : ctx.activeTab() === "players" ? 26 : ctx.activeTab() === "settings" ? 27 : 28);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.passwordModalOpen() ? 29 : -1);
        } }, dependencies: [CurrencyPipe, DatePipe], styles: ["main[_ngcontent-%COMP%] {\n  margin: 3rem auto;\n  max-width: 42rem;\n  padding: 0 1rem;\n}\n\n.tabs[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #ddd;\n  display: flex;\n  gap: 0.25rem;\n  margin-bottom: 2rem;\n}\n\n.tab[_ngcontent-%COMP%] {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  border-bottom: 3px solid transparent;\n  color: #666;\n  cursor: pointer;\n  display: inline-flex;\n  gap: 0.5rem;\n  padding: 0.75rem 1rem;\n}\n\n.tab[_ngcontent-%COMP%]:hover, \n.tab[_ngcontent-%COMP%]:focus-visible {\n  background: #f6f6f6;\n  color: #111;\n  outline: none;\n}\n\n.tab--active[_ngcontent-%COMP%] {\n  border-bottom-color: #111;\n  color: #111;\n  font-weight: 700;\n}\n\n.tab[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: none;\n  height: 1.25rem;\n  stroke: currentColor;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 1.8;\n  width: 1.25rem;\n}\n\ninput[_ngcontent-%COMP%] {\n  flex: 1;\n}\n\nul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n}\n\nli[_ngcontent-%COMP%] {\n  align-items: center;\n  border-bottom: 1px solid #ddd;\n  display: flex;\n  justify-content: space-between;\n  padding: 1rem 0;\n}\n\np[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.empty-tab[_ngcontent-%COMP%] {\n  min-height: 12rem;\n}\n\n.balance[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.balance-form-fields[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: 1fr 1fr;\n}\n\n.balance-form-fields[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.balance-form-fields[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.balance-form-fields[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\n.balance-entries-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  gap: 1rem;\n}\n\n.balance-entry-details[_ngcontent-%COMP%] {\n  display: grid;\n  font-size: 0.875rem;\n  gap: 0.25rem;\n  text-align: right;\n}\n\n.balance-entry-details[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n  color: #666;\n}\n\n.balance-entry-actions[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: 0.75rem;\n}\n\n.delete-button[_ngcontent-%COMP%] {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  border-radius: 0.25rem;\n  color: #b42318;\n  cursor: pointer;\n  display: inline-flex;\n  padding: 0.4rem;\n}\n\n.delete-button[_ngcontent-%COMP%]:hover, \n.delete-button[_ngcontent-%COMP%]:focus-visible {\n  background: #fef3f2;\n  outline: none;\n}\n\n.delete-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: none;\n  height: 1.25rem;\n  stroke: currentColor;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 1.8;\n  width: 1.25rem;\n}\n\n.players[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.player-form-fields[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: 1fr;\n}\n\n.settings[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.failure-form-fields[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(0, 2fr) minmax(10rem, 1fr);\n}\n\n.failure-form-fields[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.failure-form-fields[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.failure-form-fields[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\n.failures-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  gap: 1rem;\n}\n\n.failure-amount[_ngcontent-%COMP%] {\n  font-variant-numeric: tabular-nums;\n  text-align: right;\n}\n\n.modal-backdrop[_ngcontent-%COMP%] {\n  align-items: center;\n  background: rgb(0 0 0 / 45%);\n  display: flex;\n  inset: 0;\n  justify-content: center;\n  padding: 1rem;\n  position: fixed;\n  z-index: 1;\n}\n\n.password-modal[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 0.5rem;\n  box-shadow: 0 1rem 3rem rgb(0 0 0 / 20%);\n  max-width: 22rem;\n  padding: 1.5rem;\n  width: 100%;\n}\n\n.password-modal[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n}\n\n.password-modal[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.password-modal[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.password-modal[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\n.modal-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  justify-content: flex-end;\n  margin-top: 1rem;\n}\n\n.password-error[_ngcontent-%COMP%] {\n  color: #b42318;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n}\n\n.password-hint[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n\n.player-form-fields[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.player-form-fields[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.player-form-fields[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\nh2[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  margin: 2rem 0 0.5rem;\n}\n\n.players-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  gap: 1rem;\n}\n\n@media (max-width: 34rem) {\n  .tabs[_ngcontent-%COMP%] {\n    gap: 0;\n    justify-content: space-between;\n  }\n\n  .tab[_ngcontent-%COMP%] {\n    padding: 0.75rem 0.25rem;\n  }\n\n  .tab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .failure-form-fields[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .balance-form-fields[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppComponent, [{
        type: Component,
        args: [{ selector: 'app-root', imports: [CurrencyPipe, DatePipe], changeDetection: ChangeDetectionStrategy.OnPush, template: "<main>\n  <nav class=\"tabs\" aria-label=\"Navigation principale\">\n    <button\n      type=\"button\"\n      class=\"tab\"\n      [class.tab--active]=\"activeTab() === 'balance'\"\n      [attr.aria-selected]=\"activeTab() === 'balance'\"\n      (click)=\"selectTab('balance')\"\n    >\n      <svg aria-hidden=\"true\" viewBox=\"0 0 24 24\">\n        <path d=\"M12 3v18M5 7h14M7 7l-3 6h6L7 7Zm10 0-3 6h6l-3-6ZM4 13a3 3 0 0 0 6 0m4 0a3 3 0 0 0 6 0\" />\n      </svg>\n      <span>Balance</span>\n    </button>\n    <button\n      type=\"button\"\n      class=\"tab\"\n      [class.tab--active]=\"activeTab() === 'podium'\"\n      [attr.aria-selected]=\"activeTab() === 'podium'\"\n      (click)=\"selectTab('podium')\"\n    >\n      <svg aria-hidden=\"true\" viewBox=\"0 0 24 24\">\n        <path d=\"M4 20h16M5 20v-6h5v6m1 0V9h5v11M17 20v-9h3v9M7.5 5.5l1 2 2.2.2-1.7 1.5.5 2.2-2-1.1-2 1.1.5-2.2-1.7-1.5 2.2-.2 1-2Z\" />\n      </svg>\n      <span>Podium</span>\n    </button>\n    <button\n      type=\"button\"\n      class=\"tab\"\n      [class.tab--active]=\"activeTab() === 'players'\"\n      [attr.aria-selected]=\"activeTab() === 'players'\"\n      (click)=\"selectTab('players')\"\n    >\n      <svg aria-hidden=\"true\" viewBox=\"0 0 24 24\">\n        <circle cx=\"9\" cy=\"8\" r=\"3\" />\n        <circle cx=\"17\" cy=\"9\" r=\"2\" />\n        <path d=\"M3 20a6 6 0 0 1 12 0M15 14.5a5 5 0 0 1 5 5.5\" />\n      </svg>\n      <span>Joueurs</span>\n    </button>\n    <button\n      type=\"button\"\n      class=\"tab\"\n      [class.tab--active]=\"activeTab() === 'settings'\"\n      [attr.aria-selected]=\"activeTab() === 'settings'\"\n      (click)=\"selectTab('settings')\"\n    >\n      <svg aria-hidden=\"true\" viewBox=\"0 0 24 24\">\n        <circle cx=\"12\" cy=\"12\" r=\"3\" />\n        <path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3.5h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V13h-.2a1.7 1.7 0 0 0-1.5 1Z\" />\n      </svg>\n      <span>Param\u00E9trage</span>\n    </button>\n  </nav>\n\n  @if (activeTab() === 'balance') {\n    <section class=\"balance\" aria-labelledby=\"balance-heading\">\n      <h1 id=\"balance-heading\">Balance</h1>\n\n      <form (submit)=\"addBalanceEntry(); $event.preventDefault()\">\n        <div class=\"balance-form-fields\">\n          <div>\n            <label for=\"balance-player\">Joueur</label>\n            <select id=\"balance-player\" [value]=\"selectedPlayerId()\" (change)=\"updateSelectedPlayer($event)\" required>\n              <option value=\"\" disabled>Choisir un joueur</option>\n              @for (player of players(); track player.id) {\n                <option [value]=\"player.id\">{{ player.name }}</option>\n              }\n            </select>\n          </div>\n          <div>\n            <label for=\"balance-failure\">\u00C9chec</label>\n            <select id=\"balance-failure\" [value]=\"selectedFailureId()\" (change)=\"updateSelectedFailure($event)\" required>\n              <option value=\"\" disabled>Choisir un \u00E9chec</option>\n              @for (failure of failures(); track failure.id) {\n                <option [value]=\"failure.id\">{{ failure.name }} \u2014 {{ failure.amount | currency: 'EUR' : 'symbol' : '1.2-2' : 'fr-FR' }}</option>\n              }\n            </select>\n          </div>\n        </div>\n        <button type=\"submit\" [disabled]=\"players().length === 0 || failures().length === 0\">Ajouter au journal</button>\n      </form>\n\n      <h2>Journal</h2>\n      @if (balanceEntries().length === 0) {\n        <p>Aucune entr\u00E9e dans le journal.</p>\n      } @else {\n        <ul class=\"balance-entries-list\">\n          @for (entry of balanceEntries(); track entry.id) {\n            <li>\n              <div>\n                <strong>{{ entry.playerName }}</strong>\n                <span> \u2014 {{ entry.failureName }}</span>\n              </div>\n              <div class=\"balance-entry-actions\">\n                <div class=\"balance-entry-details\">\n                  <span>{{ entry.failureAmount | currency: 'EUR' : 'symbol' : '1.2-2' : 'fr-FR' }}</span>\n                  <time [attr.datetime]=\"entry.createdAt\">{{ entry.createdAt | date: 'dd/MM/yyyy \u00E0 HH:mm' : undefined : 'fr-FR' }}</time>\n                </div>\n                <button\n                  type=\"button\"\n                  class=\"delete-button\"\n                  [attr.aria-label]=\"'Supprimer l\u2019entr\u00E9e de ' + entry.playerName\"\n                  (click)=\"requestBalanceEntryDeletion(entry.id)\"\n                >\n                  <svg aria-hidden=\"true\" viewBox=\"0 0 24 24\">\n                    <path d=\"M4 7h16M10 11v6M14 11v6M9 7l1-3h4l1 3M6 7l1 13h10l1-13\" />\n                  </svg>\n                </button>\n              </div>\n            </li>\n          }\n        </ul>\n      }\n    </section>\n  } @else if (activeTab() === 'players') {\n    <section class=\"players\" aria-labelledby=\"players-heading\">\n      <h1 id=\"players-heading\">Joueurs</h1>\n\n      <form (submit)=\"addPlayer(); $event.preventDefault()\">\n        <div class=\"player-form-fields\">\n          <div>\n            <label for=\"player-name\">Pr\u00E9nom ou surnom</label>\n            <input\n              id=\"player-name\"\n              type=\"text\"\n              maxlength=\"100\"\n              autocomplete=\"name\"\n              [value]=\"playerName()\"\n              (input)=\"updatePlayerName($event)\"\n              required\n            >\n          </div>\n        </div>\n        <button type=\"submit\">Ajouter le joueur</button>\n      </form>\n\n      <h2>Joueurs enregistr\u00E9s</h2>\n      @if (players().length === 0) {\n        <p>Aucun joueur enregistr\u00E9.</p>\n      } @else {\n        <ul class=\"players-list\">\n          @for (player of players(); track player.id) {\n            <li>\n              <span>{{ player.name }}</span>\n            </li>\n          }\n        </ul>\n      }\n    </section>\n  } @else if (activeTab() === 'settings') {\n    <section class=\"settings\" aria-labelledby=\"settings-heading\">\n      <h1 id=\"settings-heading\">Param\u00E9trage</h1>\n\n      <form (submit)=\"addFailure(); $event.preventDefault()\">\n        <div class=\"failure-form-fields\">\n          <div>\n            <label for=\"failure-name\">\u00C9chec</label>\n            <input\n              id=\"failure-name\"\n              type=\"text\"\n              maxlength=\"100\"\n              [value]=\"failureName()\"\n              (input)=\"updateFailureName($event)\"\n              required\n            >\n          </div>\n          <div>\n            <label for=\"failure-amount\">Valeur (\u20AC)</label>\n            <input\n              id=\"failure-amount\"\n              type=\"number\"\n              min=\"0.01\"\n              step=\"0.01\"\n              inputmode=\"decimal\"\n              [value]=\"failureAmount()\"\n              (input)=\"updateFailureAmount($event)\"\n              required\n            >\n          </div>\n        </div>\n        <button type=\"submit\">Ajouter l\u2019\u00E9chec</button>\n      </form>\n\n      <h2>\u00C9checs enregistr\u00E9s</h2>\n      @if (failures().length === 0) {\n        <p>Aucun \u00E9chec enregistr\u00E9.</p>\n      } @else {\n        <ul class=\"failures-list\">\n          @for (failure of failures(); track failure.id) {\n            <li>\n              <span>{{ failure.name }}</span>\n              <span class=\"failure-amount\">{{ failure.amount | currency: 'EUR' : 'symbol' : '1.2-2' : 'fr-FR' }}</span>\n            </li>\n          }\n        </ul>\n      }\n    </section>\n  } @else {\n    <section class=\"empty-tab\">\n      <h1>Podium</h1>\n    </section>\n  }\n\n  @if (passwordModalOpen()) {\n    <div class=\"modal-backdrop\" (click)=\"closePasswordModal()\">\n      <section\n        class=\"password-modal\"\n        role=\"dialog\"\n        aria-modal=\"true\"\n        aria-labelledby=\"password-modal-heading\"\n        (click)=\"$event.stopPropagation()\"\n      >\n        <h2 id=\"password-modal-heading\">Acc\u00E8s prot\u00E9g\u00E9</h2>\n        @if (balanceEntryIdPendingDeletion !== null) {\n          <p class=\"password-hint\">Saisissez le mot de passe pour supprimer cette entr\u00E9e.</p>\n        }\n        <form (submit)=\"verifyPassword(); $event.preventDefault()\">\n          <label for=\"access-password\">Mot de passe</label>\n          <input\n            id=\"access-password\"\n            type=\"password\"\n            autocomplete=\"current-password\"\n            [value]=\"password()\"\n            (input)=\"updatePassword($event)\"\n            autofocus\n            required\n          >\n          @if (passwordError()) {\n            <p class=\"password-error\">Mot de passe incorrect.</p>\n          }\n          <div class=\"modal-actions\">\n            <button type=\"button\" (click)=\"closePasswordModal()\">Annuler</button>\n            <button type=\"submit\">Valider</button>\n          </div>\n        </form>\n      </section>\n    </div>\n  }\n</main>\n", styles: ["main {\n  margin: 3rem auto;\n  max-width: 42rem;\n  padding: 0 1rem;\n}\n\n.tabs {\n  border-bottom: 1px solid #ddd;\n  display: flex;\n  gap: 0.25rem;\n  margin-bottom: 2rem;\n}\n\n.tab {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  border-bottom: 3px solid transparent;\n  color: #666;\n  cursor: pointer;\n  display: inline-flex;\n  gap: 0.5rem;\n  padding: 0.75rem 1rem;\n}\n\n.tab:hover,\n.tab:focus-visible {\n  background: #f6f6f6;\n  color: #111;\n  outline: none;\n}\n\n.tab--active {\n  border-bottom-color: #111;\n  color: #111;\n  font-weight: 700;\n}\n\n.tab svg {\n  fill: none;\n  height: 1.25rem;\n  stroke: currentColor;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 1.8;\n  width: 1.25rem;\n}\n\ninput {\n  flex: 1;\n}\n\nul {\n  list-style: none;\n  padding: 0;\n}\n\nli {\n  align-items: center;\n  border-bottom: 1px solid #ddd;\n  display: flex;\n  justify-content: space-between;\n  padding: 1rem 0;\n}\n\np {\n  margin: 0;\n}\n\n.empty-tab {\n  min-height: 12rem;\n}\n\n.balance form {\n  display: grid;\n  gap: 1rem;\n}\n\n.balance-form-fields {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: 1fr 1fr;\n}\n\n.balance-form-fields label,\n.balance-form-fields select {\n  display: block;\n}\n\n.balance-form-fields select {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\n.balance-entries-list li {\n  align-items: flex-start;\n  gap: 1rem;\n}\n\n.balance-entry-details {\n  display: grid;\n  font-size: 0.875rem;\n  gap: 0.25rem;\n  text-align: right;\n}\n\n.balance-entry-details time {\n  color: #666;\n}\n\n.balance-entry-actions {\n  align-items: center;\n  display: flex;\n  gap: 0.75rem;\n}\n\n.delete-button {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  border-radius: 0.25rem;\n  color: #b42318;\n  cursor: pointer;\n  display: inline-flex;\n  padding: 0.4rem;\n}\n\n.delete-button:hover,\n.delete-button:focus-visible {\n  background: #fef3f2;\n  outline: none;\n}\n\n.delete-button svg {\n  fill: none;\n  height: 1.25rem;\n  stroke: currentColor;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 1.8;\n  width: 1.25rem;\n}\n\n.players form {\n  display: grid;\n  gap: 1rem;\n}\n\n.player-form-fields {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: 1fr;\n}\n\n.settings form {\n  display: grid;\n  gap: 1rem;\n}\n\n.failure-form-fields {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(0, 2fr) minmax(10rem, 1fr);\n}\n\n.failure-form-fields label,\n.failure-form-fields input {\n  display: block;\n}\n\n.failure-form-fields input {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\n.failures-list li {\n  gap: 1rem;\n}\n\n.failure-amount {\n  font-variant-numeric: tabular-nums;\n  text-align: right;\n}\n\n.modal-backdrop {\n  align-items: center;\n  background: rgb(0 0 0 / 45%);\n  display: flex;\n  inset: 0;\n  justify-content: center;\n  padding: 1rem;\n  position: fixed;\n  z-index: 1;\n}\n\n.password-modal {\n  background: #fff;\n  border-radius: 0.5rem;\n  box-shadow: 0 1rem 3rem rgb(0 0 0 / 20%);\n  max-width: 22rem;\n  padding: 1.5rem;\n  width: 100%;\n}\n\n.password-modal h2 {\n  margin: 0 0 1rem;\n}\n\n.password-modal label,\n.password-modal input {\n  display: block;\n}\n\n.password-modal input {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\n.modal-actions {\n  display: flex;\n  gap: 0.5rem;\n  justify-content: flex-end;\n  margin-top: 1rem;\n}\n\n.password-error {\n  color: #b42318;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n}\n\n.password-hint {\n  margin-bottom: 1rem;\n}\n\n.player-form-fields label,\n.player-form-fields input {\n  display: block;\n}\n\n.player-form-fields input {\n  box-sizing: border-box;\n  margin-top: 0.5rem;\n  width: 100%;\n}\n\nh2 {\n  font-size: 1.125rem;\n  margin: 2rem 0 0.5rem;\n}\n\n.players-list li {\n  gap: 1rem;\n}\n\n@media (max-width: 34rem) {\n  .tabs {\n    gap: 0;\n    justify-content: space-between;\n  }\n\n  .tab {\n    padding: 0.75rem 0.25rem;\n  }\n\n  .tab span {\n    display: none;\n  }\n\n  .failure-form-fields {\n    grid-template-columns: 1fr;\n  }\n\n  .balance-form-fields {\n    grid-template-columns: 1fr;\n  }\n}\n"] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "app/app.component.ts", lineNumber: 21 }); })();
//# sourceMappingURL=app.component.js.map