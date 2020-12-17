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

  getCustomerBalance(customerId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getCustomerBalance',
      idCliente:customerId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getCustomersBalanceReport(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'customersBalanceReport',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getCustomersTrackingReport(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'customersTrackingReport',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getCustomerWorkLines(customerId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'customerWorkLines',
      customerId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  checkCustomerAvalability(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'checkAvalability',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  checkCustomerDelTypes(customerId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'checkCustomerDelTypes',
      customerId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getDriverCategories(driverId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getDriverCategories',
      idConductor: driverId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  assignDriverCategory(driverId, categoryId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'assignDriverCategory',
      idConductor: driverId,
      idCategoria: categoryId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  removeDriverCategory(driverId, categoryId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'removeDriverCategory',
      idConductor: driverId,
      idCategoria: categoryId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

}
