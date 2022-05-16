import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-customer-menu',
  templateUrl: './customer-menu.component.html',
  styleUrls: ['./customer-menu.component.css']
})
export class CustomerMenuComponent implements OnInit {
  @Input('currentUser') currentUser: User;
  @Output('showLogoutCustomer') showLogoutCustomerEv: EventEmitter<any> = new EventEmitter();
  @Output('logout') logoutEv: EventEmitter<any> = new EventEmitter();
  @Output('showCustomerAddDeliverySubMenu') showCustomerAddDeliverySubMenuEv: EventEmitter<any> = new EventEmitter();
  @Output('showCustomerDeliveriesSubMenu') showCustomerDeliveriesSubMenuEv: EventEmitter<any> = new EventEmitter();
  @Output('showCustomerConfigSubMenu') showCustomerConfigSubMenuEv: EventEmitter<any> = new EventEmitter();
  @Input('sidenav') sidenav;
  constructor() { }

  ngOnInit(): void {
  }

}
