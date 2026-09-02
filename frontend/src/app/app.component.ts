import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageApiService } from './message-api.service';
import { Message } from './message';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly messageApi = inject(MessageApiService);

  protected readonly messages = signal<Message[]>([]);
  protected readonly text = signal('');

  constructor() {
    this.loadMessages();
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

  private loadMessages(): void {
    this.messageApi.list().subscribe((messages) => this.messages.set(messages));
  }
}
