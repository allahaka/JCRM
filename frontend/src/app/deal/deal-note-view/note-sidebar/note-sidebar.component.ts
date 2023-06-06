import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import { NewNote } from '../new-note';
import {NoteApiService} from "../../../_api-services/note-api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-note-sidebar',
  templateUrl: './note-sidebar.component.html',
  styleUrls: ['./note-sidebar.component.css'],
})
export class NoteSidebarComponent implements OnInit {

  isExpanded: boolean = false;
  newNoteForm!: FormGroup;
  id: number = 0;

  @Output()
  updateTable: EventEmitter<any> = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private noteService: NoteApiService,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.newNoteForm.valueChanges.subscribe()
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  initializeForm(projectToForm?: NewNote) {
    this.newNoteForm = this.fb.group({
      title: [projectToForm?.title, Validators.required],
      description: [projectToForm?.description, Validators.required],
    })
  }

  get f() { return this.newNoteForm.controls; }


  openNewNoteForm() {
    this.initializeForm();
    this.toggleNewProjectFormVisibility()
  }

  toggleNewProjectFormVisibility() {
    this.isExpanded = !this.isExpanded;
  }

  closeNewNoteForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.toggleNewProjectFormVisibility();
  }

  addNote(formDirective: FormGroupDirective) {
    if (this.newNoteForm.invalid) return;
    this.newNoteForm.value.deal_id = this.id;
    this.noteService.addNote(this.newNoteForm.value).subscribe(response => {
      this.updateTable.emit();
      this.toggleNewProjectFormVisibility();
      formDirective.resetForm();
    }, error => {
      console.log(error);
    });
    window.location.reload();
  }

}
