import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {

  constructor(private http: HttpClient, private authService:AuthService) { }

  getServiceTypes(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getServiceTypes',
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
