import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { SchedulesService } from './services/schedules.service';
import { Schedule } from './models/schedule';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Gestiones Xplore Delivery';
  currentUser: User;
  isMobile: boolean = false;
  schedules: Schedule[];
  currentRoute: any;

  constructor(
    private authenticationService: AuthService,
    private schedulesService: SchedulesService
  ) {
    //router.events.subscribe((url:any) => {this.currentRoute = url; console.log(this.currentRoute);});
    this.currentRoute = window.location.pathname;

    if(this.currentRoute == '/xplore-shuttle') this.title = 'Xplore - Shuttle';
    
    
    const today = new Date().getDay();

    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );

    const scheduleSubscription = this.schedulesService
      .getSchedule()
      .subscribe((response) => {
        localStorage.removeItem('todaySchedule');

        this.schedules = response.data;
        this.schedules.forEach((value) => {
          if (value.cod == today) {
            localStorage.setItem('todaySchedule', JSON.stringify(value));
          }
        });
        scheduleSubscription.unsubscribe();
      });
  }

  ngOnInit(): void {
    if (window.screen.width < 1000) {
      this.isMobile = true;
    }
  }

  logout() {
    this.authenticationService.logout().subscribe((data) => {
      location.reload();
      if ($('#sidebar').hasClass('active')) {
        $('#sidebar').toggleClass('active');
      }
    });
  }

  showLogout() {
    $('#xploreUsrSubMenu').toggleClass('d-none');
  }

  //XPLORE'S FUNCTIONS

  showConfSubMenu() {
    $('.confSubMenu').toggleClass('d-none');
  }

  showCustomersSubMenu() {
    $('.customerSubMenu').toggleClass('d-none');
  }

  showReportsSubMenu() {
    $('.reportsSubMenu').toggleClass('d-none');
  }

  //CUSTOMER'S FUNCTIONS
  showLogoutCustomer() {
    $('.userSubMenu').toggleClass('d-none');
  }

  showCustomerAddDeliverySubMenu() {
    $('.createDelMenu').toggleClass('d-none');
  }

  showCustomerDeliveriesSubMenu() {
    $('.delOrdersMenu').toggleClass('d-none');
  }

  showCustomerConfigSubMenu() {
    $('.custConfigMenu').toggleClass('d-none');
  }
}
