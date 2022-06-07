import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

/** *
 * Servicio para la comunicación con la API para el manejo de los pagos
*/
export class PaymentsService {



  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  /**
   * Crea un pago
   * @param form formulario con los datos de pago
   * @returns retorna un observable al cual se puede suscribir para obtener el response
   */
  addPayment(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'createPayment',
        form,
        tkn: this.authService.currentUserValue?.access_token || null
      }
    )
  }

  getPayments(form){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'getPayments',
        form,
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

  getMyPayments(){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'getMyPayments',
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  getPaymentsReport(form){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'paymentsReport',
        form,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  addShuttlePayment(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'addShuttlePayment',
        form,
      }
    )
  }

  deletePayment(idPago) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'deletePayment',
        idPago,
        tkn: this.authService.currentUserValue?.access_token
      }
    )
  }

  updatePayment(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'updatePayment',
        form,
        tkn: this.authService.currentUserValue?.access_token
      }
    )
  }
}
