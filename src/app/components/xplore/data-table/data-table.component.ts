import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {Subject} from "rxjs";
import {Delivery} from "../../../models/delivery";
import {Router} from "@angular/router";
import {DataTableDirective} from "angular-datatables";
import {DeliveriesService} from "../../../services/deliveries.service";
import {State} from "../../../models/state";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, AfterViewInit {

  @Input('deliveries') tDeliveries: number
  deliveries: Delivery[]
  dtTrigger: Subject<any> = new Subject<any>()
  @Output('loadingData') stopLoading: EventEmitter<boolean> = new EventEmitter<boolean>()

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective

  dtOptions: any

  states: State[]

  constructor(
    private router: Router,
    private deliveriesService: DeliveriesService,
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()

  }

  loadData() {
    this.deliveriesService.getStates().subscribe(response => {
      this.states = response.data.xploreDelivery
    })

    this.deliveriesService.getDeliveries().subscribe(response => {
      this.stopLoading.emit(false)

      switch (this.tDeliveries) {
        case 1: {
          this.deliveries = response.data.deliveriesDia
          break
        }
        case 2: {
          this.deliveries = response.data.deliveriesManiana
          break
        }
        default: {
          this.deliveries = response.data.todas
        }

      }

      this.dtTrigger.next()
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns().every(function () {
          const that = this;
          $('select', this.footer()).on('change', function () {
            if (that.search() !== this['value']) {
              that
                .search(this['value'])
                .draw();
            }
          })
        })
      })

    })
  }
  ngAfterViewInit(): void {


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
  }


}
