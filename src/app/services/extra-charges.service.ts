import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ExtraChargesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getExtraCharges(){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'getExtraCharges',
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  editExtraCharge(id, form){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'updateExtraCharge',
        ecId:id,
        form,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  createExtraCharge(form){
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'createExtraCharge',
        form,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }


}
