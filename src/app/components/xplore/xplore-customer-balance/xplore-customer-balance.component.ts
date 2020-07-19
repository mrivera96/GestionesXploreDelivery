import {Component, OnInit} from '@angular/core';
import {User} from "../../../models/user";
import {Payment} from "../../../models/payment";
import {Subject} from "rxjs";
import {Order} from "../../../models/order";
import {PaymentsService} from "../../../services/payments.service";
import {DeliveriesService} from "../../../services/deliveries.service";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../../../services/users.service";
import {Customer} from "../../../models/customer";

@Component({
  selector: 'app-xplore-customer-balance',
  templateUrl: './xplore-customer-balance.component.html',
  styleUrls: ['./xplore-customer-balance.component.css']
})
export class XploreCustomerBalanceComponent implements OnInit {
  loaders = {
    'loadingData': false
  }
  subtotal: number = 0.00
  paid: number
  balance: number = 0.00
  currCustomer: Customer = {}
  payments: Payment []
  myPayments: Payment []
  dtTrigger: Subject<any> = new Subject<any>()
  dtTrigger1: Subject<any> = new Subject<any>()
  dtOptions: DataTables.Settings
  myFinishedOrders: Order[]
  totalSurcharges: number = 0.00
  totalCTotal: number = 0.00
  customerId: number

  constructor(
    private paymentsService: PaymentsService,
    private deliveriesService: DeliveriesService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.customerId = Number(params.get("id"));
    })
  }

  ngOnInit(): void {

    this.initialize()
    this.loadData()
  }

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

  loadData() {
    this.loaders.loadingData = true
    this.usersService.getCustomers().subscribe(response => {
      let customers: Customer[] = response.data
      customers.forEach(customer => {
        if (customer.idCliente == this.customerId) {
          this.currCustomer = customer
        }
      })
    })

    this.deliveriesService.getCustomerOrders(this.customerId).subscribe(response => {
      const allOrdrs: Order[] = response.data.todos
      allOrdrs.forEach(value => {
        if (+value.idEstado === 44 || +value.estado.idEstado === 46 || +value.estado.idEstado === 47) {
          this.subtotal = this.subtotal + +value.cTotal
          this.totalCTotal = this.totalCTotal + +value.cTotal
          this.totalSurcharges = this.totalSurcharges + +value.recargo
          this.myFinishedOrders.push(value)
        }
      })
      this.loaders.loadingData = false
      this.dtTrigger1.next()

    })

    this.paymentsService.getPayments().subscribe(response => {
      this.payments = response.data
      this.payments.forEach(value => {
        if (value.idCliente == this.customerId) {
          this.paid = this.paid + +value.monto
          this.myPayments.push(value)
          this.calcBalance()
        }
      })
      this.dtTrigger.next()

    })


  }


  calcBalance() {
    this.balance = Number(this.subtotal) - Number(this.paid)
  }

}
