import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
})
export class AdminMenuComponent implements OnInit {
  @Input('currentUser') currentUser: User;
  @Output('showLogout') showLogoutEv: EventEmitter<any> = new EventEmitter();
  @Output('logout') logoutEv: EventEmitter<any> = new EventEmitter();
  @Output('showReportSubMenu') showReportsSubMenuEv: EventEmitter<any> = new EventEmitter();
  @Output('showConfSubMenu') showConfSubMenuEv: EventEmitter<any> = new EventEmitter();
  @Input('sidenav') sidenav;
  constructor() {}

  ngOnInit(): void {}
}
