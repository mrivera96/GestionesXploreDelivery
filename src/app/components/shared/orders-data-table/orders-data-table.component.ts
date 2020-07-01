import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Order} from "../../../models/order";
import {Subject} from "rxjs";
import {State} from "../../../models/state";
import {DeliveriesService} from "../../../services/deliveries.service";
import {DataTableDirective} from "angular-datatables";
import {MatDialog} from "@angular/material/dialog";
import {ErrorModalComponent} from "../error-modal/error-modal.component";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {ChangeOrderStateDialogComponent} from "./change-order-state-dialog/change-order-state-dialog.component";

declare var $: any
@Component({
  selector: 'app-orders-data-table',
  templateUrl: './orders-data-table.component.html',
  styleUrls: ['./orders-data-table.component.css']
})
export class OrdersDataTableComponent implements OnInit{
  @Input('orders') tOrders: string
  @Output('loadingData') stopLoading: EventEmitter<boolean> = new EventEmitter<boolean>()
  orders: Order[]
  dtTrigger: Subject<any> = new Subject<any>()
  dtOptions: DataTables.Settings
  msgError = ''
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective

  currUser: User
  states: State[]
  constructor(
    private deliveriesService: DeliveriesService,
    public dialog: MatDialog,
    public authService: AuthService
  ) {

  }

  ngOnInit(): void {

    this.initialize()
    this.currUser = this.authService.currentUserValue
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
    this.deliveriesService.getStates().subscribe(response => {
      this.states = response.data.xploreDeliveryEntregas
    })

    let service;
    switch (this.tOrders) {
      case 'customer-todos': {
        service = this.deliveriesService.getCustomerOrders()
        break;
      }

      case 'customer-hoy': {
        service = this.deliveriesService.getCustomerOrders()
        break;
      }


      case 'xplore-todos': {
        service = this.deliveriesService.getOrders()
        break;
      }

      case 'xplore-hoy': {
        service = this.deliveriesService.getOrders()
        break;
      }

    }

    service.subscribe(response => {
      this.stopLoading.emit(false)
      switch (this.tOrders) {
        case 'customer-todos': {
          this.orders = response.data.todos
          break
        }
        case 'customer-hoy': {
          this.orders = response.data.pedidosDia
          break
        }
        case 'xplore-todos': {
          this.orders = response.data.todos
          break
        }
        case 'xplore-hoy': {
          this.orders = response.data.pedidosDia
          break
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
          });
        });
      });

    }, error => {
      this.stopLoading.emit(false)
      this.msgError = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
     this.openErrorDialog(this.msgError, true)
    })
  }

  reloadData(){
    this.ngOnInit()
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if(reload){
      dialog.afterClosed().subscribe(result => {
        this.stopLoading.emit(true)
        this.reloadData()
      })
    }

  }

  showChangeStateDialog(currOrder) {

    const dialogRef = this.dialog.open(ChangeOrderStateDialogComponent,
      {
        data: {
          order: currOrder
        }
      }
    )

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.datatableElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.ngOnInit()
          })
      }
    })

  }

}
