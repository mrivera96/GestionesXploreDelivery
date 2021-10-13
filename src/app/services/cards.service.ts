import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getMyPaymetMethods(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getCustomerPaymentMethods',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createPaymentMethod(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'createPaymentMethod',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  editPaymentMethod(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'editPaymentMethod',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  tokenizeCard(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'tokenizeCard',
      idCliente: +form.idCliente,
      tarjeta: form.cardNumber.toString(),
      expira: form.expDate,
      cvv: form.cvv.toString()
    })
  }

  autorizePayment(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'autorizePayment',
      tarjeta: form.cardNumber.toString(),
      expira: form.expDate,
      cvv: form.cvv.toString(),
      monto: form.amount,
    })
  }

  saveFailTransaction(payDetails){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'saveFailTransaction',
      payDetails: payDetails,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
