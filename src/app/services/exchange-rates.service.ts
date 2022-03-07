import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  readExRates(){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'readExRates',
      tkn: this.authService.currentUserValue.access_token,
    });
  }

  createExRate(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'createExRate',
      tkn: this.authService.currentUserValue.access_token,
      form
    });
  }

  updateExRate(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'updateExRate',
      tkn: this.authService.currentUserValue.access_token,
      form
    });
  }
}
