import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {NewEmployee} from '../new-employee';
import {EmployeeApiService} from "../../_api-services/employee-api.service";
import {Company} from "../../_models/company";
import {CompanyApiService} from "../../_api-services/company-api.service";

@Component({
  selector: 'app-employee-sidebar',
  templateUrl: './employee-sidebar.component.html',
  styleUrls: ['./employee-sidebar.component.css'],
})
export class EmployeeSidebarComponent implements OnInit {
  companies: Company[] = [];

  isExpanded: boolean = false;
  newEmployeeForm!: FormGroup;

  @Output()
  updateTable: EventEmitter<any> = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeApiService,
    private companyService: CompanyApiService,
    ) {
  }

  ngOnInit(): void {
    this.companyService.getAllCompanies().subscribe(response => {
      this.companies = response;
    }, error => {
      console.log(error);
    });
    this.initializeForm();
    this.newEmployeeForm.valueChanges.subscribe()
  }

  initializeForm(projectToForm?: NewEmployee) {
    this.newEmployeeForm = this.fb.group({
      name: [projectToForm?.name, Validators.required],
      wid: [projectToForm?.wid, Validators.required],
      email: [projectToForm?.email, Validators.required],
      phone_number: [projectToForm?.phone_number, Validators.required],
      address: [projectToForm?.address, Validators.required],
      position: [projectToForm?.position, Validators.required],
      company_id: [projectToForm?.company_id, Validators.required],
    })
  }

  get f() { return this.newEmployeeForm.controls; }


  openNewEmployeeForm() {
    this.initializeForm();
    this.toggleNewProjectFormVisibility()
  }

  toggleNewProjectFormVisibility() {
    this.isExpanded = !this.isExpanded;
  }

  closeNewProjectForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.toggleNewProjectFormVisibility();
  }

  addEmployee(formDirective: FormGroupDirective) {
    if (this.newEmployeeForm.invalid) return;
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe(response => {
      this.updateTable.emit();
      this.toggleNewProjectFormVisibility();
      formDirective.resetForm();
    }, error => {
      console.log(error);
    });
    window.location.reload();
  }

}
