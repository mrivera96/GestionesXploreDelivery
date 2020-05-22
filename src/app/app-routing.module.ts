import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {AuthGuard} from "./helpers/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {VerSolicitudComponent} from "./components/ver-solicitud/ver-solicitud.component";
import {VerTodasReservasComponent} from "./components/ver-todas-reservas/ver-todas-reservas.component";
import {ReservasManianaComponent} from "./components/reservas-maniana/reservas-maniana.component";


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'ver-solicitud/:id', component: VerSolicitudComponent },
  { path: 'ver-todas', component: VerTodasReservasComponent },
  { path: 'reservas-maniana', component: ReservasManianaComponent },
  // redirige a home si no existe la ruta

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
