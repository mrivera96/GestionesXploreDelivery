import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Response} from "../models/response";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  constructor(
    private http: HttpClient
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
}
