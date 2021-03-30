import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {Payment} from "../../../models/payment";
import {Subject} from "rxjs";
import {Order} from "../../../models/order";
import {UsersService} from 'src/app/services/users.service';
import {ErrorModalComponent} from '../../shared/error-modal/error-modal.component';
import {LoadingDialogComponent} from "../../shared/loading-dialog/loading-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-customer-balance',
  templateUrl: './customer-balance.component.html',
  styleUrls: ['./customer-balance.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerBalanceComponent implements OnInit {
  loaders = {
    'loadingData': false
  }
  subtotal: number = 0.00
  paid: number = 0.00
  balance: number = 0.00
  currCustomer: User
  payments: Payment []
  myPayments: Payment []
  dtTrigger: Subject<any> = new Subject<any>()
  dtTrigger1: Subject<any> = new Subject<any>()
  dtOptions: DataTables.Settings
  myFinishedOrders: Order[]
  totalSurcharges: number = 0.00
  totalCTotal: number = 0.00
  totalExtraCharges: number = 0.00
  totalPaid: number = 0.00

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    public dialog: MatDialog
  ) {
    this.currCustomer = this.authService.currentUserValue
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  //INICIALIZACIÓN DE VARIABLES
  initialize() {
    this.myPayments = new Array<Payment>()
    this.myFinishedOrders = new Array<Order>()
    this.paid = 0.00
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      autoWidth: true,
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
          previous: 'Ant.'
        },
      },
    }
  }

  //COMUNICACIÓN CON LA API PARA CARGAR LOS DATOS NECESARIOS
  loadData() {
    this.openLoader()
    const balanceSubscription = this.usersService
      .getCustomerBalance(this.currCustomer.idCliente)
      .subscribe(response => {
        this.myPayments = response.payments
        this.paid = response.paid
        this.balance = response.balance
        this.subtotal = response.subtotal
        this.totalCTotal = response.footCTotal
        this.totalSurcharges = response.footSurcharges
        this.totalExtraCharges = response.footExtraCharges
        this.totalPaid = response.footMonto
        this.myFinishedOrders = response.finishedOrders
        this.dialog.closeAll()
        this.dtTrigger1.next()
        this.dtTrigger.next()
        balanceSubscription.unsubscribe()
      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.openErrorDialog(error.statusText, true)
          })
        }
      })

  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if (reload) {
      dialog.afterClosed().subscribe(result => {
        this.dialog.closeAll()
        this.ngOnInit
      })
    }

  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}
