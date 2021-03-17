import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AgenciesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCities(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getCities',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getAgencies(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getAgencies',
      tkn: this.authService.currentUserValue.access_token
    })
  }
}