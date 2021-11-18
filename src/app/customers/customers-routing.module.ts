import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerNewDeliveryComponent } from './components/new-delivery/customer-new-delivery.component';
import { CustomerGuard } from '../guards/customer.guard';
import { HomeCustomerComponent } from './components/home-customer/home-customer.component';
import { TodosDeliveriesComponent } from './components/all-deliveries/todos-deliveries.component';
import { DeliveriesManianaComponent } from './components/tomorrow-deliveries/deliveries-maniana.component';
import { CustomerBranchOfficesComponent } from './components/address/customer-branch-offices.component';
import { CustomerNewBranchComponent } from './components/address/new-address/customer-new-branch.component';
import { CustomerTodayOrdersComponent } from './components/today-orders/customer-today-orders.component';
import { CustomerAllOrdersComponent } from './components/all-orders/customer-all-orders.component';
import { CustomerProfileComponent } from './components/profile/customer-profile.component';
import { CustomerBalanceComponent } from './components/balance/customer-balance.component';
import { CustomerReportsComponent } from './components/reports/customer-reports.component';
import { CustomerDashboardComponent } from './components/dashboard/customer-dashboard.component';
import { CustomerNewConsolidatedDeliveryComponent } from './components/new-consolidated-delivery/customer-new-consolidated-delivery.component';
import { CustomerNewConsolidatedForeignDeliveryComponent } from './components/new-consolidated-foreign-delivery/customer-new-consolidated-foreign-delivery.component';
import { CustomerNewRoutingShippingComponent } from './components/new-routing-shipping/customer-new-routing-shipping.component';
import { CustomerLabelsComponent } from './components/labels/customer-labels.component';
import { DeliveryDetailComponent } from '../shared/components/delivery-detail/delivery-detail.component';
import { ViewTermsConditionsComponent } from './components/view-terms-conditions/view-terms-conditions.component';
import { ReadCardsComponent } from './components/cards/read-cards/read-cards.component';
import { DeliveryInvoiceComponent } from '../shared/components/delivery-invoice/delivery-invoice.component';

const routes: Routes = [
  //RUTAS PARA CLIENTES
  {
    path: 'envio-normal',
    component: CustomerNewDeliveryComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'reservas-hoy',
    component: HomeCustomerComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'reservas-todos',
    component: TodosDeliveriesComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'reservas-todos/:initDate/:finDate',
    component: TodosDeliveriesComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'reservas-mañana',
    component: DeliveriesManianaComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'direcciones',
    component: CustomerBranchOfficesComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'agregar-direccion',
    component: CustomerNewBranchComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'ver-reserva/:id',
    component: DeliveryDetailComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'envios-hoy',
    component: CustomerTodayOrdersComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'envios-todos',
    component: CustomerAllOrdersComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'envios-todos/:initDate/:finDate',
    component: CustomerAllOrdersComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'perfil',
    component: CustomerProfileComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'balance',
    component: CustomerBalanceComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'reporte-envios',
    component: CustomerReportsComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'dashboard',
    component: CustomerDashboardComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'envio-consolidado',
    component: CustomerNewConsolidatedDeliveryComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'envio-consolidado-foraneo',
    component: CustomerNewConsolidatedForeignDeliveryComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'envio-ruteo',
    component: CustomerNewRoutingShippingComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'etiquetas',
    component: CustomerLabelsComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'terminos-y-condiciones',
    component: ViewTermsConditionsComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: 'metodos-pago',
    component: ReadCardsComponent,
    canActivate: [CustomerGuard],
  },{
    path: 'ver-factura/:refNumber',
    component: DeliveryInvoiceComponent,
    canActivate: [CustomerGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
