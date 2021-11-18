import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styles: [
  ]
})
export class OrdersTableComponent implements OnInit {
  
  @Input()dtElement: DataTableDirective
  @Input()dtTrigger: Subject<any> 
  dtOptions: any
  @Input() orders: Order[]
  @Output('removeFromArray') removeFromArray: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
    this.initialize
  }

  initialize() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
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
          previous: 'Ant.'
        },
      },
    }
  }

  removeFromArrayFun(order) {
    this.removeFromArray.emit(order)
  }

}
