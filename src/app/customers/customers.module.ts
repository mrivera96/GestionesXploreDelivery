import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from "../shared/shared.module";
import { TodosDeliveriesComponent } from './components/all-deliveries/todos-deliveries.component';
import { DeliveriesManianaComponent } from './components/tomorrow-deliveries/deliveries-maniana.component';
import { CustomerDatatableComponent } from './components/datatable/customer-datatable.component';
import { CustomerNewDeliveryComponent } from './components/new-delivery/customer-new-delivery.component';
import { CustomerBranchOfficesComponent } from './components/branch-offices/customer-branch-offices.component';
import { CustomerNewBranchComponent } from './components/new-branch/customer-new-branch.component';
import { CustomerDeliveryDetailComponent } from './components/delivery-detail/customer-delivery-detail.component';
import { CustomerAllOrdersComponent } from './components/all-orders/customer-all-orders.component';
import { CustomerTodayOrdersComponent } from './components/today-orders/customer-today-orders.component';
import { CustomerProfileComponent } from './components/profile/customer-profile.component';
import { ConfirmDialogComponent } from './components/branch-offices/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from './components/branch-offices/edit-dialog/edit-dialog.component';
import { ConfirmDialogComponent as DeliveryConfirm } from './components/new-delivery/confirm-dialog/confirm-dialog.component';
import { HomeCustomerComponent } from './components/home-customer/home-customer.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRadioModule } from "@angular/material/radio";
import { GoogleMapsModule } from "@angular/google-maps";
import { CustomerBalanceComponent } from "./components/balance/customer-balance.component";
import { ChangeHourDialogComponent } from "./components/delivery-detail/change-hour-dialog/change-hour-dialog.component";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxDropzoneModule } from "ngx-dropzone";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustomerReportsComponent } from './components/reports/customer-reports.component';
import { CustomerDashboardComponent } from './components/dashboard/customer-dashboard.component';
import { CustomerNewConsolidatedDeliveryComponent } from './components/new-consolidated-delivery/customer-new-consolidated-delivery.component';
import { CustomerRestrictionsDialogComponent } from "./components/restrictions-dialog/customer-restrictions-dialog.component";
import { CustomerNewConsolidatedForeignDeliveryComponent } from "./components/new-consolidated-foreign-delivery/customer-new-consolidated-foreign-delivery.component";
import { CustomerNewRoutingShippingComponent } from './components/new-routing-shipping/customer-new-routing-shipping.component';
import { MatMenuModule } from "@angular/material/menu";
import { CustomerLabelsComponent } from './components/labels/customer-labels.component';
import { AddLabelComponent } from './components/labels/add-label/add-label.component';
import { EditLabelComponent } from './components/labels/edit-label/edit-label.component';
import { ViewTermsConditionsComponent } from "./components/view-terms-conditions/view-terms-conditions.component";
import { CustomerAlertComponent } from './components/customer-alert/customer-alert.component';
import { ReadCardsComponent } from './components/cards/read-cards/read-cards.component';
import { CreateCardComponent } from './components/cards/create-card/create-card.component';
import { UpdateCardComponent } from './components/cards/update-card/update-card.component';
import { BalancePaymentComponent } from './components/balance-payment/balance-payment.component';


@NgModule({
  declarations: [
    TodosDeliveriesComponent,
    DeliveriesManianaComponent,
    CustomerDatatableComponent,
    CustomerNewDeliveryComponent,
    CustomerBranchOfficesComponent,
    CustomerNewBranchComponent,
    CustomerDeliveryDetailComponent,
    CustomerAllOrdersComponent,
    CustomerTodayOrdersComponent,
    CustomerProfileComponent,
    ConfirmDialogComponent,
    EditDialogComponent,
    DeliveryConfirm,
    HomeCustomerComponent,
    CustomerBalanceComponent,
    ChangeHourDialogComponent,
    CustomerReportsComponent,
    CustomerDashboardComponent,
    CustomerNewConsolidatedDeliveryComponent,
    CustomerRestrictionsDialogComponent,
    CustomerNewConsolidatedForeignDeliveryComponent,
    CustomerNewRoutingShippingComponent,
    CustomerLabelsComponent,
    AddLabelComponent,
    EditLabelComponent,
    ViewTermsConditionsComponent,
    CustomerAlertComponent,
    ReadCardsComponent,
    CreateCardComponent,
    UpdateCardComponent,
    BalancePaymentComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    MatAutocompleteModule,
    MatRadioModule,
    GoogleMapsModule,
    MatTabsModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatMenuModule,

  ],
  entryComponents: [
    DeliveryConfirm,
    EditDialogComponent,
  ],

})
export class CustomersModule { }
