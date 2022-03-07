import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { ExchangeRate } from 'src/app/models/exchange-rate';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { LoadingDialogComponent } from 'src/app/shared/components/loading-dialog/loading-dialog.component';
import { CreateExchangeRateComponent } from '../create-exchange-rate/create-exchange-rate.component';
import { UpdateExchangeRateComponent } from '../update-exchange-rate/update-exchange-rate.component';

@Component({
  selector: 'app-read-exchange-rates',
  templateUrl: './read-exchange-rates.component.html',
  styles: [],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ReadExchangeRatesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  exRates: ExchangeRate[];
  dtOptions;
  dtTrigger: Subject<any>;
  constructor(
    private exRatesService: ExchangeRatesService,
    private matDialog: MatDialog
  ) {
    this.dtTrigger = new Subject<any>();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
      responsive: true,
      language: {
        emptyTable: 'No hay datos para mostrar en esta tabla',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.',
        },
      },
    };
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.openLoader();
    const exRatesSubs = this.exRatesService.readExRates().subscribe(
      (res) => {
        this.exRates = res.data;
        this.dtTrigger.next();
        exRatesSubs.unsubscribe();
        this.matDialog.closeAll();
      },
      (err) => {}
    );
  }

  openLoader() {
    this.matDialog.open(LoadingDialogComponent);
  }

  showNewForm() {
    const dRef = this.matDialog.open(CreateExchangeRateComponent);
    dRef.afterClosed().subscribe((res)=>{
      if(res == 1){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.exRates = [];
          this.loadData();
        });
        
      }
      
    });
  }

  showEditForm(exR) {
    const dRef = this.matDialog.open(UpdateExchangeRateComponent,{
      data:{
        currExRate: exR
      }
    });

    dRef.afterClosed().subscribe((res)=>{
      if(res == 1){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.exRates = [];
          this.loadData();
        });
        
      }
    });
  }
}
