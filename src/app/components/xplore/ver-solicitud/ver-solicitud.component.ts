import {Component, OnInit} from '@angular/core'
import {DeliveriesService} from "../../../services/deliveries.service"
import {Delivery} from "../../../models/delivery"
import {ActivatedRoute} from "@angular/router"
import {UsersService} from "../../../services/users.service"
import {State} from "../../../models/state";
import {Subject} from "rxjs";
import {DeliveryDetail} from "../../../models/delivery-detail";
import {animate, style, transition, trigger} from "@angular/animations";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ChangeStateDialogComponent} from "./change-state-dialog/change-state-dialog.component";
import { XploreChangeHourDialogComponent } from './xplore-change-hour-dialog/xplore-change-hour-dialog.component'
import {ViewPhotosDialogComponent} from "../../shared/view-photos-dialog/view-photos-dialog.component";
import {Photography} from "../../../models/photography";

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

  constructor(private deliveriesService: DeliveriesService,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
    this.loaders.loadingData = true
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
    this.deliveriesService.getById(this.deliveryId).subscribe(response => {
      this.currentDelivery = response.data
      this.currentDeliveryDetail = response.data.detalle
      this.dtTrigger.next()
      this.loaders.loadingData = false
    
      const state = response.data.idEstado

      if(state !== 39){
        this.allowHourChange = true
      }

    }, error => {
      this.loaders.loadingData = false
      this.openErrorDialog("Lo sentimos, ha ocurrido un error al cargar los datos de esta reservación. Al dar clic en Aceptar, volveremos a intentarlo", true)
    })

    this.deliveriesService.getStates().subscribe(response => {
      this.states = response.data.xploreDelivery
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

    if(reload){
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true
        this.reloadPage()
      })
    }
  }

  openChangeStateDialog(){
    this.dialog.open(ChangeStateDialogComponent, {
      data: {
        idDelivery: this.deliveryId,
        idEstado: this.currentDelivery.idEstado
      }
    })
  }

  openChangeHourDialog(){
    const dialogRef = this.dialog.open(XploreChangeHourDialogComponent,{
      data:{
        delivery: this.currentDelivery
      }
    })

    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.ngOnInit()
      }
    })

  }

  openPhotosDialog(photos){
    
    const dialogRef = this.dialog.open(ViewPhotosDialogComponent,{
      data:{
        photos: photos
      }
    })

  }

}
