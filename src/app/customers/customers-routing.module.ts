import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerNewDeliveryComponent} from "../components/customer/customer-new-delivery/customer-new-delivery.component";
import {CustomerGuard} from "../guards/customer.guard";
import {HomeCustomerComponent} from "../components/customer/home-customer/home-customer.component";
import {TodosDeliveriesComponent} from "../components/customer/customer-todos-deliveries/todos-deliveries.component";
import {DeliveriesManianaComponent} from "../components/customer/customer-deliveries-maniana/deliveries-maniana.component";
import {CustomerBranchOfficesComponent} from "../components/customer/customer-branch-offices/customer-branch-offices.component";
import {CustomerNewBranchComponent} from "../components/customer/customer-new-branch/customer-new-branch.component";
import {CustomerDeliveryDetailComponent} from "../components/customer/customer-delivery-detail/customer-delivery-detail.component";
import {CustomerTodayOrdersComponent} from "../components/customer/customer-today-orders/customer-today-orders.component";
import {CustomerAllOrdersComponent} from "../components/customer/customer-all-orders/customer-all-orders.component";
import {CustomerProfileComponent} from "../components/customer/customer-profile/customer-profile.component";
import {CustomerBalanceComponent} from "../components/customer/customer-balance/customer-balance.component";
import {CustomerReportsComponent} from "../components/customer/customer-reports/customer-reports.component";
import { CustomerDashboardComponent } from '../components/customer/customer-dashboard/customer-dashboard.component';
import {CustomerNewConsolidatedDeliveryComponent} from "../components/customer/customer-new-consolidated-delivery/customer-new-consolidated-delivery.component";
import {CustomerNewConsolidatedForeignDeliveryComponent} from "../components/customer/customer-new-consolidated-foreign-delivery/customer-new-consolidated-foreign-delivery.component";

const routes: Routes = [
  //RUTAS PARA CLIENTES
  {path: 'inicio', component: CustomerNewDeliveryComponent, canActivate: [CustomerGuard]},
  {path: 'reservas-hoy', component: HomeCustomerComponent, canActivate: [CustomerGuard]},
  {path: 'reservas-todos', component: TodosDeliveriesComponent, canActivate: [CustomerGuard]},
  {path: 'reservas-mañana', component: DeliveriesManianaComponent, canActivate: [CustomerGuard]},
  {path: 'direcciones', component: CustomerBranchOfficesComponent, canActivate: [CustomerGuard]},
  {path: 'agregar-direccion', component: CustomerNewBranchComponent, canActivate: [CustomerGuard]},
  {path: 'ver-reserva/:id', component: CustomerDeliveryDetailComponent, canActivate: [CustomerGuard]},
  {path: 'envios-hoy', component: CustomerTodayOrdersComponent, canActivate: [CustomerGuard]},
  {path: 'envios-todos', component: CustomerAllOrdersComponent, canActivate: [CustomerGuard]},
  {path: 'perfil', component: CustomerProfileComponent, canActivate: [CustomerGuard]},
  {path: 'balance', component: CustomerBalanceComponent, canActivate: [CustomerGuard]},
  {path: 'reporte-envios', component: CustomerReportsComponent, canActivate: [CustomerGuard]},
  {path: 'dashboard', component: CustomerDashboardComponent, canActivate: [CustomerGuard]},
  {path: 'envio-consolidado', component: CustomerNewConsolidatedDeliveryComponent, canActivate: [CustomerGuard]},
  {path: 'envio-consolidado-foraneo', component: CustomerNewConsolidatedForeignDeliveryComponent, canActivate: [CustomerGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
