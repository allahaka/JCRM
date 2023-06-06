import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NgApexchartsModule} from 'ng-apexcharts';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SideNavbarComponent} from './side-navbar/side-navbar.component';
import {CookieService} from 'ngx-cookie-service';
import {MaterialModule} from './material/material.module';
import {CompanyComponent} from './company/company.component';
import {EmployeeComponent} from './employee/employee.component';
import {DealComponent} from './deal/deal.component';
import {HomePageComponent} from './home/home-page/home-page.component';
import {ToastrModule} from "ngx-toastr";
import {NavbarElementComponent} from './side-navbar/navbar-element/navbar-element.component';
import {ErrorInterceptor} from "./_interceptors/error.interceptor";
import {NotFoundComponent} from "./not-found/not-found.component";
import {AgGridModule} from 'ag-grid-angular';
import {CompanySidebarComponent} from "./company/company-sidebar/company-sidebar.component";
import {EmployeeSidebarComponent} from "./employee/employee-sidebar/employee-sidebar.component";
import {CustomSelectEditorComponent} from "./custom-editor/custom-editor.component";
import {DealSidebarComponent} from "./deal/deal-sidebar/deal-sidebar.component";
import {NoteComponent} from "./deal/deal-note-view/deal-note.component";
import {NoteSidebarComponent} from "./deal/deal-note-view/note-sidebar/note-sidebar.component";
import {MeetingComponent} from "./meeting/meeting.component";
import {MeetingSidebarComponent} from "./meeting/meeting-sidebar/meeting-sidebar.component";

@NgModule({
  declarations: [
    AppComponent,
    SideNavbarComponent,
    CompanyComponent,
    EmployeeComponent,
    DealComponent,
    EmployeeSidebarComponent,
    HomePageComponent,
    NavbarElementComponent,
    NotFoundComponent,
    CompanySidebarComponent,
    CustomSelectEditorComponent,
    DealSidebarComponent,
    NoteComponent,
    NoteSidebarComponent,
    MeetingComponent,
    MeetingSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    AgGridModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center'
    }),
    NgApexchartsModule,
  ],
  providers: [
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  exports: [
    CompanySidebarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
