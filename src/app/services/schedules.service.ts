import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getSchedule(){
    return this.http.get<any>(`${environment.apiUrl}`,{params:{function:'getSchedule'} })
  }

  editSchedule(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editSchedule',
      form ,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
