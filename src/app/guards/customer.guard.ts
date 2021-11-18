import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.authService.currentUserValue;
    const currentRoute = state.url;
    if (currentUser) {
      if (currentUser.idPerfil === '8') {
        return true;
      } else if (currentUser.idPerfil === '12') {
        const blockedRoutes = [
          '/customers/envio-normal',
          '/customers/direcciones',
          '/customers/agregar-direccion',
          '/customers/perfil',
          '/customers/balance',
          '/customers/reporte-envios',
          '/customers/envio-consolidado',
          '/customers/envio-consolidado-foraneo',
          '/customers/envio-ruteo',
          '/customers/etiquetas',
          '/customers/terminos-y-condiciones',
          '/customers/metodos-pago',
          '/customers/ver-factura/:refNumber',
          '/customers/usuarios-de-consulta'
        ];

        let counter = 0;

        blockedRoutes.forEach(route=>{
          if(currentRoute === route){
            counter++;
          }
        })

        if(counter == 0){
          return true;
        }else{
          this.router.navigate(['/']);
          return false;
        }
     
      }
    }

    // El usuario no está logueado y es redirigido al login
    this.router.navigate(['/login']);
    return false;
  }
}
