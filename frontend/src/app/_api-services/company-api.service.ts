import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Company} from "../_models/company";
import {map} from "rxjs/operators";
import {ApiResponse} from "./models/api-response";

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService extends BaseApiService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllCompanies(): Observable<Company[]> {
    return this.getCompanies(1, 100).pipe(
      map((response) => {
        return response.items;
      })
    );
  }

  getCompanies(page: number, size: number): Observable<ApiResponse<Company>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.getPaged<Company>('/company', {params})
  }

  addCompany(company: Company): Observable<Company> {
    return this.post<Company>('/company/create', company);
  }

  editCompany(company: Company): Observable<Company> {
    return this.patch<Company>(`/company/${company.id}`, company);
  }

  deleteCompany(company: Company): Observable<Company> {
    return this.delete<Company>(`/company/${company.id}`);
  }
}
