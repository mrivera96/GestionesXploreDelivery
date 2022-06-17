import { animate, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { BlankSpacesValidator } from 'src/app/helpers/blankSpaces.validator';
import { DateValidate } from 'src/app/helpers/date.validator';
import { NoUrlValidator } from 'src/app/helpers/noUrl.validator';
import { Branch } from 'src/app/models/branch';
import { Category } from 'src/app/models/category';
import { Customer } from 'src/app/models/customer';
import { ExtraCharge } from 'src/app/models/extra-charge';
import { ExtraChargeCategory } from 'src/app/models/extra-charge-category';
import { ExtraChargeOption } from 'src/app/models/extra-charge-option';
import { Order } from 'src/app/models/order';
import { Rate } from 'src/app/models/rate';
import { Schedule } from 'src/app/models/schedule';
import { Surcharge } from 'src/app/models/surcharge';
import { AuthService } from 'src/app/services/auth.service';
import { BranchService } from 'src/app/services/branch.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LockedUserDialogComponent } from '../../../shared/components/locked-user-dialog/locked-user-dialog.component';
import { SuccessModalComponent } from '../../../shared/components/success-modal/success-modal.component';
import { ConfirmDialogComponent } from '../new-delivery/confirm-dialog/confirm-dialog.component';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { OperationsService } from 'src/app/services/operations.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-new-routing-shipping',
  templateUrl: './customer-new-routing-shipping.component.html',
  styleUrls: ['./customer-new-routing-shipping.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class CustomerNewRoutingShippingComponent implements OnInit {
  locationOption;
  myCurrentLocation;
  dtOptions: any;
  @ViewChild('googleMap') googleMap: GoogleMap;
  center: google.maps.LatLngLiteral;
  loaders = {
    loadingData: false,
    loadingAdd: false,
    loadingPay: false,
    loadingSubmit: false,
    loadingDistBef: false,
    loadingCalculating: false,
    loadingOptimizing: false,
  };
  befDistance = 0;
  befTime = 0;
  befCost = 0.0;
  currCustomer: Customer;
  directionsRenderer;
  directionsService;
  deliveryCategories: Category[] = [];
  transportationCategories: Category[] = [];
  deliveryForm: FormGroup;
  orders: Order[] = [];
  agregado = false;
  exitMsg = '';
  nDeliveryResponse;
  rates: Rate[] = [];
  surcharges: Surcharge[];
  myBranchOffices: Branch[] = [];
  @ViewChild('originCords') originCords: ElementRef;
  @ViewChild('destinationCords') destinationCords: ElementRef;
  @Input() cardType;
  placesOrigin = [];
  placesDestination = [];
  pago = {
    baseRate: 0.0,
    cargosExtra: 0.0,
    recargos: 0.0,
    total: 0.0,
  };
  dtTrigger: Subject<any> = new Subject();
  errorMsg = '';
  today: number;
  todaySchedule: Schedule;
  pagos = [];
  prohibitedDistance = false;
  prohibitedDistanceMsg = '';
  paymentMethod: number = 1;
  hInit;
  hFin;
  files: File[] = [];
  gcordsOrigin = false;
  gcordsDestination = false;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  fileContentArray: String[] = [];
  defaultBranch;
  selectedCategory: Category = {};
  selectedRate: Rate = {};
  selectedExtraCharge: ExtraCharge = null;
  selectedExtraChargeOption: ExtraChargeOption = {};
  extraCharges: ExtraChargeCategory[] = [];
  currOrder: any = {
    extras: ([] = []),
  };
  searchingOrigin = false;
  searchingDest = false;
  finishFlag = false;
  avgDistance = 0;
  totalTime = 0;
  totalDistance = 0;
  demandMSG: string = '';
  geocoder: google.maps.Geocoder;
  acceptTerms = false;
  detailTitle = 'Detalle de envíos';
  nameLabel = 'Nombre del destinatario';
  nameHolder = '¿Quién recibirá el pedido?';
  dliveryHolder = '¿Dónde entregaremos tu pedido?';
  instHolder = '¿Necesitamos instrucciones para la entrega de éste envío?';
  orderForm: FormGroup;
  transportationForm: FormGroup;
  

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private http: HttpClient,
    private branchService: BranchService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UsersService,
    private operationsService: OperationsService,
    private sanitizer: DomSanitizer
  ) {
    this.currCustomer = this.authService.currentUserValue.cliente;
  }

  ngOnInit(): void {
    this.todaySchedule = JSON.parse(localStorage.getItem('todaySchedule'));
    this.hInit = formatDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        null,
        Number(this.todaySchedule?.inicio.split(':')[0]),
        Number(this.todaySchedule?.inicio.split(':')[1])
      ),
      'hh:mm a',
      'en'
    );

    this.hFin = formatDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        null,
        Number(this.todaySchedule?.final.split(':')[0]),
        Number(this.todaySchedule?.final.split(':')[1])
      ),
      'hh:mm a',
      'en'
    );
    this.initialize();
    this.checkCustomer();
  }

  //INICIALIZACIÓN DE VARIABLES
  initialize() {
    this.geocoder = new google.maps.Geocoder();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();
    this.locationOption = 1;
    this.paymentMethod = 1;

    this.deliveryForm = this.formBuilder.group(
      {
        fecha: [
          {
            value: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            disabled: false,
          },
          [Validators.required, DateValidate],
        ],
        hora: [
          formatDate(
            new Date().setHours(
              new Date().getHours(),
              new Date().getMinutes() + 5
            ),
            'HH:mm',
            'en'
          ),
          Validators.required,
        ],
        dirRecogida: [{ value: '', disabled: false }, [Validators.required]],
        idCategoria: [{ value: null, disabled: false }, [Validators.required]],
        instrucciones: ['', Validators.maxLength(150)],
        coordsOrigen: [''],
        idTarifa: [null],
        distancia: [0],
        prioridad: [false],
      },
      {
        validators: [
          DateValidate('fecha', 'hora'),
          BlankSpacesValidator('dirRecogida'),
          NoUrlValidator('dirRecogida'),
        ],
      }
    );

    this.orderForm = this.formBuilder.group(
      {
        nFactura: [
          '',
          [
            Validators.required,
            Validators.maxLength(250),
            Validators.pattern(/^((?!\s{2,}).)*$/),
          ],
        ],
        nomDestinatario: [
          '',
          [
            Validators.required,
            Validators.maxLength(150),
            Validators.pattern(/^((?!\s{2,}).)*$/),
          ],
        ],
        numCel: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
        direccion: ['', Validators.required],
        instrucciones: ['', Validators.maxLength(150)],
        idCargoExtra: [null],
        idOpcionExtra: [null],
      },
      {
        validators: [
          BlankSpacesValidator('nFactura'),
          BlankSpacesValidator('nomDestinatario'),
          BlankSpacesValidator('direccion'),
          NoUrlValidator('direccion'),
        ],
      }
    );

    this.transportationForm = this.formBuilder.group(
      {
        nFactura: [
          'TRANSPORTE',
          [
            Validators.required,
            Validators.maxLength(250),
            Validators.pattern(/^((?!\s{2,}).)*$/),
          ],
        ],
        nomDestinatario: [
          '',
          [
            Validators.required,
            Validators.maxLength(150),
            Validators.pattern(/^((?!\s{2,}).)*$/),
          ],
        ],
        numCel: [
          '0000-0000',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
        direccion: ['', Validators.required],
        instrucciones: ['', Validators.maxLength(150)],
        extracharge: [null],
        montoCobertura: [''],
      },
      {
        validators: [
          BlankSpacesValidator('nFactura'),
          BlankSpacesValidator('nomDestinatario'),
          BlankSpacesValidator('direccion'),
          NoUrlValidator('direccion'),
        ],
      }
    );

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
          previous: 'Ant.',
        },
      },
    };
  }

  //COMUNICACIÓN CON LA API PARA OBTENER LOS DATOS NECESARIOS(CATEGORÍAS Y TARIFAS)
  loadData() {
    const categoriesSubscription = this.categoriesService
      .getCustomerCategories(null, 3)
      .subscribe(
        (response) => {
          response.routingCategories.forEach((element) => {
            if (element.idTipoServicio == 2) {
              this.transportationCategories.push(element);
            } else if (element.idTipoServicio == 1) {
              this.deliveryCategories.push(element);
            }
          });
          this.demandMSG = response.demand;
          this.deliveryCategories.forEach((category) => {
            this.sanitizer.bypassSecurityTrustHtml(category.notas);
            category.categoryExtraCharges.sort((a, b) =>
              a.extra_charge.nombre > b.extra_charge.nombre ? 1 : -1
            );
          });

          this.transportationCategories.forEach((category) => {
            this.sanitizer.bypassSecurityTrustHtml(category.notas);
            category.categoryExtraCharges.sort((a, b) =>
              a.extra_charge.nombre > b.extra_charge.nombre ? 1 : -1
            );
          });
          this.dialog.closeAll();
          categoriesSubscription.unsubscribe();
        },
        (error) => {
          this.dialog.closeAll();
          this.errorMsg =
            'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.';
          this.openErrorDialog(this.errorMsg, true);
          categoriesSubscription.unsubscribe();
        }
      );

    const branchSubscription = this.branchService
      .getBranchOffices()
      .subscribe((response) => {
        this.myBranchOffices = response.data;
        let defOffice = this.myBranchOffices.find(
          (item) => item.isDefault == true
        );

        if (defOffice != null) {
          this.locationOption = 3;
          this.defaultBranch = defOffice.idSucursal;
          this.deliveryForm.get('dirRecogida').setValue(defOffice.direccion);
          this.getOriginCoords();
          this.checkInsructions();
        } else {
          this.setCurrentLocationOrigin();
        }
        branchSubscription.unsubscribe();
      });
  }

  //VERIFICIA SI EL CLIENTE TIENE REGISTRADAS INSTRUCCIONES DE RECOGIDA
  checkInsructions() {
    const bOffice = this.myBranchOffices.find(
      (item) => item.direccion == this.deliveryForm.get('dirRecogida').value
    );
    this.operationsService.checkCustomerInstructions(
      bOffice,
      this.deliveryForm.get('instrucciones')
    );
  }

  clearLocationField() {
    this.newForm.get('dirRecogida').setValue('');
  }

  //ESTABLECE LA UBICACIÓN ACTUAL COMO PUNTO DE RECOGIDA
  setCurrentLocationOrigin() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.myCurrentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.deliveryForm
            .get('dirRecogida')
            .setValue(
              this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng
            );
          this.deliveryForm
            .get('coordsOrigen')
            .setValue(
              this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng
            );
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert(
                'Permiso de Ubicación Denegado. Por tanto, no podremos obtener tu ubicación actual.'
              );
              break;
            case error.POSITION_UNAVAILABLE:
              // La ubicación no está disponible.
              break;
            case error.TIMEOUT:
              // Se ha excedido el tiempo para obtener la ubicación.
              break;
          }
        }
      );
    } else {
      alert('El GPS está desactivado');
    }
  }

  //OBTIENE LAS COORDENADAS DEL PUNTO DE ORIGEN PARA SER UTILIZADAS DURANTE TODO EL PROCESO
  getOriginCoords() {
    if (
      this.deliveryForm.get('dirRecogida').value.startsWith('15.') ||
      this.deliveryForm.get('dirRecogida').value.startsWith('14.') ||
      this.deliveryForm.get('dirRecogida').value.startsWith('13.')
    ) {
      this.deliveryForm
        .get('coordsOrigen')
        .setValue(this.deliveryForm.get('dirRecogida').value);
      this.center = {
        lat: +this.deliveryForm.get('coordsOrigen').value.split(',')[0],
        lng: +this.deliveryForm.get('coordsOrigen').value.split(',')[1],
      };
    } else {
      this.geocoder.geocode(
        { address: this.deliveryForm.get('dirRecogida').value },
        (results) => {
          const ll = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          this.deliveryForm.get('coordsOrigen').setValue(ll.lat + ',' + ll.lng);
          this.center = {
            lat: ll.lat,
            lng: ll.lng,
          };
        }
      );
    }
  }

  get newForm() {
    return this.deliveryForm;
  }

  //AGREGAR UN NUEVO ENVÍO
  onOrderAdd() {
    if (this.deliveryForm.valid) {
      this.openLoader();

      if (this.selectedCategory.idTipoServicio == 1) {
        this.currOrder.nFactura = this.orderForm.get('nFactura').value;
        this.currOrder.nomDestinatario =
          this.orderForm.get('nomDestinatario').value;
        this.currOrder.numCel = this.orderForm.get('numCel').value;
        this.currOrder.direccion = this.orderForm.get('direccion').value;
        this.currOrder.instrucciones =
          this.orderForm.get('instrucciones').value;
      } else if (this.selectedCategory.idTipoServicio == 2) {
        this.currOrder.nFactura = this.transportationForm.get('nFactura').value;
        this.currOrder.nomDestinatario =
          this.transportationForm.get('nomDestinatario').value;
        this.currOrder.numCel = this.transportationForm.get('numCel').value;
        this.currOrder.direccion =
          this.transportationForm.get('direccion').value;
        this.currOrder.instrucciones =
          this.transportationForm.get('instrucciones').value;
      }

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
    this.newForm.get('idCategoria').enable();
    this.newForm.get('dirRecogida').enable();
    this.newForm.get('fecha').enable();

    if (this.deliveryForm.valid && this.orders.length > 0) {
      this.deliveryForm.get('idTarifa').setValue(this.selectedRate);

      this.openLoader();
      const deliveriesSubscription = this.deliveriesService
        .newCustomerDelivery(this.deliveryForm.value, this.orders, this.pago)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.exitMsg = response.message;
            this.nDeliveryResponse = response.nDelivery;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              (this.exitMsg = response.message),
              this.nDeliveryResponse
            );
            deliveriesSubscription.unsubscribe();
          },
          (error) => {
            if (error.subscribe()) {
              error.subscribe((error) => {
                this.dialog.closeAll();
                this.errorMsg = error.statusText;
                this.openErrorDialog(this.errorMsg, false);
                deliveriesSubscription.unsubscribe();
              });
            } else {
              this.dialog.closeAll();
              this.errorMsg =
                'Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.';
              this.openErrorDialog(this.errorMsg, false);
              deliveriesSubscription.unsubscribe();
            }
          }
        );
    } else if (this.deliveryForm.invalid) {
      let invalidFields = [].slice.call(
        document.getElementsByClassName('ng-invalid')
      );
      invalidFields[1].focus();
    }
  }

  //CALCULA LA DISTANCIA PARA PREVISUALIZACIÓN
  calculatedistanceBefore() {
    if (this.selectedCategory.idCategoria) {
      this.directionsRenderer.setMap(null);
      if (
        (this.newForm.get('dirRecogida').value != '' &&
          this.orderForm.get('direccion').value != '') ||
        (this.newForm.get('dirRecogida').value != '' &&
          this.transportationForm.get('direccion').value != '')
      ) {
        this.loaders.loadingDistBef = true;
        let ordersCount = this.orders.length + 1;
        //
        this.calculateRate(ordersCount);

        let salida0 = '';
        if (this.selectedCategory.idTipoServicio == 1) {
          salida0 = this.orderForm.get('direccion').value;
        } else if (this.selectedCategory.idTipoServicio == 2) {
          salida0 = this.transportationForm.get('direccion').value;
        }
        const distSubs = this.http
          .post<any>(`${environment.apiUrl}`, {
            function: 'calculateDistance',
            salida: salida0,
            entrega: this.deliveryForm.get('dirRecogida').value,
            tarifa: this.pago.baseRate,
            categoria: this.deliveryForm.get('deliveryHeader.idCategoria').value,
          })
          .subscribe(
            (response) => {
              const finalDistance = Number(response.distancia.split(' ')[0]);
              let salida = '';
              let entrega = '';
              if (this.selectedCategory.idTipoServicio == 1) {
                entrega = this.orderForm.get('direccion').value;
              } else if (this.selectedCategory.idTipoServicio == 2) {
                entrega = this.transportationForm.get('direccion').value;
              }
              let tarifa = this.pago.baseRate;

              if (this.orders.length > 0) {
                salida = this.orders[this.orders.length - 1].direccion;
              } else {
                salida = this.deliveryForm.get('dirRecogida').value;
              }

              const distanceSubscription = this.http
                .post<any>(`${environment.apiUrl}`, {
                  function: 'calculateDistance',
                  salida: salida,
                  entrega: entrega,
                  tarifa: tarifa,
                  categoria: this.deliveryForm.get('deliveryHeader.idCategoria').value,
                })
                .subscribe(
                  (response) => {
                    this.loaders.loadingDistBef = false;
                    this.befDistance = response.distancia;

                    const calculatedPayment = this.calculateOrderPayment();
                    this.befTime = response.tiempo;
                    this.befCost = calculatedPayment.total;
                    this.placesOrigin = [];
                    this.placesDestination = [];

                    this.directionsRenderer.setMap(this.googleMap._googleMap);
                    this.calculateAndDisplayRoute(
                      this.directionsService,
                      this.directionsRenderer
                    );
                    distanceSubscription.unsubscribe();
                  },
                  (error) => {
                    if (this.orders.length > 0 && salida == entrega) {
                      this.loaders.loadingDistBef = false;
                      this.befDistance = 0;

                      const calculatedPayment = this.calculateOrderPayment();
                      this.befTime = 0;
                      this.befCost = calculatedPayment.total;
                      this.placesOrigin = [];
                      this.placesDestination = [];

                      this.directionsRenderer.setMap(this.googleMap._googleMap);
                      this.calculateAndDisplayRoute(
                        this.directionsService,
                        this.directionsRenderer
                      );
                      distanceSubscription.unsubscribe();
                    } else if (error.subscribe()) {
                      error.subscribe((error) => {
                        this.prohibitedDistanceMsg = error.statusText;
                        this.prohibitedDistance = true;
                        this.loaders.loadingDistBef = false;
                        setTimeout(() => {
                          this.prohibitedDistance = false;
                        }, 2000);
                      });
                    }
                    distanceSubscription.unsubscribe();
                  }
                );

              distSubs.unsubscribe();
            },
            (error) => {
              if (error.subscribe()) {
                error.subscribe((error) => {
                  this.prohibitedDistanceMsg = error.statusText;
                  this.prohibitedDistance = true;
                  this.loaders.loadingDistBef = false;
                  setTimeout(() => {
                    this.prohibitedDistance = false;
                  }, 2000);
                });
              }
            }
          );
      }
    }
  }

  //CALCULA Y TRAZA LA RUTA EN EL MAPA
  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    let dirEntrega = '';
    if (this.selectedCategory.idTipoServicio == 1) {
      dirEntrega = this.orderForm.get('direccion').value;
    } else if (this.selectedCategory.idTipoServicio == 2) {
      dirEntrega = this.transportationForm.get('direccion').value;
    }
    const geocoder = new google.maps.Geocoder();

    let originLL;
    if (this.orders.length > 0) {
      originLL = this.orders[this.orders.length - 1].coordsDestino;
    } else {
      originLL = this.deliveryForm.get('coordsOrigen').value;
    }

    geocoder.geocode({ address: dirEntrega }, (results) => {
      const destLL = results[0].geometry.location;
      directionsService.route(
        {
          origin: originLL, // Haight.
          destination: destLL, // Ocean Beach.
          travelMode: google.maps.TravelMode['DRIVING'],
        },
        function (response, status) {
          if (status == 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    });
  }

  searchOrigin(event) {
    let lugar = event.target.value;
    if (lugar.trim().length >= 5) {
      this.searchingOrigin = true;
      const placeSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          lugar: lugar,
          function: 'searchPlace',
        })
        .subscribe((response) => {
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
      const placeSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          lugar: lugar,
          function: 'searchPlace',
        })
        .subscribe((response) => {
          this.placesDestination = response;
          this.searchingDest = false;
          placeSubscription.unsubscribe();
        });
    }
  }

  //SELECCIÓN DE LA TARIFA A APLICAR SEGÚN EL NÚMERO DE ENTREGAS
  calculateRate(ordersCount) {
    this.selectedRate = this.rates.find(
      (rate) =>
        ordersCount >= rate?.entregasMinimas &&
        ordersCount <= rate?.entregasMaximas &&
        this.deliveryForm.get('idCategoria').value == rate?.idCategoria
    );
    if (this.selectedRate != null) {
      this.pago.baseRate = this.selectedRate.precio;
    } else if (ordersCount == 0) {
      this.pago.baseRate = 0.0;
    }
  }

  //CALCULA EL PAGO DEL ENVÍO
  calculateOrderPayment() {
    let orderPayment = {
      baseRate: this.pago.baseRate,
      surcharges: 0.0,
      cargosExtra: 0.0,
      total: 0.0,
    };

    if (this.selectedExtraCharge != null) {
      if (this.selectedExtraCharge.options) {
        orderPayment.cargosExtra = this.selectedExtraChargeOption.costo;
        orderPayment.total =
          +orderPayment.baseRate +
          +orderPayment.surcharges +
          +this.selectedExtraChargeOption.costo;
      } else {
        orderPayment.cargosExtra = this.selectedExtraCharge.costo;
        orderPayment.total =
          +orderPayment.baseRate +
          +orderPayment.surcharges +
          +this.selectedExtraCharge.costo;
      }
    } else {
      orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges;
    }

    return orderPayment;
  }

  //CALCULA LA DISTANCIA PARA AGREGAR EL ENVÍO
  calculateDistance() {
    let salida = '';
    let entrega = '';
    const tarifa = this.pago.baseRate;

    if (this.orders.length > 0) {
      salida = this.orders[this.orders.length - 1].direccion;
    } else {
      salida = this.deliveryForm.get('dirRecogida').value;
    }

    entrega = this.currOrder.direccion;

    this.geocoder.geocode({ address: this.currOrder.direccion }, (results) => {
      const ll = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      this.currOrder.coordsDestino = ll.lat + ',' + ll.lng;
    });

    if (this.currOrder.coordsDestino != null) {
      const cDistanceSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: salida,
          entrega: entrega,
          tarifa: tarifa,
          categoria: this.deliveryForm.get('deliveryHeader.idCategoria').value,
        })
        .subscribe(
          (response) => {
            this.currOrder.distancia = response.distancia;
            this.currOrder.tiempo = response.tiempo;
            const calculatedPayment = this.calculateOrderPayment();
            this.currOrder.tarifaBase = calculatedPayment.baseRate;
            this.currOrder.recargo = calculatedPayment.surcharges;
            this.currOrder.cargosExtra = calculatedPayment.cargosExtra;
            this.currOrder.cTotal = calculatedPayment.total;

            this.orderForm.reset();
            this.orders.push(this.currOrder);
            this.pagos.push(calculatedPayment);
            this.newForm.get('idCategoria').disable();
            this.newForm.get('dirRecogida').disable();
            this.newForm.get('fecha').disable();
            const cumulativeDistance = Number(
              this.deliveryForm.get('distancia').value
            );
            const currentDistance = Number(
              this.currOrder.distancia.split(' ')[0]
            );
            const nDistance = cumulativeDistance + currentDistance;
            this.deliveryForm.get('distancia').setValue(nDistance);

            this.currOrder = {
              extras: ([] = []),
            };
            this.befDistance = 0;
            this.befTime = 0;
            this.befCost = 0;

            if (this.orders.length > 1) {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
              });
            } else {
              if (this.dtElement.dtInstance) {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
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

            this.orders.forEach((value) => {
              if (value.tarifaBase != this.pago.baseRate) {
                const nPay = this.calculateOrderPayment();
                let i = this.orders.indexOf(value);
                value.tarifaBase = this.pago.baseRate;
                value.cargosExtra = nPay.cargosExtra;
                value.recargo = nPay.surcharges;
                value.cTotal = nPay.total;
                this.pagos[i].baseRate = nPay.baseRate;
                if (this.pago[i]?.cargosExtra) {
                  this.pago[i].cargosExtra = nPay.cargosExtra;
                }

                this.pagos[i].surcharges = nPay.surcharges;
                this.pagos[i].total = nPay.total;
              }
            });

            cDistanceSubscription.unsubscribe();
            this.calculatePayment();
          },
          (error) => {
            error.subscribe((error) => {
              if (
                (this.orders.length > 0 &&
                  this.orderForm.get('direccion').value ==
                    this.orders[this.orders.length - 1].direccion) ||
                (this.orders.length > 0 &&
                  this.transportationForm.get('direccion').value ==
                    this.orders[this.orders.length - 1].direccion)
              ) {
                this.currOrder.distancia = '0 km';
                this.currOrder.tiempo = '0 mins';
                const calculatedPayment = this.calculateOrderPayment();
                this.currOrder.tarifaBase = calculatedPayment.baseRate;
                this.currOrder.recargo = calculatedPayment.surcharges;
                this.currOrder.cargosExtra = calculatedPayment.cargosExtra;
                this.currOrder.cTotal = calculatedPayment.total;

                this.orderForm.reset();
                this.orders.push(this.currOrder);
                this.pagos.push(calculatedPayment);
                this.newForm.get('idCategoria').disable();
                this.newForm.get('dirRecogida').disable();
                this.newForm.get('fecha').disable();
                const cumulativeDistance = Number(
                  this.deliveryForm.get('distancia').value
                );
                const currentDistance = 0;
                const nDistance = cumulativeDistance + currentDistance;
                this.deliveryForm.get('distancia').setValue(nDistance);

                this.currOrder = {
                  extras: ([] = []),
                };
                this.befDistance = 0;
                this.befTime = 0;
                this.befCost = 0;

                if (this.orders.length > 1) {
                  this.dtElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.destroy();
                      this.dtTrigger.next();
                    }
                  );
                } else {
                  if (this.dtElement.dtInstance) {
                    this.dtElement.dtInstance.then(
                      (dtInstance: DataTables.Api) => {
                        dtInstance.destroy();
                        this.dtTrigger.next();
                      }
                    );
                  } else {
                    this.dtTrigger.next();
                  }
                }

                this.agregado = true;
                setTimeout(() => {
                  this.agregado = false;
                }, 2000);

                this.orders.forEach((value) => {
                  if (value.tarifaBase != this.pago.baseRate) {
                    const nPay = this.calculateOrderPayment();
                    let i = this.orders.indexOf(value);
                    value.tarifaBase = this.pago.baseRate;
                    value.cargosExtra = nPay.cargosExtra;
                    value.recargo = nPay.surcharges;
                    value.cTotal = nPay.total;
                    this.pagos[i].baseRate = nPay.baseRate;
                    if (this.pago[i]?.cargosExtra) {
                      this.pago[i].cargosExtra = nPay.cargosExtra;
                    }

                    this.pagos[i].surcharges = nPay.surcharges;
                    this.pagos[i].total = nPay.total;
                  }
                });

                cDistanceSubscription.unsubscribe();
                this.calculatePayment();
              } else {
                this.prohibitedDistanceMsg = error.statusText;
                this.prohibitedDistance = true;
                this.dialog.closeAll();
                cDistanceSubscription.unsubscribe();
                setTimeout(() => {
                  this.prohibitedDistance = false;
                }, 2000);
              }
            });
          }
        );
    }
  }

  finishAdding() {
    this.finishFlag = true;
    this.calculatePayment(true);
  }

  //CALCULA EL PAGO TOTAL
  calculatePayment(final?: boolean) {
    if (final) {
      this.openLoader();
      let returnDistance = 0;
      const distSubs = this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: this.orders[this.orders.length - 1].direccion,
          entrega: this.deliveryForm.get('dirRecogida').value,
          tarifa: this.pago.baseRate,
          categoria: this.deliveryForm.get('deliveryHeader.idCategoria').value,
        })
        .subscribe((response) => {
          returnDistance = Number(response.distancia.split(' ')[0]);
          this.http
            .post<any>(`${environment.apiUrl}`, {
              function: 'calculateDistance',
              salida: this.deliveryForm.get('dirRecogida').value,
              entrega: this.orders[this.orders.length - 1].direccion,
              tarifa: this.pago.baseRate,
              categoria: this.deliveryForm.get('deliveryHeader.idCategoria').value,
            })
            .subscribe((res) => {
              let initFinishD = 0;
              let initFinishT = 0;
              initFinishD = Number(res.distancia.split(' ')[0]);

              if (res.tiempo.includes('hour') || res.tiempo.includes('h')) {
                initFinishT =
                  +res.tiempo.split(' ')[0] * 60 +
                  Number(res.tiempo.split(' ')[2]);
              } else {
                initFinishT = Number(res.tiempo.split(' ')[0]);
              }

              let avgDistance = 0;

              if (returnDistance > 12) {
                this.totalDistance =
                  Number(this.deliveryForm.get('distancia').value) +
                  returnDistance;
                avgDistance = this.totalDistance / (this.orders.length + 1);
              } else {
                this.totalDistance = Number(
                  this.deliveryForm.get('distancia').value
                );
                avgDistance = this.totalDistance / this.orders.length;
              }

              this.totalTime = initFinishT;
              let avgTime = Number(initFinishT / this.orders.length);

              this.avgDistance = +avgDistance.toPrecision(2);

              let appSurcharge;
              this.surcharges.forEach((value) => {
                if (
                  avgDistance >= Number(value.kilomMinimo) &&
                  avgDistance <= Number(value.kilomMaximo)
                ) {
                  appSurcharge = value;
                }
              });

              this.orders.forEach((order) => {
                if (appSurcharge != null) {
                  order.recargo = Number(appSurcharge?.monto);
                  order.idRecargo = appSurcharge?.idRecargo;
                } else {
                  order.recargo = 0;
                  order.idRecargo = null;
                }
                let ordrTime = 0;
                if (
                  order.tiempo.includes('hour') ||
                  order.tiempo.includes('h')
                ) {
                  ordrTime =
                    +order.tiempo.split(' ')[0] * 60 +
                    Number(order.tiempo.split(' ')[2]) +
                    avgTime;
                } else {
                  ordrTime = Number(order.tiempo.split(' ')[0]) + avgTime;
                }
                order.tiempo = ordrTime.toFixed() + ' mins';
                order.cTotal = +order.tarifaBase + +order.recargo;
              });

              if (appSurcharge != null) {
                this.pago.recargos = appSurcharge.monto * this.orders.length;
              } else {
                this.pago.recargos = 0;
              }

              this.pago.total = this.pago.total + this.pago.recargos;

              this.dialog.closeAll();
              this.loaders.loadingAdd = false;
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
      this.dialog.closeAll();
      this.loaders.loadingAdd = false;
    }
  }

  //ELIMINA UN ENVÍO
  removeFromArray(item) {
    let i = this.orders.indexOf(item);
    const cumulativeDistance = Number(this.deliveryForm.get('distancia').value);
    const currentDistance = Number(this.orders[i].distancia.split(' ')[0]);
    const nDistance = cumulativeDistance - currentDistance;
    this.deliveryForm.get('distancia').setValue(nDistance);
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
        navigator.geolocation.getCurrentPosition(
          function () {},
          function () {},
          {}
        );
        navigator.geolocation.getCurrentPosition((pos) => {
          const destCords =
            Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude);
          if (this.selectedCategory.idTipoServicio == 1) {
            this.orderForm.get('direccion').setValue(destCords);
          } else if (this.selectedCategory.idTipoServicio == 2) {
            this.transportationForm.get('direccion').setValue(destCords);
          }

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
    this.deliveryForm
      .get('dirRecogida')
      .setValue(this.originCords.nativeElement.value);
    this.deliveryForm
      .get('coordsOrigen')
      .setValue(this.originCords.nativeElement.value);
    this.gcordsOrigin = false;

    if (
      this.selectedCategory.idTipoServicio == 1 &&
      this.orderForm.get('direccion').value != ''
    ) {
      this.calculatedistanceBefore();
    } else if (
      this.selectedCategory.idTipoServicio == 2 &&
      this.transportationForm.get('direccion').value != ''
    ) {
      this.calculatedistanceBefore();
    }
  }

  setCordsDestination() {
    if (this.selectedCategory.idTipoServicio == 1) {
      this.orderForm
        .get('direccion')
        .setValue(this.destinationCords.nativeElement.value);
    } else if (this.selectedCategory.idTipoServicio == 2) {
      this.transportationForm
        .get('direccion')
        .setValue(this.destinationCords.nativeElement.value);
    }

    this.gcordsDestination = false;
    this.calculatedistanceBefore();
  }

  showNewDeliveryDetail(id) {
    this.router.navigate(['customers/ver-reserva', id]);
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    if (reload) {
      dialog.afterClosed().subscribe((result) => {
        this.loaders.loadingData = true;
        this.reloadData();
      });
    } else {
      dialog.afterClosed().subscribe((result) => {
        this.loaders.loadingSubmit = false;
        if (this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
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
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.showNewDeliveryDetail(id);
    });
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onFormSubmit();
      } else {
      }
    });
  }

  onSelect(event) {
    if (this.files.length === 0 && this.selectedCategory.idCategoria) {
      this.files.push(...event.addedFiles);
      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        const fContent = fileReader.result;
        this.fileContentArray = fContent.toString().split('?');
      };
      fileReader.readAsText(this.files[0]);
    }
  }

  async onFileOrdersAdd() {
    this.loaders.loadingAdd = true;
    let ordersCount = this.fileContentArray.length;
    //
    this.calculateRate(ordersCount);

    this.fileContentArray.forEach((order) => {
      let myOrder = order.split('|');

      let myDetail: any = {
        nFactura: myOrder[0],
        nomDestinatario: myOrder[1],
        numCel: myOrder[2].trim(),
        instrucciones: myOrder[3],
        direccion: myOrder[4],
        distancia: '',
        tarifaBase: 0,
        recargo: 0,
        cTotal: 0,
        idx: +myOrder[5],
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
        this.openErrorDialog(
          'Lo sentimos, Uno o más envíos podrían tener un formato incorrecto. ' +
            'Por favor verifique el archivo e intentelo nuevamente.',
          false
        );
        this.loaders.loadingAdd = false;
        return false;
      }

      //push on array

      const calculatedPayment = this.calculateOrderPayment();
      myDetail.tarifaBase = calculatedPayment.baseRate;
      myDetail.recargo = calculatedPayment.surcharges;
      myDetail.cargosExtra = calculatedPayment.cargosExtra;
      myDetail.cTotal = calculatedPayment.total;

      this.orderForm.reset();
      this.orders.push(myDetail);
      this.pagos.push(calculatedPayment);

      this.agregado = true;
      setTimeout(() => {
        this.agregado = false;
      }, 2000);
    });

    for (const order of this.orders) {
      order.coordsDestino = await this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'getCoords',
          lugar: order.direccion,
        })
        .toPromise()
        .then((response) => {
          return response[0].lat + ',' + response[0].lng;
        });

      this.calculateFileDistance(order).subscribe(
        (response) => {
          order.distancia = response.distancia;
          order.tiempo = response.tiempo;

          const cumulativeDistance = Number(
            this.deliveryForm.get('distancia').value
          );
          const currentDistance = Number(order.distancia.split(' ')[0]);
          const nDistance = cumulativeDistance + currentDistance;
          this.deliveryForm.get('distancia').setValue(nDistance);
          this.loaders.loadingAdd = false;
          this.selectedExtraChargeOption = {};
          this.selectedExtraCharge = null;

          if (order.idx == this.fileContentArray.length + 1) {
            this.calculatePayment(true);
          } else {
            this.calculatePayment();
          }

          if (this.dtElement.dtInstance) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          } else {
            this.dtTrigger.next();
          }
        },
        (error) => {
          if (order.direccion == this.orders[order.idx - 2].direccion) {
            order.distancia = '0 km';
            order.tiempo = '0 mins';

            const cumulativeDistance = Number(
              this.deliveryForm.get('distancia').value
            );
            const currentDistance = Number(order.distancia.split(' ')[0]);
            const nDistance = cumulativeDistance + currentDistance;
            this.deliveryForm.get('distancia').setValue(nDistance);
            this.loaders.loadingAdd = false;
            this.selectedExtraChargeOption = {};
            this.selectedExtraCharge = null;

            if (order.idx == this.fileContentArray.length + 1) {
              this.calculatePayment(true);
            } else {
              this.calculatePayment();
            }
            if (this.dtElement.dtInstance) {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
              });
            } else {
              this.dtTrigger.next();
            }
          } else {
            error.subscribe((err) => {
              this.prohibitedDistanceMsg = 'Ocurrió un error al agregar';
              this.prohibitedDistance = true;
              setTimeout(() => {
                this.prohibitedDistance = false;
              }, 2000);
            });
          }
        }
      );
    }
  }

  calculateFileDistance(currOrder): Observable<any> {
    let salida = '';
    let entrega = '';
    const tarifa = this.pago.baseRate;

    if (+currOrder.idx == 1) {
      salida = this.deliveryForm.get('dirRecogida').value;
      entrega = currOrder.direccion;
      const cordsSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'getCoords',
          lugar: salida,
        })
        .subscribe((response) => {
          this.deliveryForm
            .get('coordsOrigen')
            .setValue(response[0].lat + ',' + response[0].lng);
          cordsSubscription.unsubscribe();
        });
    } else {
      salida = this.orders[currOrder.idx - 2].direccion;
      entrega = currOrder.direccion;
    }

    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'calculateDistance',
      salida: salida,
      entrega: entrega,
      tarifa: tarifa,
      categoria: this.deliveryForm.get('deliveryHeader.idCategoria').value,
    });
  }

  onFileRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  //ESTABLECE LA CATEGORÍA A EMPLEAR
  setSelectedCategory(category) {
    this.selectedCategory = category;
    this.surcharges = this.selectedCategory.surcharges;
    this.rates = this.selectedCategory.ratesToShow;
  }

  //AÑADE UN CARGO EXTRA
  addExtraCharge(checked, extracharge, option) {
    const extraCharge = {
      idCargoExtra: extracharge,
      idDetalleOpcion: option.idDetalleOpcion,
      costo: option.costo,
    };
    if (checked == true) {
      this.currOrder.extras.push(extraCharge);
      this.befCost += +extraCharge.costo;
    } else {
      const idx = this.currOrder.extras.indexOf(extraCharge);
      this.currOrder.extras.splice(idx, 1);
      this.befCost -= extraCharge.costo;
    }
  }

  //AÑADE MONTO DE COBERTURA
  addCare(excharge) {
    if (this.orderForm.get('montoCobertura').value !== '') {
      const extraCharge = {
        idCargoExtra: excharge.idCargoExtra,
        idDetalleOpcion: null,
        costo: +excharge.costo,
        montoCobertura: +this.orderForm.get('montoCobertura').value,
      };
      this.currOrder.extras.push(extraCharge);
      this.befCost += +extraCharge.costo;
    } else {
      const idx = this.currOrder.extras.indexOf(excharge);
      this.currOrder.extras.splice(idx, 1);
      this.befCost -= excharge.costo;
    }
  }

  //VERIFICA SI EL CLIENTE TIENE SALDO PENDIENTE
  checkCustomer() {
    this.openLoader();
    const usrsSubs = this.userService
      .checkCustomerAvalability()
      .subscribe((response) => {
        if (response.data == false) {
          this.dialog.closeAll();
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
        customer: this.currCustomer,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['/customers/dashboard']);
    });
  }

  //COMUNICACIÓN CON LA API RUTEADOR PARA EL REORDENADO DEL ARRAY DE ENVÍOS
  optimizeRoutes() {
    let orderArray = [];
    const originAddress = {
      address: this.deliveryForm.get('dirRecogida').value,
      lat: this.deliveryForm.get('coordsOrigen').value.split(',')[0],
      lng: this.deliveryForm.get('coordsOrigen').value.split(',')[1],
    };

    orderArray.push(originAddress);
    this.orders.forEach((order) => {
      const orderObject = {
        address: order.direccion.replace('&', 'Y'),
        lat: order.coordsDestino.split(',')[0],
        lng: order.coordsDestino.split(',')[1],
      };
      orderArray.push(orderObject);
    });
    orderArray.push(originAddress);
    this.loaders.loadingOptimizing = true;

    const optSubscription = this.deliveriesService
      .optimizeRoute(orderArray)
      .subscribe(
        (response) => {
          if (response != null) {
            const optimizedRouteOrder: any[] = response.route;
            let totalDistance = 0;
            this.orders.forEach((order) => {
              for (let i in optimizedRouteOrder) {
                if (order.direccion == optimizedRouteOrder[i].name) {
                  // @ts-ignore
                  order.distancia =
                    (
                      optimizedRouteOrder[i].distance -
                      // @ts-ignore
                      optimizedRouteOrder[i - 1].distance
                    ).toPrecision(2) + ' km';
                  // @ts-ignore
                  order.tiempo =
                    optimizedRouteOrder[i].arrival -
                    // @ts-ignore
                    optimizedRouteOrder[i - 1].arrival +
                    ' mins';
                  order.order = +i;
                }
              }
            });

            totalDistance =
              optimizedRouteOrder[Object.values(optimizedRouteOrder).length - 1]
                ?.distance;
            this.deliveryForm.get('distancia').setValue(totalDistance);

            this.orders.sort((a, b) => (a.order > b.order ? 1 : -1));
          }

          this.loaders.loadingOptimizing = false;
          optSubscription.unsubscribe();
        },
        (error) => {
          this.loaders.loadingOptimizing = false;
          this.openErrorDialog(
            'Ha ocurrido un error al optimizar la ruta',
            false
          );
        }
      );
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }
}
