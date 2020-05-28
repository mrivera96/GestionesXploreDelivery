import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Response} from "../models/response";

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  constructor(
    private http: HttpClient
  ) { }

  getVehicles(){
    return this.http.get<any>(`${environment.apiUrl}`, {params: {function: 'listVehicles'}})
  }
}
