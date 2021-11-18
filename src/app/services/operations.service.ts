import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LatLng } from '../models/lat-lng';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  geocoder: google.maps.Geocoder;

  constructor(private http: HttpClient) {
    this.geocoder = new google.maps.Geocoder();
  }

  getCoords(place: string): Observable<LatLng> {
    return new Observable((observer) => {
      this.geocoder.geocode({ address: place }, (results) => {
        observer.next({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });

        observer.complete();
      });
    });
  }

  checkCustomerInstructions(bOffice, instField) {
    if (bOffice.instrucciones != '' || bOffice.instrucciones != null) {
      instField.setValue(bOffice.instrucciones);
    } else {
      instField.setValue('');
    }
  }

  searchPlace(lugar) {
    if (lugar.trim().length >= 5) {
      return this.http
        .post<any>(`${environment.apiUrl}`, {
          lugar: lugar,
          function: 'searchPlace',
        })
        .pipe((res) => {
          return res;
        });
    }else{
      return new Observable()
    }
  }
}
