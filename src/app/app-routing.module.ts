import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./components/xplore/home/home.component";
import {LoginComponent} from "./components/shared/login/login.component";
import {VerSolicitudComponent} from "./components/xplore/ver-solicitud/ver-solicitud.component";
import {VerTodasReservasComponent} from "./components/xplore/ver-todas-reservas/ver-todas-reservas.component";
import {ReservasManianaComponent} from "./components/xplore/reservas-maniana/reservas-maniana.component";
import {XploreGuard} from "./guards/xplore.guard";
import {CustomerGuard} from "./guards/customer.guard";
import {HomeCustomerComponent} from "./components/customer/home-customer/home-customer.component";
import {RootComponent} from "./components/shared/root/root.component";
import {TodosDeliveriesComponent} from "./components/customer/customer-todos-deliveries/todos-deliveries.component";
import {DeliveriesManianaComponent} from "./components/customer/customer-deliveries-maniana/deliveries-maniana.component";
import {CustomerNewDeliveryComponent} from "./components/customer/customer-new-delivery/customer-new-delivery.component";
import {CustomerBranchOfficesComponent} from "./components/customer/customer-branch-offices/customer-branch-offices.component";
import {CustomerNewBranchComponent} from "./components/customer/customer-new-branch/customer-new-branch.component";
import {CustomerDeliveryDetailComponent} from "./components/customer/customer-delivery-detail/customer-delivery-detail.component";
import {XploreCategoriesComponent} from "./components/xplore/xplore-categories/xplore-categories.component";
import {XploreRatesComponent} from "./components/xplore/xplore-rates/xplore-rates.component";
import {CustomerTodayOrdersComponent} from "./components/customer/customer-today-orders/customer-today-orders.component";
import {CustomerAllOrdersComponent} from "./components/customer/customer-all-orders/customer-all-orders.component";


const routes: Routes = [
  //RUTAS COMUNES
  {path: '', component: RootComponent},
  {path: 'login', component: LoginComponent},

  //RUTAS PARA USUARIOS DE XPLORE

  {path: 'xplore-inicio', component: HomeComponent, canActivate: [XploreGuard]},
  {path: 'xplore-ver/:id', component: VerSolicitudComponent, canActivate: [XploreGuard]},
  {path: 'xplore-todas', component: VerTodasReservasComponent, canActivate: [XploreGuard]},
  {path: 'xplore-maniana', component: ReservasManianaComponent, canActivate: [XploreGuard]},
  {path: 'xplore-parametrizar-categorias', component: XploreCategoriesComponent, canActivate: [XploreGuard]},
  {path: 'xplore-parametrizar-tarifas', component: XploreRatesComponent, canActivate: [XploreGuard]},

  //RUTAS PARA CLIENTES
  {path: 'cliente-inicio', component: CustomerNewDeliveryComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-hoy', component: HomeCustomerComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-todos', component: TodosDeliveriesComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-mañana', component: DeliveriesManianaComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-sucursales', component: CustomerBranchOfficesComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-agregar-sucursal', component: CustomerNewBranchComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-detalle-delivery/:id', component: CustomerDeliveryDetailComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-pedidos-hoy', component: CustomerTodayOrdersComponent, canActivate: [CustomerGuard]},
  {path: 'cliente-pedidos-todos', component: CustomerAllOrdersComponent, canActivate: [CustomerGuard]},
  /*{ path: 'todos-mis-deliveries', component: TodasMisReservacionesComponent , canActivate: [CustomerGuard] },
  { path: 'deliveries-manana', component: MisReservacionesManianaComponent , canActivate: [CustomerGuard] },
  { path: 'agregar-delivery', component: CrearDeliveryComponent , canActivate: [CustomerGuard] },*/
  // redirige a home si no existe la ruta

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
