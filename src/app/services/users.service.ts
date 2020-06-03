import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getDrivers(){
    return this.http.get<any>(`${environment.apiUrl}`, {params: {function: 'listDrivers'}})
  }

  getCustomers(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getCustomers',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  addCustomer(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'newCustomer',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  changeCustomerPassword(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'changeCustomerPassword',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
