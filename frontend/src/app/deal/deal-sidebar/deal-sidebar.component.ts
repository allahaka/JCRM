import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {NewDeal} from '../new-deal';
import {EmployeeApiService} from "../../_api-services/employee-api.service";
import {Company} from "../../_models/company";
import {CompanyApiService} from "../../_api-services/company-api.service";
import {DealApiService} from "../../_api-services/deal-api.service";
import {Employee} from "../../_models/employee";

@Component({
  selector: 'app-deal-sidebar',
  templateUrl: './deal-sidebar.component.html',
  styleUrls: ['./deal-sidebar.component.css'],
})
export class DealSidebarComponent implements OnInit {
  companies: Company[] = [];
  employees: Employee[] = [];

  isExpanded: boolean = false;
  newDealForm!: FormGroup;

  @Output()
  updateTable: EventEmitter<any> = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private dealService: DealApiService,
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
    this.employeeService.getAllEmployees().subscribe(response => {
      this.employees = response;
    }, error => {
      console.log(error);
    });
    this.initializeForm();
    this.newDealForm.valueChanges.subscribe()
  }

  initializeForm(projectToForm?: NewDeal) {
    this.newDealForm = this.fb.group({
      name: [projectToForm?.name, Validators.required],
      description: [projectToForm?.description, Validators.required],
      budget: [projectToForm?.budget, Validators.required],
      currency: [projectToForm?.currency, Validators.required],
      status: [projectToForm?.status, Validators.required],
      company_id: [projectToForm?.company_id, Validators.required],
      contact_point_id: [projectToForm?.contact_point_id, Validators.required],
    })
  }

  get f() { return this.newDealForm.controls; }


  openNewDealForm() {
    this.initializeForm();
    this.toggleNewProjectFormVisibility()
  }

  toggleNewProjectFormVisibility() {
    this.isExpanded = !this.isExpanded;
  }

  closeNewDealForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.toggleNewProjectFormVisibility();
  }

  addDeal(formDirective: FormGroupDirective) {
    if (this.newDealForm.invalid) return;
    this.dealService.addDeal(this.newDealForm.value).subscribe(response => {
      this.updateTable.emit();
      this.toggleNewProjectFormVisibility();
      formDirective.resetForm();
    }, error => {
      console.log(error);
    });
    window.location.reload();
  }

}
