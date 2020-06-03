import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Delivery} from "../../../models/delivery";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import { DataTableDirective} from "angular-datatables";
declare var $: any


@Component({
  selector: 'app-customer-datatable',
  templateUrl: './customer-datatable.component.html',
  styleUrls: ['./customer-datatable.component.css']
})
export class CustomerDatatableComponent implements OnInit {

  @Input('deliveries') deliveries: Delivery[]
  @Input('dtTrigger') dtTrigger: Subject<any>
  dtOptions: any

  constructor(
    private router: Router,

  ) {

  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,

      order:[1,'desc'],
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
