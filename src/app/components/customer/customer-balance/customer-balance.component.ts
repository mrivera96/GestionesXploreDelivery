import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {Payment} from "../../../models/payment";
import {PaymentsService} from "../../../services/payments.service";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import {Order} from "../../../models/order";

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
  paid: number
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

  constructor(
    private authService: AuthService,
    private paymentsService: PaymentsService,
    private deliveriesService: DeliveriesService
  ) {
    this.currCustomer = this.authService.currentUserValue
  }

  ngOnInit(): void {
    this.loaders.loadingData = true
    this.initialize()
    this.loadData()
  }

  initialize(){
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
      order:[0,'asc'],
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
    this.paymentsService.getPayments().subscribe(response => {
      this.payments = response.data
      this.payments.forEach(value => {
        if(value.idCliente == this.currCustomer.idCliente){
          this.paid = this.paid + +value.monto
          this.myPayments.push(value)
          this.calcBalance()
        }
      })
      this.dtTrigger.next()

    })

    this.deliveriesService.getAllCustomerOrders().subscribe(response => {
      const allOrdrs: Order[] = response.data
      allOrdrs.forEach(value => {
        if(value.estado.idEstado === 44 || value.estado.idEstado === 46 || value.estado.idEstado === 47){
          this.subtotal = this.subtotal + +value.cTotal
          this.totalCTotal = this.totalCTotal + +value.cTotal
          this.totalSurcharges = this.totalSurcharges + +value.recargo
          this.totalExtraCharges = this.totalExtraCharges + +value.cargosExtra
          this.myFinishedOrders.push(value)
        }
      })
      this.loaders.loadingData = false
      this.dtTrigger1.next()

    })

  }

  setLoading(event) {
    this.loaders.loadingData = event
  }

  calcBalance(){
    this.balance = Number(this.subtotal) - Number(this.paid)
  }

  calcSubtotal(event){
    this.subtotal = event
  }

}
