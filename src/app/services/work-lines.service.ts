import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WorkLinesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getWorkLines(){//Only active
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getWorkLines',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getAllWorkLines(){//All worklines
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getAllWorkLines',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  addCustomerToWorkLine(customerId, worklineId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'addCustomerToWorkLine',
      customerId,
      worklineId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  removeCustomerFromWorkLine(customerId, worklineId){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'removeCustomerFromWorkLine',
      customerId,
      worklineId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  editWorkLine(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editWorkLine',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createWorkLine(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'createWorkLine',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
