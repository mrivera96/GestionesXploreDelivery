import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {

      if (err.status === 401) {
        if (!request.url.includes('/auth/login')) {
          // auto deslogue al usuario si la api retorna un error 401
          localStorage.removeItem('currentUser');
          location.reload(true);
        }
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
