import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { RootComponent } from './shared/components/root/root.component';
import { PasswordRecoveryComponent } from './shared/components/password-recovery/password-recovery.component';
import { SignUpComponent } from './shared/components/sign-up/sign-up.component';
import { XploreShuttleComponent } from './shared/components/xplore-shuttle/xplore-shuttle.component';

const routes: Routes = [
  //RUTAS COMUNES
  { path: '', component: RootComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: SignUpComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  {
    path: 'customers',
    loadChildren: './customers/customers.module#CustomersModule',
  },
  {
    path: 'admins',
    loadChildren: './admins/admins.module#AdminsModule',
  },

  /*{ path: 'todos-mis-deliveries', component: TodasMisReservacionesComponent , canActivate: [CustomerGuard] },
  { path: 'deliveries-manana', component: MisReservacionesManianaComponent , canActivate: [CustomerGuard] },
  { path: 'agregar-delivery', component: CrearDeliveryComponent , canActivate: [CustomerGuard] },*/
  // redirige a today-deliveries si no existe la ruta
  { path: 'xplore-shuttle', component: XploreShuttleComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
