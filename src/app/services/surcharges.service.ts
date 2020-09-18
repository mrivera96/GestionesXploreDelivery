import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class SurchargesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getSurcharges(){
    return this.http.get<any>(`${environment.apiUrl}`, {params:{function: 'getRecargos'}})
  }

  editSurcharge(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editSurcharge',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createSurcharge(form, customers){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'createSurcharge',
      form,
      customers,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getCustomerSurcharges(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getMySurcharges',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getSurchargeCustomers(surchargeId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getSurchargeCustomers',
      idRecargo: surchargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  removeCustomerFromSurcharge(surchargeId, customerId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'removeCustomerFromSurcharge',
      idCliente: customerId,
      idRecargo: surchargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  addCustomerToSurcharge(surchargeId, customerId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'addCustomerToSurcharge',
      idCliente: customerId,
      idRecargo: surchargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
