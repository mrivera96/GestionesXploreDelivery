import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getBillingFrequencies(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getBillingFrequencies',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getBillingReport(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getBillingReport',
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
