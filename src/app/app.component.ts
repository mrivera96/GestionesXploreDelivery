import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {User} from "./models/user";
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'Gestiones Xplore Delivery'
  currentUser: User

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)
  }

  logout() {
    this.authenticationService.logout().subscribe(data => {
      location.reload(true)
      if($('#sidebar').hasClass('active')){
        $('#sidebar').toggleClass('active')
      }
    })

  }

  toggleSidebar(){
    $('#sidebar').toggleClass('active')
  }

  showLogout(){
    $('#logout').toggleClass('d-none')
  }

  goHome(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate([''])
  }

  //XPLORE'S FUNCTIONS

  showAllRequest(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-todas'])
  }

  showTomorrowRequest(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-maniana'])
  }

  showConfSubMenu(){
    $('.confSubMenu').toggleClass('d-none')
  }

  showCategoriesParametrization(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-parametrizar-categorias'])
  }

  showRatesPArametrization(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-parametrizar-tarifas'])
  }

  //CUSTOMER'S FUNCTIONS
  showLogoutCustomer(){
    $('#logoutCustomer').toggleClass('d-none')
  }

  showAllCustomersRequest(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-todos'])
  }

  addDeliveryCustomer(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-inicio'])
  }

  showCustomerBranchOffices(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-sucursales'])
  }

  showCustomerTodayDeliveries(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-hoy'])
  }

  showCustomerTodayOrders(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-pedidos-hoy'])
  }

  showCustomerAllOrders(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-pedidos-todos'])
  }

}
