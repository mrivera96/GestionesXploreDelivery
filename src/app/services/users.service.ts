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
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getDrivers',
      tkn: this.authService.currentUserValue.access_token
    })
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

  editCustomer(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editCustomer',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  addDriver(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'createDriver',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  editDriver(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editDriver',
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
