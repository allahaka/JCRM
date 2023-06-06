import {Component, OnInit, ViewChild} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {Observable} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MeetingSidebarComponent} from "./meeting-sidebar/meeting-sidebar.component";
import {map} from "rxjs/operators";
import {Meeting} from "../_models/meeting";
import {MeetingApiService} from "../_api-services/meeting-api.service";
import {CustomSelectEditorComponent} from "../custom-editor/custom-editor.component";

@Component({
  selector: 'employee-panel',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
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

  public rowData$!: Observable<Meeting[]>;

  public popupParent: HTMLElement | null = document.body;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MeetingSidebarComponent) newTaskSidebar!: MeetingSidebarComponent;

  constructor(
      private meetingService: MeetingApiService,
  ) {}

  ngOnInit(): void {
      this.columnDefs = this.createColumnDefs();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.getMeetingsTotal();
    this.refreshDataSource(this.pageIndex, this.paginationPageSize);
  }

  onPaginatorClicked(params: PageEvent){
    this.paginationPageSize = params.pageSize;
    this.getMeetingsTotal();
    this.refreshDataSource(params.pageIndex + 1, params.pageSize);
  }

  getMeetings(page: number, size: number): Observable<Meeting[]> {
    return this.meetingService.getMeetings(page, size).pipe(
      map(x => x.items),
    );
  }

  getMeetingsTotal(): void {
    this.meetingService.getMeetings(1, 1).subscribe(e => {
      this.totalRows = e.total;
    });
  }

  refreshDataSource(page: number, size: number): void {
    this.rowData$ = this.getMeetings(page, size);
  }

  onCellValueChanged(params: any, route?: string[]) {
    this.meetingService.editMeeting(params.data).subscribe();
    window.location.reload();
  }

  rowsSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
      const selectRows = this.gridApi.getSelectedRows();
      selectRows.map((rowToDelete) => {
          return this.meetingService.deleteMeeting(rowToDelete).subscribe();
      });
  }

  private createColumnDefs() {
      return [
          { field: 'title', editable: true, checkboxSelection: true},
          { field: 'description', editable: true},
          { field: 'organizer', editable: false},
          { field: 'date', editable: true},
          { field: 'deal_id',
            editable: false,
            cellRenderer: (params: any) => {
              return `<a href='/deal/${params.value}'>`+ params.value +'</a>'
          }},
      ]
  }

}
