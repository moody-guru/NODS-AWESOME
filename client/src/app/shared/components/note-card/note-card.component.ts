import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="note-card" (click)="edit.emit(note)" (keydown.enter)="edit.emit(note)" tabindex="0" role="button" [attr.aria-label]="'Edit note: ' + note.title">
      <div class="note-card-header">
        <h3 class="note-title">{{ note.title }}</h3>
        <button class="btn-delete" (click)="delete.emit(note); $event.stopPropagation()" title="Delete note" aria-label="Delete note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
      <p class="note-content">{{ note.content || 'No additional content' }}</p>
      <div class="note-footer">
        <span class="note-date">{{ note.updatedAt | date:'MMM d, yyyy' }}</span>
        <span class="note-edit-hint">Edit &rarr;</span>
      </div>
    </div>
  `,
  styles: [`
    .note-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      cursor: pointer;
      transition: all var(--transition);
      display: flex;
      flex-direction: column;
      gap: 10px;
      outline: none;
      min-width: 0;
    }
    .note-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-hover);
      box-shadow: var(--shadow-lg), var(--glow);
    }
    .note-card:focus-visible {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    }
    .note-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .note-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.4;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .btn-delete {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      flex-shrink: 0;
      transition: all var(--transition);
      opacity: 0;
    }
    .note-card:hover .btn-delete {
      opacity: 1;
    }
    .btn-delete:hover {
      background: rgba(248, 113, 113, 0.1);
      color: var(--error);
    }
    .note-content {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .note-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }
    .note-date {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .note-edit-hint {
      font-size: 12px;
      color: var(--primary);
      font-weight: 500;
      opacity: 0;
      transition: opacity var(--transition);
    }
    .note-card:hover .note-edit-hint {
      opacity: 1;
    }
  `]
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();
}
