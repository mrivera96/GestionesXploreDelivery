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

declare var $: any;

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

  categories: Category[]
  deliveryForm: FormGroup
  orders: Order[] = []
  currOrder: Order
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

  pagos = []
  prohibitedDistance = false
  prohibitedDistanceMsg = ''
  paymentMethod: number = 1

  gcordsOrigin = false
  gcordsDestination = false
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective


  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private ratesService: RatesService,
    private surchargesService: SurchargesService,
    private http: HttpClient,
    private branchService: BranchService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.locationOption = 1
    this.paymentMethod = 1

    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group({
        fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
        hora: [formatDate(new Date(), 'HH:mm', 'en'), Validators.required],
        dirRecogida: [null, Validators.required],
        idCategoria: [1, Validators.required],
        instrucciones: ['', Validators.maxLength(150)]
      }),

      order: this.formBuilder.group({
        nFactura: ['', [Validators.required, Validators.maxLength(250)]],
        nomDestinatario: ['', [Validators.required, Validators.maxLength(150)]],
        numCel: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        direccion: [null, Validators.required],
        instrucciones: ['', Validators.maxLength(150)]
      })
    })

    if (navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.myCurrentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng)
      }, function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // El usuario denegó el permiso para la Geolocalización.
            break;
          case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break;
          case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            break;
        }

      })
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
    this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
    }, error => {
      this.loaders.loadingData = false
      this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
      $("#errModal").modal('show')
    })

    this.ratesService.getCustomerRates().subscribe(response => {
      this.rates = response.data
    }, error => {
      this.loaders.loadingData = false
      this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
      $("#errModal").modal('show')
    })

    this.surchargesService.getCustomerSurcharges().subscribe(response => {
      this.surcharges = response.data
    }, error => {
      this.loaders.loadingData = false
      this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
      $("#errModal").modal('show')
    })

    this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data
    }, error => {
      this.loaders.loadingData = false
      this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
      $("#errModal").modal('show')
    })
  }

  get newForm() {
    return this.deliveryForm
  }

  onOrderAdd() {

    if (this.deliveryForm.get('order').valid) {
      this.loaders.loadingAdd = true
      this.currOrder = {
        nFactura: this.newForm.get('order.nFactura').value,
        nomDestinatario: this.newForm.get('order.nomDestinatario').value,
        numCel: this.newForm.get('order.numCel').value,
        direccion: this.newForm.get('order.direccion').value,
        instrucciones: this.newForm.get('order.instrucciones').value,
      }

      this.newForm.get('deliveryHeader.idCategoria').disable({onlySelf: true})
      this.newForm.get('deliveryHeader.dirRecogida').disable({onlySelf: true})
      $("#prevDirRecogida").prop('disabled', 'disabled');
      let ordersCount = this.orders.length + 1
      //
      this.calculateRate(ordersCount)

      this.calculateDistance()

      this.befDistance = 0
      this.befTime = 0
      this.befCost = 0.00
    }
  }

  onFormSubmit() {
    if (this.deliveryForm.get('deliveryHeader').valid && this.orders.length > 0) {
      this.loaders.loadingSubmit = true;
      this.deliveriesService
        .newCustomerDelivery(this.deliveryForm.get('deliveryHeader').value, this.orders, this.pago)
        .subscribe(response => {
          this.loaders.loadingSubmit = false
          this.exitMsg = response.message
          this.nDeliveryResponse = response.nDelivery
          $("#succsModal").modal('show')
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.errorMsg = 'Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.'
              $("#errModal").modal('show')
            })
          } else {
            this.loaders.loadingSubmit = false
            this.errorMsg = 'Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.'
            $("#errModal").modal('show')
          }

        })
    }

  }

  calculatedistanceBefore() {
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
      const calculatedPayment = this.calculateOrderPayment( Number(response.distancia.split(" ")[0]))
      this.befTime = response.tiempo
      this.befCost = +calculatedPayment.total
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
    console.log(distance)
    let orderPayment = {
      'baseRate': this.pago.baseRate,
      'surcharges': 0.00,
      'total': 0.00
    }
    this.surcharges.forEach(value => {
      if (distance >= value.kilomMinimo
        && distance <= value.kilomMaximo
      ) {
        orderPayment.surcharges = value.monto
      } else{
        orderPayment.surcharges = 0.00
      }
    })
    orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges

    return orderPayment
  }

  calculateDistance() {
    const salida = this.deliveryForm.get('deliveryHeader.dirRecogida').value
    const entrega = this.deliveryForm.get('order.direccion').value
    const tarifa = this.pago.baseRate


    this.http.post<any>(`${environment.apiUrl}`, {
      function: 'calculateDistance',
      salida: salida,
      entrega: entrega,
      tarifa: tarifa
    }).subscribe((response) => {
      this.currOrder.distancia = response.distancia
      const calculatedPayment = this.calculateOrderPayment( Number(response.distancia.split(" ")[0]))
      this.currOrder.tarifaBase = calculatedPayment.baseRate
      this.currOrder.recargo = calculatedPayment.surcharges
      this.currOrder.cTotal = calculatedPayment.total
      this.deliveryForm.get('order').reset()
      this.orders.push(this.currOrder)
      this.pagos.push(calculatedPayment)
      this.loaders.loadingAdd = false

      if (this.orders.length > 1) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        })
      } else {
        this.dtTrigger.next();
      }

      this.agregado = true
      setTimeout(() => {
        this.agregado = false;
      }, 2000)

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

  setOrigin(origin) {
    this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(origin)
    this.placesOrigin = []
  }

  calculatePayment() {
    this.pago.recargos = this.pagos.reduce(function (a, b) {
      return +a + +b['recargos']
    }, 0)

    this.pago.baseRate = this.pagos.reduce(function (a, b) {
      return +a + +b['tarifaBase']

    })

    this.pago.total = this.pagos.reduce(function (a, b) {
      return +a + +b['total']

    }, 0)
  }

  setDestination(destination) {
    this.deliveryForm.get('order.direccion').setValue(destination)
    this.placesDestination = []
    this.calculatedistanceBefore()
  }

  removeFromArray(item) {
    let i = this.orders.indexOf(item)
    this.orders.splice(i, 1)
    this.pagos.splice(i, 1)
    this.calculateRate(this.orders.length)
    this.calculatePayment()
  }

  reloadData() {
    location.reload()
  }

  setCurrentLocationDest(event) {
    if (event.target.checked == true) {
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
    this.router.navigate(['cliente-detalle-delivery', id])
  }

}
