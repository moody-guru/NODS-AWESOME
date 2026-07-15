import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Note, NoteResponse, NotesResponse } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadNotes(): void {
    this.http.get<NotesResponse>('/api/notes').subscribe({
      next: (res) => this.notesSubject.next(res.notes),
    });
  }

  getNotes(): Observable<NotesResponse> {
    return this.http.get<NotesResponse>('/api/notes').pipe(
      tap((res) => this.notesSubject.next(res.notes))
    );
  }

  getNote(id: string): Observable<NoteResponse> {
    return this.http.get<NoteResponse>(`/api/notes/${id}`);
  }

  createNote(title: string, content: string): Observable<NoteResponse> {
    return this.http.post<NoteResponse>('/api/notes', { title, content }).pipe(
      tap(() => this.loadNotes())
    );
  }

  updateNote(id: string, title: string, content: string): Observable<NoteResponse> {
    return this.http.put<NoteResponse>(`/api/notes/${id}`, { title, content }).pipe(
      tap(() => this.loadNotes())
    );
  }

  deleteNote(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`/api/notes/${id}`).pipe(
      tap(() => this.loadNotes())
    );
  }
}
