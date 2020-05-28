import { Injectable } from '@angular/core';
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
  ) { }

  getRates(){
    return this.http.get<any>(`${environment.apiUrl}`, {params:{function: 'getTarifas'}})
  }

  editRate(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editRate',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
