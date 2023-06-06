import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import { NewCompany } from '../new-company';
import {CompanyApiService} from "../../_api-services/company-api.service";

@Component({
  selector: 'app-company-sidebar',
  templateUrl: './company-sidebar.component.html',
  styleUrls: ['./company-sidebar.component.css'],
})
export class CompanySidebarComponent implements OnInit {

  isExpanded: boolean = false;
  newCompanyForm!: FormGroup;

  @Output()
  updateTable: EventEmitter<any> = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private companyService: CompanyApiService,
    ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.newCompanyForm.valueChanges.subscribe()
  }

  initializeForm(projectToForm?: NewCompany) {
    this.newCompanyForm = this.fb.group({
      name: [projectToForm?.name, Validators.required],
      email: [projectToForm?.email, Validators.required],
      phone_number: [projectToForm?.phone_number, Validators.required],
      address: [projectToForm?.address, Validators.required],
      country: [projectToForm?.country, Validators.required],
      business_field: [projectToForm?.business_field, Validators.required],
    })
  }

  get f() { return this.newCompanyForm.controls; }


  openNewCompanyForm() {
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

  addCompany(formDirective: FormGroupDirective) {
    if (this.newCompanyForm.invalid) return;
    this.companyService.addCompany(this.newCompanyForm.value).subscribe(response => {
      this.updateTable.emit();
      this.toggleNewProjectFormVisibility();
      formDirective.resetForm();
    }, error => {
      console.log(error);
    });
  }

}
