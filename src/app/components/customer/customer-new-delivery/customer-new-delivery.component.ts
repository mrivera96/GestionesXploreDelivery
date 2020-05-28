import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
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
  markers
  dtOptions: any
  loaders = {
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
  myBranchOffices: Branch[] = []

  @Input() cardType
  cardSrc = ''
  placesOrigin = []
  placesDestination = []
  pago = {
    'baseRate': 0.00,
    'recargos': 0.00,
    'total': 0.00,
  }
  dtTrigger: Subject<any> = new Subject()

  pagos = []
  prohibitedDistance = false
  prohibitedDistanceMsg = ''
  paymentMethod: number = 1

  gcordsOrigin = false
  gcordsDestination = false
  orgnCL = ''


  constructor(
    private categoriesSService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private ratesService: RatesService,
    private http: HttpClient,
    private branchService: BranchService,
  ) {

  }

  ngOnInit(): void {
    this.locationOption = 1
    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group({
        fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
        hora: [formatDate(new Date(), 'HH:mm', 'en'), Validators.required],
        dirRecogida: [null, Validators.required],
        idCategoria: [1, Validators.required],
      }),

      orders: this.formBuilder.group({
        nFactura: ['', Validators.required],
        nomDestinatario: ['', Validators.required],
        numCel: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        direccion: [null, Validators.required],
        distancia: ['']
      })
    })

    navigator.geolocation.getCurrentPosition(position => {
      this.myCurrentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue(this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng)
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


    this.paymentMethod = 1
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

    this.loadData()
  }


  loadData() {
    this.categoriesSService.getAllCategories().subscribe(response => {
      this.categories = response.data
    })

    this.ratesService.getRates().subscribe(response => {
      this.rates = response.data
    })

    this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data
    })
  }

  onOrderAdd() {

    if (this.deliveryForm.get('orders').valid) {
      this.loaders.loadingAdd = true
      this.currOrder = {
        nFactura: this.deliveryForm.get('orders').get('nFactura').value,
        nomDestinatario: this.deliveryForm.get('orders').get('nomDestinatario').value,
        numCel: this.deliveryForm.get('orders').get('numCel').value,
        direccion: this.deliveryForm.get('orders').get('direccion').value,
      }

      this.deliveryForm.get('deliveryHeader').get('idCategoria').disable({onlySelf: true})
      this.deliveryForm.get('deliveryHeader').get('dirRecogida').disable({onlySelf: true})
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
          this.loaders.loadingSubmit = false
          $("#errModal").modal('show')
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
      salida: this.deliveryForm.get('deliveryHeader').get('dirRecogida').value,
      entrega: this.deliveryForm.get('orders').get('direccion').value,
      tarifa: this.pago.baseRate
    }).subscribe((response) => {
      this.loaders.loadingDistBef = false
      this.befDistance = response.distancia
      this.befTime = response.tiempo
      this.befCost = response.total
    }, error => {
      error.subscribe(error => {
        this.prohibitedDistanceMsg = error.statusText
        this.prohibitedDistance = true
        this.loaders.loadingDistBef = false
        setTimeout(() => {
          this.prohibitedDistance = false;
        }, 2000)
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
        && this.deliveryForm.get('deliveryHeader').get('idCategoria').value == value.idCategoria) {
        this.pago.baseRate = value.precio

      } else if (ordersCount == 0) {
        this.pago.baseRate = 0.00
      }
    })
  }

  calculateDistance() {
    const salida = this.deliveryForm.get('deliveryHeader').get('dirRecogida').value
    const entrega = this.deliveryForm.get('orders').get('direccion').value
    const tarifa = this.pago.baseRate


    this.http.post<any>(`${environment.apiUrl}`, {
      function: 'calculateDistance',
      salida: salida,
      entrega: entrega,
      tarifa: tarifa
    }).subscribe((response) => {
      this.currOrder.distancia = response.distancia
      let pago = {
        'tarifaBase': +response.tarifa,
        'recargos': +response.recargo,
        'total': +response.total
      }
      this.deliveryForm.get('orders').reset()
      this.orders.push(this.currOrder)
      this.dtTrigger.next()
      this.pagos.push(pago)
      this.loaders.loadingAdd = false

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

  validateCard(event) {
    if (event == 'Visa') {
      this.cardSrc = 'Visa'
    } else if (event == 'Master Card') {
      this.cardSrc = 'MC'
    } else if (event == null) {
      this.cardSrc = ''
    }
  }

  setOrigin(origin) {
    this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue(origin)
    this.placesOrigin = []
  }

  calculatePayment() {
    this.pago.recargos = this.pagos.reduce(function (a, b) {
      return +a + +b['recargos'];
    }, 0)

    this.pago.total = Number(this.pago.baseRate) + Number(this.pago.recargos)
  }

  setDestination(destination) {
    this.deliveryForm.get('orders').get('direccion').setValue(destination)
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

  setCurrentLocationOrg(event) {
    if (event.target.checked == true) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          const originCords = Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude)
          const ctrl = document.getElementById('dirRecogida')
          let option = document.createElement("option")
          option.text = originCords
          option.value = originCords
          ctrl.appendChild(option)
          this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue(originCords)
          if (this.deliveryForm.get('orders').get('direccion').value != '') {
            this.calculatedistanceBefore()
          }
        });
      } else {
        alert('Por favor activa la ubicación para esta función')
      }
    } else {
      this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue('')
    }

  }

  setCurrentLocationDest(event) {
    if (event.target.checked == true) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          const destCords = Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude)
          this.deliveryForm.get('orders').get('direccion').setValue(destCords)
          this.calculatedistanceBefore()
        })
      } else {
        alert('Por favor activa la ubicación para esta función')
      }
    } else {
      this.deliveryForm.get('orders').get('direccion').setValue('')
    }

  }


}
