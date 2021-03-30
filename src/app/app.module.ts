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
import { PasswordRecoveryComponent } from './components/shared/password-recovery/password-recovery.component';
import { ViewPhotosDialogComponent } from './components/shared/view-photos-dialog/view-photos-dialog.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { OrderDetailDialogComponent } from './components/shared/order-detail-dialog/order-detail-dialog.component';
import {MatMenuModule} from "@angular/material/menu";
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { XploreAddDeliveryComponent } from './components/admin/add-delivery/xplore-add-delivery.component';
import { RegularDeliveryComponent } from './components/admin/add-delivery/regular-delivery/regular-delivery.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatTooltipModule} from "@angular/material/tooltip";
import {GoogleMapsModule} from "@angular/google-maps";
import { ConsolidatedDeliveryComponent } from './components/admin/add-delivery/consolidated-delivery/consolidated-delivery.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import { LockedUserDialogComponent } from './components/shared/locked-user-dialog/locked-user-dialog.component';
import { ConfirmCancelDialogComponent } from './components/customer/delivery-detail/confirm-cancel-dialog/confirm-cancel-dialog.component';
import { ConfirmDeleteComponent } from './components/customer/labels/confirm-delete/confirm-delete.component';

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RootComponent,
        ErrorModalComponent,
        PasswordRecoveryComponent,
        ViewPhotosDialogComponent,
        OrderDetailDialogComponent,
        XploreAddDeliveryComponent,
        RegularDeliveryComponent,
        ConsolidatedDeliveryComponent,
        LockedUserDialogComponent,
        ConfirmCancelDialogComponent,
        ConfirmDeleteComponent,
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
        MatAutocompleteModule,
        MatMenuModule,
        MatRadioModule,
        MatTooltipModule,
        GoogleMapsModule,
        NgxDropzoneModule,
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
