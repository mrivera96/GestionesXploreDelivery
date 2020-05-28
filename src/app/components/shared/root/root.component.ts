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
    this.authService.currentUser.subscribe(x => this.currentUser = x)
    if(!this.currentUser){
      this.router.navigate(['login'])
    }
    if(this.currentUser.idPerfil === '1'){
      this.router.navigate(['xplore-inicio'])
    }else if(this.currentUser.idPerfil === '8'){
      this.router.navigate(['cliente-inicio'])
    }

  }

  ngOnInit(): void {
  }

}
