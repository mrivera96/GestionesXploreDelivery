import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Delivery} from "../../../models/delivery";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";

import { DataTableDirective} from "angular-datatables";
import {DeliveriesService} from "../../../services/deliveries.service";
import {State} from "../../../models/state";
declare var $: any

@Component({
  selector: 'app-customer-datatable',
  templateUrl: './customer-datatable.component.html',
  styleUrls: ['./customer-datatable.component.css']
})
export class CustomerDatatableComponent implements OnInit {

  @Input('deliveries') tDeliveries: number
  deliveries: Delivery[]
  dtTrigger: Subject<any> = new Subject<any>()
  dtOptions: DataTables.Settings
  @Output('loadingData') stopLoading: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output('subtotal') subtotal: EventEmitter<number> = new EventEmitter<number>()

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective

  states: State[]

  constructor(
    private router: Router,
    private deliveriesService: DeliveriesService
  ) {

  }

  ngOnInit(): void {

    this.initialize()

    this.loadData()
  }

  loadData(){
    const stateSubscription = this.deliveriesService.getStates().subscribe(response => {
      this.states = response.data.xploreDelivery
      stateSubscription.unsubscribe()
    })

    let service: Observable<any>
    switch (this.tDeliveries) {
      case 1: {
        service = this.deliveriesService.getTodayCustomerDeliveries()
        break
      }
      case 2: {
        service = this.deliveriesService.getAllCustomerDeliveries()
        break
      }

    }

    const serviceSubscription = service.subscribe(response => {
      this.stopLoading.emit(false)
      this.deliveries = response.data
      this.deliveries.forEach(delivery => {
        delivery.entregas = delivery.detalle.length
      })

      this.dtTrigger.next()
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns().every(function () {
          const that = this;
          $('select', this.footer()).on('change', function () {
            if (that.search() !== this['value']) {
              that
                .search(this['value'])
                .draw()
            }
          })
        })
      })
      serviceSubscription.unsubscribe()
    })


  }

  initialize(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      autoWidth: true,
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
