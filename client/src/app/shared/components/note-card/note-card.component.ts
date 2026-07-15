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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
      <p class="note-content">{{ note.content || 'No additional content' }}</p>
      <div class="note-footer">
        <span class="note-date">{{ note.updatedAt | date:'MMM d, yyyy' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .note-card {
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 14px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      flex-direction: column;
      gap: 8px;
      outline: none;
    }
    .note-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
      border-color: rgba(99, 102, 241, 0.2);
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
      color: #1a1a2e;
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
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #d1d5db;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .btn-delete:hover {
      background: rgba(239, 68, 68, 0.08);
      color: #ef4444;
    }
    .note-content {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
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
      color: #9ca3af;
      font-weight: 500;
    }
  `]
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();
}
