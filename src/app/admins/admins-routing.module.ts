import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "../components/admin/today-deliveries/home.component";
import {XploreGuard} from "../guards/xplore.guard";
import {VerSolicitudComponent} from "../components/admin/delivery-detail/ver-solicitud.component";
import {VerTodasReservasComponent} from "../components/admin/all-deliveries/ver-todas-reservas.component";
import {ReservasManianaComponent} from "../components/admin/tomorrow-deliveries/reservas-maniana.component";
import {XploreCategoriesComponent} from "../components/admin/categories/xplore-categories.component";
import {XploreRatesComponent} from "../components/admin/rates/xplore-rates.component";
import {XploreSurchargesComponent} from "../components/admin/surcharges/xplore-surcharges.component";
import {XploreCustomersComponent} from "../components/admin/customers/xplore-customers.component";
import {XploreAddCustomerComponent} from "../components/admin/add-customer/xplore-add-customer.component";
import {XploreTodayOrdersComponent} from "../components/admin/today-orders/xplore-today-orders.component";
import {XploreAllOrdersComponent} from "../components/admin/all-orders/xplore-all-orders.component";
import {PendingDeliveriesComponent} from "../components/admin/pending-deliveries/pending-deliveries.component";
import {XploreDriversComponent} from "../components/admin/drivers/xplore-drivers.component";
import {OrdersByDriverComponent} from "../components/admin/reports/orders-by-driver/orders-by-driver.component";
import {PaymentsComponent} from "../components/admin/payments/payments.component";
import {OrdersByCustomerComponent} from "../components/admin/reports/orders-by-customer/orders-by-customer.component";
import {XploreScheduleComponent} from "../components/admin/schedule/xplore-schedule.component";
import {XploreCustomerBalanceComponent} from "../components/admin/customer-balance/xplore-customer-balance.component";
import {ExtraChargesComponent} from "../components/admin/extra-charges/extra-charges.component";
import {DeliveriesReportComponent} from "../components/admin/reports/deliveries-report/deliveries-report.component";
import {PaymentsReportComponent} from "../components/admin/reports/payments-report/payments-report.component";
import {CustomersReportComponent} from "../components/admin/reports/customers-report/customers-report.component";
import {CustomersBalanceReportComponent} from "../components/admin/reports/customer-balance-report/customers-balance-report.component";
import {CustomersTrackingReportComponent} from "../components/admin/reports/customers-tracking-report/customers-tracking-report.component";
import { XploreWorkLinesComponent } from '../components/admin/work-lines/xplore-work-lines.component';
import {ReportRequestsComponent} from "../components/admin/reports/report-requests/report-requests.component";
import { XploreAddDeliveryComponent } from '../components/admin/add-delivery/xplore-add-delivery.component';
import { OrdersByDriverConsolidatedComponent } from '../components/admin/reports/orders-by-driver-consolidated/orders-by-driver-consolidated.component';
import {RestrictionsComponent} from "../components/admin/restrictions/restrictions.component";
import {BillingReportComponent} from "../components/admin/reports/billing-report/billing-report/billing-report.component";

const routes: Routes = [
  //RUTAS PARA USUARIOS DE XPLORE

  {path: 'reservas-hoy', component: HomeComponent, canActivate: [XploreGuard]},
  {path: 'ver-reserva/:id', component: VerSolicitudComponent, canActivate: [XploreGuard]},
  {path: 'reservas-todas', component: VerTodasReservasComponent, canActivate: [XploreGuard]},
  {path: 'reservas-todas/:initDate/:finDate', component: VerTodasReservasComponent, canActivate: [XploreGuard]},
  {path: 'tomorrow-deliveries', component: ReservasManianaComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-categorias', component: XploreCategoriesComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-restricciones', component: RestrictionsComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-rubros', component: XploreWorkLinesComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-tarifas', component: XploreRatesComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-recargos', component: XploreSurchargesComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-envio-reportes', component: ReportRequestsComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-horarios', component: XploreScheduleComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-cargos-extras', component: ExtraChargesComponent, canActivate: [XploreGuard]},
  {path: 'clientes', component: XploreCustomersComponent, canActivate: [XploreGuard]},
  {path: 'agregar-cliente', component: XploreAddCustomerComponent, canActivate: [XploreGuard]},
  {path: 'envios-hoy', component: XploreTodayOrdersComponent, canActivate: [XploreGuard]},
  {path: 'envios-todos', component: XploreAllOrdersComponent, canActivate: [XploreGuard]},
  {path: 'envios-todos/:initDate/:finDate', component: XploreAllOrdersComponent, canActivate: [XploreGuard]},
  {path: 'reservas-pendientes', component: PendingDeliveriesComponent, canActivate: [XploreGuard]},
  {path: 'conductores', component: XploreDriversComponent, canActivate: [XploreGuard]},
  {path: 'reportes/envios-conductores', component: OrdersByDriverComponent, canActivate: [XploreGuard]},
  {path: 'reportes/consolidados-conductores', component: OrdersByDriverConsolidatedComponent, canActivate: [XploreGuard]},
  {path: 'reportes/envios', component: DeliveriesReportComponent, canActivate: [XploreGuard]},
  {path: 'reportes/pagos', component: PaymentsReportComponent, canActivate: [XploreGuard]},
  {path: 'reportes/clientes', component: CustomersReportComponent, canActivate: [XploreGuard]},
  {path: 'reportes/balance-clientes', component: CustomersBalanceReportComponent, canActivate: [XploreGuard]},
  {path: 'reportes/seguimiento-clientes', component: CustomersTrackingReportComponent, canActivate: [XploreGuard]},
  {path: 'reportes/envios-clientes', component: OrdersByCustomerComponent, canActivate: [XploreGuard]},
  {path: 'reportes/facturas', component: BillingReportComponent, canActivate: [XploreGuard]},
  {path: 'pagos', component: PaymentsComponent, canActivate: [XploreGuard]},
  {path: 'balance-cliente/:id/:nombre', component: XploreCustomerBalanceComponent, canActivate: [XploreGuard]},
  {path: 'nuevo-delivery', component: XploreAddDeliveryComponent, canActivate: [XploreGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsRoutingModule {
}
