import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrdersDataTableComponent} from "./components/orders-data-table/orders-data-table.component";
import {DataTablesModule} from "angular-datatables";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {PhoneMaskDirective} from "../directives/phone-mask.directive";
import {SuccessModalComponent} from "./components/success-modal/success-modal.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {LoadingDialogComponent} from "./components/loading-dialog/loading-dialog.component";
import { FormTitleComponent } from './components/delivery-form/form-title/form-title.component';
import { CategorySelectionComponent } from './components/delivery-form/category-selection/category-selection.component';
import { CategoryDescriptionComponent } from './components/delivery-form/category-description/category-description.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { NotasGeneralesComponent } from './components/delivery-form/notas-generales/notas-generales.component';
import { OffScheduleComponent } from './components/delivery-form/off-schedule/off-schedule.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ExpDateDirective } from '../directives/exp-date.directive';
import { ConsolidatedCategorySelectComponent } from './components/delivery-form/consolidated-category-select/consolidated-category-select.component';
import { OrdersTableComponent } from './components/delivery-form/orders-table/orders-table.component';
import { ReportViewerModule } from 'ngx-ssrs-reportviewer';
import { DeliveryDetailComponent } from './components/delivery-detail/delivery-detail.component';
import { DeliveryInvoiceComponent } from './components/delivery-invoice/delivery-invoice.component';
import { ConfirmRemoveComponent } from './components/delivery-detail/confirm-remove/confirm-remove.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { VerificationDialogComponent } from './components/verification-dialog/verification-dialog.component';
import { XploreShuttleComponent } from './components/xplore-shuttle/xplore-shuttle.component';
import {MatStepperModule} from '@angular/material/stepper';

import { InternationalPhoneMaskDirective } from '../directives/international-phone-mask.directive';
import { NgxFlagPickerModule } from 'ngx-flag-picker';
import { ShuttleDetailsComponent } from './components/shuttle-details/shuttle-details.component';
import { NgxCcModule } from 'ngx-cc';
import { ChangeDateDialogComponent } from './components/order-detail-dialog/change-date-dialog/change-date-dialog.component';
@NgModule({
  declarations: [
    OrdersDataTableComponent,
    PhoneMaskDirective,
    SuccessModalComponent,
    LoadingDialogComponent,
    FormTitleComponent,
    CategorySelectionComponent,
    CategoryDescriptionComponent,
    NotasGeneralesComponent,
    OffScheduleComponent,
    ExpDateDirective,
    ConsolidatedCategorySelectComponent,
    OrdersTableComponent,
    DeliveryDetailComponent,
    DeliveryInvoiceComponent,
    ConfirmRemoveComponent,
    SignUpComponent,
    ConfirmationDialogComponent,
    VerificationDialogComponent,
    XploreShuttleComponent,
    InternationalPhoneMaskDirective,
    ShuttleDetailsComponent,
    ChangeDateDialogComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatMenuModule,
    MatTabsModule,
    MatRadioModule,
    GoogleMapsModule,
    ReportViewerModule,
    MatStepperModule,
    NgxFlagPickerModule,
    NgxCcModule
  ],
  exports: [
    OrdersDataTableComponent,
    DataTablesModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    PhoneMaskDirective,
    MatProgressSpinnerModule,
    LoadingDialogComponent,
    FormTitleComponent,
    CategorySelectionComponent,
    CategoryDescriptionComponent,
    NotasGeneralesComponent,
    OffScheduleComponent,
    ExpDateDirective,
    ConsolidatedCategorySelectComponent,
    OrdersTableComponent,
    InternationalPhoneMaskDirective

  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}
