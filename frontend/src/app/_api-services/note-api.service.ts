import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ApiResponse} from "./models/api-response";
import {Note} from "../_models/note";

@Injectable({
  providedIn: 'root'
})
export class NoteApiService extends BaseApiService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllNotes(): Observable<Note[]> {
    return this.getNotes(1, 100).pipe(
      map((response) => {
        return response.items;
      })
    );
  }

  getNotes(page: number, size: number): Observable<ApiResponse<Note>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.getPaged<Note>('/note', {params})
  }

  addNote(note: Note): Observable<Note> {
    return this.post<Note>('/note/create', note);
  }

  editNote(note: Note): Observable<Note> {
    return this.patch<Note>(`/note/${note.id}`, note);
  }

  deleteNote(note: Note): Observable<Note> {
    return this.delete<Note>(`/note/${note.id}`);
  }

  getNotesFor(dealId: number, page: number, size: number): Observable<ApiResponse<Note>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.getPaged<Note>(`/note/deal/${dealId}`, {params})
  }

  getAllNotesFor(dealId: number): Observable<Note[]> {
    return this.getNotesFor(dealId, 1, 100).pipe(
      map((response) => {
        return response.items;
      })
    );
  }
}
