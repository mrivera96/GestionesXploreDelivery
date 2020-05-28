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

  getBranchOffices(){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCustomerBranchOffices', tkn: this.authService.currentUserValue.access_token})
  }
}
