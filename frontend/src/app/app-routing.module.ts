import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CompanyComponent} from "./company/company.component";
import {EmployeeComponent} from "./employee/employee.component";
import {HomePageComponent} from "./home/home-page/home-page.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {DealComponent} from "./deal/deal.component";
import {NoteComponent} from "./deal/deal-note-view/deal-note.component";
import {MeetingComponent} from "./meeting/meeting.component";

const routes: Routes = [
  {
    path: '', component: HomePageComponent, children: [
      {path: 'company', component: CompanyComponent},
      {path: 'employee', component: EmployeeComponent},
      {path: 'deal', component: DealComponent},
      {path: 'deal/:id', component: NoteComponent},
      {path: 'meeting', component: MeetingComponent},
      {path: 'not-found', component: NotFoundComponent}
    ]
  },
  //wildcard must be the last element
  {path: '**', component: NotFoundComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
