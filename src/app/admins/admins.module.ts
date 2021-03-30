import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from '../components/admin/today-deliveries/home.component'
import {VerSolicitudComponent} from '../components/admin/delivery-detail/ver-solicitud.component'
import {VerTodasReservasComponent} from '../components/admin/all-deliveries/ver-todas-reservas.component';
import {ReservasManianaComponent} from '../components/admin/tomorrow-deliveries/reservas-maniana.component';
import {DataTableComponent} from '../components/admin/data-table/data-table.component';
import {XploreCategoriesComponent} from '../components/admin/categories/xplore-categories.component';
import {XploreRatesComponent} from '../components/admin/rates/xplore-rates.component';
import {XploreCustomersComponent} from '../components/admin/customers/xplore-customers.component';
import {XploreAddCustomerComponent} from '../components/admin/add-customer/xplore-add-customer.component';
import {XploreAllOrdersComponent} from '../components/admin/all-orders/xplore-all-orders.component';
import {XploreTodayOrdersComponent} from '../components/admin/today-orders/xplore-today-orders.component';
import {XploreUsersComponent} from '../components/admin/users/xplore-users.component';
import {XploreSurchargesComponent} from '../components/admin/surcharges/xplore-surcharges.component';
import {XploreDriversComponent} from '../components/admin/drivers/xplore-drivers.component';
import { ConfirmModalComponent } from '../components/admin/delivery-detail/confirm-modal/confirm-modal.component';
import { AssignDialogComponent } from '../components/admin/delivery-detail/assign-dialog/assign-dialog.component';
import { EditCategoryDialogComponent } from '../components/admin/categories/edit-category-dialog/edit-category-dialog.component';
import { NewCategoryDialogComponent } from '../components/admin/categories/new-category-dialog/new-category-dialog.component';
import { NewRateDialogComponent } from '../components/admin/rates/new-rate-dialog/new-rate-dialog.component';
import { EditRateDialogComponent } from '../components/admin/rates/edit-rate-dialog/edit-rate-dialog.component';
import { EditSurchargeDialogComponent } from '../components/admin/surcharges/edit-surcharge-dialog/edit-surcharge-dialog.component';
import { NewSurchargeDialogComponent } from '../components/admin/surcharges/new-surcharge-dialog/new-surcharge-dialog.component';
import { EditCustomerDialogComponent } from '../components/admin/customers/edit-customer-dialog/edit-customer-dialog.component';
import { PendingDeliveriesComponent } from '../components/admin/pending-deliveries/pending-deliveries.component';
import { EditDriverDialogComponent } from '../components/admin/drivers/edit-driver-dialog/edit-driver-dialog.component';
import { NewDriverDialogComponent } from '../components/admin/drivers/new-driver-dialog/new-driver-dialog.component';
import { OrdersByDriverComponent } from '../components/admin/reports/orders-by-driver/orders-by-driver.component';
import { AdminsRoutingModule } from './admins-routing.module';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {SharedModule} from "../shared/shared.module";
import {ChangeStateDialogComponent} from '../components/admin/delivery-detail/change-state-dialog/change-state-dialog.component';
import {PaymentsComponent} from "../components/admin/payments/payments.component";
import {AddPaymentDialogComponent} from "../components/admin/payments/add-payment-dialog/add-payment-dialog.component";
import { RateCustomersDialogComponent } from '../components/admin/rates/rate-customers-dialog/rate-customers-dialog.component';
import { AddCustomerRateDialogComponent } from '../components/admin/rates/rate-customers-dialog/add-customer-rate-dialog/add-customer-rate-dialog.component';
import { OrdersByCustomerComponent } from '../components/admin/reports/orders-by-customer/orders-by-customer.component';
import { ChangeOrderStateDialogComponent } from '../components/shared/change-order-state-dialog/change-order-state-dialog.component';
import { XploreScheduleComponent } from '../components/admin/schedule/xplore-schedule.component';
import { EditScheduleDialogComponent } from '../components/admin/schedule/edit-schedule-dialog/edit-schedule-dialog.component';
import { XploreCustomerBalanceComponent } from '../components/admin/customer-balance/xplore-customer-balance.component';
import {MatTabsModule} from "@angular/material/tabs";
import { ExtraChargesComponent } from '../components/admin/extra-charges/extra-charges.component';
import { EditExtraChargeDialogComponent } from '../components/admin/extra-charges/edit-extra-charge-dialog/edit-extra-charge-dialog.component';
import { NewExtraChargeDialogComponent } from '../components/admin/extra-charges/new-extra-charge-dialog/new-extra-charge-dialog.component';
import { XploreChangeHourDialogComponent } from '../components/admin/delivery-detail/xplore-change-hour-dialog/xplore-change-hour-dialog.component';
import { ExtraChargeCategoriesComponent } from '../components/admin/extra-charges/extra-charge-categories/extra-charge-categories.component';
import { AddCategoryExtraChargeDailogComponent } from '../components/admin/extra-charges/extra-charge-categories/add-category-extra-charge-dailog/add-category-extra-charge-dailog.component';
import { ExtraChargesOptionsDialogComponent } from '../components/admin/extra-charges/extra-charges-options-dialog/extra-charges-options-dialog.component';
import { AddExtraChargeOptionDialogComponent } from '../components/admin/extra-charges/add-extra-charge-option-dialog/add-extra-charge-option-dialog.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { ConsolidatedRateDetailsComponent } from '../components/admin/rates/consolidated-rate-details/consolidated-rate-details.component';
import {AssignDriverComponent} from "../components/shared/assign-driver/assign-driver.component";
import {AddOrderExtrachargeDialogComponent} from "../components/shared/add-order-extracharge-dialog/add-order-extracharge-dialog.component";
import {MatMenuModule} from "@angular/material/menu";
import {DeliveriesReportComponent} from "../components/admin/reports/deliveries-report/deliveries-report.component";
import {PaymentsReportComponent} from "../components/admin/reports/payments-report/payments-report.component";
import {CustomersReportComponent} from "../components/admin/reports/customers-report/customers-report.component";
import {CustomersBalanceReportComponent} from "../components/admin/reports/customer-balance-report/customers-balance-report.component";
import {CustomersTrackingReportComponent} from "../components/admin/reports/customers-tracking-report/customers-tracking-report.component";
import {CustomerWorkLinesComponent} from "../components/admin/customers/customer-work-lines/customer-work-lines.component";
import { AddWorkLineComponent } from '../components/admin/customers/customer-work-lines/add-work-line/add-work-line.component';
import { SurchargeCustomersDialogComponent } from '../components/admin/surcharges/surcharge-customers-dialog/surcharge-customers-dialog.component';
import { AddCustomerSurchargeDialogComponent } from '../components/admin/surcharges/add-customer-surcharge-dialog/add-customer-surcharge-dialog.component';
import { XploreWorkLinesComponent } from '../components/admin/work-lines/xplore-work-lines.component';
import { EditWorklineDialogComponent } from '../components/admin/work-lines/edit-workline-dialog/edit-workline-dialog.component';
import { NewWorklineDialogComponent } from '../components/admin/work-lines/new-workline-dialog/new-workline-dialog.component';
import {AssignAuxiliarComponent} from "../components/shared/assign-auxiliar/assign-auxiliar.component";
import {ReportRequestsComponent} from "../components/admin/reports/report-requests/report-requests.component";
import {AddRequestsDialogComponent} from "../components/admin/reports/report-requests/add-requests-dialog/add-requests-dialog.component";
import {EditExtraChargeOptionDialogComponent} from "../components/admin/extra-charges/edit-extra-charge-option-dialog/edit-extra-charge-option-dialog.component";
import {CustomerChooseComponent} from "../components/admin/add-delivery/customer-choose/customer-choose.component";
import { DriverCategoriesComponent } from '../components/admin/drivers/driver-categories/driver-categories.component';
import { AddCategoryComponent } from '../components/admin/drivers/add-category/add-category.component';
import { OrdersByDriverConsolidatedComponent } from '../components/admin/reports/orders-by-driver-consolidated/orders-by-driver-consolidated.component';

@NgModule({
  declarations: [
    HomeComponent,
    VerSolicitudComponent,
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
    OrdersByDriverConsolidatedComponent
  ],
  entryComponents:[
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
    ],

})
export class AdminsModule { }
