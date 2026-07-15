import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { ToastService } from '../../services/toast.service';
import { Note } from '../../models/note.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NoteCardComponent } from '../../shared/components/note-card/note-card.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    NoteCardComponent,
    ConfirmationDialogComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <main class="dashboard">
      <div class="dashboard-inner">
        <div class="dashboard-header">
          <div>
            <h1 class="page-title">My Notes</h1>
            <p class="page-subtitle">{{ notes.length }} note{{ notes.length !== 1 ? 's' : '' }}</p>
          </div>
          <button class="btn-add" (click)="openCreateModal()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Note
          </button>
        </div>

        <div class="note-modal-overlay" *ngIf="showModal" (click)="closeModal()">
          <div class="note-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="modal-title">{{ editingNote ? 'Edit Note' : 'New Note' }}</h2>
              <button class="btn-close" (click)="closeModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form [formGroup]="noteForm" (ngSubmit)="saveNote()" class="modal-form">
              <div class="form-group">
                <input
                  type="text"
                  formControlName="title"
                  class="form-input title-input"
                  placeholder="Note title"
                  [class.input-error]="title?.invalid && title?.touched"
                />
                <span class="error-text" *ngIf="title?.invalid && title?.touched">
                  Title is required
                </span>
              </div>
              <div class="form-group">
                <textarea
                  formControlName="content"
                  class="form-input content-input"
                  placeholder="Start writing..."
                  rows="6"
                ></textarea>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="noteForm.invalid || saving">
                  <span *ngIf="!saving">{{ editingNote ? 'Save Changes' : 'Create Note' }}</span>
                  <span *ngIf="saving" class="spinner-sm"></span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="notes-grid" *ngIf="notes.length > 0">
          <app-note-card
            *ngFor="let note of notes"
            [note]="note"
            (edit)="openEditModal($event)"
            (delete)="confirmDelete($event)"
          ></app-note-card>
        </div>

        <div class="empty-state" *ngIf="notes.length === 0 && !loading">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <h2 class="empty-title">No notes yet</h2>
          <p class="empty-text">Create your first note to get started</p>
          <button class="btn-add empty-btn" (click)="openCreateModal()">Create Note</button>
        </div>

        <div class="loading-state" *ngIf="loading">
          <div class="loader"></div>
        </div>
      </div>
    </main>

    <app-confirmation-dialog
      *ngIf="showDeleteDialog"
      (confirm)="deleteNote()"
      (cancel)="showDeleteDialog = false"
    ></app-confirmation-dialog>
  `,
  styles: [`
    .dashboard { min-height: calc(100vh - 64px); background: #f8f9fb; }
    .dashboard-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }
    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    .page-title {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: -0.5px;
    }
    .page-subtitle {
      margin: 4px 0 0;
      font-size: 14px;
      color: #9ca3af;
      font-weight: 500;
    }
    .btn-add {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
    }
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.06);
      color: #6366f1;
      margin-bottom: 8px;
    }
    .empty-title { margin: 0; font-size: 20px; font-weight: 600; color: #1a1a2e; }
    .empty-text { margin: 0; font-size: 15px; color: #6b7280; }
    .empty-btn { margin-top: 8px; }

    .loading-state { display: flex; justify-content: center; padding: 80px 0; }
    .loader {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(99, 102, 241, 0.15);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .note-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      padding: 24px;
      animation: fadeIn 0.2s ease;
    }
    .note-modal {
      background: #fff;
      border-radius: 16px;
      width: 100%;
      max-width: 540px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
      animation: scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 24px 0;
    }
    .modal-title { margin: 0; font-size: 18px; font-weight: 600; color: #1a1a2e; }
    .btn-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #9ca3af;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-close:hover { background: #f3f4f6; color: #374151; }
    .modal-form {
      padding: 20px 24px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-input {
      padding: 12px 16px;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      font-size: 15px;
      color: #1a1a2e;
      background: #f9fafb;
      transition: all 0.2s;
      outline: none;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: #6366f1;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .title-input { font-size: 17px; font-weight: 600; }
    .content-input {
      resize: vertical;
      min-height: 120px;
      line-height: 1.6;
    }
    .form-input.input-error { border-color: #ef4444; background: #fef2f2; }
    .error-text { font-size: 12px; color: #ef4444; font-weight: 500; }
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 8px;
    }
    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-secondary { background: #f3f4f6; color: #374151; }
    .btn-secondary:hover { background: #e5e7eb; }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      min-width: 120px;
      height: 40px;
    }
    .btn-primary:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .spinner-sm {
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @media (max-width: 640px) {
      .dashboard-inner { padding: 20px 16px 40px; }
      .dashboard-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .page-title { font-size: 24px; }
      .notes-grid { grid-template-columns: 1fr; }
      .note-modal { margin: 16px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  notes: Note[] = [];
  loading = true;
  showModal = false;
  showDeleteDialog = false;
  editingNote: Note | null = null;
  noteToDelete: Note | null = null;
  saving = false;

  noteForm;

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private toast: ToastService
  ) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', Validators.maxLength(10000)],
    });
  }

  get title() { return this.noteForm.get('title'); }

  ngOnInit(): void {
    this.noteService.notes$.subscribe((notes) => {
      this.notes = notes;
      this.loading = false;
    });
    this.noteService.loadNotes();
  }

  openCreateModal(): void {
    this.editingNote = null;
    this.noteForm.reset({ title: '', content: '' });
    this.showModal = true;
  }

  openEditModal(note: Note): void {
    this.editingNote = note;
    this.noteForm.setValue({ title: note.title, content: note.content || '' });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingNote = null;
    this.noteForm.reset();
  }

  saveNote(): void {
    if (this.noteForm.invalid) return;
    this.saving = true;
    const { title, content } = this.noteForm.value as { title: string; content: string };

    const action = this.editingNote
      ? this.noteService.updateNote(this.editingNote._id, title, content)
      : this.noteService.createNote(title, content);

    action.subscribe({
      next: () => {
        this.toast.show(
          this.editingNote ? 'Note updated' : 'Note created',
          'success'
        );
        this.closeModal();
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;
        this.toast.show(err.error?.message || 'Something went wrong', 'error');
      },
    });
  }

  confirmDelete(note: Note): void {
    this.noteToDelete = note;
    this.showDeleteDialog = true;
  }

  deleteNote(): void {
    if (!this.noteToDelete) return;
    this.noteService.deleteNote(this.noteToDelete._id).subscribe({
      next: () => {
        this.toast.show('Note deleted', 'success');
        this.showDeleteDialog = false;
        this.noteToDelete = null;
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Delete failed', 'error');
      },
    });
  }
}
