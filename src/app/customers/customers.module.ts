import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import {SharedModule} from "../shared/shared.module";
import {TodosDeliveriesComponent} from '../components/customer/customer-todos-deliveries/todos-deliveries.component';
import {DeliveriesManianaComponent} from '../components/customer/customer-deliveries-maniana/deliveries-maniana.component';
import {CustomerDatatableComponent} from '../components/customer/customer-datatable/customer-datatable.component';
import {CustomerNewDeliveryComponent} from '../components/customer/customer-new-delivery/customer-new-delivery.component';
import {CustomerBranchOfficesComponent} from '../components/customer/customer-branch-offices/customer-branch-offices.component';
import {CustomerNewBranchComponent} from '../components/customer/customer-new-branch/customer-new-branch.component';
import {CustomerDeliveryDetailComponent} from '../components/customer/customer-delivery-detail/customer-delivery-detail.component';
import {CustomerAllOrdersComponent} from '../components/customer/customer-all-orders/customer-all-orders.component';
import {CustomerTodayOrdersComponent} from '../components/customer/customer-today-orders/customer-today-orders.component';
import {CustomerProfileComponent} from '../components/customer/customer-profile/customer-profile.component';
import { ConfirmDialogComponent } from '../components/customer/customer-branch-offices/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../components/customer/customer-branch-offices/edit-dialog/edit-dialog.component';
import { ConfirmDialogComponent as DeliveryConfirm } from '../components/customer/customer-new-delivery/confirm-dialog/confirm-dialog.component';
import {HomeCustomerComponent} from '../components/customer/home-customer/home-customer.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatRadioModule} from "@angular/material/radio";
import {GoogleMapsModule} from "@angular/google-maps";
import {CustomerBalanceComponent} from "../components/customer/customer-balance/customer-balance.component";
import {ChangeHourDialogComponent} from "../components/customer/customer-delivery-detail/change-hour-dialog/change-hour-dialog.component";
import {MatTabsModule} from "@angular/material/tabs";
import {NgxDropzoneModule} from "ngx-dropzone";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";
import { CustomerReportsComponent } from '../components/customer/customer-reports/customer-reports.component';
import { CustomerDashboardComponent } from '../components/customer/customer-dashboard/customer-dashboard.component';
import { CustomerNewConsolidatedDeliveryComponent } from '../components/customer/customer-new-consolidated-delivery/customer-new-consolidated-delivery.component';


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
        MatTooltipModule
    ],
  entryComponents:[
    DeliveryConfirm,
    EditDialogComponent,
  ]
})
export class CustomersModule { }
