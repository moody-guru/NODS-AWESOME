import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" (click)="cancel.emit()" (keydown.escape)="cancel.emit()">
      <div class="dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-label="Confirm action">
        <div class="dialog-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 class="dialog-title">Delete Note</h3>
        <p class="dialog-message">Are you sure you want to delete this note? This action cannot be undone.</p>
        <div class="dialog-actions">
          <button class="btn btn-secondary" (click)="cancel.emit()">Cancel</button>
          <button class="btn btn-danger" (click)="confirm.emit()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      animation: fadeIn 0.2s ease;
    }
    .dialog {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 36px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: var(--shadow-xl);
      animation: scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dialog-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(248, 113, 113, 0.1);
      color: var(--error);
      margin: 0 auto 16px;
    }
    .dialog-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
    }
    .dialog-message {
      margin: 0 0 24px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition);
    }
    .btn-secondary {
      background: var(--surface-hover);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover { background: var(--surface-elevated); color: var(--text); }
    .btn-danger {
      background: var(--error);
      color: #fff;
    }
    .btn-danger:hover { opacity: 0.9; }
  `]
})
export class ConfirmationDialogComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
