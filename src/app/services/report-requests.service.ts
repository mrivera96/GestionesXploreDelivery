import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReportRequestsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getReportRequests() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getReportRequests',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createReportRequests(form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'createReportRequest',
      idCliente: form.idCliente,
      correo: form.correo,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  deleteReportRequests() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'deleteReportRequest',
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
