import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DeliveriesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCustomerDashboardData() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCustomerDashboardData',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getTodayDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getTodayDeliveries',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getTomorrowDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getTomorrowDeliveries',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getAllDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getAllDeliveries',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getFilteredDeliveries(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getFilteredDeliveries',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getTodayOrders() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getTodayOrders',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getAllOrders() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getAllOrders',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getFilteredOrders(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getFilteredOrders',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getById(id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getDeliveryById',
      id: id,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  cancelDelivery(id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'cancelDelivery',
      id: id,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  assignDelivery(id, form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'assignDelivery',
      idDelivery: id,
      assignForm: form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  finishDelivery(id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'finishDelivery',
      idDelivery: id,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  changeState(id, ste) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'changeState',
      idDelivery: id,
      idEstado: ste,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getStates() {
    return this.http.get<any>(`${environment.apiUrl}`, {
      params: { function: 'listStates' },
    });
  }

  //CUSTOMER'S SERVICES
  getTodayCustomerDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getTodayCustomerDeliveries',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getAllCustomerDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getAllCustomerDeliveries',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getCustomerOrders(id?) {
    if (id) {
      return this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCustomerOrdersFAdmin',
        customerId: id,
        tkn: this.authService.currentUserValue.access_token,
      });
    }
  }

  getTodayCustomerOrders() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getTodayCustomerOrders',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getAllCustomerOrders() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getAllCustomerOrders',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  newCustomerDelivery(deliveryForm, orders, pago, idCustomer = null) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'insertCustomerDelivery',
      deliveryForm,
      orders,
      pago: pago,
      idCustomer,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getPending() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getPendingDeliveries',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  changeDeliveryHour(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'changeHour',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getOrdersByDriver(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'reportOrdersByDriver',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getConsolidatedOrdersByDriver(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'reportConsolidatedOrdersByDriver',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getOrdersByCustomer(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'reportOrdersByCustomer',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  changeOrderState(id, ste, obsr) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'changeOrderState',
      idDetalle: id,
      idEstado: ste,
      observaciones: obsr,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  assigOrder(orderId, driverId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'assignOrder',
      idDetalle: orderId,
      idConductor: driverId,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  assigOrderAuxiliar(orderId, auxiliarId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'assignOrderAuxiliar',
      idDetalle: orderId,
      idAuxiliar: auxiliarId,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  addExtraChargeToOrder(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'addExtraChargeToOrder',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  removeExtraChargeFromOrder(idDetalle, id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'removeExtraChargeFromOrder',
      idDetalle,
      id,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getDeliveriesReport(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'deliveriesReport',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  optimizeRoute(routes) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'optimizeRoutes',
      routes: routes,
    });
  }

  changeDestinationAddress(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'changeDestinationAddress',
      form,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  getDriverPending(id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getDriverPending',
      driverId: id,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  removeOrder(orderId, deliveryId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'removeOrder',
      orderId,
      deliveryId,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  addOrder(order, deliveryId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'addOrder',
      order,
      deliveryId,
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  createShuttle(vehicleData, reservData,
    passengerData, paymentData){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'createShuttle',
      vehicleData,
      reservData,
      passengerData,
      paymentData
    });
  }

  getshuttleDetails(id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getShuttleById',
      id: id,
    });
  }

  validateDateTime(date, time, delType) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'validateDateTime',
      date,
      time,
      delType,
      tkn: this.authService.currentUserValue.access_token,
    });
  }
}
