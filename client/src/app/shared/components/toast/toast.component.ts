import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" [class.visible]="toast">
      <div class="toast toast-{{ toast.type }}" *ngIf="toast">
        <span class="toast-icon">
          <ng-container [ngSwitch]="toast.type">
            <span *ngSwitchCase="'success'">&#10003;</span>
            <span *ngSwitchCase="'error'">&#10007;</span>
            <span *ngSwitchDefault>&#8505;</span>
          </ng-container>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 10000;
      opacity: 0;
      transform: translateY(-16px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      pointer-events: none;
    }
    .toast-container.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 12px;
      background: rgba(30, 30, 40, 0.95);
      backdrop-filter: blur(12px);
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.08);
      min-width: 280px;
    }
    .toast-success { border-left: 3px solid #4ade80; }
    .toast-error { border-left: 3px solid #f87171; }
    .toast-info { border-left: 3px solid #60a5fa; }
    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .toast-success .toast-icon { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
    .toast-error .toast-icon { background: rgba(248, 113, 113, 0.15); color: #f87171; }
    .toast-info .toast-icon { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
    .toast-message { flex: 1; }
  `]
})
export class ToastComponent {
  toast: Toast | null = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe((t) => (this.toast = t));
  }
}
