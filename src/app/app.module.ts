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



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RootComponent,
        ErrorModalComponent,
        PasswordRecoveryComponent,
        ViewPhotosDialogComponent,

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
