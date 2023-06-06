import {Component, OnInit, ViewChild} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {Observable} from "rxjs";
import {Company} from "../_models/company";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CompanyApiService} from "../_api-services/company-api.service";
import {CompanySidebarComponent} from "./company-sidebar/company-sidebar.component";
import {map} from "rxjs/operators";

@Component({
  selector: 'company-panel',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  private gridApi!: GridApi;
  private pageIndex: number = 1;

  public paginationSizeOptions: number[] = [5, 25, 100];
  public paginationPageSize: number = this.paginationSizeOptions[0];
  public totalRows: number = 0;

  public columnDefs: ColDef[] = [
    { field: 'name', editable: true, checkboxSelection: true},
    { field: 'email', editable: true},
    { field: 'phone_number', editable: true},
    { field: 'address', editable: true},
    { field: 'country', editable: true},
    { field: 'business_field', editable: true},
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public rowData$!: Observable<Company[]>;

  public popupParent: HTMLElement | null = document.body;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(CompanySidebarComponent) newTaskSidebar!: CompanySidebarComponent;

  constructor(
    private companyService: CompanyApiService
  ) { }

  ngOnInit(): void {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.getCompaniesTotal();
    this.refreshDataSource(this.pageIndex, this.paginationPageSize);
  }

  onPaginatorClicked(params: PageEvent){
    this.paginationPageSize = params.pageSize;
    this.getCompaniesTotal();
    this.refreshDataSource(params.pageIndex + 1, params.pageSize);
  }

  getCompanies(page: number, size: number): Observable<Company[]> {
    return this.companyService.getCompanies(page, size).pipe(
      map(x => x.items),
    );
  }

  getCompaniesTotal(): void {
    this.companyService.getCompanies(1, 1).subscribe(e => {
      this.totalRows = e.total;
    });
  }

  refreshDataSource(page: number, size: number): void {
    this.rowData$ = this.getCompanies(page, size);
  }

  onCellValueChanged(params: any) {
    this.companyService.editCompany(params.data).subscribe();
    window.location.reload();
  }

  rowsSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
      const selectRows = this.gridApi.getSelectedRows();
      selectRows.map((rowToDelete) => {
          return this.companyService.deleteCompany(rowToDelete).subscribe();
      });
  }
}
