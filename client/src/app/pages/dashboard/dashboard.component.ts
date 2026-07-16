import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
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
        <div class="welcome-section">
          <div class="welcome-text">
            <h1 class="welcome-greeting">{{ greeting }}, <span class="welcome-name">{{ userName }}</span></h1>
            <p class="welcome-subtitle">{{ notes.length > 0 ? 'You have ' + notes.length + ' note' + (notes.length !== 1 ? 's' : '') : 'Start creating your first note' }}</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-card">
              <span class="stat-value">{{ notes.length }}</span>
              <span class="stat-label">Total Notes</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ recentCount }}</span>
              <span class="stat-label">This Week</span>
            </div>
          </div>
        </div>

        <div class="notes-toolbar" *ngIf="notes.length > 0">
          <div class="toolbar-left">
            <div class="view-toggle">
              <button class="view-btn" [class.active]="viewMode === 'carousel'" (click)="viewMode = 'carousel'" title="Carousel view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
              <button class="view-btn" [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'" title="Grid view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </button>
            </div>
          </div>
          <div class="toolbar-right">
            <span class="note-count">{{ notes.length }} note{{ notes.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <div class="notes-carousel" *ngIf="notes.length > 0 && viewMode === 'carousel'" #carouselContainer>
          <div class="carousel-track" #carouselTrack>
            <app-note-card
              *ngFor="let note of notes"
              [note]="note"
              (edit)="openEditModal($event)"
              (delete)="confirmDelete($event)"
            ></app-note-card>
          </div>
          <div class="carousel-fade-left" aria-hidden="true"></div>
          <div class="carousel-fade-right" aria-hidden="true"></div>
        </div>

        <div class="notes-grid" *ngIf="notes.length > 0 && viewMode === 'grid'">
          <app-note-card
            *ngFor="let note of notes"
            [note]="note"
            (edit)="openEditModal($event)"
            (delete)="confirmDelete($event)"
          ></app-note-card>
        </div>

        <div class="skeleton-section" *ngIf="loading">
          <div class="skeleton-cards">
            <div class="skeleton-card" *ngFor="let _ of [].constructor(6)">
              <div class="skeleton-line skeleton-line-title"></div>
              <div class="skeleton-line skeleton-line-text"></div>
              <div class="skeleton-line skeleton-line-text short"></div>
              <div class="skeleton-line skeleton-line-date"></div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="notes.length === 0 && !loading">
          <div class="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
            </svg>
          </div>
          <h2 class="empty-title">No notes yet</h2>
          <p class="empty-text">Create your first note to get started</p>
          <button class="btn-primary empty-btn" (click)="openCreateModal()">Create Note</button>
        </div>
      </div>
    </main>

    <button class="fab" (click)="openCreateModal()" title="New Note">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>

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
              autofocus
            />
            <span class="error-text" *ngIf="title?.invalid && title?.touched">Title is required</span>
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

    <app-confirmation-dialog
      *ngIf="showDeleteDialog"
      (confirm)="deleteNote()"
      (cancel)="showDeleteDialog = false"
    ></app-confirmation-dialog>
  `,
  styles: [`
    .dashboard { min-height: calc(100vh - 64px); }
    .dashboard-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 100px;
      animation: slideUp 0.5s var(--transition);
    }

    .welcome-section {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 36px;
      gap: 24px;
    }
    .welcome-greeting {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.5px;
      line-height: 1.3;
    }
    .welcome-name {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .welcome-subtitle {
      margin: 6px 0 0;
      font-size: 15px;
      color: var(--text-secondary);
    }
    .welcome-stats {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 16px 24px;
      text-align: center;
      min-width: 110px;
    }
    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
    }
    .stat-label {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
      font-weight: 500;
    }

    .notes-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .toolbar-left { display: flex; align-items: center; gap: 12px; }
    .view-toggle {
      display: flex;
      gap: 4px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 4px;
    }
    .view-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all var(--transition);
    }
    .view-btn.active {
      background: var(--surface-elevated);
      color: var(--text);
    }
    .view-btn:hover:not(.active) { color: var(--text-secondary); }
    .note-count {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .notes-carousel {
      position: relative;
      margin: 0 -24px;
      padding: 0 24px;
    }
    .carousel-track {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 8px;
      scrollbar-width: none;
    }
    .carousel-track::-webkit-scrollbar { display: none; }
    .carousel-track > app-note-card {
      flex: 0 0 320px;
      scroll-snap-align: start;
    }
    .carousel-fade-left, .carousel-fade-right {
      position: absolute;
      top: 0;
      bottom: 8px;
      width: 60px;
      pointer-events: none;
      z-index: 2;
    }
    .carousel-fade-left {
      left: 0;
      background: linear-gradient(to right, var(--bg), transparent);
    }
    .carousel-fade-right {
      right: 0;
      background: linear-gradient(to left, var(--bg), transparent);
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      animation: fadeIn 0.3s ease;
    }

    .skeleton-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .skeleton-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .skeleton-line {
      height: 14px;
      border-radius: 6px;
      background: linear-gradient(90deg, var(--surface-hover) 25%, var(--surface-elevated) 50%, var(--surface-hover) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }
    .skeleton-line-title { width: 80%; height: 18px; }
    .skeleton-line-text { width: 100%; }
    .skeleton-line-text.short { width: 60%; }
    .skeleton-line-date { width: 40%; height: 12px; }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .empty-illustration {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(139, 92, 246, 0.1));
      color: var(--primary);
      margin-bottom: 8px;
    }
    .empty-title { margin: 0; font-size: 22px; font-weight: 600; color: var(--text); }
    .empty-text { margin: 0; font-size: 15px; color: var(--text-secondary); }
    .empty-btn { margin-top: 8px; }

    .fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 56px;
      height: 56px;
      border: none;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(99, 102, 241, 0.35);
      transition: all var(--transition);
      z-index: 50;
    }
    .fab:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45);
    }
    .fab:active { transform: scale(0.95); }

    .note-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      padding: 24px;
      animation: fadeIn 0.2s ease;
    }
    .note-modal {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 540px;
      box-shadow: var(--shadow-xl);
      animation: scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 24px 0;
    }
    .modal-title { margin: 0; font-size: 18px; font-weight: 600; color: var(--text); }
    .btn-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all var(--transition);
    }
    .btn-close:hover { background: var(--surface-hover); color: var(--text); }
    .modal-form {
      padding: 20px 24px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-input {
      padding: 12px 16px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 15px;
      color: var(--text);
      background: var(--bg-secondary);
      transition: all var(--transition);
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: var(--primary);
      background: var(--surface);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .title-input { font-size: 17px; font-weight: 600; }
    .content-input {
      resize: vertical;
      min-height: 120px;
      line-height: 1.6;
    }
    .form-input.input-error { border-color: var(--error); }
    .error-text { font-size: 12px; color: var(--error); font-weight: 500; }
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 8px;
    }
    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
    }
    .btn-secondary {
      background: var(--surface-hover);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover { background: var(--surface-elevated); color: var(--text); }
    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: #fff;
      min-width: 120px;
    }
    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
    .spinner-sm {
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @media (max-width: 768px) {
      .dashboard-inner { padding: 24px 16px 100px; }
      .welcome-section { flex-direction: column; }
      .welcome-greeting { font-size: 24px; }
      .welcome-stats { width: 100%; }
      .stat-card { flex: 1; }
      .carousel-track > app-note-card { flex: 0 0 280px; }
      .notes-grid { grid-template-columns: 1fr; }
      .fab { bottom: 20px; right: 20px; width: 52px; height: 52px; }
      .note-modal { margin: 16px; }
      .notes-carousel { margin: 0 -16px; padding: 0 16px; }
    }
    @media (max-width: 480px) {
      .carousel-track > app-note-card { flex: 0 0 260px; }
      .stat-card { min-width: 0; padding: 12px 16px; }
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
  viewMode: 'carousel' | 'grid' = 'carousel';
  userName = '';
  greeting = 'Hello';

  noteForm;

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private toast: ToastService,
    private authService: AuthService
  ) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', Validators.maxLength(10000)],
    });
  }

  get title() { return this.noteForm.get('title'); }

  get recentCount(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.notes.filter((n) => new Date(n.updatedAt) > weekAgo).length;
  }

  ngOnInit(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 18) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';

    this.authService.currentUser$.subscribe((u) => {
      if (u) this.userName = u.name;
    });
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
        this.toast.show(this.editingNote ? 'Note updated' : 'Note created', 'success');
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
