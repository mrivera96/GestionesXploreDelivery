import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Delivery} from "../../../models/delivery";
import {DeliveryDetail} from "../../../models/delivery-detail";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import {ActivatedRoute} from "@angular/router";
import {ErrorModalComponent} from "../../../shared/components/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ChangeHourDialogComponent} from "./change-hour-dialog/change-hour-dialog.component";
import {DataTableDirective} from "angular-datatables";
import {ViewPhotosDialogComponent} from "../../../shared/components/view-photos-dialog/view-photos-dialog.component";
import { ConfirmCancelDialogComponent } from './confirm-cancel-dialog/confirm-cancel-dialog.component';
import { SuccessModalComponent } from '../../../shared/components/success-modal/success-modal.component';
import {LoadingDialogComponent} from "../../../shared/components/loading-dialog/loading-dialog.component";
@Component({
  selector: 'app-customer-delivery-detail',
  templateUrl: './customer-delivery-detail.component.html',
  styleUrls: ['./customer-delivery-detail.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerDeliveryDetailComponent implements OnInit {
  currentDelivery: Delivery = {}
  currentDeliveryDetail: DeliveryDetail[]
  deliveryId: number
  loaders = {
    'loadingData': false
  }
  dddtOptions: any
  dddtTrigger: Subject<any>
  errorMSg: string
  allowHourChange: boolean = false
  allowCancel: boolean = false
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  hasPhotos: boolean = false

  

  constructor(
    private deliveriesService: DeliveriesService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.initialize()
    this.route.paramMap.subscribe(params => {
      this.deliveryId = Number(params.get("id"));
    })

    this.loadData()

  }

  //INICIALIZACIÓN DE VARIABLES
  initialize() {
    this.allowHourChange = false
    this.dddtOptions =  {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      order:[],
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
    this.dddtTrigger = new Subject()
  }

  //COMUNICACIÓN CON LA API PARA OBTENER LOS DATOS NECESARIOS
  loadData() {
    this.openLoader()
    const deliveriesSubscription = this.deliveriesService.getById(this.deliveryId).subscribe(response => {
      this.currentDelivery = response.data
      this.currentDeliveryDetail = response.data.detalle
      
      this.dddtTrigger.next()

      let photos = 0
      this.currentDeliveryDetail.forEach(detail => {
        if(detail.photography.length > 0){
          photos ++
        }
      })

      if(photos > 0){
        this.hasPhotos = true
      }
      const registered_date = ((new Date(response.data.fechaNoFormatted).getTime()) / 1000) /60
      const new_date = ((new Date().getTime() / 1000) / 60)
      const diff = registered_date - new_date
      const diffReverse = new_date - registered_date
      if(diff >= 30){
        this.allowHourChange = true
      }
      if(diffReverse >= 30){
        this.allowCancel = true
      }
      this.dialog.closeAll()

      deliveriesSubscription.unsubscribe()

    }, error => {
      this.dialog.closeAll()
      this.errorMSg = 'Lo sentimos, ha ocurrido un error al cargar la información. Por favor intente de nuevo.'
      this.openErrorDialog(this.errorMSg, true)
      deliveriesSubscription.unsubscribe()
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
        this.reloadData()
      })
    }

  }

  openSuccessDialog(succsTitle: string, succssMsg: string) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData()
    })
  }

  openChangeHourDialog(){
    const dialogRef = this.dialog.open(ChangeHourDialogComponent,{
      data:{
        delivery: this.currentDelivery
      }
    })

    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.reloadData()
      }
    })

  }

  openCancelDialog(){
    const dialogRef = this.dialog.open(ConfirmCancelDialogComponent)

    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.openLoader()
        const cancelSubs = this.deliveriesService.cancelDelivery(this.currentDelivery.idDelivery)
        .subscribe(response => {
          this.dialog.closeAll()
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          cancelSubs.unsubscribe()
        }, error => {
          error.subscribe(error => {
            this.dialog.closeAll()
            this.openErrorDialog(error.statusText, true)
          })
        }
        )
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

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}
