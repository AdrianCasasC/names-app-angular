import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notification = signal<Notification | null>(null);
  notification = computed(() => this._notification());

  closeNotification(): void {
    this._notification.set(null);
  }

  createNotification(content: Notification) {
    this._notification.set(content);

    setTimeout(() => this.closeNotification(), 5000);
  }
}

export interface Notification {
  type: 'success' | 'error';
  message: string;
  icon: string;
}
