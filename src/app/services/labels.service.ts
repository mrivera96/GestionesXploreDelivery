import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMyLabels() {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'getMyLabels',
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  createLabel(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'createLabel',
        descEtiqueta: form.descEtiqueta,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  updateLabel(form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'updateLabel',
        idEtiqueta: form.idEtiqueta,
        descEtiqueta: form.descEtiqueta,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  deleteLabel(id) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'deleteLabel',
        idEtiqueta: id,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }
}
