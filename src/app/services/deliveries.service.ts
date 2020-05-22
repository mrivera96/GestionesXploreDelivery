import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Response} from "../models/response";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getDeliveries(){
    return this.http.get<Response>(`${environment.apiUrl}`, {params:{
      function: 'getDeliveries'
    }})
  }

  getById(id){
    return this.http.get<Response>(`${environment.apiUrl}`, {params:{
        function: 'getDeliveryById', id
      }})
  }

  assignDelivery(id, form){
    return this.http.post<Response>(`${environment.apiUrl}`,
      {
        function: 'assignDelivery', idDelivery: id, assignForm: form, tkn: this.authService.currentUserValue.access_token
      })
  }

  finishDelivery(id){
    return this.http.post<Response>(`${environment.apiUrl}`,
      {
        function: 'finishDelivery', idDelivery: id, tkn: this.authService.currentUserValue.access_token
      })
  }

  changeState(id, ste){
    return this.http.post<Response>(`${environment.apiUrl}`,
      {
        function: 'changeState', idDelivery: id, idEstado: ste,tkn: this.authService.currentUserValue.access_token
      })
  }

  getStates(){
    return this.http.get<Response>(`${environment.apiUrl}`, {params: {function: 'listStates'}})
  }
}
