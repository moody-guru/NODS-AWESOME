export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteResponse {
  success: boolean;
  note: Note;
}

export interface NotesResponse {
  success: boolean;
  count: number;
  notes: Note[];
}
