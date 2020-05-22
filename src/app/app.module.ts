import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './components/login/login.component'
import { HomeComponent } from './components/home/home.component'
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import { ReactiveFormsModule} from '@angular/forms'

import { VerSolicitudComponent } from './components/ver-solicitud/ver-solicitud.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { VerTodasReservasComponent } from './components/ver-todas-reservas/ver-todas-reservas.component';
import { DataTablesModule } from 'angular-datatables';
import { ReservasManianaComponent } from './components/reservas-maniana/reservas-maniana.component';
import { DataTableComponent } from './components/data-table/data-table.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VerSolicitudComponent,

    VerTodasReservasComponent,
    ReservasManianaComponent,
    DataTableComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DataTablesModule


  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
