import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  addPayment(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'createPayment',
        form,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  getPayments(){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'getPayments',
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  getPaymentTypes(){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'getPaymentTypes',
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }
}