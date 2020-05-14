import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {AuthGuard} from "./helpers/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {VerSolicitudComponent} from "./components/ver-solicitud/ver-solicitud.component";


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'ver-solicitud/:id', component: VerSolicitudComponent },
  // redirige a home si no existe la ruta

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
