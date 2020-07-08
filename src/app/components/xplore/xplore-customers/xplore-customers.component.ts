import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Customer} from "../../../models/customer";
import {UsersService} from "../../../services/users.service";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {XploreAddCustomerComponent} from "../xplore-add-customer/xplore-add-customer.component";
import {EditCustomerDialogComponent} from "./edit-customer-dialog/edit-customer-dialog.component";
import {DataTableDirective} from "angular-datatables";
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {Order} from "../../../models/order";
import {PaymentsService} from "../../../services/payments.service";
import {Payment} from "../../../models/payment";

@Component({
  selector: 'app-xplore-customers',
  templateUrl: './xplore-customers.component.html',
  styleUrls: ['./xplore-customers.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreCustomersComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective
  customers: Customer[]
  dtTrigger: Subject<any> = new Subject()
  loaders = {
    loadingData: false
  }
  dtOptions
  deliveries: Order[] = []
  payments: Payment[] = []

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private deliveriesService: DeliveriesService,
    private paymentsService: PaymentsService
  ) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      serverSide: false,
      processing: true,
      info: true,
      order: [0, 'asc'],
      autoWidth: true,
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
    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true
    this.paymentsService.getPayments().subscribe(response => {
      this.payments = response.data
    })
    this.deliveriesService.getOrders().subscribe(response => {
      this.deliveries = response.data.todos

      this.usersService.getCustomers().subscribe(response => {
        this.customers = response.data

        this.customers.forEach(customer => {
          customer.subtotal = 0.00
          customer.paid = 0.00
          customer.balance = 0.00
          this.deliveries.forEach(delivery => {
            if (customer.idCliente == delivery.delivery.idCliente && delivery.idEstado == 44) {
              customer.subtotal = customer.subtotal + +delivery.cTotal
            }
          })

          this.payments.forEach( payment => {
            if (customer.idCliente === Number(payment.idCliente)) {
              customer.paid = customer.paid + +payment.monto
            }
          })

          customer.balance = customer.subtotal - customer.paid
        })
        this.loaders.loadingData = false
        this.dtTrigger.next()
      })
    })



  }

  showNewCustForm() {
    const dialogRef = this.dialog.open(XploreAddCustomerComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })
  }

  showEditForm(id) {
    let currCustomer: Customer = {}
    this.customers.forEach(value => {
      if (value.idCliente === id) {
        currCustomer = value
      }
    })
    const dialogRef = this.dialog.open(EditCustomerDialogComponent, {
      data: {
        customer: currCustomer
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })

  }

}
