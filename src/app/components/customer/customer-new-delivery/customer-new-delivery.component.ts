import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Category} from "../../../models/category";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import {HttpClient} from "@angular/common/http";
import {formatDate} from "@angular/common";
import {environment} from "../../../../environments/environment";
import {Order} from "../../../models/order";
import {Rate} from "../../../models/rate";
import {Branch} from "../../../models/branch";
import {CategoriesService} from "../../../services/categories.service";
import {RatesService} from "../../../services/rates.service";
import {BranchService} from "../../../services/branch.service";
import {DataTableDirective} from "angular-datatables";
import {Router} from "@angular/router";
import {Surcharge} from "../../../models/surcharge";
import {SurchargesService} from "../../../services/surcharges.service";
import {DateValidate} from "../../../helpers/date.validator";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../shared/success-modal/success-modal.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {BlankSpacesValidator} from "../../../helpers/blankSpaces.validator";
import {Customer} from "../../../models/customer";
import {AuthService} from "../../../services/auth.service";
import {NoUrlValidator} from "../../../helpers/noUrl.validator";
import {GoogleMap} from "@angular/google-maps";
import {Schedule} from "../../../models/schedule";


@Component({
  selector: 'app-customer-new-delivery',
  templateUrl: './customer-new-delivery.component.html',
  styleUrls: ['./customer-new-delivery.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerNewDeliveryComponent implements OnInit {
  locationOption
  myCurrentLocation
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
  categories: Category[]
  deliveryForm: FormGroup
  orders: Order[] = []
  agregado = false
  exitMsg = ''
  nDeliveryResponse
  rates: Rate[] = []
  surcharges: Surcharge[]
  myBranchOffices: Branch[] = []
  @ViewChild('originCords') originCords: ElementRef
  @ViewChild('destinationCords') destinationCords: ElementRef
  @Input() cardType
  placesOrigin = []
  placesDestination = []
  pago = {
    'baseRate': 0.00,
    'recargos': 0.00,
    'total': 0.00,
  }
  dtTrigger: Subject<any> = new Subject()
  errorMsg = ''
  today: number
  todaySchedule: Schedule
  pagos = []
  prohibitedDistance = false
  prohibitedDistanceMsg = ''
  paymentMethod: number = 1
  hInit
  hFin
  files: File[] = []
  gcordsOrigin = false
  gcordsDestination = false
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  fileContentArray: String[] = []
  defaultBranch

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private ratesService: RatesService,
    private surchargesService: SurchargesService,
    private http: HttpClient,
    private branchService: BranchService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.currCustomer = this.authService.currentUserValue

  }

  ngOnInit(): void {
    this.todaySchedule = JSON.parse(localStorage.getItem('todaySchedule'))
    this.hInit = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(),
      null, Number(this.todaySchedule?.inicio.split(':')[0]), Number(this.todaySchedule?.inicio.split(':')[1])),
      'hh:mm a', 'en')

    this.hFin = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(),
      null, Number(this.todaySchedule?.final.split(':')[0]), Number(this.todaySchedule?.final.split(':')[1])),
      'hh:mm a', 'en')

    this.initialize()
    this.loadData()
  }

  initialize() {
    this.directionsRenderer = new google.maps.DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService
    this.locationOption = 1
    this.paymentMethod = 1
    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group({
        fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
        hora: [formatDate(new Date(), 'HH:mm', 'en'), Validators.required],
        dirRecogida: ['' , [Validators.required]],
        idCategoria: [1, [Validators.required]],
        instrucciones: ['', Validators.maxLength(150)]
      }, {
        validators: [
          DateValidate('fecha', 'hora'),
          BlankSpacesValidator('dirRecogida'),
          NoUrlValidator('dirRecogida'),
        ]
      }),

      order: this.formBuilder.group({
        nFactura: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^((?!\s{2,}).)*$/)]],
        nomDestinatario: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^((?!\s{2,}).)*$/)]],
        numCel: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        direccion: ['', Validators.required],
        instrucciones: ['', Validators.maxLength(150)]
      }, {
        validators: [
          BlankSpacesValidator('nFactura'),
          BlankSpacesValidator('nomDestinatario'),
          BlankSpacesValidator('direccion'),
          NoUrlValidator('direccion'),
        ]
      })
    })

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
    this.categoriesService.getCustomerCategories().subscribe(response => {
      this.categories = response.data
    }, error => {
      this.loaders.loadingData = false
      this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
      this.openErrorDialog(this.errorMsg, true)
    })

    this.ratesService.getCustomerRates().subscribe(response => {
      this.rates = response.data
    })

    this.surchargesService.getSurcharges().subscribe(response => {
      this.surcharges = response.data
    })
    this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data
      this.myBranchOffices.forEach(bOffice => {
        if (bOffice.isDefault == true) {
          this.locationOption = 3
          this.defaultBranch = bOffice.idSucursal
          this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(bOffice.direccion)
          this.checkInsructions()
        }

      })
    })

  }

  checkInsructions(){
    this.myBranchOffices.forEach(bOffice => {
      if (bOffice.direccion == this.deliveryForm.get('deliveryHeader.dirRecogida').value && bOffice.instrucciones != '') {
        this.deliveryForm.get('deliveryHeader.instrucciones').setValue(bOffice.instrucciones)
      }else {
        this.deliveryForm.get('deliveryHeader.instrucciones').setValue('')
      }
    })
  }

  clearLocationField() {
    this.newForm.get('deliveryHeader.dirRecogida').setValue('')
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
        distancia: '',
        tarifaBase: 0,
        recargo: 0,
        cTotal: 0
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

      this.loaders.loadingSubmit = true
      this.deliveriesService
        .newCustomerDelivery(this.deliveryForm.get('deliveryHeader').value, this.orders, this.pago)
        .subscribe(response => {
          this.loaders.loadingSubmit = false
          this.exitMsg = response.message
          this.nDeliveryResponse = response.nDelivery
          this.openSuccessDialog('Operación Realizada Correctamente', this.exitMsg = response.message, this.nDeliveryResponse)
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.errorMsg = error.statusText
              this.openErrorDialog(this.errorMsg, false)
            })
          } else {
            this.loaders.loadingSubmit = false
            this.errorMsg = 'Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.'
            this.openErrorDialog(this.errorMsg, false)
          }

        })
    } else if (this.deliveryForm.invalid) {
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();
    }

  }

  calculatedistanceBefore() {
    this.directionsRenderer.setMap(null)
    if (this.newForm.get('deliveryHeader.dirRecogida').value != '' && this.newForm.get('order.direccion').value != '') {
      this.loaders.loadingDistBef = true
      let ordersCount = this.orders.length + 1
      //
      this.calculateRate(ordersCount)

      this.http.post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: this.deliveryForm.get('deliveryHeader.dirRecogida').value,
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
        this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer);

      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.prohibitedDistanceMsg = error.statusText
            this.prohibitedDistance = true
            this.loaders.loadingDistBef = false
            setTimeout(() => {
              this.prohibitedDistance = false;
            }, 2000)
          })
        }

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

  searchOrigin(event) {
    let lugar = event.target.value
    this.http.post<any>(`${environment.apiUrl}`, {lugar: lugar, function: 'searchPlace'}).subscribe(response => {
      this.placesOrigin = response
    })
  }

  searchDestination(event) {
    let lugar = event.target.value
    this.http.post<any>(`${environment.apiUrl}`, {lugar: lugar, function: 'searchPlace'}).subscribe(response => {
      this.placesDestination = response
    })
  }

  calculateRate(ordersCount) {
    this.rates.forEach(value => {
      if (ordersCount >= value.entregasMinimas
        && ordersCount <= value.entregasMaximas
        && this.deliveryForm.get('deliveryHeader.idCategoria').value == value.idCategoria) {
        this.pago.baseRate = value.precio
      } else if (ordersCount == 0) {
        this.pago.baseRate = 0.00
      }
    })
  }

  calculateOrderPayment(distance) {

    let orderPayment = {
      'baseRate': this.pago.baseRate,
      'surcharges': 0.00,
      'total': 0.00
    }
    this.surcharges.forEach(value => {
      if (distance >= Number(value.kilomMinimo)
        && distance <= Number(value.kilomMaximo)
        && value.cliente.idCliente == this.currCustomer.idCliente) {

        orderPayment.surcharges = Number(value.monto)
      } else if (distance >= Number(value.kilomMinimo)
        && distance <= Number(value.kilomMaximo)
        && value.cliente.idCliente == 1) {
        orderPayment.surcharges = Number(value.monto)
      }
    })
    orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges

    return orderPayment
  }

  calculateDistance(currOrder, reloadTable?) {
    const salida = this.deliveryForm.get('deliveryHeader.dirRecogida').value
    const entrega = currOrder.direccion
    const tarifa = this.pago.baseRate

    this.http.post<any>(`${environment.apiUrl}`, {
      function: 'calculateDistance',
      salida: salida,
      entrega: entrega,
      tarifa: tarifa
    }).subscribe((response) => {
      currOrder.distancia = response.distancia
      const calculatedPayment = this.calculateOrderPayment(Number(response.distancia.split(" ")[0]))
      currOrder.tarifaBase = calculatedPayment.baseRate
      currOrder.recargo = calculatedPayment.surcharges
      currOrder.cTotal = calculatedPayment.total
      this.deliveryForm.get('order').reset()
      this.orders.push(currOrder)
      this.pagos.push(calculatedPayment)
      this.loaders.loadingAdd = false

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
          value.recargo = nPay.surcharges
          value.cTotal = nPay.total
          this.pagos[i].baseRate = nPay.baseRate
          this.pagos[i].surcharges = nPay.surcharges
          this.pagos[i].total = nPay.total
        }
      })

      this.calculatePayment()
    }, error => {
      error.subscribe(error => {
        this.prohibitedDistanceMsg = error.statusText
        this.prohibitedDistance = true
        this.loaders.loadingAdd = false
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

  setCordsOrigin() {
    this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(this.originCords.nativeElement.value)
    this.gcordsOrigin = false

    if (this.deliveryForm.get('order.direccion').value != '') {
      this.calculatedistanceBefore()
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
/*
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
        numCel: myOrder[2],
        instrucciones: myOrder[3],
        direccion: myOrder[4],
        distancia: '',
        tarifaBase: 0,
        recargo: 0,
        cTotal: 0
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

}
