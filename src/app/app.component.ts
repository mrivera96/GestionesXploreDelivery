import {Component} from '@angular/core';
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
      if ($('#sidebar').hasClass('active')) {
        $('#sidebar').toggleClass('active')
      }
    })

  }

  toggleSidebar() {
    $('#sidebar').toggleClass('active')
  }

  showLogout() {
    $('#logout').toggleClass('d-none')
  }

  goHome() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate([''])
  }

  //XPLORE'S FUNCTIONS

  showAllRequest() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-todas'])
  }

  showTomorrowRequest() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-maniana'])
  }

  showConfSubMenu() {
    $('.confSubMenu').toggleClass('d-none')
  }

  showCategoriesParametrization() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-parametrizar-categorias'])
  }

  showRatesPArametrization() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-parametrizar-tarifas'])
  }

  showSurchargesParametrization() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-parametrizar-recargos'])
  }

  showCustomersSubMenu() {
    $('.customerSubMenu').toggleClass('d-none')
  }

  showCustomersView() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-clientes'])
  }

  addCustomer() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-agregar-cliente'])
  }

  showTodayOrders() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-envios-hoy'])
  }

  showAllOrders() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['xplore-envios-todos'])
  }

  //CUSTOMER'S FUNCTIONS
  showLogoutCustomer() {
    $('.userSubMenu').toggleClass('d-none')
  }
  showCustomerProfile(){
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-perfil'])
  }

  showAllCustomersRequest() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-todos'])
  }

  addDeliveryCustomer() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-inicio'])
  }

  showCustomerTodayDeliveries() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-hoy'])
  }

  showCustomerTodayOrders() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-envios-hoy'])
  }

  showCustomerAllOrders() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-envios-todos'])
  }

  showCustomerBranchSubMenu() {
    $('.branchSubMenu').toggleClass('d-none')
  }

  showCustomerBranchOffices() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-direcciones'])
  }

  showCustomerNewBranchOffices() {
    if ($('#sidebar').hasClass('active')) {
      $('#sidebar').toggleClass('active')
    }
    this.router.navigate(['cliente-agregar-direccion'])
  }


}
