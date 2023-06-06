import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar-element',
  templateUrl: './navbar-element.component.html',
  styleUrls: ['./navbar-element.component.css']
})
export class NavbarElementComponent implements OnInit {

  @Input() label = '';
  @Input() icon = '';
  @Input() route = '#';
  @Input() isExpanded = true;
  @Input() isDisabled?: boolean

  ngOnInit(): void {
  }
}
