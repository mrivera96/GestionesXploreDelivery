import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LatLng } from '../models/lat-lng';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(
    private http: HttpClient
  ) { }

  getCoords(place: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCoords',
      lugar: place,
    })
  }
}
