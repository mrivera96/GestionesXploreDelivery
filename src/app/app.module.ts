import { BrowserModule } from '@angular/platform-browser'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './shared/components/login/login.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ErrorInterceptor } from "./helpers/error.interceptor";
import { RootComponent } from './shared/components/root/root.component';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { SuccessModalComponent } from './shared/components/success-modal/success-modal.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { AdminsModule } from "./admins/admins.module";
import { CustomersModule } from "./customers/customers.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { SharedModule } from "./shared/shared.module";
import { PasswordRecoveryComponent } from './shared/components/password-recovery/password-recovery.component';
import { ViewPhotosDialogComponent } from './shared/components/view-photos-dialog/view-photos-dialog.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { OrderDetailDialogComponent } from './shared/components/order-detail-dialog/order-detail-dialog.component';
import { MatMenuModule } from "@angular/material/menu";
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgxDropzoneModule } from "ngx-dropzone";
import { LockedUserDialogComponent } from './shared/components/locked-user-dialog/locked-user-dialog.component';
import { ConfirmCancelDialogComponent } from './customers/components/delivery-detail/confirm-cancel-dialog/confirm-cancel-dialog.component';
import { ConfirmDeleteComponent } from './customers/components/labels/confirm-delete/confirm-delete.component';
import { ServiceChooseComponent } from './shared/components/service-choose/service-choose.component';
import { NgxFlagPickerModule } from 'ngx-flag-picker'

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
        LockedUserDialogComponent,
        ConfirmCancelDialogComponent,
        ConfirmDeleteComponent,
        ServiceChooseComponent,
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
        NgxDropzoneModule,
        NgxFlagPickerModule
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

    bootstrap: [AppComponent],
})
export class AppModule {
}
