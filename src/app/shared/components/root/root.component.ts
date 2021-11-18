import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {Router} from "@angular/router";
import {LockedUserDialogComponent} from '../locked-user-dialog/locked-user-dialog.component';
import {Customer} from '../../../models/customer';
import {UsersService} from '../../../services/users.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  currentUser: User
  currentCustomer: Customer

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UsersService,
    public matDialog: MatDialog,
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
      this.currentCustomer = this.authService.currentUserValue.cliente   
      this.router.navigate(['/customers/dashboard'])
    }

  }

  ngOnInit(): void {
  }


}
