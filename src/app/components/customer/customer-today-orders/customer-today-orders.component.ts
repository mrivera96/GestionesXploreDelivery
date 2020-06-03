import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import { Order } from "../../../models/order";
declare var $: any
@Component({
  selector: 'app-customer-today-orders',
  templateUrl: './customer-today-orders.component.html',
  styleUrls: ['./customer-today-orders.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerTodayOrdersComponent implements OnInit {
  loaders = {
    'loadingData': false
  }
  dtTrigger: Subject<any> = new Subject()
  dtOptions

  orders: Order[]
  msgError = ''


  constructor(
    private deliveriesService: DeliveriesService,
  ) { }

  ngOnInit(): void {
    this.dtOptions =  {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
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
    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true
    this.deliveriesService.getCustomerOrders().subscribe(response => {
      this.orders = response.data.pedidosDia
      this.dtTrigger.next()
      this.loaders.loadingData = false
    }, error => {
      this.loaders.loadingData = false
      this.msgError = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
      $("#errModal").modal('show')
    })

  }

}
