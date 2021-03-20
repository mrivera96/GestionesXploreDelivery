import {animate, style, transition, trigger} from '@angular/animations';
import {formatDate} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GoogleMap} from '@angular/google-maps';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {BlankSpacesValidator} from 'src/app/helpers/blankSpaces.validator';
import {DateValidate} from 'src/app/helpers/date.validator';
import {NoUrlValidator} from 'src/app/helpers/noUrl.validator';
import {Branch} from 'src/app/models/branch';
import {Category} from 'src/app/models/category';
import {Customer} from 'src/app/models/customer';
import {ExtraCharge} from 'src/app/models/extra-charge';
import {ExtraChargeCategory} from 'src/app/models/extra-charge-category';
import {ExtraChargeOption} from 'src/app/models/extra-charge-option';
import {Order} from 'src/app/models/order';
import {Rate} from 'src/app/models/rate';
import {Schedule} from 'src/app/models/schedule';
import {Surcharge} from 'src/app/models/surcharge';
import {AuthService} from 'src/app/services/auth.service';
import {BranchService} from 'src/app/services/branch.service';
import {CategoriesService} from 'src/app/services/categories.service';
import {DeliveriesService} from 'src/app/services/deliveries.service';
import {RatesService} from 'src/app/services/rates.service';
import {UsersService} from 'src/app/services/users.service';
import {environment} from 'src/environments/environment';
import {ErrorModalComponent} from '../../shared/error-modal/error-modal.component';
import {LockedUserDialogComponent} from '../../shared/locked-user-dialog/locked-user-dialog.component';
import {SuccessModalComponent} from '../../shared/success-modal/success-modal.component';
import {ConfirmDialogComponent} from '../customer-new-delivery/confirm-dialog/confirm-dialog.component';
import {LoadingDialogComponent} from "../../shared/loading-dialog/loading-dialog.component";

@Component({
  selector: 'app-customer-new-routing-shipping',
  templateUrl: './customer-new-routing-shipping.component.html',
  styleUrls: ['./customer-new-routing-shipping.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerNewRoutingShippingComponent implements OnInit {
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
    'loadingDistBef': false,
    'loadingCalculating': false,
    'loadingOptimizing': false
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
  myBranchOffices: Branch[] = []
  @ViewChild('originCords') originCords: ElementRef
  @ViewChild('destinationCords') destinationCords: ElementRef
  @Input() cardType
  placesOrigin = []
  placesDestination = []
  pago = {
    'baseRate': 0.00,
    'cargosExtra': 0.00,
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
  selectedCategory: Category = {}
  selectedExtraCharge: ExtraCharge = null
  selectedExtraChargeOption: ExtraChargeOption = {}
  extraCharges: ExtraChargeCategory[] = []
  currOrder: any = {
    extras: [] = []
  }
  searchingOrigin = false
  searchingDest = false
  finishFlag = false
  avgDistance = 0
  totalTime = 0
  totalDistance = 0
  demandMSG: string = ''

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private ratesService: RatesService,
    private http: HttpClient,
    private branchService: BranchService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UsersService
  ) {
    this.currCustomer = this.authService.currentUserValue.cliente
  }

  ngOnInit(): void {
    this.todaySchedule = JSON.parse(localStorage.getItem('todaySchedule'));
    this.hInit = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(),
      null, Number(this.todaySchedule?.inicio.split(':')[0]), Number(this.todaySchedule?.inicio.split(':')[1])),
      'hh:mm a', 'en');

    this.hFin = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(),
      null, Number(this.todaySchedule?.final.split(':')[0]), Number(this.todaySchedule?.final.split(':')[1])),
      'hh:mm a', 'en');
    this.initialize();
    this.checkCustomer();
  }

  //INICIALIZACIÓN DE VARIABLES
  initialize() {
    this.directionsRenderer = new google.maps.DirectionsRenderer;
    this.directionsService = new google.maps.DirectionsService;
    this.locationOption = 1;
    this.paymentMethod = 1;
    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group({
        fecha: [{
          value: formatDate(new Date(), 'yyyy-MM-dd', 'en'), disabled: false
        }, Validators.required],
        hora: [formatDate(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 5), 'HH:mm', 'en'), Validators.required],
        dirRecogida: [{value: '', disabled: false}, [Validators.required]],
        idCategoria: [{value: 1, disabled: false}, [Validators.required]],
        instrucciones: ['', Validators.maxLength(150)],
        coordsOrigen: [''],
        distancia: [0]
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
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.myCurrentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.deliveryForm.get('deliveryHeader.dirRecogida')
          .setValue(this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng);
      }, function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permiso de Ubicación Denegado. Por tanto, no podremos obtener tu ubicación actual.');
            break;
          case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break;
          case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            break;
        }

      });
    } else {
      alert('El GPS está desactivado');
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
    };

  }

  //COMUNICACIÓN CON LA API PARA OBTENER LOS DATOS NECESARIOS(CATEGORÍAS Y TARIFAS)
  loadData() {
    const categoriesSubscription = this.categoriesService.getCustomerCategories().subscribe(response => {
      this.categories = response.routingCategories;
      this.demandMSG = response.demand;
      this.setSelectedCategory();
      this.dialog.closeAll()
      categoriesSubscription.unsubscribe();
    }, error => {
      this.dialog.closeAll()
      this.errorMsg = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.';
      this.openErrorDialog(this.errorMsg, true);
      categoriesSubscription.unsubscribe();
    });

    const branchSubscription = this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data;
      this.myBranchOffices.forEach(bOffice => {
        if (bOffice.isDefault == true) {
          this.locationOption = 3;
          this.defaultBranch = bOffice.idSucursal;
          this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(bOffice.direccion);
          this.checkInsructions();
        }
      });
      branchSubscription.unsubscribe();
    });

  }

  //VERIFICIA SI EL CLIENTE TIENE REGISTRADAS INSTRUCCIONES DE RECOGIDA
  checkInsructions() {
    this.myBranchOffices.forEach(bOffice => {
      if (bOffice.direccion == this.deliveryForm.get('deliveryHeader.dirRecogida').value && bOffice.instrucciones != '') {
        this.deliveryForm.get('deliveryHeader.instrucciones').setValue(bOffice.instrucciones);
      } else {
        this.deliveryForm.get('deliveryHeader.instrucciones').setValue('');
      }
    });
  }

  clearLocationField() {
    this.newForm.get('deliveryHeader.dirRecogida').setValue('');
  }

  //ESTABLECE LA UBICACIÓN ACTUAL COMO PUNTO DE RECOGIDA
  setCurrentLocationOrigin() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.myCurrentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.deliveryForm.get('deliveryHeader.dirRecogida')
          .setValue(this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng);
        this.calculatedistanceBefore();
      }, function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permiso de Ubicación Denegado. Por tanto, no podremos obtener tu ubicación actual.');
            break;
          case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break;
          case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            break;
        }

      });
    } else {
      alert('El GPS está desactivado');
    }
  }

  get newForm() {
    return this.deliveryForm;
  }

  //AGREGAR UN NUEVO ENVÍO
  onOrderAdd() {
    if (this.deliveryForm.get('order').valid) {
      this.openLoader()

      this.currOrder.nFactura = this.newForm.get('order.nFactura').value;
      this.currOrder.nomDestinatario = this.newForm.get('order.nomDestinatario').value;
      this.currOrder.numCel = this.newForm.get('order.numCel').value;
      this.currOrder.direccion = this.newForm.get('order.direccion').value;
      this.currOrder.instrucciones = this.newForm.get('order.instrucciones').value;
      this.currOrder.coordsDestino = '';
      this.currOrder.distancia = '';
      this.currOrder.tiempo = '';
      this.currOrder.tarifaBase = 0;
      this.currOrder.recargo = 0;
      this.currOrder.cTotal = 0;
      this.currOrder.cargosExtra = 0;

      let ordersCount = this.orders.length + 1;
      //
      this.calculateRate(ordersCount);
      if (this.finishFlag == true) {
        this.finishFlag = false;
      }

      this.calculateDistance();
    }
  }

  //COMUNICACIÓN CON LA API PARA REGISTRAR EL DELIVERY
  onFormSubmit() {
    this.newForm.get('deliveryHeader.idCategoria').enable()
    this.newForm.get('deliveryHeader.dirRecogida').enable()
    this.newForm.get('deliveryHeader.fecha').enable()
    if (this.deliveryForm.get('deliveryHeader').valid && this.orders.length > 0) {

      this.openLoader()
      const deliveriesSubscription = this.deliveriesService
        .newCustomerDelivery(this.deliveryForm.get('deliveryHeader').value, this.orders, this.pago)
        .subscribe(response => {
          this.loaders.loadingSubmit = false;
          this.exitMsg = response.message;
          this.nDeliveryResponse = response.nDelivery;
          this.openSuccessDialog('Operación Realizada Correctamente', this.exitMsg = response.message, this.nDeliveryResponse);
          deliveriesSubscription.unsubscribe();
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.dialog.closeAll()
              this.errorMsg = error.statusText;
              this.openErrorDialog(this.errorMsg, false);
              deliveriesSubscription.unsubscribe();
            });
          } else {
            this.dialog.closeAll()
            this.errorMsg = 'Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.';
            this.openErrorDialog(this.errorMsg, false);
            deliveriesSubscription.unsubscribe();
          }

        });
    } else if (this.deliveryForm.invalid) {
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();
    }

  }

  //CALCULA LA DISTANCIA PARA PREVISUALIZACIÓN
  calculatedistanceBefore() {
    if (this.selectedCategory.idCategoria) {
      this.directionsRenderer.setMap(null);
      if (this.newForm.get('deliveryHeader.dirRecogida').value != '' && this.newForm.get('order.direccion').value != '') {
        this.loaders.loadingDistBef = true;
        let ordersCount = this.orders.length + 1;
        //
        this.calculateRate(ordersCount);

        const distSubs = this.http.post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: this.deliveryForm.get('order.direccion').value,
          entrega: this.deliveryForm.get('deliveryHeader.dirRecogida').value,
          tarifa: this.pago.baseRate
        }).subscribe((response) => {

          const finalDistance = Number(response.distancia.split(' ')[0]);
          let salida = '';
          const entrega = this.newForm.get('order.direccion').value;
          let tarifa = this.pago.baseRate;

          if (this.orders.length > 0) {
            salida = this.orders[this.orders.length - 1].direccion;
          } else {
            salida = this.deliveryForm.get('deliveryHeader.dirRecogida').value;
          }

          const distanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
            function: 'calculateDistance',
            salida: salida,
            entrega: entrega,
            tarifa: tarifa
          }).subscribe((response) => {
            this.loaders.loadingDistBef = false;
            this.befDistance = response.distancia;

            const calculatedPayment = this.calculateOrderPayment();
            this.befTime = response.tiempo;
            this.befCost = calculatedPayment.total;
            this.placesOrigin = [];
            this.placesDestination = [];

            this.directionsRenderer.setMap(this.googleMap._googleMap);
            this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer);
            distanceSubscription.unsubscribe();
          }, error => {
            if (error.subscribe()) {
              error.subscribe(error => {
                this.prohibitedDistanceMsg = error.statusText;
                this.prohibitedDistance = true;
                this.loaders.loadingDistBef = false;
                setTimeout(() => {
                  this.prohibitedDistance = false;
                }, 2000);
              });
            }
            distanceSubscription.unsubscribe();

          });

          distSubs.unsubscribe();
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.prohibitedDistanceMsg = error.statusText;
              this.prohibitedDistance = true;
              this.loaders.loadingDistBef = false;
              setTimeout(() => {
                this.prohibitedDistance = false;
              }, 2000);
            });
          }

        });

      }
    }

  }

  //CALCULA Y TRAZA LA RUTA EN EL MAPA
  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    let dirRecogida = '';
    const dirEntrega = this.newForm.get('order.direccion').value;
    const geocoder1 = new google.maps.Geocoder();
    const geocoder2 = new google.maps.Geocoder();
    if (this.orders.length > 0) {
      dirRecogida = this.orders[this.orders.length - 1].direccion;
    } else {
      dirRecogida = this.deliveryForm.get('deliveryHeader.dirRecogida').value;
    }
    geocoder1.geocode({'address': dirRecogida}, results => {
      const originLL = results[0].geometry.location;
      geocoder2.geocode({'address': dirEntrega}, results => {
        const destLL = results[0].geometry.location;
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
        });
      });

    });

  }

  searchOrigin(event) {
    let lugar = event.target.value;
    if (lugar.trim().length >= 5) {
      this.searchingOrigin = true;
      const placeSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        lugar: lugar,
        function: 'searchPlace'
      }).subscribe(response => {
        this.placesOrigin = response;
        this.searchingOrigin = false;
        placeSubscription.unsubscribe();
      });
    }

  }

  searchDestination(event) {
    let lugar = event.target.value;
    if (lugar.trim().length >= 5) {
      this.searchingDest = true;
      const placeSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        lugar: lugar,
        function: 'searchPlace'
      }).subscribe(response => {
        this.placesDestination = response;
        this.searchingDest = false;
        placeSubscription.unsubscribe();
      });
    }

  }

  //SELECCIÓN DE LA TARIFA A APLICAR SEGÚN EL NÚMERO DE ENTREGAS
  calculateRate(ordersCount) {
    this.rates.forEach(value => {
      if (ordersCount >= value?.entregasMinimas
        && ordersCount <= value?.entregasMaximas
        && this.deliveryForm.get('deliveryHeader.idCategoria').value == value?.idCategoria) {
        this.pago.baseRate = value.precio;
      } else if (ordersCount == 0) {
        this.pago.baseRate = 0.00;
      }
    });
  }

  //CALCULA EL PAGO DEL ENVÍO
  calculateOrderPayment() {
    let orderPayment = {
      'baseRate': this.pago.baseRate,
      'surcharges': 0.00,
      'cargosExtra': 0.00,
      'total': 0.00
    };

    if (this.selectedExtraCharge != null) {
      if (this.selectedExtraCharge.options) {
        orderPayment.cargosExtra = this.selectedExtraChargeOption.costo;
        orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges + +this.selectedExtraChargeOption.costo;
      } else {
        orderPayment.cargosExtra = this.selectedExtraCharge.costo;
        orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges + +this.selectedExtraCharge.costo;
      }

    } else {
      orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges;
    }

    return orderPayment;
  }

  //CALCULA LA DISTANCIA PARA AGREGAR EL ENVÍO
  calculateDistance() {
    let salida = ''
    let entrega = ''
    const tarifa = this.pago.baseRate

    if (this.orders.length > 0) {
      salida = this.orders[this.orders.length - 1].direccion
      entrega = this.currOrder.direccion
    } else {
      salida = this.deliveryForm.get('deliveryHeader.dirRecogida').value
      entrega = this.currOrder.direccion

      const cordsSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCoords',
        lugar: salida,
      }).subscribe((response) => {
        this.deliveryForm.get('deliveryHeader.coordsOrigen').setValue(response[0].lat + ',' + response[0].lng);
        cordsSubscription.unsubscribe()
      })
    }

    const cordsSubscription = this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCoords',
      lugar: entrega,
    }).subscribe((response) => {
      this.currOrder.coordsDestino = response[0].lat + ',' + response[0].lng
      if(this.currOrder.coordsDestino != null){
        const cDistanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: salida,
          entrega: entrega,
          tarifa: tarifa
        }).subscribe(response => {

          this.currOrder.distancia = response.distancia
          this.currOrder.tiempo = response.tiempo
          const calculatedPayment = this.calculateOrderPayment()
          this.currOrder.tarifaBase = calculatedPayment.baseRate
          this.currOrder.recargo = calculatedPayment.surcharges
          this.currOrder.cargosExtra = calculatedPayment.cargosExtra
          this.currOrder.cTotal = calculatedPayment.total

          this.deliveryForm.get('order').reset()
          this.orders.push(this.currOrder)
          this.pagos.push(calculatedPayment)
          this.newForm.get('deliveryHeader.idCategoria').disable()
          this.newForm.get('deliveryHeader.dirRecogida').disable()
          this.newForm.get('deliveryHeader.fecha').disable()
          const cumulativeDistance = Number(this.deliveryForm.get('deliveryHeader.distancia').value)
          const currentDistance = Number(this.currOrder.distancia.split(" ")[0])
          const nDistance = cumulativeDistance + currentDistance
          this.deliveryForm.get('deliveryHeader.distancia').setValue(nDistance)

          this.currOrder = {
            extras: [] = []
          }
          this.befDistance = 0
          this.befTime = 0
          this.befCost = 0

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
              const nPay = this.calculateOrderPayment()
              let i = this.orders.indexOf(value)
              value.tarifaBase = this.pago.baseRate
              value.cargosExtra = nPay.cargosExtra
              value.recargo = nPay.surcharges
              value.cTotal = nPay.total
              this.pagos[i].baseRate = nPay.baseRate
              if (this.pago[i]?.cargosExtra) {
                this.pago[i].cargosExtra = nPay.cargosExtra
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
            this.dialog.closeAll()
            cDistanceSubscription.unsubscribe()
            setTimeout(() => {
              this.prohibitedDistance = false;
            }, 2000)
          })

        })
      }
      cordsSubscription.unsubscribe()
    })

  }

  finishAdding() {
    this.finishFlag = true;
    this.calculatePayment(true);
  }

  //CALCULA EL PAGO TOTAL
  calculatePayment(final?: boolean) {
    if (final) {
      this.openLoader()
      let returnDistance = 0;
      const distSubs = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: this.orders[this.orders.length - 1].direccion,
        entrega: this.deliveryForm.get('deliveryHeader.dirRecogida').value,
        tarifa: this.pago.baseRate
      }).subscribe((response) => {
        returnDistance = Number(response.distancia.split(' ')[0]);

        this.http.post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: this.deliveryForm.get('deliveryHeader.dirRecogida').value,
          entrega: this.orders[this.orders.length - 1].direccion,
          tarifa: this.pago.baseRate
        }).subscribe((res) => {
          let initFinishD = 0;
          let initFinishT = 0;
          initFinishD = Number(res.distancia.split(' ')[0]);
          if (res.tiempo.includes('hour') || res.tiempo.includes('h')) {
            initFinishT = (+res.tiempo.split(' ')[0] * 60) + Number(res.tiempo.split(' ')[2]);
          } else {
            initFinishT = Number(res.tiempo.split(' ')[0]);
          }

          this.totalDistance = Number(this.deliveryForm.get('deliveryHeader.distancia').value) + returnDistance;

          if (initFinishD >= 20.01) {
            this.totalDistance += initFinishD;
          }

          this.totalTime = initFinishT
          let avgTime = Number(initFinishT / this.orders.length);
          let avgDistance = this.totalDistance / (this.orders.length + 1);
          this.avgDistance = +avgDistance.toPrecision(2);

          let appSurcharge = 0.00;
          this.surcharges.forEach(value => {
            if (avgDistance >= Number(value.kilomMinimo)
              && avgDistance <= Number(value.kilomMaximo)
            ) {
              appSurcharge = Number(value.monto);
            }
          });

          this.orders.forEach(order => {
            order.recargo = appSurcharge;
            let ordrTime = 0;
            if (order.tiempo.includes('hour') || order.tiempo.includes('h')) {
              ordrTime = (+order.tiempo.split(' ')[0] * 60) + Number(order.tiempo.split(' ')[2]) + avgTime;
            } else {
              ordrTime = Number(order.tiempo.split(' ')[0]) + avgTime;
            }
            order.tiempo = ordrTime.toFixed() + ' mins';
            order.cTotal = +order.tarifaBase + +order.recargo;
          });

          this.pago.recargos = appSurcharge * this.orders.length;

          this.pago.total = this.pago.total + this.pago.recargos;

          this.dialog.closeAll()
          distSubs.unsubscribe();
        });

      });

    } else {
      this.pago.cargosExtra = this.pagos.reduce(function (a, b) {
        return +a + +b['cargosExtra'];
      }, 0);

      this.pago.total = this.pagos.reduce(function (a, b) {
        return +a + +b['total'];
      }, 0);
      this.dialog.closeAll()
    }

  }

  //ELIMINA UN ENVÍO
  removeFromArray(item) {
    let i = this.orders.indexOf(item);
    const cumulativeDistance = Number(this.deliveryForm.get('deliveryHeader.distancia').value);
    const currentDistance = Number(this.orders[i].distancia.split(' ')[0]);
    const nDistance = cumulativeDistance - currentDistance;
    this.deliveryForm.get('deliveryHeader.distancia').setValue(nDistance);
    this.orders.splice(i, 1);
    this.pagos.splice(i, 1);
    this.calculateRate(this.orders.length);
    this.calculatePayment();
    this.finishFlag = false;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });

  }

  reloadData() {
    location.reload();
  }

  //ESTABLECE LA UBICACIÓN ACTUAL COMO PUNTO DE DESTINO
  setCurrentLocationDest(checked) {
    if (!checked) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(function () {
        }, function () {
        }, {});
        navigator.geolocation.getCurrentPosition(pos => {
          const destCords = Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude);
          this.deliveryForm.get('order.direccion').setValue(destCords);
          this.calculatedistanceBefore();
        });
      } else {
        alert('Por favor activa la ubicación para esta función');
      }
    } else {
      this.deliveryForm.get('order.direccion').setValue('');
    }

  }

  setCordsOrigin() {
    this.deliveryForm.get('deliveryHeader.dirRecogida').setValue(this.originCords.nativeElement.value);
    this.gcordsOrigin = false;

    if (this.deliveryForm.get('order.direccion').value != '') {
      this.calculatedistanceBefore();
    }

  }

  setCordsDestination() {
    this.deliveryForm.get('order.direccion').setValue(this.destinationCords.nativeElement.value);
    this.gcordsDestination = false;
    this.calculatedistanceBefore();
  }

  showNewDeliveryDetail(id) {
    this.router.navigate(['customers/ver-reserva', id]);
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    });

    if (reload) {
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true;
        this.reloadData();
      });
    } else {
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingSubmit = false;
        if (this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
        }

      });
    }

  }

  openSuccessDialog(succsTitle: string, succssMsg: string, id: number) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showNewDeliveryDetail(id);
    });
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onFormSubmit();
      } else {

      }
    });
  }

  /*onSelect(event) {
    if (this.files.length === 0) {
      this.files.push(...event.addedFiles);
      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        const fContent = fileReader.result;
        this.fileContentArray = fContent.toString().split('?');
      };
      fileReader.readAsText(this.files[0]);
    }
  }

  onFileOrdersAdd() {
    this.loaders.loadingAdd = true;

    let idx = 0;
    this.fileContentArray.forEach(order => {
      let myOrder = order.split('|');

      let myDetail = {
        nFactura: myOrder[0],
        nomDestinatario: myOrder[1],
        numCel: myOrder[2].trim(),
        instrucciones: myOrder[3],
        direccion: myOrder[4],
        distancia: '',
        tarifaBase: 0,
        recargo: 0,
        cTotal: 0,
        idx: idx
      };

      let errs = 0;

      if (myDetail.nFactura.length > 250) {
        errs++;
      } else if (myDetail.nomDestinatario.length > 150) {
        errs++;
      } else if (myDetail.numCel.length > 9) {
        errs++;
      } else if (myDetail.instrucciones.length > 150) {
        errs++;
      } else if (myDetail.direccion.length > 250) {
        errs++;
      } else if (myDetail.distancia.length > 10) {
        errs++;
      }

      if (errs > 0) {
        this.openErrorDialog('Lo sentimos, Uno o más envíos podrían tener un formato incorrecto. ' +
          'Por favor verifique el archivo e intentelo nuevamente.', false);
        this.loaders.loadingAdd = false;
        return false;
      }

      let ordersCount = this.orders.length + 1;
      //
      this.calculateRate(ordersCount);
      this.calculateFileDistance(myDetail);
      idx++;
    });

  }

  calculateFileDistance(currOrder) {
    let salida = '';
    let entrega = '';
    const tarifa = this.pago.baseRate;

    if (this.orders.length > 0) {
      salida = this.orders[this.orders.length - 1].direccion;
      entrega = currOrder.direccion;
    } else {
      salida = this.deliveryForm.get('deliveryHeader.dirRecogida').value;
      entrega = currOrder.direccion;

      const cordsSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCoords',
        lugar: salida,
      }).subscribe((response) => {
        this.deliveryForm.get('deliveryHeader.coordsOrigen').setValue(response[0].lat + ',' + response[0].lng);
        cordsSubscription.unsubscribe();
      });
    }

    const cDistanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
      function: 'calculateDistance',
      salida: salida,
      entrega: entrega,
      tarifa: tarifa
    }).subscribe((response) => {
      currOrder.distancia = response.distancia;
      currOrder.tiempo = response.tiempo;
      const calculatedPayment = this.calculateOrderPayment();
      currOrder.tarifaBase = calculatedPayment.baseRate;
      currOrder.recargo = calculatedPayment.surcharges;
      currOrder.cargosExtra = calculatedPayment.cargosExtra;
      currOrder.cTotal = calculatedPayment.total;
      this.http.post<any>(`${environment.apiUrl}`, {
        function: 'getCoords',
        lugar: entrega,
      }).subscribe((response) => {
        currOrder.coordsDestino = response[0].lat + ',' + response[0].lng;
      });
      this.deliveryForm.get('order').reset();
      this.orders.push(currOrder);
      this.pagos.push(calculatedPayment);
      const cumulativeDistance = Number(this.deliveryForm.get('deliveryHeader.distancia').value);
      const currentDistance = Number(currOrder.distancia.split(' ')[0]);
      const nDistance = cumulativeDistance + currentDistance;
      this.deliveryForm.get('deliveryHeader.distancia').setValue(nDistance);
      this.loaders.loadingAdd = false;
      this.selectedExtraChargeOption = {};
      this.selectedExtraCharge = null;
      if (this.orders.length > 1) {
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
      } else {
        if (this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
        } else {
          this.dtTrigger.next();
        }
      }
      this.agregado = true;
      setTimeout(() => {
        this.agregado = false;
      }, 2000);
      this.orders.forEach(value => {
        if (value.tarifaBase != this.pago.baseRate) {
          const nPay = this.calculateOrderPayment();
          let i = this.orders.indexOf(value);
          value.tarifaBase = this.pago.baseRate;
          value.cargosExtra = nPay.cargosExtra;
          value.recargo = nPay.surcharges;
          value.cTotal = nPay.total;
          this.pagos[i].baseRate = nPay.baseRate;
          this.pago[i].cargosExtra = nPay.cargosExtra;
          this.pagos[i].surcharges = nPay.surcharges;
          this.pagos[i].total = nPay.total;
        }
      });
      cDistanceSubscription.unsubscribe();
      if (currOrder.idx == (this.fileContentArray.length - 1)) {
        this.calculatePayment(true);
      } else {
        this.calculatePayment();
      }

    }, error => {
      error.subscribe(error => {
        this.prohibitedDistanceMsg = error.statusText;
        this.prohibitedDistance = true;
        this.loaders.loadingAdd = false;
        cDistanceSubscription.unsubscribe();
        setTimeout(() => {
          this.prohibitedDistance = false;
        }, 2000);
      });
    });

  }

  onFileRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
*/

  //ESTABLECE LA CATEGORÍA A EMPLEAR
  setSelectedCategory() {
    this.categories.forEach(category => {
      if (category.idCategoria === +this.newForm.get('deliveryHeader.idCategoria').value) {
        this.selectedCategory = category;
        this.surcharges = this.selectedCategory.surcharges;
        this.rates = this.selectedCategory.ratesToShow;
      }
    });
  }

  //AÑADE UN CARGO EXTRA
  addExtraCharge(checked, extracharge, option) {
    const extraCharge = {
      idCargoExtra: extracharge,
      idDetalleOpcion: option.idDetalleOpcion,
      costo: option.costo
    }
    if (checked == true) {
      this.currOrder.extras.push(extraCharge)
      this.befCost += +extraCharge.costo
    } else {
      const idx = this.currOrder.extras.indexOf(extraCharge)
      this.currOrder.extras.splice(idx, 1)
      this.befCost -= extraCharge.costo
    }
  }

  //AÑADE MONTO DE COBERTURA
  addCare(excharge) {
    if (this.newForm.get('order.montoCobertura').value !== '') {
      const extraCharge = {
        idCargoExtra: excharge.idCargoExtra,
        idDetalleOpcion: null,
        costo: +excharge.costo,
        montoCobertura: +this.newForm.get('order.montoCobertura').value
      }
      this.currOrder.extras.push(extraCharge)
      this.befCost += +extraCharge.costo
    } else {
      const idx = this.currOrder.extras.indexOf(excharge)
      this.currOrder.extras.splice(idx, 1)
      this.befCost -= excharge.costo
    }

  }

  //VERIFICA SI EL CLIENTE TIENE SALDO PENDIENTE
  checkCustomer() {
    this.openLoader()
    const usrsSubs = this.userService
      .checkCustomerAvalability()
      .subscribe(response => {
        if (response.data == false) {
          this.dialog.closeAll()
          this.openLockedUserDialog(response.balance);
        } else {
          this.loadData();
        }
        usrsSubs.unsubscribe();
      });
  }

  openLockedUserDialog(balance) {
    const dialogRef = this.dialog.open(LockedUserDialogComponent, {
      data: {
        balance: balance,
        customer: this.currCustomer
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/customers/dashboard']);
    });
  }

  //COMUNICACIÓN CON LA API RUTEADOR PARA EL REORDENADO DEL ARRAY DE ENVÍOS
  optimizeRoutes() {
    let orderArray = '['
    const originAddress = {
      address: this.deliveryForm.get('deliveryHeader.dirRecogida').value,
      lat: this.deliveryForm.get('deliveryHeader.coordsOrigen').value.split(',')[0],
      lng: this.deliveryForm.get('deliveryHeader.coordsOrigen').value.split(',')[1]
    }
    orderArray = orderArray + JSON.stringify(originAddress) + ','
    this.orders.forEach(order => {
      const orderObject = {
        address: order.direccion,
        lat: order.coordsDestino.split(',')[0],
        lng: order.coordsDestino.split(',')[1]
      }
      orderArray = orderArray + JSON.stringify(orderObject) + ','
    })
    orderArray = orderArray + JSON.stringify(originAddress) + ']'
    this.loaders.loadingOptimizing = true
    const optSubscription = this.deliveriesService.optimizeRoute(orderArray.replace(' ', ''))
      .subscribe(response => {
        if(response != null){
          const optimizedRouteOrder: any[] = response.route
          let totalDistance = 0
          this.orders.forEach(order => {
            for (let i in optimizedRouteOrder) {
              if (order.direccion == optimizedRouteOrder[i].name) {
                // @ts-ignore
                order.distancia = (optimizedRouteOrder[i].distance - optimizedRouteOrder[i - 1].distance).toPrecision(2) + ' km'
                // @ts-ignore
                order.tiempo = (optimizedRouteOrder[i].arrival - optimizedRouteOrder[i - 1]) + ' mins'
                order.order = +i
              }
            }
          })
          totalDistance = optimizedRouteOrder[optimizedRouteOrder.length - 1].distance
          this.deliveryForm.get('deliveryHeader.distancia').setValue(totalDistance)

          this.orders.sort((a, b) => (a.order > b.order) ? 1 : -1);
        }

        this.loaders.loadingOptimizing = false
        optSubscription.unsubscribe()
      }, error => {
        this.loaders.loadingOptimizing = false
        this.openErrorDialog('Ha ocurrido un error al optimizar la ruta', false)
      })
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }


}
