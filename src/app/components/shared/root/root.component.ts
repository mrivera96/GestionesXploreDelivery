import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  currentUser: User

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const authSubscription  = this.authService.currentUser.subscribe(x => {
      this.currentUser = x

    })
    if(!this.currentUser){
      this.router.navigate(['login'])
    }
    if(this.currentUser.idPerfil === '1' || this.currentUser.idPerfil === '9'){
      this.router.navigate(['/admins/reservas-pendientes'])
    }else if(this.currentUser.idPerfil === '8'){
      this.router.navigate(['/customers/dashboard'])
    }

  }

  ngOnInit(): void {
  }

}
