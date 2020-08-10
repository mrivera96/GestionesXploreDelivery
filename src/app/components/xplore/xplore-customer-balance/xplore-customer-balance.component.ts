import {Component, OnInit} from '@angular/core';
import {Payment} from "../../../models/payment";
import {Subject} from "rxjs";
import {Order} from "../../../models/order";
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
  paid: number = 0.00
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
  subtotalShow: string
  paidShow: string
  balanceShow: string
  totalSurchargesShow: string
  totalExtraCharges: number = 0.00

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.customerId = Number(params.get("id"));
      this.currCustomer.nomEmpresa = params.get("nombre");
    })
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()

  }

  initialize() {
    this.myPayments = new Array<Payment>()
    this.myFinishedOrders = new Array<Order>()
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
    const balanceSubscription = this.usersService.getCustomerBalance(this.customerId).subscribe(response => {
      this.myPayments = response.payments
      this.paid = response.paid
      this.subtotal = response.subtotal
      this.balance = response.balance
      this.totalCTotal = response.footCTotal
      this.totalSurcharges = response.footSurcharges
      //this.totalExtraCharges = response.footExtraCharges 
      this.myFinishedOrders = response.finishedOrders
      this.dtTrigger.next()
      this.dtTrigger1.next()
     
      this.loaders.loadingData = false
      balanceSubscription.unsubscribe
    })

  }

}
