import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Note, NoteResponse, NotesResponse } from '../models/note.model';
import { API_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_URL) apiUrl: string
  ) {
    this.apiUrl = apiUrl;
  }

  loadNotes(): void {
    this.http.get<NotesResponse>(`${this.apiUrl}/notes`).subscribe({
      next: (res) => this.notesSubject.next(res.notes),
    });
  }

  getNotes(): Observable<NotesResponse> {
    return this.http.get<NotesResponse>(`${this.apiUrl}/notes`).pipe(
      tap((res) => this.notesSubject.next(res.notes))
    );
  }

  getNote(id: string): Observable<NoteResponse> {
    return this.http.get<NoteResponse>(`${this.apiUrl}/notes/${id}`);
  }

  createNote(title: string, content: string): Observable<NoteResponse> {
    return this.http.post<NoteResponse>(`${this.apiUrl}/notes`, { title, content }).pipe(
      tap(() => this.loadNotes())
    );
  }

  updateNote(id: string, title: string, content: string): Observable<NoteResponse> {
    return this.http.put<NoteResponse>(`${this.apiUrl}/notes/${id}`, { title, content }).pipe(
      tap(() => this.loadNotes())
    );
  }

  deleteNote(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/notes/${id}`).pipe(
      tap(() => this.loadNotes())
    );
  }
}
