import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrdersDataTableComponent} from "../components/shared/orders-data-table/orders-data-table.component";
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
import {PhoneMaskDirective} from "../phone-mask.directive";
import {SuccessModalComponent} from "../components/shared/success-modal/success-modal.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";



@NgModule({
  declarations: [
    OrdersDataTableComponent,
    PhoneMaskDirective,
    SuccessModalComponent,

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
        MatMenuModule

    ],
  exports:[
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
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
