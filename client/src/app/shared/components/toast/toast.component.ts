import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" [class.visible]="!!toast">
      <div class="toast" [class.toast-success]="toast.type === 'success'" [class.toast-error]="toast.type === 'error'" [class.toast-info]="toast.type === 'info'" *ngIf="toast">
        <span class="toast-icon">
          <ng-container [ngSwitch]="toast.type">
            <span *ngSwitchCase="'success'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span *ngSwitchCase="'error'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </span>
            <span *ngSwitchDefault>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
          </ng-container>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 24px;
      z-index: 10000;
      opacity: 0;
      transform: translateX(24px);
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      pointer-events: none;
    }
    .toast-container.visible {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: var(--radius-md);
      background: var(--surface-elevated);
      backdrop-filter: blur(20px);
      color: var(--text);
      font-size: 14px;
      font-weight: 500;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
      min-width: 280px;
    }
    .toast-success { border-left: 3px solid var(--success); }
    .toast-error { border-left: 3px solid var(--error); }
    .toast-info { border-left: 3px solid var(--info); }
    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .toast-success .toast-icon { background: rgba(52, 211, 153, 0.12); color: var(--success); }
    .toast-error .toast-icon { background: rgba(248, 113, 113, 0.12); color: var(--error); }
    .toast-info .toast-icon { background: rgba(96, 165, 250, 0.12); color: var(--info); }
    .toast-message { flex: 1; }
  `]
})
export class ToastComponent {
  toast: Toast | null = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe((t) => (this.toast = t));
  }
}
