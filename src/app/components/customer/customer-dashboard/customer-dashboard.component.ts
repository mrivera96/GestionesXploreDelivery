import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { Order } from 'src/app/models/order';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ErrorModalComponent } from '../../shared/error-modal/error-modal.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))

      ])
    ])
  ]
})
export class CustomerDashboardComponent implements OnInit {
  
  loaders = {
    'loadingData': false
  }
  finishedOrders: number = 0
  actualBalance: number = 0.00
  pendingOrdersCount: number = 0
  pendingOrders: Order[] = []
  assignedOrdersCount: number = 0
  assignedOrders: Order[] = []
  dtOptions: DataTables.Settings
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective
  dialog: any;
  constructor(
    private deliveriesService: DeliveriesService
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize(){
    this.dtOptions =  {
      pagingType: 'full_numbers',
      pageLength: 10,
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
  }

  loadData(){
    this.loaders.loadingData = true
    const dashboardDataSubscription = this.deliveriesService.getCustomerDashboardData().subscribe(response => {
      this.finishedOrders = response.finishedOrdersCount
      this.actualBalance = response.actualBalance
      this.pendingOrdersCount = response.pendingOrdersCount
      this.pendingOrders = response.pendingOrders
      this.assignedOrdersCount = response.assignedOrdersCount
      this.assignedOrders = response.assignedOrders
      this.pendingOrders.forEach(order => {
        order.delivery.fechaReserva = formatDate(new Date(order.delivery.fechaReserva), 'yyyy-MM-dd HH:mm', 'en')
      })

      this. loaders.loadingData = false
      dashboardDataSubscription.unsubscribe()
    },error => {
      if(error.subscribe()){
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

    if(reload){
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true
        this.ngOnInit
      })
    }

  }

}
