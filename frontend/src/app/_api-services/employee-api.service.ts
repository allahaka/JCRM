import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ApiResponse} from "./models/api-response";
import {Employee} from "../_models/employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService extends BaseApiService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.getEmployees(1, 100).pipe(
      map((response) => {
        return response.items;
      })
    );
  }

  getEmployees(page: number, size: number): Observable<ApiResponse<Employee>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.getPaged<Employee>('/employee', {params})
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.post<Employee>('/employee/create', employee);
  }

  editEmployee(employee: Employee): Observable<Employee> {
    delete employee.company_name;
    return this.patch<Employee>(`/employee/${employee.id}`, employee);
  }

  deleteEmployee(employee: Employee): Observable<Employee> {
    return this.delete<Employee>(`/employee/${employee.id}`);
  }
}
