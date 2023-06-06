import { Component } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-select-editor',
  template: `
    <select [(ngModel)]="selectedValue" (change)="onSelectionChange()">
      <option *ngFor="let option of options" [value]="option.id">
        {{ option.name }} ({{ option.id }})
      </option>
    </select>
  `
})
export class CustomSelectEditorComponent implements AgEditorComponent {
  private params: any;
  public selectedValue: any;
  //@ts-ignore
  public options: any[];

  agInit(params: any): void {
    this.params = params;
    this.options = params.values;
    this.selectedValue = params.value;
  }

  getValue(): any {
    return this.selectedValue;
  }

  onSelectionChange(): void {
    this.params.api.stopEditing();
  }
}
