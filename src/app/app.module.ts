import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {LoginComponent} from './components/shared/login/login.component'
import {HomeComponent} from './components/xplore/home/home.component'
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {VerSolicitudComponent} from './components/xplore/ver-solicitud/ver-solicitud.component'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {VerTodasReservasComponent} from './components/xplore/ver-todas-reservas/ver-todas-reservas.component';
import {DataTablesModule} from 'angular-datatables';
import {ReservasManianaComponent} from './components/xplore/reservas-maniana/reservas-maniana.component';
import {DataTableComponent} from './components/xplore/data-table/data-table.component';
import {ErrorInterceptor} from "./helpers/error.interceptor";
import {HomeCustomerComponent} from './components/customer/home-customer/home-customer.component';
import {RootComponent} from './components/shared/root/root.component';
import {TodosDeliveriesComponent} from './components/customer/customer-todos-deliveries/todos-deliveries.component';
import {DeliveriesManianaComponent} from './components/customer/customer-deliveries-maniana/deliveries-maniana.component';
import {CustomerDatatableComponent} from './components/customer/customer-datatable/customer-datatable.component';
import {CustomerNewDeliveryComponent} from './components/customer/customer-new-delivery/customer-new-delivery.component';
import {CustomerBranchOfficesComponent} from './components/customer/customer-branch-offices/customer-branch-offices.component';
import {CustomerNewBranchComponent} from './components/customer/customer-new-branch/customer-new-branch.component';
import {CustomerDeliveryDetailComponent} from './components/customer/customer-delivery-detail/customer-delivery-detail.component';
import {XploreCategoriesComponent} from './components/xplore/xplore-categories/xplore-categories.component';
import {XploreRatesComponent} from './components/xplore/xplore-rates/xplore-rates.component';
import {CustomerAllOrdersComponent} from './components/customer/customer-all-orders/customer-all-orders.component';
import {CustomerTodayOrdersComponent} from './components/customer/customer-today-orders/customer-today-orders.component';
import {XploreCustomersComponent} from './components/xplore/xplore-customers/xplore-customers.component';
import {XploreAddCustomerComponent} from './components/xplore/xplore-add-customer/xplore-add-customer.component';
import {PhoneMaskDirective} from './phone-mask.directive';
import {CustomerProfileComponent} from './components/customer/customer-profile/customer-profile.component';
import {ErrorModalComponent} from './components/shared/error-modal/error-modal.component';
import {XploreAllOrdersComponent} from './components/xplore/xplore-all-orders/xplore-all-orders.component';
import {XploreTodayOrdersComponent} from './components/xplore/xplore-today-orders/xplore-today-orders.component';
import {OrdersDataTableComponent} from './components/shared/orders-data-table/orders-data-table.component';
import {XploreUsersComponent} from './components/xplore/xplore-users/xplore-users.component';
import {XploreSurchargesComponent} from './components/xplore/xplore-surcharges/xplore-surcharges.component';
import {XploreDriversComponent} from './components/xplore/xplore-drivers/xplore-drivers.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ChangeStateDialogComponent} from './components/xplore/ver-solicitud/change-state-dialog/change-state-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {SuccessModalComponent} from './components/shared/success-modal/success-modal.component';
import { ConfirmModalComponent } from './components/xplore/ver-solicitud/confirm-modal/confirm-modal.component';
import { AssignDialogComponent } from './components/xplore/ver-solicitud/assign-dialog/assign-dialog.component';
import { ConfirmDialogComponent } from './components/customer/customer-branch-offices/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from './components/customer/customer-branch-offices/edit-dialog/edit-dialog.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatRadioModule} from "@angular/material/radio";
import { ConfirmDialogComponent as DeliveryConfirm } from './components/customer/customer-new-delivery/confirm-dialog/confirm-dialog.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import { EditCategoryDialogComponent } from './components/xplore/xplore-categories/edit-category-dialog/edit-category-dialog.component';
import { NewCategoryDialogComponent } from './components/xplore/xplore-categories/new-category-dialog/new-category-dialog.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { NewRateDialogComponent } from './components/xplore/xplore-rates/new-rate-dialog/new-rate-dialog.component';
import { EditRateDialogComponent } from './components/xplore/xplore-rates/edit-rate-dialog/edit-rate-dialog.component';
import { EditSurchargeDialogComponent } from './components/xplore/xplore-surcharges/edit-surcharge-dialog/edit-surcharge-dialog.component';
import { NewSurchargeDialogComponent } from './components/xplore/xplore-surcharges/new-surcharge-dialog/new-surcharge-dialog.component';
import { EditCustomerDialogComponent } from './components/xplore/xplore-customers/edit-customer-dialog/edit-customer-dialog.component';


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
    XploreDriversComponent,
    ChangeStateDialogComponent,
    SuccessModalComponent,
    ConfirmModalComponent,
    AssignDialogComponent,
    ConfirmDialogComponent,
    EditDialogComponent,
    DeliveryConfirm,
    EditCategoryDialogComponent,
    NewCategoryDialogComponent,
    NewRateDialogComponent,
    EditRateDialogComponent,
    EditSurchargeDialogComponent,
    NewSurchargeDialogComponent,
    EditCustomerDialogComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DataTablesModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatSlideToggleModule,

  ],
  entryComponents: [
    ErrorModalComponent,
    ChangeStateDialogComponent,
    SuccessModalComponent,
    ConfirmModalComponent,
    DeliveryConfirm,
    EditRateDialogComponent,
    EditCategoryDialogComponent,
    EditDialogComponent,
    EditSurchargeDialogComponent,
    NewCategoryDialogComponent,
    NewRateDialogComponent,
    NewSurchargeDialogComponent
  ]
  ,
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
