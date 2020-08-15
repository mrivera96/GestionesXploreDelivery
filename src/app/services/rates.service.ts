import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getRates() {
    return this.http.get<any>(`${environment.apiUrl}`, {params: {function: 'getTarifas'}})
  }

  editRate(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'editRate',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createRate(form, customers, detail?, schedules?) {
    if(detail){
      return this.http.post<any>(`${environment.apiUrl}`, {
        function: 'createRate',
        form,
        detail:detail,
        schedules,
        customers: customers,
        tkn: this.authService.currentUserValue.access_token
      })
    }else{
      return this.http.post<any>(`${environment.apiUrl}`, {
        function: 'createRate',
        form,
        customers: customers,
        tkn: this.authService.currentUserValue.access_token
      })
    }

  }

  getCustomerRates() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getMyRates',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getRateCustomers(rateId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getRateCustomers',
      idTarifa: rateId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  removeCustomerFromRate(rateId, customerId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'removeCustomerFromRate',
      idCliente: customerId,
      idTarifa: rateId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  addCustomerToRate(rateId, customerId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'addCustomerToRate',
      idCliente: customerId,
      idTarifa: rateId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getRateTypes(){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getRateTypes',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  updateConsolidatedRateDetail(form, schedules?){
    if(schedules){
      return this.http.post<any>(`${environment.apiUrl}`, {
        function: 'updateConsolidatedRateDetail',
        form,
        schedules,
        tkn: this.authService.currentUserValue.access_token
      })
    }else{
      return this.http.post<any>(`${environment.apiUrl}`, {
        function: 'updateConsolidatedRateDetail',
        form,
        tkn: this.authService.currentUserValue.access_token
      })
    }

  }

  getRateSchedules(rateId){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getRateSchedules',
      idTarifa: rateId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  removeScheduleFromRate(rateId, scheduleId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'removeScheduleFromRate',
      idHorario: scheduleId,
      idTarifa: rateId,
      tkn: this.authService.currentUserValue.access_token
    })
  }


}
