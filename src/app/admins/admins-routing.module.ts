import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "../components/xplore/home/home.component";
import {XploreGuard} from "../guards/xplore.guard";
import {VerSolicitudComponent} from "../components/xplore/ver-solicitud/ver-solicitud.component";
import {VerTodasReservasComponent} from "../components/xplore/ver-todas-reservas/ver-todas-reservas.component";
import {ReservasManianaComponent} from "../components/xplore/reservas-maniana/reservas-maniana.component";
import {XploreCategoriesComponent} from "../components/xplore/xplore-categories/xplore-categories.component";
import {XploreRatesComponent} from "../components/xplore/xplore-rates/xplore-rates.component";
import {XploreSurchargesComponent} from "../components/xplore/xplore-surcharges/xplore-surcharges.component";
import {XploreCustomersComponent} from "../components/xplore/xplore-customers/xplore-customers.component";
import {XploreAddCustomerComponent} from "../components/xplore/xplore-add-customer/xplore-add-customer.component";
import {XploreTodayOrdersComponent} from "../components/xplore/xplore-today-orders/xplore-today-orders.component";
import {XploreAllOrdersComponent} from "../components/xplore/xplore-all-orders/xplore-all-orders.component";
import {PendingDeliveriesComponent} from "../components/xplore/pending-deliveries/pending-deliveries.component";
import {XploreDriversComponent} from "../components/xplore/xplore-drivers/xplore-drivers.component";
import {OrdersByDriverComponent} from "../components/xplore/xplore-reports/orders-by-driver/orders-by-driver.component";
import {PaymentsComponent} from "../components/xplore/payments/payments.component";
import {OrdersByCustomerComponent} from "../components/xplore/xplore-reports/orders-by-customer/orders-by-customer.component";
import {XploreScheduleComponent} from "../components/xplore/xplore-schedule/xplore-schedule.component";
import {XploreCustomerBalanceComponent} from "../components/xplore/xplore-customer-balance/xplore-customer-balance.component";
import {ExtraChargesComponent} from "../components/xplore/extra-charges/extra-charges.component";
import {DeliveriesReportComponent} from "../components/xplore/xplore-reports/deliveries-report/deliveries-report.component";
import {PaymentsReportComponent} from "../components/xplore/xplore-reports/payments-report/payments-report.component";
import {CustomersReportComponent} from "../components/xplore/xplore-reports/customers-report/customers-report.component";
import {CustomersBalanceReportComponent} from "../components/xplore/xplore-reports/customer-balance-report/customers-balance-report.component";
import {CustomersTrackingReportComponent} from "../components/xplore/xplore-reports/customers-tracking-report/customers-tracking-report.component";
import { XploreWorkLinesComponent } from '../components/xplore/xplore-work-lines/xplore-work-lines.component';
import {ReportRequestsComponent} from "../components/xplore/xplore-reports/report-requests/report-requests.component";
import {CustomerChooseComponent} from "../components/xplore/xplore-add-delivery/customer-choose/customer-choose.component";
import { XploreAddDeliveryComponent } from '../components/xplore/xplore-add-delivery/xplore-add-delivery.component';
import { OrdersByDriverConsolidatedComponent } from '../components/xplore/xplore-reports/orders-by-driver-consolidated/orders-by-driver-consolidated.component';

const routes: Routes = [
  //RUTAS PARA USUARIOS DE XPLORE

  {path: 'reservas-hoy', component: HomeComponent, canActivate: [XploreGuard]},
  {path: 'ver-reserva/:id', component: VerSolicitudComponent, canActivate: [XploreGuard]},
  {path: 'reservas-todas', component: VerTodasReservasComponent, canActivate: [XploreGuard]},
  {path: 'reservas-todas/:initDate/:finDate', component: VerTodasReservasComponent, canActivate: [XploreGuard]},
  {path: 'reservas-maniana', component: ReservasManianaComponent, canActivate: [XploreGuard]},
  {path: 'parametrizar-categorias', component: XploreCategoriesComponent, canActivate: [XploreGuard]},
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
