import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './components/shared/login/login.component'
import { HomeComponent } from './components/xplore/home/home.component'
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { VerSolicitudComponent } from './components/xplore/ver-solicitud/ver-solicitud.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { VerTodasReservasComponent } from './components/xplore/ver-todas-reservas/ver-todas-reservas.component';
import { DataTablesModule } from 'angular-datatables';
import { ReservasManianaComponent } from './components/xplore/reservas-maniana/reservas-maniana.component';
import { DataTableComponent } from './components/xplore/data-table/data-table.component';
import { ErrorInterceptor } from "./helpers/error.interceptor";
import { HomeCustomerComponent } from './components/customer/home-customer/home-customer.component';
import { RootComponent } from './components/shared/root/root.component';
import { TodosDeliveriesComponent } from './components/customer/customer-todos-deliveries/todos-deliveries.component';
import { DeliveriesManianaComponent } from './components/customer/customer-deliveries-maniana/deliveries-maniana.component';
import { CustomerDatatableComponent } from './components/customer/customer-datatable/customer-datatable.component';
import { CustomerNewDeliveryComponent } from './components/customer/customer-new-delivery/customer-new-delivery.component';
import { CustomerBranchOfficesComponent } from './components/customer/customer-branch-offices/customer-branch-offices.component';
import { CustomerNewBranchComponent } from './components/customer/customer-new-branch/customer-new-branch.component';
import { CustomerDeliveryDetailComponent } from './components/customer/customer-delivery-detail/customer-delivery-detail.component';
import { XploreCategoriesComponent } from './components/xplore/xplore-categories/xplore-categories.component';
import { XploreRatesComponent } from './components/xplore/xplore-rates/xplore-rates.component';
import { CustomerAllOrdersComponent } from './components/customer/customer-all-orders/customer-all-orders.component';
import { CustomerTodayOrdersComponent } from './components/customer/customer-today-orders/customer-today-orders.component';
import { XploreCustomersComponent } from './components/xplore/xplore-customers/xplore-customers.component';
import { XploreAddCustomerComponent } from './components/xplore/xplore-add-customer/xplore-add-customer.component';
import { PhoneMaskDirective } from './phone-mask.directive';
import { CustomerProfileComponent } from './components/customer/customer-profile/customer-profile.component';
import { ErrorModalComponent } from './components/shared/error-modal/error-modal.component';
import { XploreAllOrdersComponent } from './components/xplore/xplore-all-orders/xplore-all-orders.component';
import { XploreTodayOrdersComponent } from './components/xplore/xplore-today-orders/xplore-today-orders.component';
import { OrdersDataTableComponent } from './components/shared/orders-data-table/orders-data-table.component';
import { XploreUsersComponent } from './components/xplore/xplore-users/xplore-users.component';
import { XploreSurchargesComponent } from './components/xplore/xplore-surcharges/xplore-surcharges.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VerSolicitudComponent,
    VerTodasReservasComponent,
    ReservasManianaComponent,
    DataTableComponent,
    HomeCustomerComponent,
    RootComponent,
    TodosDeliveriesComponent,
    DeliveriesManianaComponent,
    CustomerDatatableComponent,
    CustomerNewDeliveryComponent,
    CustomerBranchOfficesComponent,
    CustomerNewBranchComponent,
    CustomerDeliveryDetailComponent,
    XploreCategoriesComponent,
    XploreRatesComponent,
    CustomerAllOrdersComponent,
    CustomerTodayOrdersComponent,
    XploreCustomersComponent,
    XploreAddCustomerComponent,
    PhoneMaskDirective,
    CustomerProfileComponent,
    ErrorModalComponent,
    XploreAllOrdersComponent,
    XploreTodayOrdersComponent,
    OrdersDataTableComponent,
    XploreUsersComponent,
    XploreSurchargesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DataTablesModule,
    FormsModule


  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
