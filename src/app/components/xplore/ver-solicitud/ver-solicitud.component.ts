import {Component, OnInit} from '@angular/core'
import {DeliveriesService} from "../../../services/deliveries.service"
import {Delivery} from "../../../models/delivery"
import {ActivatedRoute} from "@angular/router"
import {FormControl, FormGroup, Validators} from "@angular/forms"
import {Vehicle} from "../../../models/vehicle"
import {VehiclesService} from "../../../services/vehicles.service"
import {UsersService} from "../../../services/users.service"
import {User} from "../../../models/user"
import {State} from "../../../models/state";
import {Subject} from "rxjs";
import {DeliveryDetail} from "../../../models/delivery-detail";
import {animate, style, transition, trigger} from "@angular/animations";

declare var $: any

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
  asignForm: FormGroup
  changeForm: FormGroup
  vehicles: Vehicle[]
  conductores: User[]
  succsMsg: string
  succsTitle: string
  errorMSg: string
  states: State[]
  dtOptions: any
  dtTrigger: Subject<any> = new Subject()

  constructor(private deliveriesService: DeliveriesService,
              private route: ActivatedRoute,
              private vehiclesService: VehiclesService,
              private usersService: UsersService) {
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
    this.asignForm = new FormGroup({
      idConductor: new FormControl(null, [Validators.required]),
    })

    this.changeForm = new FormGroup({
      idEstado: new FormControl(null, [Validators.required]),
    })

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
      if (this.currentDelivery.idEstado == 33 || this.currentDelivery.idEstado == 36) {
        this.vehiclesService.getVehicles().subscribe(response => {
          if (response.error == 0) {
            this.vehicles = response.data
          }
        })
      }

    }, error => {
      this.loaders.loadingData = false
      this.errorMSg = 'Lo sentimos, ha ocurrido un error al cargar la información. Por favor intente de nuevo.'
      $("#errModal").modal('show')
    })

    this.usersService.getDrivers().subscribe(response => {
      this.conductores = response.data
    })

    this.deliveriesService.getStates().subscribe(response => {

      this.states = response.data
    })

  }

  reloadPage() {
    this.ngOnInit()
  }

  assignDelivery() {
    if (this.asignForm.valid) {
      this.loaders.loadingData = true
      this.deliveriesService.assignDelivery(this.deliveryId, this.asignForm.value).subscribe(response => {

        this.loaders.loadingData = false
        this.succsMsg = response.data
        this.succsTitle = 'Asignación de reserva'
        $("#succsModal").modal('show')

      }, error => {
        this.loaders.loadingData = false
        this.errorMSg = 'Lo sentimos, ha ocurrido un error al asignar esta reserva. Por favor intente de nuevo.'
        $("#errModal").modal('show')
      })
    }
  }

  finishDelivery() {
    this.loaders.loadingData = true
    this.deliveriesService.finishDelivery(this.deliveryId).subscribe(response => {
      this.loaders.loadingData = false
      this.succsMsg = response.data
      this.succsTitle = 'Finalización de reserva'
      $("#succsModal").modal('show')

    }, error => {
      error.subscribe(error => {
        this.loaders.loadingData = false
        this.errorMSg = error.statusText
        $("#errModal").modal('show')
      })
    })

  }

  changeState() {
    if (this.changeForm.valid) {
      if (this.changeForm.get('idEstado').value == 37) {
        $("#asignModal").modal('show')
      } else if (this.changeForm.get('idEstado').value == 39) {
        $("#confirmModal").modal('show')
      } else {
        this.loaders.loadingData = true
        this.deliveriesService.changeState(this.deliveryId, this.changeForm.value).subscribe(response => {

          this.loaders.loadingData = false
          this.succsMsg = response.data
          this.succsTitle = 'Cambio de estado de reserva'
          $("#succsModal").modal('show')

        }, error => {
          error.subscribe(error => {
            this.loaders.loadingData = false
            this.errorMSg = error.statusText
            $("#errModal").modal('show')
          })
        })
      }

    }

  }

}
