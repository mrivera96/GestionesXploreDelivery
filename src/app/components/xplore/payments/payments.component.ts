import {Component, OnInit, ViewChild} from '@angular/core';
import {PaymentsService} from "../../../services/payments.service";
import {Payment} from "../../../models/payment";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {AddPaymentDialogComponent} from "./add-payment-dialog/add-payment-dialog.component";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class PaymentsComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective
  dtOptions
  loaders = {
    'loadingData': false
  }
  dtTrigger: Subject<any>
  payments: Payment[]
  constructor(
    private paymentsService: PaymentsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }
  initialize(){
    this.dtTrigger = new Subject<any>()

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'desc'],
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
          previous: 'Ant.'
        },
      },
    }

  }

  loadData(){
    this.loaders.loadingData = true
    this.paymentsService.getPayments().subscribe(response => {
      this.payments = response.data
      this.loaders.loadingData = false
      this.dtTrigger.next()
    })
  }

  showNewForm(){
    const dialogRef = this.dialog.open(AddPaymentDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })

  }

  showEditForm(id){

  }

}
