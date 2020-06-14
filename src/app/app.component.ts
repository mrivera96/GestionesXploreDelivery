import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {User} from "./models/user";

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
      if ($('#sidebar').hasClass('active')) {
        $('#sidebar').toggleClass('active')
      }
    })

  }


  showLogout() {
    $('#xploreUsrSubMenu').toggleClass('d-none')
  }



  //XPLORE'S FUNCTIONS

  showConfSubMenu() {
    $('.confSubMenu').toggleClass('d-none')
  }

  showCustomersSubMenu() {
    $('.customerSubMenu').toggleClass('d-none')
  }


  //CUSTOMER'S FUNCTIONS
  showLogoutCustomer() {
    $('.userSubMenu').toggleClass('d-none')
  }

  showCustomerBranchSubMenu() {
    $('.branchSubMenu').toggleClass('d-none')
  }


}
