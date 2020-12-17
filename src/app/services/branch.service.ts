import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getBranchOffices(idCustomer = null){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCustomerBranchOffices',
      idCustomer,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  newBranch(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'newBranch',
      form,
      tkn: this.authService.currentUserValue.access_token})
  }

  editBranch(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'updateBranch',
      form,
      tkn: this.authService.currentUserValue.access_token})
  }

  deleteBranch(id){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'deleteBranch',
      id:id,
      tkn: this.authService.currentUserValue.access_token})
  }
}
