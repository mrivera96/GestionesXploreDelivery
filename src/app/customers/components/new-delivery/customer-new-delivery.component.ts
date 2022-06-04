import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Category } from '../../../models/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { DeliveriesService } from '../../../services/deliveries.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Order } from '../../../models/order';
import { Rate } from '../../../models/rate';
import { Branch } from '../../../models/branch';
import { CategoriesService } from '../../../services/categories.service';
import { BranchService } from '../../../services/branch.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Surcharge } from '../../../models/surcharge';
import { DateValidate } from '../../../helpers/date.validator';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessModalComponent } from '../../../shared/components/success-modal/success-modal.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { BlankSpacesValidator } from '../../../helpers/blankSpaces.validator';
import { Customer } from '../../../models/customer';
import { AuthService } from '../../../services/auth.service';
import { NoUrlValidator } from '../../../helpers/noUrl.validator';
import { GoogleMap } from '@angular/google-maps';
import { Schedule } from '../../../models/schedule';
import { ExtraCharge } from '../../../models/extra-charge';
import { ExtraChargeCategory } from 'src/app/models/extra-charge-category';
import { LockedUserDialogComponent } from '../../../shared/components/locked-user-dialog/locked-user-dialog.component';
import { UsersService } from 'src/app/services/users.service';
import { LabelsService } from 'src/app/services/labels.service';
import { Label } from 'src/app/models/label';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { OperationsService } from 'src/app/services/operations.service';
import { DateTimeValidate } from 'src/app/helpers/datetime.validator';

@Component({
  selector: 'app-customer-new-delivery',
  templateUrl: './customer-new-delivery.component.html',
  styleUrls: ['./customer-new-delivery.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class CustomerNewDeliveryComponent implements OnInit {
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
  dtTrigger: Subject<any>;
  errorMsg = '';
  today: number;
  todaySchedule: Schedule;
  pagos = [];
  prohibitedDistance = false;
  prohibitedDistanceMsg = '';
  paymentMethod: number;
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
  extraCharges: ExtraChargeCategory[] = [];
  currOrder: any = {
    extras: ([] = []),
  };
  searchingOrigin = false;
  searchingDest = false;
  demandMSG: string = '';
  myLabels: Label[] = [];
  geocoder: google.maps.Geocoder;
  hourOption;
  priority = false;
  priorityCharge;
  acceptTerms = false;
  reserv;
  nowHourError = false;
  allowPriority = false;
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
    private labelsService: LabelsService,
    private operationsService: OperationsService
  ) {
    this.currCustomer = this.authService.currentUserValue;
    this.hourOption = 1;
    this.reserv = false;

    this.geocoder = new google.maps.Geocoder();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();
    this.locationOption = 1;

    this.paymentMethod = 1;
    this.dtTrigger = new Subject();

    this.deliveryForm = this.formBuilder.group(
      {
        dirRecogida: [{ value: '', disabled: false }, [Validators.required]],
        idCategoria: [{ value: null, disabled: false }, [Validators.required]],
        instrucciones: ['', Validators.maxLength(150)],
        coordsOrigen: [''],
        idTarifa: [null],
        idEtiqueta: [null],
        prioridad: [false],
        fecha: [
          formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          [Validators.required],
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
      },
      {
        validators: [
          BlankSpacesValidator('dirRecogida'),
          NoUrlValidator('dirRecogida'),
          DateValidate('fecha'),
        ]
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
    this.checkCustomer();
    this.setCurrentDate();  
  }

  //COMUNICACIÓN CON LA API PARA OBTENER LOS DATOS NECESARIOS
  loadData() {
    const categoriesSubscription = this.categoriesService
      .getCustomerCategories(null, 1)
      .subscribe(
        (response) => {
          response.data.forEach((element) => {
            if (element.idTipoServicio == 2) {
              this.transportationCategories.push(element);
            } else if (element.idTipoServicio == 1) {
              this.deliveryCategories.push(element);
            }
          });

          this.deliveryCategories.forEach((category) => {
            category.categoryExtraCharges.sort((a, b) =>
              a.extra_charge.nombre > b.extra_charge.nombre ? 1 : -1
            );
          });

          this.transportationCategories.forEach((category) => {
            category.categoryExtraCharges.sort((a, b) =>
              a.extra_charge.nombre > b.extra_charge.nombre ? 1 : -1
            );
          });

          this.demandMSG = response.demand;
          //this.priorityCharge = response.priority;
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

        if (defOffice) {
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

    const lblSubscription = this.labelsService
      .getMyLabels()
      .subscribe((response) => {
        this.myLabels = response.data;
        lblSubscription.unsubscribe();
      });
  }

  //VERIFICA SI EL CLIENTE TIENE INSTRUCCIONES REGISTRADAS
  checkInsructions() {
    const bOffice = this.myBranchOffices.find(
      (item) => item.direccion == this.deliveryForm.get('dirRecogida').value
    );

    this.operationsService.checkCustomerInstructions(
      bOffice,
      this.deliveryForm.get('instrucciones')
    );
  }

  //ESTABLECE LA UBICACIÓN ACTUAL COMO PUNTO DE RECOGIDA
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

  get newForm() {
    return this.deliveryForm;
  }

  //MÉTODO QUE EJECUTA LA ADICIÓN DE UN NUEVO ENVÍO
  onOrderAdd() {
    
    if (this.reserv) {
      this.validateHour();
    } else {
      this.validateNowHour();
    }

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

      this.calculateDistance();
    }
  }

  //COMUNICACIÓN CON LA API PARA REGISTRAR EL DELIVERY
  onFormSubmit() {
    this.newForm.get('idCategoria').enable();
    this.newForm.get('dirRecogida').enable();

    if (this.deliveryForm.valid && this.orders.length > 0) {
      this.deliveryForm.get('idTarifa').setValue(this.selectedRate);
      //this.deliveryForm.get('prioridad').setValue(this.priority);

      this.openLoader();
      const deliveriesSubscription = this.deliveriesService
        .newCustomerDelivery(this.deliveryForm.value, this.orders, this.pago)
        .subscribe(
          (response) => {
            this.dialog.closeAll();
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
            error.subscribe((err) => {
              this.dialog.closeAll();
              this.errorMsg = err.statusText;
              this.openErrorDialog(this.errorMsg, false);
            });
          }
        );
    } else if (this.deliveryForm.invalid) {
      let invalidFields = [].slice.call(
        document.getElementsByClassName('ng-invalid')
      );
      invalidFields[1].focus();
    }
  }

  //CALCULA LA DISTANCIA PARA LA PREVISUALIZACIÓN
  calculatedistanceBefore() {
    this.directionsRenderer.setMap(null);
    if (
      (this.newForm.get('dirRecogida').value != '' &&
        this.orderForm.get('direccion').value != '') ||
      (this.newForm.get('dirRecogida').value != '' &&
        this.transportationForm.get('direccion').value != '')
    ) {
      this.befDistance = 0;
      this.befTime = 0;
      this.befCost = 0;
      this.loaders.loadingDistBef = true;
      let ordersCount = this.orders.length + 1;
      //
      this.calculateRate(ordersCount);

      let entrega = '';
      if (this.selectedCategory.idTipoServicio == 1) {
        entrega = this.orderForm.get('direccion').value;
      } else if (this.selectedCategory.idTipoServicio == 2) {
        entrega = this.transportationForm.get('direccion').value;
      }

      const distanceSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: this.deliveryForm.get('dirRecogida').value,
          entrega: entrega,
          tarifa: this.pago.baseRate,
          categoria: this.deliveryForm.get('idCategoria').value
        })
        .subscribe(
          (response) => {
            this.loaders.loadingDistBef = false;
            if (response.distancia == '') {
              this.prohibitedDistanceMsg =
                'No se ha podido procesar alguna de sus direcciones,' +
                ' si ingresó coordenadas, verifique que sean correctas. El tipo de coordenada ej. 14°07\'32.5"N 87°07\'18.5"W no está soportada actualmente';
              this.prohibitedDistance = true;
              if (this.selectedCategory.idTipoServicio == 1) {
                this.orderForm.get('direccion').setValue(null);
              } else if (this.selectedCategory.idTipoServicio == 2) {
                this.transportationForm.get('direccion').setValue(null);
              }
              setTimeout(() => {
                this.prohibitedDistance = false;
              }, 2000);
              distanceSubscription.unsubscribe();
            } else {
              this.befDistance = response.distancia;
              const calculatedPayment = this.calculateOrderPayment(
                Number(response.distancia.split(' ')[0])
              );
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
            }
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
            distanceSubscription.unsubscribe();
          }
        );
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
    const originLL = this.deliveryForm.get('coordsOrigen').value;

    geocoder.geocode({ address: dirEntrega }, (results) => {
      const destLL = results[0].geometry.location;
      directionsService.route(
        {
          origin: originLL,
          destination: destLL,
          travelMode: google.maps.TravelMode['DRIVING'],
        },
        function (response, status) {
          if (status == 'OK') {
            console.log(response);
            directionsRenderer.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    });
  }

  //EVENTO ONINPUT DEL CAMPO DE DIRECCIÓN DE RECOGIDA
  searchPlace(event) {
    let lugar = event.target.value;

    if (event.target.name == 'dirRecogida') {
      this.searchingOrigin = true;
    } else {
      this.searchingDest = true;
    }

    const placeSubscription = this.operationsService
      .searchPlace(lugar)
      .subscribe((response) => {
        if (event.target.name == 'dirRecogida') {
          this.placesOrigin = response;
          this.searchingOrigin = false;
        } else {
          this.placesDestination = response;
          this.searchingDest = false;
        }

        placeSubscription.unsubscribe();
      });
  }

  //OBTIENE LAS COORDENADAS DEL PUNTO DE ORIGEN PARA SER UTILIZADAS DURANTE EL PROCESO
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

  //SELECCIONA LA TARIFA SEGÚN EL NÚMERO DE ENVÍOS AGREGADOS AL MOMENTO
  calculateRate(ordersCount) {
    this.selectedRate = this.rates.find(
      (rate) =>
        ordersCount >= rate?.entregasMinimas &&
        ordersCount <= rate?.entregasMaximas
    );
    if (this.selectedRate != null) {
      this.pago.baseRate = this.selectedRate.precio;
    } else if (ordersCount == 0) {
      this.pago.baseRate = 0.0;
    }
  }

  //CALCULA EL PAGO DEL ENVÍO SEGÚN LA DISTANCIA
  calculateOrderPayment(distance) {
    let orderPayment = {
      baseRate: this.pago.baseRate,
      surcharges: 0.0,
      cargosExtra: 0.0,
      total: 0.0,
      idRecargo: null,
    };

    const appSurcharge = this.surcharges.find(
      (value) =>
        distance >= Number(value.kilomMinimo) &&
        distance <= Number(value.kilomMaximo)
    );

    if (appSurcharge?.monto) {
      orderPayment.surcharges = Number(appSurcharge?.monto);
      orderPayment.idRecargo = appSurcharge.idRecargo;
    }

    if (this.currOrder.extras.length > 0) {
      orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges;
      this.currOrder.extras.forEach((extra) => {
        orderPayment.cargosExtra = +orderPayment.cargosExtra + +extra.costo;
        orderPayment.total = +orderPayment.total + +extra.costo;
      });
    } else {
      orderPayment.total = +orderPayment.baseRate + +orderPayment.surcharges;
    }

    return orderPayment;
  }

  //CÁLCULO DE LA DISTANCIA PARA AGREGAR EL ENVÍO
  calculateDistance() {
    const salida = this.deliveryForm.get('dirRecogida').value;
    const entrega = this.currOrder.direccion;
    const tarifa = this.pago.baseRate;

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
          categoria: this.deliveryForm.get('idCategoria').value
        })
        .subscribe(
          (response) => {
            this.currOrder.distancia = response.distancia;
            this.currOrder.tiempo = response.tiempo;
            const calculatedPayment = this.calculateOrderPayment(
              Number(response.distancia.split(' ')[0])
            );
            this.currOrder.tarifaBase = calculatedPayment.baseRate;
            this.currOrder.recargo = calculatedPayment.surcharges;
            this.currOrder.cargosExtra = calculatedPayment.cargosExtra;
            this.currOrder.cTotal = calculatedPayment.total;
            this.currOrder.idRecargo = calculatedPayment.idRecargo;

            this.orderForm.reset();
            this.orders.push(this.currOrder);
            this.pagos.push(calculatedPayment);

            this.newForm.get('hora').setValidators(null);
            this.newForm.get('idCategoria').disable();
            this.newForm.get('dirRecogida').disable();
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
            }, 1000);

            this.orders.forEach((value) => {
              if (value.tarifaBase != this.pago.baseRate) {
                const nPay = this.calculateOrderPayment(
                  Number(value.distancia.split(' ')[0])
                );
                let i = this.orders.indexOf(value);
                value.tarifaBase = this.pago.baseRate;
                value.cargosExtra = nPay.cargosExtra;
                value.recargo = nPay.surcharges;
                value.cTotal = nPay.total;
                this.pagos[i].baseRate = nPay.baseRate;
                if (this.pagos[i]?.cargosExtra) {
                  this.pagos[i].cargosExtra = nPay.cargosExtra;
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
              this.prohibitedDistanceMsg = error.statusText;
              this.prohibitedDistance = true;
              this.loaders.loadingAdd = false;
              cDistanceSubscription.unsubscribe();
              setTimeout(() => {
                this.prohibitedDistance = false;
              }, 1000);
            });
          }
        );
    }
  }

  //CALCULA EL PAGO TOTAL
  calculatePayment() {
    this.loaders.loadingAdd = false;
    this.pago.recargos = this.pagos.reduce(function (a, b) {
      return +a + +b['surcharges'];
    }, 0);

    this.pago.cargosExtra = this.pagos.reduce(function (a, b) {
      return +a + +b['cargosExtra'];
    }, 0);

    this.pago.total = this.pagos.reduce(function (a, b) {
      return +a + +b['total'];
    }, 0);

    this.dialog.closeAll();
    this.loaders.loadingAdd = false;
  }

  //ELIMINA UN ENVÍO
  removeFromArray(item) {
    let i = this.orders.indexOf(item);
    this.orders.splice(i, 1);
    this.pagos.splice(i, 1);
    this.calculateRate(this.orders.length);
    this.calculatePayment();

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  reloadData() {
    location.reload();
  }

  //ESTABLECE LA UBICACIÓN ACTUAL PARA EL PUNTO DESTINO
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
      this.orderForm.get('direccion').setValue('');
    }
  }

  //ESTABLECE LAS COORDENADAS PARA EL PUNTO DE RECOGIDA
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

  //ESTABLECE LAS COORDENADAS PARA EL PUNTO DESTINO
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

  //REDIRIGE A LOS DETALLES DE LA RESERVA AL GUARDARLA
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

    for (const order of this.fileContentArray) {
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

      myDetail.coordsDestino = await this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'getCoords',
          lugar: myDetail.direccion,
        })
        .toPromise()
        .then((response) => {
          return response[0].lat + ',' + response[0].lng;
        });

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

      let ordersCount = this.orders.length + 1;
      //
      this.calculateRate(ordersCount);

      this.calculateFileDistance(myDetail).subscribe(
        (response) => {
          myDetail.distancia = response.distancia;
          myDetail.tiempo = response.tiempo;
          const calculatedPayment = this.calculateOrderPayment(
            Number(response.distancia.split(' ')[0])
          );
          myDetail.tarifaBase = calculatedPayment.baseRate;
          myDetail.recargo = calculatedPayment.surcharges;
          myDetail.cargosExtra = calculatedPayment.cargosExtra;
          myDetail.cTotal = calculatedPayment.total;
          myDetail.idRecargo = calculatedPayment.idRecargo;

          this.orderForm.reset();
          this.orders.push(myDetail);
          this.orders.sort((a: any, b: any) => (+a.idx > +b.idx ? 1 : -1));
          this.pagos.push(calculatedPayment);

          if (this.orders.length == this.fileContentArray.length) {
            this.dtTrigger.next();
            /*this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            
          });*/
          }

          this.agregado = true;
          setTimeout(() => {
            this.agregado = false;
          }, 2000);

          this.orders.forEach((value) => {
            if (value.tarifaBase != this.pago.baseRate) {
              const nPay = this.calculateOrderPayment(
                Number(value.distancia.split(' ')[0])
              );
              let i = this.orders.indexOf(value);
              value.tarifaBase = this.pago.baseRate;
              value.cargosExtra = nPay.cargosExtra;
              value.recargo = nPay.surcharges;
              value.cTotal = nPay.total;
              this.pagos[i].baseRate = nPay.baseRate;
              if (this.pagos[i]?.cargosExtra) {
                this.pagos[i].cargosExtra = nPay.cargosExtra;
              }
              this.pagos[i].surcharges = nPay.surcharges;
              this.pagos[i].total = nPay.total;
            }
          });
          this.calculatePayment();
        },
        (error) => {
          error.subscribe((err) => {
            this.prohibitedDistanceMsg = 'Ocurrió un error al agregar';
            this.prohibitedDistance = true;
            setTimeout(() => {
              this.prohibitedDistance = false;
            }, 2000);
          });
        }
      );
    }
  }

  calculateFileDistance(currOrder): Observable<any> {
    const salida = this.deliveryForm.get('dirRecogida').value;
    const entrega = currOrder.direccion;
    const tarifa = this.pago.baseRate;

    if (this.orders.length == 0) {
      this.geocoder.geocode({ address: salida }, (results) => {
        const ll = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        this.deliveryForm.get('coordsOrigen').setValue(ll.lat + ',' + ll.lng);
      });
    }

    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'calculateDistance',
      salida: salida,
      entrega: entrega,
      tarifa: tarifa,
      categoria: this.deliveryForm.get('idCategoria').value
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

    const allowPriority = this.selectedCategory.categoryExtraCharges.find(
      (item) => item.idCargoExtra == 16
    );
    if (allowPriority != null && allowPriority != undefined) {
      this.allowPriority = true;
    } else {
      this.allowPriority = false;
    }
  }

  //AÑADE UN CARGO EXTRA
  addExtraCharge(extracharge, option) {
    const extraCharge = {
      idCargoExtra: extracharge,
      idDetalleOpcion: option.idDetalleOpcion,
      costo: option.costo,
    };
    this.currOrder.extras.push(extraCharge);
  }

  //SETEAR EL VALOR DE LA FECHA Y HORA A LA FECHA ACTUAL Y UNA HORA DESPUES DE LA ACTUAL
  setCurrentDate() {
    this.reserv = false;
    this.newForm
      .get('fecha')
      .setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.newForm
      .get('hora')
      .setValue(
        formatDate(
          new Date().setHours(new Date().getHours(), new Date().getMinutes()),
          'HH:mm',
          'en'
        )
      );
  }

  removeExtraCharges(extracharge) {
    this.orderForm.get('extracharge').setValue(null);
    const ec = this.currOrder.extras.find((x) => x.idCargoExtra == extracharge);
    const id = this.currOrder.extras.indexOf(ec);
    this.currOrder.extras.splice(id, 1);
  }

  //AÑADE MONTO DE COBERTURA
  addCare() {
    if (this.orderForm.get('montoCobertura').value !== '') {
      this.currOrder.extras.find((x) => x.idCargoExtra == 13).montoCobertura =
        +this.orderForm.get('montoCobertura').value;
    }
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

  //MUESTRA EL LOADER
  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }

  //VALIDA LA HORA SEGUN EL TIPO DE SERVICIO RESERVA O SOLICITAR AHORA
  validateHour() {
    const control = this.deliveryForm.get('hora');
    let h = this.newForm.get('hora').value;
    const date = this.newForm.get('fecha').value;
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    const currentDateTime = new Date().setHours(
      new Date().getHours(),
      new Date().getMinutes()
    );
    const oneHourMore = new Date().setHours(
      new Date().getHours() + 1,
      new Date().getMinutes()
    );
    const todaySchedule: Schedule = JSON.parse(
      localStorage.getItem('todaySchedule')
    );
    const tSSHour = formatDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        null,
        Number(todaySchedule?.inicio.split(':')[0]),
        Number(todaySchedule?.inicio.split(':')[1])
      ),
      'HH:mm',
      'en'
    );
    const tSFHour = formatDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        null,
        Number(todaySchedule?.final.split(':')[0]),
        Number(todaySchedule?.final.split(':')[1])
      ),
      'HH:mm',
      'en'
    );

    const shour = h.split(':')[0];
    const smin = h.split(':')[1];
    h = formatDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        null,
        shour,
        smin
      ),
      'HH:mm',
      'en'
    );
    const datetime = new Date(date + ' ' + h);

    if (control.errors && !control.errors.mustAfterHour) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if (this.reserv == true) {
      // @ts-ignore
      if (datetime < oneHourMore) {
        control.setErrors({ mustAfterHour: true });
      }
      if (h < tSSHour || h > tSFHour) {
        control.setErrors({ mustAfterHour: true });
      }
    } else {
      // @ts-ignore
      if (datetime < currentDateTime) {
        control.setErrors({ mustAfterHour: true });
      }
      if (h < tSSHour || h > tSFHour) {
        control.setErrors({ mustAfterHour: true });
      }
    }
  }

  validateNowHour() {
    const control = this.deliveryForm.get('hora');
    let h = this.newForm.get('hora').value;
    const todaySchedule: Schedule = JSON.parse(
      localStorage.getItem('todaySchedule')
    );
    const tSSHour = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      null,
      Number(todaySchedule?.inicio.split(':')[0]),
      Number(todaySchedule?.inicio.split(':')[1])
    );
    const tSFHour = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      null,
      Number(todaySchedule?.final.split(':')[0]),
      Number(todaySchedule?.final.split(':')[1])
    );

    const shour = h.split(':')[0];
    const smin = h.split(':')[1];
    h = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      null,
      shour,
      smin
    );

    const now = new Date();

    if (control.errors && !control.errors.mustAfterHour) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if (h < tSSHour || h > tSFHour) {
      control.setErrors({ mustAfterHour: true });
      this.nowHourError = true;
    }
  }
}
