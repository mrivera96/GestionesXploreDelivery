import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RestrictionsService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getRestrictions(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getRestrictions',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createRestriction(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'createRestriction',
      tkn: this.authService.currentUserValue.access_token,
      form
    })
  }

  updateRestriction(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'updateRestriction',
      tkn: this.authService.currentUserValue.access_token,
      form
    })
  }
}
