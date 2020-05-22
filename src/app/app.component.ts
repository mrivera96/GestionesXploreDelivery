import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {User} from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestiones Xplore Delivery';
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)
  }

  logout() {
    this.authenticationService.logout().subscribe(data => {
      this.router.navigate(['/login'])
    })
  }

  toggleSidebar(){
    $('#sidebar').toggleClass('active');
  }
  showLogout(){
    $('#logout').toggleClass('d-none');
  }

  goHome(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active');
    }
    this.router.navigate(['/'])
  }

  showAllRequest(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active');
    }
    this.router.navigate(['ver-todas'])
  }

  showTomorrow(){
    if($('#sidebar').hasClass('active')){
      $('#sidebar').toggleClass('active');
    }
    this.router.navigate(['reservas-maniana'])
  }
}
