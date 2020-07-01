import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {LoginComponent} from './components/shared/login/login.component'
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ErrorInterceptor} from "./helpers/error.interceptor";
import {RootComponent} from './components/shared/root/root.component';
import {ErrorModalComponent} from './components/shared/error-modal/error-modal.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {SuccessModalComponent} from './components/shared/success-modal/success-modal.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {AdminsModule} from "./admins/admins.module";
import {CustomersModule} from "./customers/customers.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SharedModule} from "./shared/shared.module";
import { RateCustomersDialogComponent } from './components/xplore/xplore-rates/rate-customers-dialog/rate-customers-dialog.component';
import { AddCustomerRateDialogComponent } from './components/xplore/xplore-rates/rate-customers-dialog/add-customer-rate-dialog/add-customer-rate-dialog.component';
import { OrdersByCutomerComponent } from './components/xplore/xplore-reports/orders-by-cutomer/orders-by-cutomer.component';
import { ChangeOrderStateDialogComponent } from './components/shared/orders-data-table/change-order-state-dialog/change-order-state-dialog.component';
import { XploreScheduleComponent } from './components/xplore/xplore-schedule/xplore-schedule.component';
import { EditScheduleDialogComponent } from './components/xplore/xplore-schedule/edit-schedule-dialog/edit-schedule-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RootComponent,
        ErrorModalComponent,
        RateCustomersDialogComponent,
        AddCustomerRateDialogComponent,
        OrdersByCutomerComponent,
        ChangeOrderStateDialogComponent,
        XploreScheduleComponent,
        EditScheduleDialogComponent,
    ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AdminsModule,
    CustomersModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
  ],

    entryComponents: [
        ErrorModalComponent,
        SuccessModalComponent,
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
        },

    ],

    bootstrap: [AppComponent]
})
export class AppModule {
}
