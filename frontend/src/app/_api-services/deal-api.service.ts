import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ApiResponse} from "./models/api-response";
import {Deal} from "../_models/deal";

@Injectable({
  providedIn: 'root'
})
export class DealApiService extends BaseApiService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllDeals(): Observable<Deal[]> {
    return this.getDeals(1, 100).pipe(
      map((response) => {
        return response.items;
      })
    );
  }

  getDeals(page: number, size: number): Observable<ApiResponse<Deal>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.getPaged<Deal>('/deal', {params})
  }

  addDeal(deal: Deal): Observable<Deal> {
    return this.post<Deal>('/deal/create', deal);
  }

  editDeal(deal: Deal): Observable<Deal> {
    delete deal.company_name;
    delete deal.contact_point_name;
    return this.patch<Deal>(`/deal/${deal.id}`, deal);
  }

  deleteDeal(deal: Deal): Observable<Deal> {
    return this.delete<Deal>(`/deal/${deal.id}`);
  }
}
