import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {User} from "./models/user";
import {SchedulesService} from "./services/schedules.service";
import {Schedule} from "./models/schedule";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'Gestiones Xplore Delivery'
  currentUser: User
  schedules: Schedule[]

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private route: ActivatedRoute,
    private schedulesService: SchedulesService,
  ) {
    const today = new Date().getDay()
    const savedSchedule = JSON.parse(localStorage.getItem('todaySchedule'))

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)

    this.schedulesService.getSchedule().subscribe(response => {
      this.schedules = response.data
      if (savedSchedule) {
        localStorage.removeItem('todaySchedule')
      }

      this.schedules.forEach(value => {
        if (value.cod == today) {
          localStorage.setItem('todaySchedule', JSON.stringify(value));
        }
      })
    })

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

  showReportsSubMenu() {
    $('.reportsSubMenu').toggleClass('d-none')
  }

  //CUSTOMER'S FUNCTIONS
  showLogoutCustomer() {
    $('.userSubMenu').toggleClass('d-none')
  }

  showCustomerBranchSubMenu() {
    $('.branchSubMenu').toggleClass('d-none')
  }


}
