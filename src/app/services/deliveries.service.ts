import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getDeliveries',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getOrders() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getOrders',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getById(id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getDeliveryById',
      id: id,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  assignDelivery(id, form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'assignDelivery',
        idDelivery: id,
        assignForm: form,
        tkn: this.authService.currentUserValue.access_token
      })
  }

  finishDelivery(id) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'finishDelivery',
        idDelivery: id,
        tkn: this.authService.currentUserValue.access_token
      })
  }

  changeState(id, ste) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'changeState',
        idDelivery: id,
        idEstado: ste,
        tkn: this.authService.currentUserValue.access_token
      })
  }

  getStates() {
    return this.http.get<any>(`${environment.apiUrl}`, {params: {function: 'listStates'}})
  }

  //CUSTOMER'S SERVICES
  getCustomerDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCustomerDeliveries', tkn: this.authService.currentUserValue.access_token
    })
  }

  getCustomerOrders(id?) {
    if (id) {
      return this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCustomerOrdersFAdmin',
        customerId: id,
        tkn: this.authService.currentUserValue.access_token
      })
    } else {
      return this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCustomerOrders', tkn: this.authService.currentUserValue.access_token
      })
    }

  }


  newCustomerDelivery(deliveryForm, orders, pago) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      'function': 'insertCustomerDelivery',
      deliveryForm,
      orders,
      'pago': pago,
      tkn: this.authService.currentUserValue.access_token
    });
  }

  getPending() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getPendingDeliveries',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  changeDeliveryHour(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'changeHour',
        form,
        tkn: this.authService.currentUserValue.access_token
      })
  }

  getOrdersByDriver(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'reportOrdersByDriver',
        form,
        tkn: this.authService.currentUserValue.access_token
      })
  }

  getOrdersByCustomer(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'reportOrdersByCustomer',
        form,
        tkn: this.authService.currentUserValue.access_token
      })
  }

  changeOrderState(id, ste) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'changeOrderState',
        idDetalle: id,
        idEstado: ste,
        tkn: this.authService.currentUserValue.access_token
      })
  }
}
