import {Component, OnInit} from '@angular/core'
import {DeliveriesService} from "../../../services/deliveries.service"
import {Delivery} from "../../../models/delivery"
import {ActivatedRoute} from "@angular/router"
import {State} from "../../../models/state";
import {Subject} from "rxjs";
import {DeliveryDetail} from "../../../models/delivery-detail";
import {animate, style, transition, trigger} from "@angular/animations";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ChangeStateDialogComponent} from "./change-state-dialog/change-state-dialog.component";
import {XploreChangeHourDialogComponent} from './xplore-change-hour-dialog/xplore-change-hour-dialog.component'
import {ViewPhotosDialogComponent} from "../../shared/view-photos-dialog/view-photos-dialog.component";
import {OrderDetailDialogComponent} from "../../shared/order-detail-dialog/order-detail-dialog.component";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {LoadingDialogComponent} from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-ver-solicitud',
  templateUrl: './ver-solicitud.component.html',
  styleUrls: ['./ver-solicitud.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class VerSolicitudComponent implements OnInit {
  currentDelivery: Delivery
  currentDeliveryDetail: DeliveryDetail[]
  deliveryId: number
  loaders = {
    'loadingData': false
  }
  allowHourChange: boolean = false
  succsMsg: string
  states: State[]
  dtOptions: any
  dtTrigger: Subject<any> = new Subject()
  currUser: User = {}

  constructor(private deliveriesService: DeliveriesService,
              private route: ActivatedRoute,
              private authService: AuthService,
              public dialog: MatDialog) {
    this.loaders.loadingData = true
    this.currUser = this.authService.currentUserValue
  }

  ngOnInit(): void {
    this.initialize()
    this.route.paramMap.subscribe(params => {
      this.deliveryId = Number(params.get("id"));
    })
    this.loadData()
  }

  initialize() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
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

    this.dtTrigger = new Subject<any>()

  }

  loadData() {
    this.openLoader()
    const deliveriesSubscription = this.deliveriesService.getById(this.deliveryId).subscribe(response => {
      this.currentDelivery = response.data
      this.currentDeliveryDetail = response.data.detalle
      this.dtTrigger.next()
      this.dialog.closeAll()

      const state = response.data.idEstado

      if (state !== 39) {
        this.allowHourChange = true
      }
      deliveriesSubscription.unsubscribe()

    }, error => {
      this.dialog.closeAll()
      this.openErrorDialog("Lo sentimos, ha ocurrido un error al cargar los datos de esta reservación. Al dar clic en Aceptar, volveremos a intentarlo", true)
      deliveriesSubscription.unsubscribe()
    })

    const statesSubscription = this.deliveriesService.getStates().subscribe(response => {
      this.states = response.data.xploreDelivery
      statesSubscription.unsubscribe()
    })

  }

  reloadPage() {
    this.ngOnInit()
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if (reload) {
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true
        this.reloadPage()
      })
    }
  }

  openChangeStateDialog() {
    this.dialog.open(ChangeStateDialogComponent, {
      data: {
        idDelivery: this.deliveryId,
        idEstado: this.currentDelivery.idEstado
      }
    })
  }

  openChangeHourDialog() {
    const dialogRef = this.dialog.open(XploreChangeHourDialogComponent, {
      data: {
        delivery: this.currentDelivery
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit()
      }
    })

  }

  openPhotosDialog(photos) {

    const dialogRef = this.dialog.open(ViewPhotosDialogComponent, {
      data: {
        photos: photos
      }
    })

  }

  showDetailDialog(order) {
    const dialogRef = this.dialog.open(OrderDetailDialogComponent,
      {
        data: {
          currentOrder: order,
          currentDelivery: this.currentDelivery,
          currentUser: this.currUser
        }
      }
    )

    /*dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datatableElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.ngOnInit()
          })
      }
    })*/
  }

  //COMUNICACIÓN CON LA API RUTEADOR PARA EL REORDENADO DEL ARRAY DE ENVÍOS
  /*optimizeRoutes() {
    let orderArray = '['
    const originAddress = {
      address: this.currentDelivery.dirRecogida,
      lat: this.currentDelivery.coordsOrigen.split(',')[0],
      lng: this.currentDelivery.coordsOrigen.split(',')[1]
    }

    orderArray = orderArray + JSON.stringify(originAddress) + ','
    this.currentDelivery.detalle.forEach(order => {
      const orderObject = {
        address: order.direccion,
        lat: order.coordsDestino.split(',')[0],
        lng: order.coordsDestino.split(',')[1]
      }
      orderArray = orderArray + JSON.stringify(orderObject) + ','
    })
    orderArray = orderArray + JSON.stringify(originAddress) + ']'

    const optSubscription = this.deliveriesService.optimizeRoute(orderArray.replace(' ', ''))
      .subscribe(response => {
        const optimizedRouteOrder: any[] = response.route
        let totalDistance = 0
        this.orders.forEach(order => {
          for (let i in optimizedRouteOrder) {
            if (order.direccion == optimizedRouteOrder[i].name) {
              // @ts-ignore
              order.distancia = (optimizedRouteOrder[i].distance - optimizedRouteOrder[i - 1].distance).toPrecision(2) + ' km'
              order.tiempo = optimizedRouteOrder[i].arrival + ' mins'
              order.order = +i
              totalDistance = totalDistance + +order.distancia.split(" ")[0]
            }
          }
        })
        this.deliveryForm.get('deliveryHeader.distancia').setValue(totalDistance)

        this.orders.sort((a, b) => (a.order > b.order) ? 1 : -1);
        this.loaders.loadingOptimizing = false
        optSubscription.unsubscribe()
      }, error => {
        this.loaders.loadingOptimizing = false
        this.openErrorDialog('Ha ocurrido un error al optimizar la ruta', false)
      })
  }*/

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}