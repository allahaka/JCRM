import {Component, OnInit, ViewChild} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {Observable} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EmployeeSidebarComponent} from "./employee-sidebar/employee-sidebar.component";
import {map} from "rxjs/operators";
import {Employee} from "../_models/employee";
import {EmployeeApiService} from "../_api-services/employee-api.service";
import {Company} from "../_models/company";
import {CompanyApiService} from "../_api-services/company-api.service";
import {CustomSelectEditorComponent} from "../custom-editor/custom-editor.component";

@Component({
  selector: 'employee-panel',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  private gridApi!: GridApi;
  private pageIndex: number = 1;

  public paginationSizeOptions: number[] = [5, 25, 100];
  public paginationPageSize: number = this.paginationSizeOptions[0];
  public totalRows: number = 0;

  public columnDefs: ColDef[] = [];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public rowData$!: Observable<Employee[]>;

  public popupParent: HTMLElement | null = document.body;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(EmployeeSidebarComponent) newTaskSidebar!: EmployeeSidebarComponent;

  constructor(
      private employeeService: EmployeeApiService,
      private companyService: CompanyApiService
  ) {
    companyService.getAllCompanies().subscribe(
        companies => this.columnDefs = this.createColumnDefs(companies),
        error => console.log(error)
    );
  }

  ngOnInit(): void {
      this.companyService.getAllCompanies().subscribe(
        companies => this.columnDefs = this.createColumnDefs(companies),
        error => console.log(error)
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.getEmployeesTotal();
    this.refreshDataSource(this.pageIndex, this.paginationPageSize);
  }

  onPaginatorClicked(params: PageEvent){
    this.paginationPageSize = params.pageSize;
    this.getEmployeesTotal();
    this.refreshDataSource(params.pageIndex + 1, params.pageSize);
  }

  getEmployees(page: number, size: number): Observable<Employee[]> {
    return this.employeeService.getEmployees(page, size).pipe(
      map(x => x.items),
    );
  }

  getEmployeesTotal(): void {
    this.employeeService.getEmployees(1, 1).subscribe(e => {
      this.totalRows = e.total;
    });
  }

  refreshDataSource(page: number, size: number): void {
    this.rowData$ = this.getEmployees(page, size);
  }

  onCellValueChanged(params: any, route?: string[]) {
    if(params.colDef.field == "company_name"){
      params.data.company_id = params.value;
    }
    this.employeeService.editEmployee(params.data).subscribe();
    window.location.reload();
  }

  rowsSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
      const selectRows = this.gridApi.getSelectedRows();
      selectRows.map((rowToDelete) => {
          return this.employeeService.deleteEmployee(rowToDelete).subscribe();
      });
  }

  private createColumnDefs(companies: Company[]) {
      return [
          { field: 'name', editable: true, checkboxSelection: true},
          { field: 'wid', editable: true},
          { field: 'email', editable: true},
          { field: 'phone_number', editable: true},
          { field: 'address', editable: true},
          { field: 'position', editable: true},
          {
              headerName: 'Company',
              field: 'company_name',
              editable: true,
              cellEditorFramework: CustomSelectEditorComponent,
              cellRenderer: (params: any) => {
                  if (params && params.value) {
                    return params.data.company_name;
                  }
              },
              cellEditorParams: {
                  values: companies,
                  cellRenderer: (params: any) => {
                      return params.data.company_name;
                  }
              }
          },
      ]
  }

}
