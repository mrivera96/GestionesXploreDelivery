import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ExtraChargesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getExtraCharges() {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'getExtraCharges',
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  editExtraCharge(id, form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'updateExtraCharge',
        ecId: id,
        form,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  createExtraCharge(form, categories) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'createExtraCharge',
        form,
        categories: categories,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }

  getExtraChargeCategories(extraChargeId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getExtraChargeCategories',
      idCargoExtra: extraChargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  removeCategoryFromExtraCharge(extraChargeId, categoryId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'removeCategoryFromExtraCharge',
      idCategoria: categoryId,
      idCargoExtra: extraChargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  addCategoryToExtraCharge(extraChargeId, categoryId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'addCategoryToExtraCharge',
      idCategoria: categoryId,
      idCargoExtra: extraChargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }


  getExtraChargeOptions(extraChargeId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getExtraChargeOptions',
      idCargoExtra: extraChargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  removeOptionFromExtraCharge(extraChargeId, optionId) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'removeOptionFromExtraCharge',
      optionId: optionId,
      idCargoExtra: extraChargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  addOptionToExtraCharge(extraChargeId, form) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'addOptionToExtraCharge',
      form: form,
      idCargoExtra: extraChargeId,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  editExtraChargeOption(idCargoExtra, idOpcion, form) {
    return this.http.post<any>(`${environment.apiUrl}`,
      {
        function: 'editExtraChargeOption',
        idCargoExtra: idCargoExtra,
        idDetalleOpcion: idOpcion,
        costo: form.costo,
        tiempo: form.tiempo,
        tkn: this.authService.currentUserValue.access_token
      }
    )
  }
}
