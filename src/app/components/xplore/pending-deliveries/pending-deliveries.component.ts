import {Component, OnInit, ViewChild} from '@angular/core';
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {Subject} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pending-deliveries',
  templateUrl: './pending-deliveries.component.html',
  styleUrls: ['./pending-deliveries.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class PendingDeliveriesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  loaders = {
    'loadingData': false
  }
  deliveries: Delivery[] = []
  consolidateDeliveries: Delivery[] = []
  dtTrigger: Subject<any> = new Subject<any>()
  dtTrigger1: Subject<any> = new Subject<any>()
  dtOptions: any
  dtOptions1: any
  interval

  constructor(
    private deliveriesService: DeliveriesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
    this.interval = setInterval(() => {
      location.reload()
    }, 60000);

  }

  initialize() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [2, 'desc'],
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

    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [2, 'desc'],
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
    const deliveriesSubscription = this.deliveriesService.getPending().subscribe(response => {
      response.data.forEach(value => {
        if (value.isConsolidada == 0) {
          this.deliveries.push(value)
        } else if (value.isConsolidada == 1) {
          this.consolidateDeliveries.push(value)
        }
      })
      this.dtTrigger.next()
      this.dtTrigger1.next()

      this.loaders.loadingData = false

      deliveriesSubscription.unsubscribe()

    })
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }


}
