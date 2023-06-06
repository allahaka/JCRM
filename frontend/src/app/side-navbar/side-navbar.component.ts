import {Component, OnInit, ViewChild} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  isExpanded = true;

  constructor(private cookieService: CookieService,
              private router: Router,
              private toastr: ToastrService) {

  }

  public ngOnInit(): void {
    let cookieValue = this.cookieService.get('sidebar-expanded');
    this.isExpanded = cookieValue === "true";
  }

  public toggleSidebar(value: boolean) {
    this.isExpanded = !value;

    if (this.isExpanded)
      this.cookieService.set('sidebar-expanded', "true");
    else
      this.cookieService.set('sidebar-expanded', "false");
  }
}
