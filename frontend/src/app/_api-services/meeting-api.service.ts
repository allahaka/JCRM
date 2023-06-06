import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ApiResponse} from "./models/api-response";
import {Meeting} from "../_models/meeting";

@Injectable({
  providedIn: 'root'
})
export class MeetingApiService extends BaseApiService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllMeetings(): Observable<Meeting[]> {
    return this.getMeetings(1, 100).pipe(
      map((response) => {
        return response.items;
      })
    );
  }

  getMeetings(page: number, size: number): Observable<ApiResponse<Meeting>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.getPaged<Meeting>('/meeting', {params})
  }

  addMeeting(meeting: Meeting): Observable<Meeting> {
    console.log(meeting)
    return this.post<Meeting>('/meeting/create', meeting);
  }

  editMeeting(meeting: Meeting): Observable<Meeting> {
    return this.patch<Meeting>(`/meeting/${meeting.id}`, meeting);
  }

  deleteMeeting(meeting: Meeting): Observable<Meeting> {
    return this.delete<Meeting>(`/meeting/${meeting.id}`);
  }
}
