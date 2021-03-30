import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerNewDeliveryComponent} from "../components/customer/new-delivery/customer-new-delivery.component";
import {CustomerGuard} from "../guards/customer.guard";
import {HomeCustomerComponent} from "../components/customer/home-customer/home-customer.component";
import {TodosDeliveriesComponent} from "../components/customer/all-deliveries/todos-deliveries.component";
import {DeliveriesManianaComponent} from "../components/customer/tomorrow-deliveries/deliveries-maniana.component";
import {CustomerBranchOfficesComponent} from "../components/customer/branch-offices/customer-branch-offices.component";
import {CustomerNewBranchComponent} from "../components/customer/new-branch/customer-new-branch.component";
import {CustomerDeliveryDetailComponent} from "../components/customer/delivery-detail/customer-delivery-detail.component";
import {CustomerTodayOrdersComponent} from "../components/customer/today-orders/customer-today-orders.component";
import {CustomerAllOrdersComponent} from "../components/customer/all-orders/customer-all-orders.component";
import {CustomerProfileComponent} from "../components/customer/profile/customer-profile.component";
import {CustomerBalanceComponent} from "../components/customer/balance/customer-balance.component";
import {CustomerReportsComponent} from "../components/customer/reports/customer-reports.component";
import { CustomerDashboardComponent } from '../components/customer/dashboard/customer-dashboard.component';
import {CustomerNewConsolidatedDeliveryComponent} from "../components/customer/new-consolidated-delivery/customer-new-consolidated-delivery.component";
import {CustomerNewConsolidatedForeignDeliveryComponent} from "../components/customer/new-consolidated-foreign-delivery/customer-new-consolidated-foreign-delivery.component";
import { CustomerNewRoutingShippingComponent } from '../components/customer/new-routing-shipping/customer-new-routing-shipping.component';
import { CustomerLabelsComponent } from '../components/customer/labels/customer-labels.component';

const routes: Routes = [
  //RUTAS PARA CLIENTES
  {path: 'inicio', component: CustomerNewDeliveryComponent, canActivate: [CustomerGuard]},
  {path: 'reservas-hoy', component: HomeCustomerComponent, canActivate: [CustomerGuard]},
  {path: 'reservas-todos', component: TodosDeliveriesComponent, canActivate: [CustomerGuard]},
  {path: 'reservas-todos/:initDate/:finDate', component: TodosDeliveriesComponent, canActivate: [CustomerGuard]},
  {path: 'reservas-mañana', component: DeliveriesManianaComponent, canActivate: [CustomerGuard]},
  {path: 'direcciones', component: CustomerBranchOfficesComponent, canActivate: [CustomerGuard]},
  {path: 'agregar-direccion', component: CustomerNewBranchComponent, canActivate: [CustomerGuard]},
  {path: 'ver-reserva/:id', component: CustomerDeliveryDetailComponent, canActivate: [CustomerGuard]},
  {path: 'envios-hoy', component: CustomerTodayOrdersComponent, canActivate: [CustomerGuard]},
  {path: 'envios-todos', component: CustomerAllOrdersComponent, canActivate: [CustomerGuard]},
  {path: 'envios-todos/:initDate/:finDate', component: CustomerAllOrdersComponent, canActivate: [CustomerGuard]},
  {path: 'perfil', component: CustomerProfileComponent, canActivate: [CustomerGuard]},
  {path: 'balance', component: CustomerBalanceComponent, canActivate: [CustomerGuard]},
  {path: 'reporte-envios', component: CustomerReportsComponent, canActivate: [CustomerGuard]},
  {path: 'dashboard', component: CustomerDashboardComponent, canActivate: [CustomerGuard]},
  {path: 'envio-consolidado', component: CustomerNewConsolidatedDeliveryComponent, canActivate: [CustomerGuard]},
  {path: 'envio-consolidado-foraneo', component: CustomerNewConsolidatedForeignDeliveryComponent, canActivate: [CustomerGuard]},
  {path: 'envio-ruteo', component: CustomerNewRoutingShippingComponent, canActivate: [CustomerGuard]},
  {path: 'etiquetas', component: CustomerLabelsComponent, canActivate: [CustomerGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
