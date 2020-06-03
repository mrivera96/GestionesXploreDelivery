import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          if (response?.body?.error === 0) {
            return response
          } else if (response?.body?.error === 1 || response?.body?.codError === 1) {
            const error = response.body.message || response.body.msgError
            throw of(new HttpErrorResponse({status: response.body.status, statusText: error}))
          } else if (response?.body?.message === "Unauthenticated.") {
            //if (!request.body.includes('function:"login"')) {
            // auto deslogue al usuario si la api retorna un error 401
            localStorage.removeItem('currentUserManagement');
            location.reload(true);
            //}
          }
        }

      }, catchError(err => {
        const error = err.error.message || err.statusText
        return throwError(error)
      })));
  }
}
