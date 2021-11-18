import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TermConditionsService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  get(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getTermsConditions',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  create(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'createTermCondition',
      tkn: this.authService.currentUserValue.access_token,
      form
    })
  }

  update(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'updateTermCondition',
      tkn: this.authService.currentUserValue.access_token,
      form
    })
  }
}
