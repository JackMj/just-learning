import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  readonly id: number;
  readonly type: NotificationType;
  readonly message: string;
  readonly timestamp: Date;
}

/**
 * NotificationService - Injectable service demonstrating service-based state
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _counter = 0;
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  show(type: NotificationType, message: string, autoDismissMs = 3500): void {
    const notification: Notification = {
      id: ++this._counter,
      type,
      message,
      timestamp: new Date(),
    };
    this._notifications.update(n => [...n, notification]);

    if (autoDismissMs > 0) {
      setTimeout(() => this.dismiss(notification.id), autoDismissMs);
    }
  }

  success(message: string): void { this.show('success', message); }
  error(message: string): void { this.show('error', message, 5000); }
  warning(message: string): void { this.show('warning', message); }
  info(message: string): void { this.show('info', message); }

  dismiss(id: number): void {
    this._notifications.update(n => n.filter(item => item.id !== id));
  }

  dismissAll(): void {
    this._notifications.set([]);
  }
}
