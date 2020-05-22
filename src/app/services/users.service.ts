import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Response} from "../models/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers(){
    return this.http.get<Response>(`${environment.apiUrl}`, {params: {function: 'listUsers'}})
  }
}
