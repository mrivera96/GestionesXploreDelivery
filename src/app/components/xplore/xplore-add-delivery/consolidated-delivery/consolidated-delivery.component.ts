import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Customer} from "../../../../models/customer";
import {GoogleMap} from "@angular/google-maps";
import {Category} from "../../../../models/category";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Order} from "../../../../models/order";
import {Rate} from "../../../../models/rate";
import {Surcharge} from "../../../../models/surcharge";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {ExtraCharge} from "../../../../models/extra-charge";
import {ExtraChargeOption} from "../../../../models/extra-charge-option";
import {Branch} from "../../../../models/branch";
import {Schedule} from "../../../../models/schedule";
import {CategoriesService} from "../../../../services/categories.service";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../../services/auth.service";
import {BranchService} from "../../../../services/branch.service";
import {BlankSpacesValidator} from "../../../../helpers/blankSpaces.validator";
import {NoUrlValidator} from "../../../../helpers/noUrl.validator";
import {environment} from "../../../../../environments/environment";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ConfirmDialogComponent} from "../../../customer/customer-new-delivery/confirm-dialog/confirm-dialog.component";
import {CustomerRestrictionsDialogComponent} from "../../../customer/customer-restrictions-dialog/customer-restrictions-dialog.component";

@Component({
  selector: 'app-consolidated-delivery',
  templateUrl: './consolidated-delivery.component.html',
  styleUrls: ['./consolidated-delivery.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class ConsolidatedDeliveryComponent implements OnInit {
  @Input() currCustomer: Customer
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
  @ViewChild(DataTableDirective, {static: false})
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
  rateSchedules: Schedule[] = []
  prohibitedAddress: boolean = false
  prohibitedAddressCentinel: boolean = false
  prohibitedAddressMsg: string = ''
  datesToShow: Array<any> = []
  hoursToShow: Array<any> = []
  files: File[] = []
  fileContentArray: String[] = []

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private branchService: BranchService,
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.directionsRenderer = new google.maps.DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService
    this.paymentMethod = 1
    this.locationOption = 1
    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group({
        dirRecogida: ['', [Validators.required]],
        idCategoria: [{
          value: 1,
          disabled: false,
        }, Validators.required],
        instrucciones: ['', Validators.maxLength(150)],
        coordsOrigen: [''],
        fecha: ['', Validators.required],
        hora: ['', Validators.required],
        idTarifa: [null]
      }, {
        validators: [
          BlankSpacesValidator('dirRecogida'),
          NoUrlValidator('dirRecogida'),
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

  loadData() {
    this.loaders.loadingData = true
    const categoriesSubscription = this.categoriesService
      .getCustomerCategories(this.currCustomer.idCliente)
      .subscribe(response => {
        this.categories = response.consolidatedCategories
        categoriesSubscription.unsubscribe()
        this.loaders.loadingData = false
        this.setSelectedCategory()

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
            this.calculateRatio()
            this.calculatedistanceBefore()
          }, function (error) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('Permiso de Ubicación Denegado. Por tanto, no podremos obtener tu ubicación actual.')
                break;
              case error.POSITION_UNAVAILABLE:
                // La ubicación no está disponible.
                break;
              case error.TIMEOUT:
                // Se ha excedido el tiempo para obtener la ubicación.
                break;
            }

          })
        } else {
          alert('El GPS está desactivado')
        }
      }, error => {
        this.loaders.loadingData = false
        this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
        this.openErrorDialog(this.errorMsg, true)
        categoriesSubscription.unsubscribe()
        this.loaders.loadingData = false
      })

    const branchSubscription = this.branchService
      .getBranchOffices(this.currCustomer.idCliente)
      .subscribe(response => {
        this.myBranchOffices = response.data
        this.myBranchOffices.forEach(bOffice => {
          if (bOffice.isDefault == true) {
            this.checkInsructions()
          }
        })
        branchSubscription.unsubscribe()
      })
  }

  get newForm() {
    return this.deliveryForm
  }

  onOrderAdd() {
    if (this.deliveryForm.get('order').valid) {
      this.loaders.loadingAdd = true

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

      let ordersCount = this.orders.length + 1
      //
      this.calculateRate(ordersCount)

      this.calculateDistance(currOrder)

      this.befDistance = 0
      this.befTime = 0
      this.befCost = 0.00
    }
  }

  onFormSubmit() {
    if (this.deliveryForm.get('deliveryHeader').valid && this.orders.length > 0) {
      this.deliveryForm.get('deliveryHeader.idTarifa').setValue(this.selectedRate.idTarifaDelivery)

      this.loaders.loadingSubmit = true
      const deliveriesSubscription = this.deliveriesService
        .newCustomerDelivery(
          this.deliveryForm.get('deliveryHeader').value,
          this.orders,
          this.pago,
          this.currCustomer.idCliente
        )
        .subscribe(response => {
          this.loaders.loadingSubmit = false
          this.exitMsg = response.message
          this.nDeliveryResponse = response.nDelivery
          this.openSuccessDialog('Operación Realizada Correctamente', this.exitMsg = response.message, this.nDeliveryResponse)
          deliveriesSubscription.unsubscribe()
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.errorMsg = error.statusText
              this.openErrorDialog(this.errorMsg, false)
              deliveriesSubscription.unsubscribe()
            })
          } else {
            this.loaders.loadingSubmit = false
            this.errorMsg = 'Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.'
            this.openErrorDialog(this.errorMsg, false)
            deliveriesSubscription.unsubscribe()
          }

        })
    } else if (this.deliveryForm.invalid) {
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();
    }

  }

  calculateRatio() {
    if (this.newForm.get('deliveryHeader.dirRecogida').value != '') {
      this.prohibitedAddress = false
      this.prohibitedAddressCentinel = false
      let ordersCount = this.orders.length + 1
      //
      this.calculateRate(ordersCount)

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

  calculatedistanceBefore() {
    this.directionsRenderer.setMap(null)
    if (this.newForm.get('deliveryHeader.dirRecogida').value != '' && this.newForm.get('order.direccion').value != '') {
      this.loaders.loadingDistBef = true
      let ordersCount = this.orders.length + 1
      //
      this.calculateRate(ordersCount)

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
        this.placesDestination = []

        this.directionsRenderer.setMap(this.googleMap._googleMap)
        this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer);
        distanceSubscription.unsubscribe()
      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.prohibitedDistanceMsg = error.statusText
            this.prohibitedDistance = true
            this.loaders.loadingDistBef = false
            setTimeout(() => {
              this.prohibitedDistance = false;
            }, 6000)
          })
        }
        distanceSubscription.unsubscribe()

      })
    }

  }

  calculateAndDisplayRoute(directionsService, directionsRenderer) {

    const dirRecogida = this.newForm.get('deliveryHeader.dirRecogida').value
    const dirEntrega = this.newForm.get('order.direccion').value
    const geocoder1 = new google.maps.Geocoder()

    const geocoder2 = new google.maps.Geocoder()
    geocoder1.geocode({'address': dirRecogida}, results => {
      const originLL = results[0].geometry.location
      geocoder2.geocode({'address': dirEntrega}, results => {
        const destLL = results[0].geometry.location
        directionsService.route({
          origin: originLL,  // Haight.
          destination: destLL,  // Ocean Beach.

          travelMode: google.maps.TravelMode['DRIVING']
        }, function (response, status) {
          if (status == 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        })
      })

    })
  }

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

  calculateRate(ordersCount) {
    this.pago.baseRate = this.selectedRate.precio
  }

  calculateOrderPayment(distance) {

    let orderPayment = {
      'baseRate': this.pago.baseRate,
      'surcharges': 0.00,
      'cargosExtra': 0.00,
      'total': 0.00
    }
    if (distance > this.selectedRate.consolidated_detail.radioMaximo) {
      this.surcharges.forEach(value => {
        if (distance >= Number(value.kilomMinimo)
          && distance <= Number(value.kilomMaximo)
        ) {

          orderPayment.surcharges = Number(value.monto)
        }
      })
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

  calculateDistance(currOrder, reloadTable?) {
    const salida = this.selectedRate.consolidated_detail.dirRecogida
    const entrega = currOrder.direccion
    const tarifa = this.pago.baseRate

    if (this.orders.length == 0) {
      const cordsSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCoords',
        lugar: salida,
      }).subscribe((response) => {
        this.deliveryForm.get('deliveryHeader.coordsOrigen').setValue(response[0].lat + ', ' + response[0].lng)
        cordsSubscription.unsubscribe()
      })
    }

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
      currOrder.idCargoExtra = this.selectedExtraCharge?.idCargoExtra
      currOrder.idDetalleOpcion = this.selectedExtraChargeOption?.idDetalleOpcion

      this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCoords',
        lugar: entrega,
      }).subscribe((response) => {
        currOrder.coordsDestino = response[0].lat + ', ' + response[0].lng
      })

      this.deliveryForm.get('order').reset()
      this.orders.push(currOrder)
      this.pagos.push(calculatedPayment)
      this.loaders.loadingAdd = false
      this.selectedExtraChargeOption = {}
      this.selectedExtraCharge = null

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
        this.agregado = false;
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
          this.pago[i].cargosExtra = nPay.cargosExtra
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
          this.prohibitedDistance = false;
        }, 2000)
      })

    })

  }

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

  }

  removeFromArray(item) {
    let i = this.orders.indexOf(item)
    this.orders.splice(i, 1)
    this.pagos.splice(i, 1)
    this.calculateRate(this.orders.length)
    this.calculatePayment()

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    })

  }

  reloadData() {
    location.reload()
  }

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

  setCordsDestination() {
    this.deliveryForm.get('order.direccion').setValue(this.destinationCords.nativeElement.value)
    this.gcordsDestination = false
    this.calculatedistanceBefore()
  }

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

  setSelectedCategory() {
    this.categories.forEach(category => {
      if (category.idCategoria === +this.newForm.get('deliveryHeader.idCategoria').value) {
        this.selectedCategory = category
        const selectedCatRate = category.ratesToShow[0]
        this.rateSchedules = selectedCatRate.schedules
        this.setSelectedRate(selectedCatRate)
        this.datesToShow = selectedCatRate.datesToShow
        this.surcharges = this.selectedCategory.surcharges
      }
    })

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

  setCurrentLocationOrigin() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.myCurrentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        this.deliveryForm.get('deliveryHeader.dirRecogida')
          .setValue(this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng)
        this.calculateRatio()
        this.calculatedistanceBefore()
      }, function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permiso de Ubicación Denegado. Por tanto, no podremos obtener tu ubicación actual.')
            break;
          case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break;
          case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            break;
        }

      })
    } else {
      alert('El GPS está desactivado')
    }
  }

  clearLocationField() {
    this.newForm.get('deliveryHeader.dirRecogida').setValue('')
  }

  checkInsructions() {
    this.myBranchOffices.forEach(bOffice => {
      if (bOffice.direccion == this.deliveryForm.get('deliveryHeader.dirRecogida').value && bOffice.instrucciones != '') {
        this.deliveryForm.get('deliveryHeader.instrucciones').setValue(bOffice.instrucciones)
      } else {
        this.deliveryForm.get('deliveryHeader.instrucciones').setValue('')
      }
    })
  }

  setDate(date) {
    this.hoursToShow = date.hoursToShow

    let i = 0
    this.hoursToShow.forEach(hour => {
      i++
      if (i == 1) {
        this.deliveryForm.get('deliveryHeader.hora').setValue(hour.hour)
      }
    })
  }

  onSelect(event) {
    if (this.files.length === 0) {
      this.files.push(...event.addedFiles)
      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        const fContent = fileReader.result
        this.fileContentArray = fContent.toString().split('?')
      }
      fileReader.readAsText(this.files[0]);
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
          'Por favor verifique el archivo e intentelo nuevamente.', false);
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
  }

  openRestrictionsDialog() {
    const dialogRef = this.dialog.open(CustomerRestrictionsDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close()
    })
  }

}
