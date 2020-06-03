import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../../models/order";
import {Subject} from "rxjs";

@Component({
  selector: 'app-orders-data-table',
  templateUrl: './orders-data-table.component.html',
  styleUrls: ['./orders-data-table.component.css']
})
export class OrdersDataTableComponent implements OnInit {
  @Input('orders') orders: Order[]
  @Input('dtTrigger') dtTrigger: Subject<any>
  dtOptions: any
  constructor() { }

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
  }

}
