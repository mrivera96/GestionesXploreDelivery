import {Component, OnInit, ViewChild} from '@angular/core';
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {Subject, TimeInterval} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";

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
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective
  loaders = {
    'loadingData': false
  }
  deliveries: Delivery []
  dtTrigger: Subject<any> = new Subject<any>()
  dtOptions: any
  interval
  constructor(
    private deliveriesService: DeliveriesService,

  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
    this.interval = setInterval(() => {
      this.dtElement.dtInstance.then(
        (dtInstance: DataTables.Api) => {
          dtInstance.destroy()
          this.loadData()
        })
    }, 60000);

  }

  initialize(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order:[2,'desc'],
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
    this.deliveriesService.getPending().subscribe(response => {
      this.deliveries = response.data
      this.loaders.loadingData = false
      this.dtTrigger.next()
    })
  }

}
