import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {LatLng} from "../models/lat-lng";

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  geocoder: google.maps.Geocoder

  constructor(
    private http: HttpClient
  ) {
    this.geocoder = new google.maps.Geocoder();
  }

  getCoords(place: string): Observable<LatLng> {
    return new Observable(observer => {
      this.geocoder.geocode({'address': place}, results => {
        observer.next({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        })

        observer.complete()
      })

    })

  }
}
