import {Component, OnInit, ViewChild} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {Observable} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DealSidebarComponent} from "./deal-sidebar/deal-sidebar.component";
import {map} from "rxjs/operators";
import {Deal} from "../_models/deal";
import {EmployeeApiService} from "../_api-services/employee-api.service";
import {Company} from "../_models/company";
import {CompanyApiService} from "../_api-services/company-api.service";
import {CustomSelectEditorComponent} from "../custom-editor/custom-editor.component";
import {DealApiService} from "../_api-services/deal-api.service";
import {Employee} from "../_models/employee";

@Component({
  selector: 'employee-panel',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.css']
})
export class DealComponent implements OnInit {
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

  public rowData$!: Observable<Deal[]>;

  public popupParent: HTMLElement | null = document.body;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(DealSidebarComponent) newTaskSidebar!: DealSidebarComponent;
  public companies: Company[] = [];
  public employees: Employee[] = [];

  constructor(
      private dealService: DealApiService,
      private companyService: CompanyApiService,
      private employeeService: EmployeeApiService
  ) {
    employeeService.getAllEmployees().subscribe(
        response => this.employees = response,
        error => console.log(error),
        () => {
          companyService.getAllCompanies().subscribe(
            response => this.companies = response,
            error => console.log(error),
            () => this.columnDefs = this.createColumnDefs(this.companies, this.employees),
         );
        }
    );
    }


  ngOnInit(): void {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.getDealsTotal();
    this.refreshDataSource(this.pageIndex, this.paginationPageSize);
  }

  onPaginatorClicked(params: PageEvent){
    this.paginationPageSize = params.pageSize;
    this.getDealsTotal();
    this.refreshDataSource(params.pageIndex + 1, params.pageSize);
  }

  getDeals(page: number, size: number): Observable<Deal[]> {
    return this.dealService.getDeals(page, size).pipe(
      map(x => x.items),
    );
  }

  getDealsTotal(): void {
    this.dealService.getDeals(1, 1).subscribe(e => {
      this.totalRows = e.total;
    });
  }

  refreshDataSource(page: number, size: number): void {
    this.rowData$ = this.getDeals(page, size);
  }

  onCellValueChanged(params: any, route?: string[]) {
    if(params.colDef.field == "company_name"){
      params.data.company_id = params.value;
    }else{
      params.data.contact_point_id = params.value;
    }
    this.dealService.editDeal(params.data).subscribe(
      () => {
        this.refreshDataSource(this.pageIndex, this.paginationPageSize);
      },
      error => console.log(error),
      () => window.location.reload()
    );

  }

  rowsSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
      const selectRows = this.gridApi.getSelectedRows();
      selectRows.map((rowToDelete) => {
          return this.dealService.deleteDeal(rowToDelete).subscribe();
      });
  }

  private createColumnDefs(companies: Company[], contact_points: Employee[]) {
      return [
          { field: 'id',
            editable: false,
            checkboxSelection: true,
            maxWidth: 100,
            cellRenderer: (params: any) => {
              return `<a href='/deal/${params.value}'>`+ params.value +'</a>'
          }},
          { field: 'name', editable: true},
          { field: 'description', editable: true},
          { field: 'budget', editable: true},
          { field: 'currency', editable: true},
          { field: 'status', editable: true},
          {
              headerName: 'Company',
              field: 'company_name',
              editable: true,
              cellEditorFramework: CustomSelectEditorComponent,
              cellRenderer: (params: any) => {
                console.log(params);
                  if (params) {
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
          {
              headerName: 'Contact point',
              field: 'contact_point_name',
              editable: true,
              cellEditorFramework: CustomSelectEditorComponent,
              cellRenderer: (params: any) => {
                  if (params && params.value) {
                    return params.data.contact_point_name;
                  }
              },
              cellEditorParams: {
                  values: contact_points,
                  cellRenderer: (params: any) => {
                      return params.data.contact_point_name;
                  }
              }
          },
      ]
  }

}
