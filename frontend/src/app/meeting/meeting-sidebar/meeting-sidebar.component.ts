import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {NewMeeting} from '../new-meeting';
import {EmployeeApiService} from "../../_api-services/employee-api.service";
import {Deal} from "../../_models/deal";
import {DealApiService} from "../../_api-services/deal-api.service";
import {Employee} from "../../_models/employee";
import {MeetingApiService} from "../../_api-services/meeting-api.service";
import {Meeting} from "../../_models/meeting";

@Component({
  selector: 'app-meeting-sidebar',
  templateUrl: './meeting-sidebar.component.html',
  styleUrls: ['./meeting-sidebar.component.css'],
})
export class MeetingSidebarComponent implements OnInit {
  deals: Deal[] = [];
  organizers: Employee[] = [];

  isExpanded: boolean = false;
  newMeetingForm!: FormGroup;

  @Output()
  updateTable: EventEmitter<any> = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeApiService,
    private dealService: DealApiService,
    private meetingService: MeetingApiService,
    ) {
  }

  ngOnInit(): void {
    this.dealService.getAllDeals().subscribe(response => {
      this.deals = response;
    }, error => {
      console.log(error);
    });
    this.employeeService.getAllEmployees().subscribe(response => {
      this.organizers = response;
    }, error => {
      console.log(error);
    });
    this.initializeForm();
    this.newMeetingForm.valueChanges.subscribe()
  }

  initializeForm(projectToForm?: NewMeeting) {
    this.newMeetingForm = this.fb.group({
      title: [projectToForm?.title, Validators.required],
      description: [projectToForm?.description, Validators.required],
      organizer: [projectToForm?.organizer, Validators.required],
      date: [projectToForm?.date, Validators.required],
      deal_id: [projectToForm?.deal_id, Validators.required]
    })
  }

  get f() { return this.newMeetingForm.controls; }


  openNewMeetingForm() {
    this.initializeForm();
    this.toggleNewMeetingFormVisibility()
  }

  toggleNewMeetingFormVisibility() {
    this.isExpanded = !this.isExpanded;
  }

  closeNewMeetingForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.toggleNewMeetingFormVisibility();
  }

  addMeeting(formDirective: FormGroupDirective) {
    console.log(this.newMeetingForm.value);
    console.log(this.newMeetingForm.invalid);
    if (this.newMeetingForm.invalid) return;
    this.meetingService.addMeeting(this.newMeetingForm.value).subscribe(response => {
      this.updateTable.emit();
      this.toggleNewMeetingFormVisibility();
      formDirective.resetForm();
    }, error => {
      console.log(error);
    });
    window.location.reload();
  }

}
