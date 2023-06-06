import {Component, OnInit, ViewChild} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {Observable} from "rxjs";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NoteSidebarComponent} from "./note-sidebar/note-sidebar.component";
import {map} from "rxjs/operators";
import {NoteApiService} from "../../_api-services/note-api.service";
import {Note} from "../../_models/note";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'deal-note-panel',
  templateUrl: './deal-note.component.html',
  styleUrls: ['./deal-note.component.css']
})
export class NoteComponent implements OnInit {
  private gridApi!: GridApi;
  private pageIndex: number = 1;
  id: number = 0;

  public paginationSizeOptions: number[] = [5, 25, 100];
  public paginationPageSize: number = this.paginationSizeOptions[0];
  public totalRows: number = 0;

  public columnDefs: ColDef[] = [];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public rowData$!: Observable<Note[]>;

  public popupParent: HTMLElement | null = document.body;

  selection = new SelectionModel<Note>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(NoteSidebarComponent) newTaskSidebar!: NoteSidebarComponent;

  constructor(
      private noteService: NoteApiService,
      private route: ActivatedRoute,
  ) {
    this.columnDefs = this.createColumnDefs();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
      this.noteService.getAllNotesFor(this.id).subscribe(
        notes => this.columnDefs = this.createColumnDefs(),
        error => console.log(error)
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.getNotesTotal();
    this.refreshDataSource(this.pageIndex, this.paginationPageSize);
  }

  onPaginatorClicked(params: PageEvent){
    this.paginationPageSize = params.pageSize;
    this.getNotesTotal();
    this.refreshDataSource(params.pageIndex + 1, params.pageSize);
  }

  getNotes(page: number, size: number): Observable<Note[]> {
    return this.noteService.getNotesFor(this.id, page, size).pipe(
      map(x => x.items),
    );
  }

  getNotesTotal(): void {
    this.noteService.getNotes(1, 1).subscribe(e => {
      this.totalRows = e.total;
    });
  }

  refreshDataSource(page: number, size: number): void {
    this.rowData$ = this.getNotes(page, size);
  }

  onCellValueChanged(params: any, route?: string[]) {
    this.noteService.editNote(params.data).subscribe();
    window.location.reload();
  }

  rowsSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
      const selectRows = this.gridApi.getSelectedRows();
      selectRows.map((rowToDelete) => {
          return this.noteService.deleteNote(rowToDelete).subscribe();
      });
  }

  private createColumnDefs() {
      return [
          { field: 'title', editable: true, checkboxSelection: true},
          { field: 'description', editable: true},
      ]
  }

}
