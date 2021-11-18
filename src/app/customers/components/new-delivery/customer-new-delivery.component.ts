import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Category } from '../../../models/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
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
  dtTrigger: Subject<any> = new Subject();
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
  detailTitle = 'Detalle de envíos';
  nameLabel = 'Nombre del destinatario';
  nameHolder = '¿Quién recibirá el pedido?';
  dliveryHolder = '¿Dónde entregaremos tu pedido?';
  instHolder = '¿Necesitamos instrucciones para la entrega de éste envío?';
  nFactValue = '1';
  numValue = '1';
  nowHourError = false;
  allowPriority = false;

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

    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group(
        {
          dirRecogida: [{ value: '', disabled: false }, [Validators.required]],
          idCategoria: [
            { value: null, disabled: false },
            [Validators.required],
          ],
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
          ],
        }
      ),

      order: this.formBuilder.group(
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
      ),
    });

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
            } else {
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
          this.deliveryForm
            .get('deliveryHeader.dirRecogida')
            .setValue(defOffice.direccion);
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
      (item) =>
        item.direccion ==
        this.deliveryForm.get('deliveryHeader.dirRecogida').value
    );

    this.operationsService.checkCustomerInstructions(
      bOffice,
      this.deliveryForm.get('deliveryHeader.instrucciones')
    );
  }

  //ESTABLECE LA UBICACIÓN ACTUAL COMO PUNTO DE RECOGIDA
  clearLocationField() {
    this.newForm.get('deliveryHeader.dirRecogida').setValue('');
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
            .get('deliveryHeader.dirRecogida')
            .setValue(
              this.myCurrentLocation.lat + ',' + this.myCurrentLocation.lng
            );
          this.deliveryForm
            .get('deliveryHeader.coordsOrigen')
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

      this.currOrder.nFactura = this.newForm.get('order.nFactura').value;
      this.currOrder.nomDestinatario = this.newForm.get(
        'order.nomDestinatario'
      ).value;
      this.currOrder.numCel = this.newForm.get('order.numCel').value;
      this.currOrder.direccion = this.newForm.get('order.direccion').value;
      this.currOrder.instrucciones = this.newForm.get(
        'order.instrucciones'
      ).value;
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
    this.newForm.get('deliveryHeader.idCategoria').enable();
    this.newForm.get('deliveryHeader.dirRecogida').enable();

    if (
      this.deliveryForm.get('deliveryHeader').valid &&
      this.orders.length > 0
    ) {
      this.deliveryForm
        .get('deliveryHeader.idTarifa')
        .setValue(this.selectedRate);
      //this.deliveryForm.get('deliveryHeader.prioridad').setValue(this.priority);

      this.openLoader();
      const deliveriesSubscription = this.deliveriesService
        .newCustomerDelivery(
          this.deliveryForm.get('deliveryHeader').value,
          this.orders,
          this.pago
        )
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
      this.newForm.get('deliveryHeader.dirRecogida').value != '' &&
      this.newForm.get('order.direccion').value != ''
    ) {
      this.befDistance = 0;
      this.befTime = 0;
      this.befCost = 0;
      this.loaders.loadingDistBef = true;
      let ordersCount = this.orders.length + 1;
      //
      this.calculateRate(ordersCount);

      const distanceSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida: this.deliveryForm.get('deliveryHeader.dirRecogida').value,
          entrega: this.newForm.get('order.direccion').value,
          tarifa: this.pago.baseRate,
        })
        .subscribe(
          (response) => {
            this.loaders.loadingDistBef = false;
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
    const dirEntrega = this.newForm.get('order.direccion').value;
    const geocoder = new google.maps.Geocoder();
    const originLL = this.deliveryForm.get('deliveryHeader.coordsOrigen').value;

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
      this.deliveryForm
        .get('deliveryHeader.dirRecogida')
        .value.startsWith('15.') ||
      this.deliveryForm
        .get('deliveryHeader.dirRecogida')
        .value.startsWith('14.') ||
      this.deliveryForm
        .get('deliveryHeader.dirRecogida')
        .value.startsWith('13.')
    ) {
      this.deliveryForm
        .get('deliveryHeader.coordsOrigen')
        .setValue(this.deliveryForm.get('deliveryHeader.dirRecogida').value);
      this.center = {
        lat: +this.deliveryForm
          .get('deliveryHeader.coordsOrigen')
          .value.split(',')[0],
        lng: +this.deliveryForm
          .get('deliveryHeader.coordsOrigen')
          .value.split(',')[1],
      };
    } else {
      this.geocoder.geocode(
        { address: this.deliveryForm.get('deliveryHeader.dirRecogida').value },
        (results) => {
          const ll = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          this.deliveryForm
            .get('deliveryHeader.coordsOrigen')
            .setValue(ll.lat + ',' + ll.lng);
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
    const salida = this.deliveryForm.get('deliveryHeader.dirRecogida').value;
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

            this.deliveryForm.get('order').reset();
            this.orders.push(this.currOrder);
            this.pagos.push(calculatedPayment);

            this.newForm.get('deliveryHeader.hora').setValidators(null);
            this.newForm.get('deliveryHeader.idCategoria').disable();
            this.newForm.get('deliveryHeader.dirRecogida').disable();
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

  //ESTABLECE LAS COORDENADAS PARA EL PUNTO DE RECOGIDA
  setCordsOrigin() {
    this.deliveryForm
      .get('deliveryHeader.dirRecogida')
      .setValue(this.originCords.nativeElement.value);
    this.deliveryForm
      .get('deliveryHeader.coordsOrigen')
      .setValue(this.originCords.nativeElement.value);
    this.gcordsOrigin = false;

    if (this.deliveryForm.get('order.direccion').value != '') {
      this.calculatedistanceBefore();
    }
  }

  //ESTABLECE LAS COORDENADAS PARA EL PUNTO DESTINO
  setCordsDestination() {
    this.deliveryForm
      .get('order.direccion')
      .setValue(this.destinationCords.nativeElement.value);
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

  onFileOrdersAdd() {
    this.openLoader();

    this.fileContentArray.forEach((order) => {
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

      let ordersCount = this.orders.length + 1;
      //
      this.calculateRate(ordersCount);
      this.calculateFileDistance(myDetail);
    });

    this.dialog.closeAll();
  }

  calculateFileDistance(currOrder) {
    const salida = this.deliveryForm.get('deliveryHeader.dirRecogida').value;
    const entrega = currOrder.direccion;
    const tarifa = this.pago.baseRate;

    if (this.orders.length == 0) {
      this.geocoder.geocode({ address: salida }, (results) => {
        const ll = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        this.deliveryForm
          .get('deliveryHeader.coordsOrigen')
          .setValue(ll.lat + ',' + ll.lng);
      });
    }

    this.geocoder.geocode({ address: entrega }, (results) => {
      const ll = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      currOrder.coordsDestino = ll.lat + ',' + ll.lng;
    });

    const cDistanceSubscription = this.http
      .post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: salida,
        entrega: entrega,
        tarifa: tarifa,
      })
      .subscribe(
        (response) => {
          currOrder.distancia = response.distancia;
          currOrder.tiempo = response.tiempo;
          const calculatedPayment = this.calculateOrderPayment(
            Number(response.distancia.split(' ')[0])
          );
          currOrder.tarifaBase = calculatedPayment.baseRate;
          currOrder.recargo = calculatedPayment.surcharges;
          currOrder.cargosExtra = calculatedPayment.cargosExtra;
          currOrder.cTotal = calculatedPayment.total;
          currOrder.idRecargo = calculatedPayment.idRecargo;

          this.deliveryForm.get('order').reset();
          this.orders.push(currOrder);
          this.pagos.push(calculatedPayment);

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
            cDistanceSubscription.unsubscribe();
            setTimeout(() => {
              this.prohibitedDistance = false;
            }, 2000);
          });
        }
      );
  }

  onFileRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  //ESTABLECE LA CATEGORÍA A EMPLEAR
  setSelectedCategory(category) {
    this.selectedCategory = category;
    this.surcharges = this.selectedCategory.surcharges;
    this.rates = this.selectedCategory.ratesToShow;
    /*if (this.selectedCategory.idTipoServicio == 2) {
      this.detailTitle = 'Detalle de transporte';
      this.nameLabel = 'Nombre del pasajero';
      this.nameHolder = '¿Quien será la persona a transportar?';
      this.dliveryHolder = '¿Hacia donde realizaremos este transporte?';
      this.instHolder =
        '¿Necesitamos instrucciones para realizar este transporte?';
      this.numValue = '0000-0000';
      this.nFactValue = 'Transporte';

      this.newForm.get('order.nFactura').setValidators(null);
      this.newForm.get('order.nFactura').updateValueAndValidity();
      this.newForm.get('order.numCel').setValidators(null);
      this.newForm.get('order.numCel').updateValueAndValidity();
    } else {
      this.newForm
        .get('order.nFactura')
        .setValidators([
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern(/^((?!\s{2,}).)*$/),
        ]);
      this.newForm
        .get('order.numCel')
        .setValidators([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
        ]);
    }*/
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
      .get('deliveryHeader.fecha')
      .setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.newForm
      .get('deliveryHeader.hora')
      .setValue(
        formatDate(
          new Date().setHours(new Date().getHours(), new Date().getMinutes()),
          'HH:mm',
          'en'
        )
      );
  }

  removeExtraCharges(extracharge) {
    this.newForm.get('order.extracharge').setValue(null);
    const ec = this.currOrder.extras.find((x) => x.idCargoExtra == extracharge);
    const id = this.currOrder.extras.indexOf(ec);
    this.currOrder.extras.splice(id, 1);
  }

  //AÑADE MONTO DE COBERTURA
  addCare() {
    if (this.newForm.get('order.montoCobertura').value !== '') {
      this.currOrder.extras.find((x) => x.idCargoExtra == 13).montoCobertura =
        +this.newForm.get('order.montoCobertura').value;
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
    const control = this.deliveryForm.get('deliveryHeader.hora');
    let h = this.newForm.get('deliveryHeader.hora').value;
    const date = this.newForm.get('deliveryHeader.fecha').value;
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
    const control = this.deliveryForm.get('deliveryHeader.hora');
    let h = this.newForm.get('deliveryHeader.hora').value;
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