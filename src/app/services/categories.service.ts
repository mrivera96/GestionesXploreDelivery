import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllCategories(){
    return this.http.get<any>(`${environment.apiUrl}`,{params:{function:'getCategories'}})
  }

  showAllCategories(){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'showAllCategories',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  editCategory(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editCategory',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createCategory(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'createCategory',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
