import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" aria-live="polite">
      @for (notif of notifications(); track notif.id) {
        <div
          class="toast"
          [ngClass]="'toast--' + notif.type"
          role="alert"
        >
          <span class="toast__icon">{{ iconFor(notif.type) }}</span>
          <span class="toast__message">{{ notif.message }}</span>
          <button
            class="toast__close"
            (click)="dismiss(notif.id)"
            aria-label="Dismiss notification"
          >✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 360px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid;
      animation: slideIn 0.2s ease;
      font-size: 0.9rem;

      &__message { flex: 1; }
      &__icon { font-size: 1.1rem; }
      &__close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.8rem;
        opacity: 0.6;
        padding: 2px 6px;
        border-radius: 4px;
        transition: opacity 0.15s;
        &:hover { opacity: 1; }
      }

      &--success { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.3); color: #4ade80; }
      &--error   { background: rgba(239,68,68,0.15);  border-color: rgba(239,68,68,0.3);  color: #f87171; }
      &--warning { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.3); color: #fbbf24; }
      &--info    { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.3); color: #60a5fa; }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class NotificationToastComponent {
  private readonly notifService = inject(NotificationService);
  readonly notifications = this.notifService.notifications;

  iconFor(type: string): string {
    const icons: Record<string, string> = {
      success: '✓', error: '✕', warning: '⚠', info: 'ℹ',
    };
    return icons[type] ?? 'ℹ';
  }

  dismiss(id: number): void {
    this.notifService.dismiss(id);
  }
}
