import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(nickname: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}`, {function:'login',nickname, password})
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`)
      .pipe(map(data => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }));
  }

  setCurrUser(user){
    this.currentUserSubject.next(user);
  }
}
