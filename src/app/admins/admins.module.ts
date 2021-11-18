import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './components/today-deliveries/home.component'
import {VerTodasReservasComponent} from './components/all-deliveries/ver-todas-reservas.component';
import {ReservasManianaComponent} from './components/tomorrow-deliveries/reservas-maniana.component';
import {DataTableComponent} from './components/data-table/data-table.component';
import {XploreCategoriesComponent} from './components/categories/xplore-categories.component';
import {XploreRatesComponent} from './components/rates/xplore-rates.component';
import {XploreCustomersComponent} from './components/customers/xplore-customers.component';
import {XploreAddCustomerComponent} from './components/customers/add-customer/xplore-add-customer.component';
import {XploreAllOrdersComponent} from './components/all-orders/xplore-all-orders.component';
import {XploreTodayOrdersComponent} from './components/today-orders/xplore-today-orders.component';
import {XploreUsersComponent} from './components/users/xplore-users.component';
import {XploreSurchargesComponent} from './components/surcharges/xplore-surcharges.component';
import {XploreDriversComponent} from './components/drivers/xplore-drivers.component';
import {ConfirmModalComponent} from './components/delivery-detail/confirm-modal/confirm-modal.component';
import {AssignDialogComponent} from './components/delivery-detail/assign-dialog/assign-dialog.component';
import {EditCategoryDialogComponent} from './components/categories/edit-category-dialog/edit-category-dialog.component';
import {NewCategoryDialogComponent} from './components/categories/new-category-dialog/new-category-dialog.component';
import {NewRateDialogComponent} from './components/rates/new-rate-dialog/new-rate-dialog.component';
import {EditRateDialogComponent} from './components/rates/edit-rate-dialog/edit-rate-dialog.component';
import {EditSurchargeDialogComponent} from './components/surcharges/edit-surcharge-dialog/edit-surcharge-dialog.component';
import {NewSurchargeDialogComponent} from './components/surcharges/new-surcharge-dialog/new-surcharge-dialog.component';
import {EditCustomerDialogComponent} from './components/customers/edit-customer-dialog/edit-customer-dialog.component';
import {PendingDeliveriesComponent} from './components/pending-deliveries/pending-deliveries.component';
import {EditDriverDialogComponent} from './components/drivers/edit-driver-dialog/edit-driver-dialog.component';
import {NewDriverDialogComponent} from './components/drivers/new-driver-dialog/new-driver-dialog.component';
import {OrdersByDriverComponent} from './components/reports/orders-by-driver/orders-by-driver.component';
import {AdminsRoutingModule} from './admins-routing.module';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {SharedModule} from "../shared/shared.module";
import {ChangeStateDialogComponent} from './components/delivery-detail/change-state-dialog/change-state-dialog.component';
import {PaymentsComponent} from "./components/payments/payments.component";
import {AddPaymentDialogComponent} from "./components/payments/add-payment-dialog/add-payment-dialog.component";
import {RateCustomersDialogComponent} from './components/rates/rate-customers-dialog/rate-customers-dialog.component';
import {AddCustomerRateDialogComponent} from './components/rates/rate-customers-dialog/add-customer-rate-dialog/add-customer-rate-dialog.component';
import {OrdersByCustomerComponent} from './components/reports/orders-by-customer/orders-by-customer.component';
import {ChangeOrderStateDialogComponent} from '../shared/components/change-order-state-dialog/change-order-state-dialog.component';
import {XploreScheduleComponent} from './components/schedule/xplore-schedule.component';
import {EditScheduleDialogComponent} from './components/schedule/edit-schedule-dialog/edit-schedule-dialog.component';
import {XploreCustomerBalanceComponent} from './components/customers/customer-balance/xplore-customer-balance.component';
import {MatTabsModule} from "@angular/material/tabs";
import {ExtraChargesComponent} from './components/extra-charges/extra-charges.component';
import {EditExtraChargeDialogComponent} from './components/extra-charges/edit-extra-charge-dialog/edit-extra-charge-dialog.component';
import {NewExtraChargeDialogComponent} from './components/extra-charges/new-extra-charge-dialog/new-extra-charge-dialog.component';
import {XploreChangeHourDialogComponent} from './components/delivery-detail/xplore-change-hour-dialog/xplore-change-hour-dialog.component';
import {ExtraChargeCategoriesComponent} from './components/extra-charges/extra-charge-categories/extra-charge-categories.component';
import {AddCategoryExtraChargeDailogComponent} from './components/extra-charges/extra-charge-categories/add-category-extra-charge-dailog/add-category-extra-charge-dailog.component';
import {ExtraChargesOptionsDialogComponent} from './components/extra-charges/extra-charges-options-dialog/extra-charges-options-dialog.component';
import {AddExtraChargeOptionDialogComponent} from './components/extra-charges/add-extra-charge-option-dialog/add-extra-charge-option-dialog.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ConsolidatedRateDetailsComponent} from './components/rates/consolidated-rate-details/consolidated-rate-details.component';
import {AssignDriverComponent} from "../shared/components/assign-driver/assign-driver.component";
import {AddOrderExtrachargeDialogComponent} from "../shared/components/add-order-extracharge-dialog/add-order-extracharge-dialog.component";
import {MatMenuModule} from "@angular/material/menu";
import {DeliveriesReportComponent} from "./components/reports/deliveries-report/deliveries-report.component";
import {PaymentsReportComponent} from "./components/reports/payments-report/payments-report.component";
import {CustomersReportComponent} from "./components/reports/customers-report/customers-report.component";
import {CustomersBalanceReportComponent} from "./components/reports/customer-balance-report/customers-balance-report.component";
import {CustomersTrackingReportComponent} from "./components/reports/customers-tracking-report/customers-tracking-report.component";
import {CustomerWorkLinesComponent} from "./components/customers/customer-work-lines/customer-work-lines.component";
import {AddWorkLineComponent} from './components/customers/customer-work-lines/add-work-line/add-work-line.component';
import {SurchargeCustomersDialogComponent} from './components/surcharges/surcharge-customers-dialog/surcharge-customers-dialog.component';
import {AddCustomerSurchargeDialogComponent} from './components/surcharges/add-customer-surcharge-dialog/add-customer-surcharge-dialog.component';
import {XploreWorkLinesComponent} from './components/work-lines/xplore-work-lines.component';
import {EditWorklineDialogComponent} from './components/work-lines/edit-workline-dialog/edit-workline-dialog.component';
import {NewWorklineDialogComponent} from './components/work-lines/new-workline-dialog/new-workline-dialog.component';
import {AssignAuxiliarComponent} from "../shared/components/assign-auxiliar/assign-auxiliar.component";
import {ReportRequestsComponent} from "./components/reports/report-requests/report-requests.component";
import {AddRequestsDialogComponent} from "./components/reports/report-requests/add-requests-dialog/add-requests-dialog.component";
import {EditExtraChargeOptionDialogComponent} from "./components/extra-charges/edit-extra-charge-option-dialog/edit-extra-charge-option-dialog.component";
import {CustomerChooseComponent} from "./components/add-delivery/customer-choose/customer-choose.component";
import {DriverCategoriesComponent} from './components/drivers/driver-categories/driver-categories.component';
import {AddCategoryComponent} from './components/drivers/add-category/add-category.component';
import {OrdersByDriverConsolidatedComponent} from './components/reports/orders-by-driver-consolidated/orders-by-driver-consolidated.component';
import {RestrictionsComponent} from './components/restrictions/restrictions.component';
import {ChangeAddressDialogComponent} from "../shared/components/order-detail-dialog/change-address-dialog/change-address-dialog.component";
import {RoutingShippingComponent} from "./components/add-delivery/routing-shipping/routing-shipping.component";
import {ConsolidatedDeliveryComponent} from "./components/add-delivery/consolidated-delivery/consolidated-delivery.component";
import {XploreAddDeliveryComponent} from "./components/add-delivery/xplore-add-delivery.component";
import {RegularDeliveryComponent} from "./components/add-delivery/regular-delivery/regular-delivery.component";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatRadioModule} from "@angular/material/radio";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxDropzoneModule} from "ngx-dropzone";
import {BillingReportComponent} from "./components/reports/billing-report/billing-report/billing-report.component";
import {TermsConditionsComponent} from "./components/terms-conditions/terms-conditions.component";
import {EditRestrictionDialogComponent} from "./components/restrictions/edit-restriction-dialog/edit-restriction-dialog.component";
import {CreateRestrictionDialogComponent} from "./components/restrictions/create-restriction-dialog/create-restriction-dialog.component";
import {EditTermsDialogComponent} from "./components/terms-conditions/edit-terms-dialog/edit-terms-dialog.component";
import {CreateTermsDialogComponent} from "./components/terms-conditions/create-terms-dialog/create-terms-dialog.component";
import { DriverOrdersComponent } from './components/drivers/driver-orders/driver-orders.component';
import { AddOrderToDeliveryComponent } from './components/add-order-to-delivery/add-order-to-delivery.component';
import { QueryUsersComponent } from './components/query-users/query-users.component';
import { AddQueryUserComponent } from './components/query-users/add-query-user/add-query-user.component';
import { UpdateQueryUserComponent } from './components/query-users/update-query-user/update-query-user.component';

@NgModule({
  declarations: [
    HomeComponent,
    VerTodasReservasComponent,
    ReservasManianaComponent,
    DataTableComponent,
    XploreCategoriesComponent,
    XploreRatesComponent,
    XploreCustomersComponent,
    XploreAddCustomerComponent,
    XploreAllOrdersComponent,
    XploreTodayOrdersComponent,
    XploreUsersComponent,
    XploreSurchargesComponent,
    XploreDriversComponent,
    ConfirmModalComponent,
    AssignDialogComponent,
    EditCategoryDialogComponent,
    NewCategoryDialogComponent,
    NewRateDialogComponent,
    EditRateDialogComponent,
    EditSurchargeDialogComponent,
    NewSurchargeDialogComponent,
    EditCustomerDialogComponent,
    PendingDeliveriesComponent,
    EditDriverDialogComponent,
    NewDriverDialogComponent,
    OrdersByDriverComponent,
    ChangeStateDialogComponent,
    PaymentsComponent,
    AddPaymentDialogComponent,
    RateCustomersDialogComponent,
    AddCustomerRateDialogComponent,
    OrdersByCustomerComponent,
    ChangeOrderStateDialogComponent,
    XploreScheduleComponent,
    EditScheduleDialogComponent,
    XploreCustomerBalanceComponent,
    ExtraChargesComponent,
    EditExtraChargeDialogComponent,
    NewExtraChargeDialogComponent,
    XploreChangeHourDialogComponent,
    ExtraChargeCategoriesComponent,
    AddCategoryExtraChargeDailogComponent,
    ExtraChargesOptionsDialogComponent,
    AddExtraChargeOptionDialogComponent,
    ConsolidatedRateDetailsComponent,
    AssignDriverComponent,
    AddOrderExtrachargeDialogComponent,
    DeliveriesReportComponent,
    PaymentsReportComponent,
    CustomersReportComponent,
    CustomersBalanceReportComponent,
    CustomersTrackingReportComponent,
    CustomerWorkLinesComponent,
    AddWorkLineComponent,
    SurchargeCustomersDialogComponent,
    AddCustomerSurchargeDialogComponent,
    XploreWorkLinesComponent,
    EditWorklineDialogComponent,
    NewWorklineDialogComponent,
    AssignAuxiliarComponent,
    ReportRequestsComponent,
    AddRequestsDialogComponent,
    EditExtraChargeOptionDialogComponent,
    CustomerChooseComponent,
    DriverCategoriesComponent,
    AddCategoryComponent,
    OrdersByDriverConsolidatedComponent,
    RestrictionsComponent,
    ChangeAddressDialogComponent,
    RoutingShippingComponent,
    ConsolidatedDeliveryComponent,
    XploreAddDeliveryComponent,
    RegularDeliveryComponent,
    BillingReportComponent,
    TermsConditionsComponent,
    EditRestrictionDialogComponent,
    CreateRestrictionDialogComponent,
    EditTermsDialogComponent,
    CreateTermsDialogComponent,
    DriverOrdersComponent,
    AddOrderToDeliveryComponent,
    QueryUsersComponent,
    AddQueryUserComponent,
    UpdateQueryUserComponent
  ],
  entryComponents: [
    ConfirmModalComponent,
    EditRateDialogComponent,
    EditCategoryDialogComponent,
    EditSurchargeDialogComponent,
    NewCategoryDialogComponent,
    NewRateDialogComponent,
    NewSurchargeDialogComponent,
    ChangeStateDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminsRoutingModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatMenuModule,
    GoogleMapsModule,
    MatRadioModule,
    MatTooltipModule,
    NgxDropzoneModule,
  ],

})
export class AdminsModule {
}
