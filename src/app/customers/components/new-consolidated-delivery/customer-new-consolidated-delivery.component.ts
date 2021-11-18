import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { GoogleMap } from "@angular/google-maps"
import { Customer } from "../../../models/customer"
import { Category } from "../../../models/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Order } from "../../../models/order"
import { Rate } from "../../../models/rate"
import { Surcharge } from "../../../models/surcharge"
import { Subject } from "rxjs"
import { DataTableDirective } from "angular-datatables"
import { ExtraCharge } from "../../../models/extra-charge"
import { ExtraChargeOption } from "../../../models/extra-charge-option"
import { CategoriesService } from "../../../services/categories.service"
import { DeliveriesService } from "../../../services/deliveries.service"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { MatDialog } from "@angular/material/dialog"
import { AuthService } from "../../../services/auth.service"
import { BlankSpacesValidator } from "../../../helpers/blankSpaces.validator"
import { NoUrlValidator } from "../../../helpers/noUrl.validator"
import { environment } from "../../../../environments/environment"
import { ErrorModalComponent } from "../../../shared/components/error-modal/error-modal.component"
import { SuccessModalComponent } from "../../../shared/components/success-modal/success-modal.component"
import { ConfirmDialogComponent } from "../new-delivery/confirm-dialog/confirm-dialog.component"
import { animate, style, transition, trigger } from "@angular/animations"
import { BranchService } from "../../../services/branch.service"
import { Branch } from "../../../models/branch"
import { CustomerRestrictionsDialogComponent } from "../restrictions-dialog/customer-restrictions-dialog.component"
import { LockedUserDialogComponent } from '../../../shared/components/locked-user-dialog/locked-user-dialog.component'
import { UsersService } from 'src/app/services/users.service'
import { LabelsService } from 'src/app/services/labels.service'
import { Label } from 'src/app/models/label'
import { LoadingDialogComponent } from "../../../shared/components/loading-dialog/loading-dialog.component"
import { OperationsService } from 'src/app/services/operations.service'
import { DateValidate } from 'src/app/helpers/date.validator'
import { ConsolidatedHourValidate } from 'src/app/helpers/consolidatedHour.validator'

@Component({
  selector: 'app-customer-new-consolidated-delivery',
  templateUrl: './customer-new-consolidated-delivery.component.html',
  styleUrls: ['./customer-new-consolidated-delivery.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CustomerNewConsolidatedDeliveryComponent implements OnInit {
  dtOptions: any
  @ViewChild('googleMap') googleMap: GoogleMap
  center: google.maps.LatLngLiteral
  loaders = {
    'loadingData': false,
    'loadingAdd': false,
    'loadingPay': false,
    'loadingSubmit': false,
    'loadingDistBef': false
  }
  befDistance = 0
  befTime = 0
  befCost = 0.00
  currCustomer: Customer
  directionsRenderer
  directionsService
  categories: Category[] = []
  deliveryForm: FormGroup
  orders: Order[] = []
  agregado = false
  exitMsg = ''
  nDeliveryResponse
  rates: Rate[] = []
  surcharges: Surcharge[]
  pago = {
    'baseRate': 0.00,
    'cargosExtra': 0.00,
    'recargos': 0.00,
    'total': 0.00,
  }
  dtTrigger: Subject<any> = new Subject()
  errorMsg = ''
  prohibitedDistance = false
  prohibitedDistanceMsg = ''
  paymentMethod: number = 1
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective
  selectedCategory: Category = {}
  selectedExtraCharge: ExtraCharge = null
  selectedExtraChargeOption: ExtraChargeOption = {}
  pagos = []
  placesDestination = []
  gcordsDestination = false
  @ViewChild('destinationCords')
  destinationCords: ElementRef
  gcordsOrigin = false
  placesOrigin = []
  @ViewChild('originCords')
  originCords: ElementRef
  myBranchOffices: Branch[] = []
  locationOption
  myCurrentLocation
  selectedRate: Rate = {}
  selectedCategoryRates: Rate[] = []
  prohibitedAddress: boolean = false
  prohibitedAddressCentinel: boolean = false
  prohibitedAddressMsg: string = ''
  datesToShow: Array<any> = []
  hoursToShow: Array<any> = []
  files: File[] = []
  fileContentArray: String[] = []
  demandMSG: string = ''
  myLabels: Label[] = []
  defaultBranch
  geocoder: google.maps.Geocoder
  acceptTerms = false

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private branchService: BranchService,
    private userService: UsersService,
    private labelsService: LabelsService,
    private operationsService: OperationsService
  ) {
    this.currCustomer = this.authService.currentUserValue
  }

  ngOnInit(): void {
    this.initialize()
    this.checkCustomer()
  }

  //INICIALIZACIÓN DE VARIABLES
  initialize() {
    this.geocoder = new google.maps.Geocoder();
    this.directionsRenderer = new google.maps.DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService
    this.paymentMethod = 1
    this.locationOption = 1

    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group({
        dirRecogida: [{ value: '', disabled: false }, [Validators.required]],
        idCategoria: [{
          value: 1,
          disabled: false,
        }, Validators.required],
        instrucciones: ['', Validators.maxLength(150)],
        coordsOrigen: [''],
        fecha: [{ value: '', disabled: false }, [Validators.required, DateValidate]],
        hora: [{ value: '', disabled: false }, Validators.required],
        idTarifa: [null],
        idEtiqueta: [null],
        prioridad: [false]
      }, {
        validators: [
          BlankSpacesValidator('dirRecogida'),
          NoUrlValidator('dirRecogida'),
          ConsolidatedHourValidate('fecha','hora')
        ]
      }),

      order: this.formBuilder.group({
        nFactura: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^((?!\s{2,}).)*$/)]],
        nomDestinatario: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^((?!\s{2,}).)*$/)]],
        numCel: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        direccion: ['', Validators.required],
        instrucciones: ['', Validators.maxLength(150)],
        idCargoExtra: [null],
        idOpcionExtra: [null],
      }, {
        validators: [
          BlankSpacesValidator('nFactura'),
          BlankSpacesValidator('nomDestinatario'),
          BlankSpacesValidator('direccion'),
          NoUrlValidator('direccion'),
          
        ]
      })
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
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

  //COMUNICACIÓN CON LA API PARA OBTENER LOS DATOS NECESARIOS
  loadData() {
    const categoriesSubscription = this.categoriesService
      .getCustomerCategories(null, 2).subscribe(response => {
        this.categories = response.consolidatedCategories
        this.demandMSG = response.demand
        this.categories.forEach(category => {
          category.categoryExtraCharges.sort((a, b) => (a.extra_charge.nombre > b.extra_charge.nombre) ? 1 : -1)
        })
        categoriesSubscription.unsubscribe()
        this.dialog.closeAll()
        this.setSelectedCategory(this.categories[0])
        this.setCurrentLocationOrigin()
      }, error => {
        this.dialog.closeAll()
        this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
        this.openErrorDialog(this.errorMsg, true)
        categoriesSubscription.unsubscribe()
      })

    const branchSubscription = this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data

      let defOffice = this.myBranchOffices.find(item => item.isDefault == true);

      if (defOffice != null) {
        this.locationOption = 3;
        this.defaultBranch = defOffice.idSucursal;
        this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(defOffice.direccion);
        this.getOriginCoords();
        this.checkInsructions();
      } else {
        this.setCurrentLocationOrigin();
      }
      branchSubscription.unsubscribe()
    })

    const lblSubscription = this.labelsService
      .getMyLabels()
      .subscribe(response => {
        this.myLabels = response.data
        lblSubscription.unsubscribe()
      })

  }

  //VERIFICA SI EL CLIENTE TIENE INSTRUCCIONES REGISTRADAS
  checkInsructions() {
    const bOffice = this.myBranchOffices.find(
      (item) =>
        item.direccion ==
        this.deliveryForm.get('deliveryHeader.dirRecogida').value
    );
    this.operationsService.checkCustomerInstructions(
      bOffice,
      this.deliveryForm.get('deliveryHeader.instrucciones')
    );
  }

  clearLocationField() {
    this.newForm.get('deliveryHeader.dirRecogida').setValue('')
  }

  //ESTABLECE LA UBICACIÓN ACTUAL COMO PUNTO DE RECOGIDA
  setCurrentLocationOrigin() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.myCurrentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        this.deliveryForm.get('deliveryHeader.dirRecogida')
          .setValue(this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng)
        this.deliveryForm.get('deliveryHeader.coordsOrigen')
          .setValue(this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng)
      }, function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permiso de Ubicación Denegado. Por tanto, no podremos obtener tu ubicación actual.')
            break
          case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break
          case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            break
        }

      })
    } else {
      alert('El GPS está desactivado')
    }
  }

  get newForm() {
    return this.deliveryForm
  }

  onOrderAdd() {
    if (this.deliveryForm.get('order').valid) {
      this.openLoader()

      let currOrder = {
        nFactura: this.newForm.get('order.nFactura').value,
        nomDestinatario: this.newForm.get('order.nomDestinatario').value,
        numCel: this.newForm.get('order.numCel').value,
        direccion: this.newForm.get('order.direccion').value,
        instrucciones: this.newForm.get('order.instrucciones').value,
        coordsDestino: '',
        distancia: '',
        tiempo: '',
        tarifaBase: 0,
        recargo: 0,
        cTotal: 0,
        cargosExtra: 0,
        idCargoExtra: null,
        idDetalleOpcion: null,
      }
      //
      this.calculateRate()

      this.calculateDistance(currOrder)

      this.befDistance = 0
      this.befTime = 0
      this.befCost = 0.00
    }
  }

  //COMUNICACIÓN CON LA API PARA REGISTRAR EL DELIVERY
  onFormSubmit() {
    this.newForm.get('deliveryHeader.idCategoria').enable()
    this.newForm.get('deliveryHeader.dirRecogida').enable()
    this.newForm.get('deliveryHeader.fecha').enable()
    this.newForm.get('deliveryHeader.hora').enable()

    if (this.deliveryForm.get('deliveryHeader').valid) {
      this.deliveryForm.get('deliveryHeader.idTarifa').setValue(this.selectedRate)

      this.openLoader()
      const deliveriesSubscription = this.deliveriesService
        .newCustomerDelivery(this.deliveryForm.get('deliveryHeader').value, this.orders, this.pago)
        .subscribe(response => {
          this.dialog.closeAll()
          this.exitMsg = response.message
          this.nDeliveryResponse = response.nDelivery
          this.openSuccessDialog('Operación Realizada Correctamente', this.exitMsg = response.message, this.nDeliveryResponse)
          deliveriesSubscription.unsubscribe()
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.dialog.closeAll()
              this.errorMsg = error.statusText
              this.openErrorDialog(this.errorMsg, false)
              deliveriesSubscription.unsubscribe()
            })
          } else {
            this.dialog.closeAll()
            this.errorMsg = 'Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.'
            this.openErrorDialog(this.errorMsg, false)
            deliveriesSubscription.unsubscribe()
          }

        })
    } else if (this.deliveryForm.invalid) {
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'))
      invalidFields[0].focus()
    }

  }

  //CALCULA EL RADIO DE LA DIRECCIÓN DE RECOGIDA
  calculateRatio() {
    if (this.newForm.get('deliveryHeader.dirRecogida').value != '') {
      this.prohibitedAddress = false
      this.prohibitedAddressCentinel = false
      //
      this.calculateRate()

      if (this.deliveryForm.get('deliveryHeader.dirRecogida').value != this.selectedRate.consolidated_detail.dirRecogida) {
        const distanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: this.selectedRate.consolidated_detail.dirRecogida,
          entrega: this.deliveryForm.get('deliveryHeader.dirRecogida').value,
          tarifa: this.pago.baseRate
        }).subscribe((response) => {
          if (Number(response.distancia.split(" ")[0]) > this.selectedRate.consolidated_detail.radioMaximo) {
            this.prohibitedAddressMsg = "El lugar de recogida seleccionado se encuentra fuera de nuestro radio de servicio. "
            this.prohibitedAddress = true
            this.prohibitedAddressCentinel = true
            distanceSubscription.unsubscribe()
          }

          distanceSubscription.unsubscribe()
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.prohibitedAddressMsg = error.statusText
              this.prohibitedAddress = true
              this.prohibitedAddressCentinel = true
            })
          }
          distanceSubscription.unsubscribe()

        })
      }


    }
  }

  //CALCULA LA DISTANCIA PARA LA PREVISUALIZACIÓN
  calculatedistanceBefore() {
    this.directionsRenderer.setMap(null)
    if (this.newForm.get('deliveryHeader.dirRecogida').value != '' && this.newForm.get('order.direccion').value != '') {
      this.loaders.loadingDistBef = true

      this.calculateRate()

      const distanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: this.selectedRate.consolidated_detail.dirRecogida,
        entrega: this.newForm.get('order.direccion').value,
        tarifa: this.pago.baseRate
      }).subscribe((response) => {
        this.loaders.loadingDistBef = false
        this.befDistance = response.distancia
        const calculatedPayment = this.calculateOrderPayment(Number(response.distancia.split(" ")[0]))
        this.befTime = response.tiempo
        this.befCost = calculatedPayment.total
        this.placesOrigin = []
        this.placesDestination = []

        this.directionsRenderer.setMap(this.googleMap._googleMap)
        this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer)
        distanceSubscription.unsubscribe()
      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.prohibitedDistanceMsg = error.statusText
            this.prohibitedDistance = true
            this.loaders.loadingDistBef = false
            setTimeout(() => {
              this.prohibitedDistance = false
            }, 6000)
          })
        }
        distanceSubscription.unsubscribe()

      })
    }

  }

  //CALCULA Y TRAZA LA RUTA EN EL MAPA
  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const dirEntrega = this.newForm.get('order.direccion').value
    const geocoder = new google.maps.Geocoder()
    const originLL = this.deliveryForm.get('deliveryHeader.coordsOrigen').value

    geocoder.geocode({ 'address': dirEntrega }, results => {
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

  //EVENTO ONINPUT DEL CAMPO DE DIRECCIÓN DE DESTINO
  searchDestination(event) {
    let lugar = event.target.value
    if (lugar.trim().length >= 5) {
      const placeSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        lugar: lugar,
        function: 'searchPlace'
      }).subscribe(response => {
        this.placesDestination = response
        placeSubscription.unsubscribe()
      })
    }
  }

  //OBTIENE LAS COORDENADAS DEL PUNTO DE ORIGEN PARA SER UTILIZADAS DURANTE TODO EL PROCESO
  getOriginCoords() {
    if (this.deliveryForm.get('deliveryHeader.dirRecogida').value.startsWith('15.') || this.deliveryForm.get('deliveryHeader.dirRecogida').value.startsWith('14.') || this.deliveryForm.get('deliveryHeader.dirRecogida').value.startsWith('13.')) {
      this.deliveryForm.get('deliveryHeader.coordsOrigen')
        .setValue(this.deliveryForm.get('deliveryHeader.dirRecogida').value)
      this.center = {
        lat: +this.deliveryForm.get('deliveryHeader.coordsOrigen').value.split(',')[0],
        lng: +this.deliveryForm.get('deliveryHeader.coordsOrigen').value.split(',')[1],
      }
    } else {

      this.geocoder.geocode({ 'address': this.deliveryForm.get('deliveryHeader.dirRecogida').value }, results => {
        const ll = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        }
        this.deliveryForm.get('deliveryHeader.coordsOrigen').setValue(ll.lat + ',' + ll.lng)
        this.center = {
          lat: ll.lat,
          lng: ll.lng,
        }
      })
    }

  }

  //SELECCIONA LA TARIFA SEGÚN EL NÚMERO DE ENVÍOS AGREGADOS AL MOMENTO
  calculateRate() {
    this.pago.baseRate = this.selectedRate.precio
  }

  //CALCULA EL PAGO DEL ENVÍO SEGÚN LA DISTANCIA
  calculateOrderPayment(distance) {

    let orderPayment = {
      'baseRate': this.pago.baseRate,
      'surcharges': 0.00,
      'cargosExtra': 0.00,
      'total': 0.00,
      'idRecargo': null
    }
    if (distance > this.selectedRate.consolidated_detail.radioMaximo) {
      const appSurcharge = this.surcharges.find(value => distance >= Number(value.kilomMinimo)
        && distance <= Number(value.kilomMaximo))

      if (appSurcharge?.monto) {
        orderPayment.surcharges = Number(appSurcharge?.monto)
        orderPayment.idRecargo = appSurcharge.idRecargo
      }
    }

    if (this.selectedExtraCharge != null) {
      if (this.selectedExtraCharge.options) {
        orderPayment.cargosExtra = this.selectedExtraChargeOption.costo
        orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges + +this.selectedExtraChargeOption.costo
      } else {
        orderPayment.cargosExtra = this.selectedExtraCharge.costo
        orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges + +this.selectedExtraCharge.costo
      }

    } else {
      orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges
    }

    return orderPayment
  }

  //CÁLCULO DE LA DISTANCIA PARA AGREGAR EL ENVÍO
  calculateDistance(currOrder, reloadTable?) {
    const salida = this.selectedRate.consolidated_detail.dirRecogida
    const entrega = currOrder.direccion
    const tarifa = this.pago.baseRate

    this.geocoder.geocode({ 'address': entrega }, results => {
      const ll = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      }
      currOrder.coordsDestino = ll.lat + ',' + ll.lng
    })

    if (currOrder.coordsDestino != null) {
      const cDistanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: salida,
        entrega: entrega,
        tarifa: tarifa
      }).subscribe((response) => {
        currOrder.distancia = response.distancia
        currOrder.tiempo = response.tiempo
        const calculatedPayment = this.calculateOrderPayment(Number(response.distancia.split(" ")[0]))
        currOrder.tarifaBase = calculatedPayment.baseRate
        currOrder.recargo = calculatedPayment.surcharges
        currOrder.cargosExtra = calculatedPayment.cargosExtra
        currOrder.cTotal = calculatedPayment.total
        currOrder.idRecargo = calculatedPayment.idRecargo

        this.deliveryForm.get('order').reset()
        this.orders.push(currOrder)
        this.pagos.push(calculatedPayment)
        this.newForm.get('deliveryHeader.idCategoria').disable()
        this.newForm.get('deliveryHeader.dirRecogida').disable()
        this.newForm.get('deliveryHeader.fecha').disable()
        this.newForm.get('deliveryHeader.hora').disable()


        if (this.orders.length > 1) {
          this.dtElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy()
              this.dtTrigger.next()
            })
        } else {
          if (this.dtElement.dtInstance) {
            this.dtElement.dtInstance.then(
              (dtInstance: DataTables.Api) => {
                dtInstance.destroy()
                this.dtTrigger.next()
              })
          } else {
            this.dtTrigger.next()
          }

        }

        this.agregado = true
        setTimeout(() => {
          this.agregado = false
        }, 2000)

        this.orders.forEach(value => {
          if (value.tarifaBase != this.pago.baseRate) {
            const nPay = this.calculateOrderPayment(Number(value.distancia.split(" ")[0]))
            let i = this.orders.indexOf(value)
            value.tarifaBase = this.pago.baseRate
            value.cargosExtra = nPay.cargosExtra
            value.recargo = nPay.surcharges
            value.cTotal = nPay.total
            this.pagos[i].baseRate = nPay.baseRate
            if (this.pagos[i]?.cargosExtra) {
              this.pagos[i].cargosExtra = nPay.cargosExtra
            }
            this.pagos[i].surcharges = nPay.surcharges
            this.pagos[i].total = nPay.total
          }
        })
        cDistanceSubscription.unsubscribe()
        this.calculatePayment()

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

  //CALCULA EL PAGO TOTAL
  calculatePayment() {
    this.pago.recargos = this.pagos.reduce(function (a, b) {
      return +a + +b['surcharges']
    }, 0)

    this.pago.cargosExtra = this.pagos.reduce(function (a, b) {
      return +a + +b['cargosExtra']
    }, 0)

    this.pago.total = this.pagos.reduce(function (a, b) {
      return +a + +b['total']
    }, 0)

    this.dialog.closeAll()

  }

  //ELIMINA UN ENVÍO
  removeFromArray(item) {
    let i = this.orders.indexOf(item)
    this.orders.splice(i, 1)
    this.pagos.splice(i, 1)
    this.calculateRate()
    this.calculatePayment()

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
      this.dtTrigger.next()
    })

  }

  reloadData() {
    location.reload()
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
          this.deliveryForm.get('order.direccion').setValue(destCords)
          this.calculatedistanceBefore()
        })
      } else {
        alert('Por favor activa la ubicación para esta función')
      }
    } else {
      this.deliveryForm.get('order.direccion').setValue('')
    }

  }

  //ESTABLECE LAS COORDENADAS PARA EL PUNTO DESTINO
  setCordsDestination() {
    this.deliveryForm.get('order.direccion').setValue(this.destinationCords.nativeElement.value)
    this.gcordsDestination = false
    this.calculatedistanceBefore()
  }

  //REDIRIGE A LOS DETALLES DE LA RESERVA AL GUARDARLA
  showNewDeliveryDetail(id) {
    this.router.navigate(['customers/ver-reserva', id])
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
        this.reloadData()
      })
    } else {
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingSubmit = false
        if (this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy()
              this.dtTrigger.next()
            })
        }

      })
    }

  }

  openSuccessDialog(succsTitle: string, succssMsg: string, id: number) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.showNewDeliveryDetail(id)
    })
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onFormSubmit()
      } else {

      }
    })
  }

  //ESTABLECE LA CATEGORÍA A EMPLEAR
  setSelectedCategory(category) {
    this.selectedCategory = category

    this.datesToShow = this.selectedCategory.datesToShow

    this.surcharges = this.selectedCategory.surcharges

    this.newForm.get('deliveryHeader.fecha').setValue('')
    this.newForm.get('deliveryHeader.hora').setValue('')

  }

  setSelectedExtraCharge(extraCharge) {
    this.selectedExtraCharge = extraCharge
  }

  setSelectedExtraChargeOption(option) {
    this.selectedExtraChargeOption = option
  }

  setSelectedRate(rate) {
    this.selectedRate = rate
  }

  setCordsOrigin() {
    this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(this.originCords.nativeElement.value)
    this.deliveryForm.get('deliveryHeader.coordsOrigen').setValue(this.originCords.nativeElement.value)
    this.gcordsOrigin = false

    if (this.deliveryForm.get('order.direccion').value != '') {
      this.calculatedistanceBefore()
    }

  }

  searchOrigin(event) {
    let lugar = event.target.value
    if (lugar.trim().length >= 5) {
      const placeSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        lugar: lugar,
        function: 'searchPlace'
      }).subscribe(response => {
        this.placesOrigin = response
        placeSubscription.unsubscribe()
      })
    }

  }

  setDate(date) {
    this.hoursToShow = []
    this.hoursToShow = date.hoursToShow
    this.hoursToShow.sort((a, b) => (a.hour > b.hour) ? 1 : -1)
  }

  /*
  onSelect(event) {
    if (this.files.length === 0) {
      this.files.push(...event.addedFiles)
      let fileReader = new FileReader()

      fileReader.onload = (e) => {
        const fContent = fileReader.result
        this.fileContentArray = fContent.toString().split('?')
      }
      fileReader.readAsText(this.files[0])
    }
  }

  onFileOrdersAdd() {
    this.loaders.loadingAdd = true

    this.fileContentArray.forEach(order => {
      let myOrder = order.split('|')

      let myDetail = {
        nFactura: myOrder[0],
        nomDestinatario: myOrder[1],
        numCel: myOrder[2].trim(),
        instrucciones: myOrder[3],
        direccion: myOrder[4],
        distancia: '',
        tarifaBase: 0,
        recargo: 0,
        cTotal: 0
      }

      let errs = 0

      if (myDetail.nFactura.length > 250) {
        errs++
      } else if (myDetail.nomDestinatario.length > 150) {
        errs++
      } else if (myDetail.numCel.length > 9) {
        errs++
      } else if (myDetail.instrucciones.length > 150) {
        errs++
      } else if (myDetail.direccion.length > 250) {
        errs++
      } else if (myDetail.distancia.length > 10) {
        errs++
      }

      if (errs > 0) {
        this.openErrorDialog('Lo sentimos, Uno o más envíos podrían tener un formato incorrecto. ' +
          'Por favor verifique el archivo e intentelo nuevamente.', false)
        this.loaders.loadingAdd = false
        return false
      }


      let ordersCount = this.orders.length + 1
      //
      this.calculateRate(ordersCount)
      this.calculateDistance(myDetail)

    })

  }

  onFileRemove(event) {
    this.files.splice(this.files.indexOf(event), 1)
  }*/

  openRestrictionsDialog() {
    const dialogRef = this.dialog.open(CustomerRestrictionsDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close()
    })
  }

  //VERIFICA SI EL CLIENTE TIENE SALDO PENDIENTE
  checkCustomer() {
    this.openLoader()
    const usrsSubs = this.userService
      .checkCustomerAvalability()
      .subscribe(response => {
        if (response.data == false) {
          this.dialog.closeAll()
          this.openLockedUserDialog(response.balance)
        } else {
          this.loadData()
        }
        usrsSubs.unsubscribe()
      })
  }

  openLockedUserDialog(balance) {
    const dialogRef = this.dialog.open(LockedUserDialogComponent, {
      data: {
        balance: balance,
        customer: this.currCustomer
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/customers/dashboard'])
    })
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

  checkRate(){
    if(this.orders.length > 0){
      this.pago.baseRate = this.selectedRate.precio
      
      this.orders.forEach(value => {
        if (value.tarifaBase != this.selectedRate.precio ) {
          const nPay = this.calculateOrderPayment(Number(value.distancia.split(" ")[0]))
          let i = this.orders.indexOf(value)
          value.tarifaBase = this.pago.baseRate
          value.cargosExtra = nPay.cargosExtra
          value.recargo = nPay.surcharges
          value.cTotal = nPay.total
          this.pagos[i].baseRate = nPay.baseRate
          if (this.pagos[i]?.cargosExtra) {
            this.pagos[i].cargosExtra = nPay.cargosExtra
          }
          this.pagos[i].surcharges = nPay.surcharges
          this.pagos[i].total = nPay.total  
        }
        
      })
      this.pago.recargos = this.pagos.reduce(function(a,b){return a.surcharges + b.surcharges})
      this.pago.cargosExtra = this.pagos.reduce(function(a,b){ return a.cargosExtra + b.cargosExtra})
      this.pago.total = this.pagos.reduce(function(a,b){ return a.total + b.total})
      
    }
    
  }

}
