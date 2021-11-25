import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private http: HttpClient,) { }

  getRoutes(){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getShuttleRoutes',
    });
  }
}
