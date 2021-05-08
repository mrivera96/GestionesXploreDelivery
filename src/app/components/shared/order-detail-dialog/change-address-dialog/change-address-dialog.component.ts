import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {DeliveriesService} from "../../../../services/deliveries.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OperationsService} from "../../../../services/operations.service";
import {environment} from "../../../../../environments/environment";
import {Order} from "../../../../models/order";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BlankSpacesValidator} from "../../../../helpers/blankSpaces.validator";
import {NoUrlValidator} from "../../../../helpers/noUrl.validator";
import {HttpClient} from "@angular/common/http";
import {Delivery} from "../../../../models/delivery";
import {ErrorModalComponent} from "../../error-modal/error-modal.component";
import {SuccessModalComponent} from "../../success-modal/success-modal.component";
import {GoogleMap} from "@angular/google-maps";
import {Surcharge} from "../../../../models/surcharge";

@Component({
  selector: 'app-change-address-dialog',
  templateUrl: './change-address-dialog.component.html',
  styleUrls: ['./change-address-dialog.component.css']
})
export class ChangeAddressDialogComponent implements OnInit {
  @ViewChild('destinationCords') destinationCords: ElementRef
  placesDestination = []
  prohibitedDistance = false
  prohibitedDistanceMsg = ''
  gcordsDestination = false
  searchingDest = false
  directionsRenderer
  directionsService
  befDistance = 0
  befTime = 0
  befCost = 0.00
  currOrder: Order
  addressForm: FormGroup
  currDelivery: Delivery
  @ViewChild('googleMap') googleMap: GoogleMap
  center: google.maps.LatLngLiteral
  surcharges: Surcharge[]

  loaders = {
    'loadingData': false,
    'loadingAdd': false,
    'loadingPay': false,
    'loadingSubmit': false,
    'loadingDistBef': false
  }

  constructor(
    public dialogRef: MatDialogRef<ChangeAddressDialogComponent>,
    private deliveriesService: DeliveriesService,
    public dialog: MatDialog,
    private operationsService: OperationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) {
    this.currOrder = data.currOrder
    this.currDelivery = data.currDelivery
    this.surcharges = this.currDelivery.category.surcharges
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.initialize()
  }

  //INICIALIZACION DE VARIABLES
  initialize() {
    this.directionsRenderer = new google.maps.DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService
    this.addressForm = this.formBuilder.group({
      idDetalle: [this.currOrder.idDetalle],
      idDelivery: [this.currDelivery.idDelivery],
      direccion: ['', Validators.required],
      distancia: ['', Validators.required],
      tiempo: ['', Validators.required],
      recargo: [0, Validators.required],
      cTotal: [0, Validators.required],
      coordsDestino: [null, Validators.required]
    }, {
      validators: [
        BlankSpacesValidator('direccion'),
        NoUrlValidator('direccion'),
      ]
    })
  }

  //COMUNICA CON LA API PARA OBTENER INFORMACION NECESARIA
  loadData() {

  }

  //GETTER PARA EL FORMULARIO
  get addForm() {
    return this.addressForm.controls
  }

  //BUSCAR LUGAR DE ENTREGA
  searchDestination(event) {
    let lugar = event.target.value
    if (lugar.trim().length >= 5) {
      this.searchingDest = true
      const placeSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        lugar: lugar,
        function: 'searchPlace'
      }).subscribe(response => {
        this.placesDestination = response
        this.searchingDest = false
        placeSubscription.unsubscribe()
      })
    }
  }

  //CALCULAR DISTANCIA EN TIEMPO REAL
  calculatedistanceBefore() {
    this.directionsRenderer.setMap(null)
    if (this.addForm.direccion.value != '') {

      const cordsSubscription = this.operationsService.getCoords(this.addForm.direccion.value)
        .subscribe(result => {
          this.addForm.coordsDestino.setValue(result[0].lat + ',' + result[0].lng)
          cordsSubscription.unsubscribe()
        })

      this.befDistance = 0
      this.befTime = 0
      this.befCost = 0
      this.loaders.loadingDistBef = true

      const distanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: this.currDelivery.dirRecogida,
        entrega: this.addForm.direccion.value,
        tarifa: this.currDelivery.tarifaBase
      }).subscribe((response) => {
        this.befDistance = response.distancia
        const calculatedPayment = this.calculateOrderPayment(Number(response.distancia.split(" ")[0]))
        this.befTime = response.tiempo
        this.befCost = calculatedPayment.total
        this.placesDestination = []

        this.directionsRenderer.setMap(this.googleMap._googleMap)
        this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer)
        this.loaders.loadingDistBef = false
        distanceSubscription.unsubscribe()
      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.prohibitedDistanceMsg = error.statusText
            this.prohibitedDistance = true
            this.loaders.loadingDistBef = false
            setTimeout(() => {
              this.prohibitedDistance = false
            }, 2000)
          })
        }
        distanceSubscription.unsubscribe()

      })
    }

  }

  //CALCULA Y MUESTRA LA RUTA EN EL MAPA
  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const dirEntrega = this.addForm.direccion.value
    const geocoder = new google.maps.Geocoder()
    const originLL = this.currDelivery.coordsOrigen.trim()

    geocoder.geocode({'address': dirEntrega}, results => {
      const destLL = results[0].geometry.location
      directionsService.route({
        origin: originLL,  // Haight.
        destination: destLL,  // Ocean Beach.
        travelMode: google.maps.TravelMode['DRIVING']
      }, function (response, status) {
        if (status == 'OK') {
          directionsRenderer.setDirections(response)
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      })
    })
  }

  //CALCULA EL PAGO DEL ENVÍO SEGÚN LA DISTANCIA
  calculateOrderPayment(distance) {
    let orderPayment = {
      'baseRate': this.currDelivery.tarifaBase,
      'surcharges': 0.00,
      'total': 0.00
    }

    const appSurcharge = this.surcharges.find(value => distance >= Number(value.kilomMinimo)
      && distance <= Number(value.kilomMaximo))

    if (appSurcharge?.monto) {
      orderPayment.surcharges = Number(appSurcharge?.monto)
    }

    orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges

    return orderPayment
  }

  //CÁLCULO DE LA DISTANCIA PARA AGREGAR EL ENVÍO
  calculateDistance() {
    const salida = this.currDelivery.dirRecogida
    const entrega = this.addForm.direccion.value
    const tarifa = this.currDelivery.tarifaBase

    if (this.addForm.coordsDestino.value != null) {
      const cDistanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: salida,
        entrega: entrega,
        tarifa: tarifa
      }).subscribe((response) => {
        this.addForm.distancia.setValue(response.distancia)
        this.addForm.tiempo.setValue(response.tiempo)
        const calculatedPayment = this.calculateOrderPayment(Number(response.distancia.split(" ")[0]))
        this.addForm.recargo.setValue(calculatedPayment.surcharges)
        this.addForm.cTotal.setValue(calculatedPayment.total)

        this.addressForm.reset()

        this.befDistance = 0
        this.befTime = 0
        this.befCost = 0

        cDistanceSubscription.unsubscribe()

      }, error => {
        error.subscribe(error => {
          this.prohibitedDistanceMsg = error.statusText
          this.prohibitedDistance = true
          this.loaders.loadingAdd = false
          cDistanceSubscription.unsubscribe()
          setTimeout(() => {
            this.prohibitedDistance = false
          }, 2000)
        })

      })
    }
  }

  //ESTABLECE LA UBICACIÓN ACTUAL PARA EL PUNTO DESTINO
  setCurrentLocationDest(checked) {
    if (!checked) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(function () {
        }, function () {
        }, {})
        navigator.geolocation.getCurrentPosition(pos => {
          const destCords = Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude)
          this.addForm.direccion.setValue(destCords)
          this.calculatedistanceBefore()
        })
      } else {
        alert('Por favor activa la ubicación para esta función')
      }
    } else {
      this.addForm.direccion.setValue('')
    }

  }

  setCordsDestination() {
    this.addForm.direccion.setValue(this.destinationCords.nativeElement.value)
    this.gcordsDestination = false
    this.calculatedistanceBefore()
  }

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    dialog.afterClosed().subscribe(result => {
      this.loaders.loadingSubmit = false
    })

  }

  openSuccessDialog(succsTitle: string, succssMsg: string, id: number) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close()
    })
  }

  onFormSubmit() {

  }
}
