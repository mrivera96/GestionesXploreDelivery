import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {LoginComponent} from "./components/shared/login/login.component";
import {RootComponent} from "./components/shared/root/root.component";
import {PasswordRecoveryComponent} from "./components/shared/password-recovery/password-recovery.component";

const routes: Routes = [
  //RUTAS COMUNES
  {path: '', component: RootComponent},
  {path: 'login', component: LoginComponent},
  {path: 'password-recovery', component: PasswordRecoveryComponent},
  {
    path:'customers',
    loadChildren: './customers/customers.module#CustomersModule'
  },
  {
    path:'admins',
    loadChildren: './admins/admins.module#AdminsModule'
  },

  /*{ path: 'todos-mis-deliveries', component: TodasMisReservacionesComponent , canActivate: [CustomerGuard] },
  { path: 'deliveries-manana', component: MisReservacionesManianaComponent , canActivate: [CustomerGuard] },
  { path: 'agregar-delivery', component: CrearDeliveryComponent , canActivate: [CustomerGuard] },*/
  // redirige a home si no existe la ruta

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
