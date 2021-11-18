import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BlankSpacesValidator } from 'src/app/helpers/blankSpaces.validator';
import { NoUrlValidator } from 'src/app/helpers/noUrl.validator';
import { Category } from 'src/app/models/category';
import { Delivery } from 'src/app/models/delivery';
import { ExtraCharge } from 'src/app/models/extra-charge';
import { ExtraChargeCategory } from 'src/app/models/extra-charge-category';
import { ExtraChargeOption } from 'src/app/models/extra-charge-option';
import { Rate } from 'src/app/models/rate';
import { Surcharge } from 'src/app/models/surcharge';
import { CategoriesService } from 'src/app/services/categories.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { OperationsService } from 'src/app/services/operations.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-order-to-delivery',
  templateUrl: './add-order-to-delivery.component.html',
  styles: [],
})
export class AddOrderToDeliveryComponent implements OnInit {
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
  directionsRenderer;
  directionsService;
  currentDelivery: Delivery;
  prohibitedDistance = false;
  prohibitedDistanceMsg = '';
  gcordsDestination = false;
  selectedCategory: Category = {};
  selectedRate: Rate = {};
  extraCharges: ExtraChargeCategory[] = [];
  searchingDest = false;
  geocoder: google.maps.Geocoder;
  nOrdrForm: FormGroup;
  currOrder: any = {
    extras: ([] = []),
  };
  placesDestination = [];
  @ViewChild('destinationCords') destinationCords: ElementRef;
  surcharges: Surcharge[];
  selectedExtraCharge: ExtraCharge = null;
  selectedExtraChargeOption: ExtraChargeOption = {};
  totalDistance: any;
  totalTime: any;
  avgDistance: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddOrderToDeliveryComponent>,
    private deliveriesService: DeliveriesService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private operationsService: OperationsService,
    private categoriesService: CategoriesService,
    private http: HttpClient
  ) {
    this.dialogRef.disableClose = true;
    this.currentDelivery = this.data.delivery;
    this.geocoder = new google.maps.Geocoder();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();

    this.nOrdrForm = this.formBuilder.group(
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

    this.surcharges = this.currentDelivery.category.surcharges;
  }

  ngOnInit(): void {
    this.loadData();
  }

  //COMUNICACIÓN CON LA API PARA OBTENER LOS DATOS NECESARIOS(CATEGORÍAS Y TARIFAS)
  loadData() {
    this.loaders.loadingData = true;
  }

  //MÉTODO QUE EJECUTA LA ADICIÓN DE UN NUEVO ENVÍO
  onOrderAdd() {
    if (this.nOrdrForm.valid) {
      this.loaders.loadingAdd = true;

      this.currOrder.nFactura = this.nOrdrForm.get('nFactura').value;
      this.currOrder.nomDestinatario =
        this.nOrdrForm.get('nomDestinatario').value;
      this.currOrder.numCel = this.nOrdrForm.get('numCel').value;
      this.currOrder.direccion = this.nOrdrForm.get('direccion').value;
      this.currOrder.instrucciones = this.nOrdrForm.get('instrucciones').value;
      this.currOrder.coordsDestino = '';
      this.currOrder.distancia = '';
      this.currOrder.tiempo = '';
      this.currOrder.tarifaBase = 0;
      this.currOrder.recargo = 0;
      this.currOrder.cTotal = 0;
      this.currOrder.cargosExtra = 0;

      this.calculateDistance();
    }
  }

  //CALCULA LA DISTANCIA PARA LA PREVISUALIZACIÓN
  calculatedistanceBefore() {
    this.directionsRenderer.setMap(null);
    if (
      this.currentDelivery.detalle[this.currentDelivery.detalle.length - 1]
        .direccion != '' &&
      this.nOrdrForm.get('direccion').value != ''
    ) {
      this.befDistance = 0;
      this.befTime = 0;
      this.befCost = 0;
      this.loaders.loadingDistBef = true;

      const distanceSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          function: 'calculateDistance',
          salida:
            this.currentDelivery.detalle[
              this.currentDelivery.detalle.length - 1
            ].direccion,
          entrega: this.nOrdrForm.get('direccion').value,
          tarifa: this.currentDelivery.tarifaBase,
        })
        .subscribe(
          (response) => {
            this.loaders.loadingDistBef = false;
            this.befDistance = response.distancia;
            const calculatedPayment = this.calculateOrderPayment();
            this.befTime = response.tiempo;
            this.befCost = calculatedPayment.total;

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
    const dirEntrega = this.nOrdrForm.get('direccion').value;
    const geocoder = new google.maps.Geocoder();
    const originLL = this.currentDelivery.coordsOrigen;

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
    this.searchingDest = true;

    const placeSubscription = this.operationsService
      .searchPlace(lugar)
      .subscribe((response) => {
        this.placesDestination = response;
        this.searchingDest = false;
        placeSubscription.unsubscribe();
      });
  }

  //CALCULA EL PAGO DEL ENVÍO SEGÚN LA DISTANCIA
  calculateOrderPayment() {
    let orderPayment = {
      baseRate: this.currentDelivery.tarifaBase,
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

  //CÁLCULO DE LA DISTANCIA PARA AGREGAR EL ENVÍO
  calculateDistance() {
    const salida =
      this.currentDelivery.detalle[this.currentDelivery.detalle.length - 1]
        .direccion;
    const entrega = this.currOrder.direccion;
    const tarifa = this.currentDelivery.tarifaBase;

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
            const calculatedPayment = this.calculateOrderPayment();
            this.currOrder.tarifaBase = calculatedPayment.baseRate;
            this.currOrder.recargo = calculatedPayment.surcharges;
            this.currOrder.cargosExtra = calculatedPayment.cargosExtra;
            this.currOrder.cTotal = calculatedPayment.total;
            this.currOrder.idRecargo =
              this.currentDelivery.detalle[
                this.currentDelivery.detalle.length - 1
              ].idRecargo;

            this.onFormSubmit();
            cDistanceSubscription.unsubscribe();
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
          this.nOrdrForm.get('direccion').setValue(destCords);
          this.calculatedistanceBefore();
        });
      } else {
        alert('Por favor activa la ubicación para esta función');
      }
    } else {
      this.nOrdrForm.get('direccion').setValue('');
    }
  }

  //ESTABLECE LAS COORDENADAS PARA EL PUNTO DESTINO
  setCordsDestination() {
    this.nOrdrForm
      .get('direccion')
      .setValue(this.destinationCords.nativeElement.value);
    this.gcordsDestination = false;
    this.calculatedistanceBefore();
  }

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    dialog.afterClosed().subscribe((result) => {
      this.loaders.loadingSubmit = false;
    });
  }

  openSuccessDialog(succsTitle: string, succssMsg: string) {
    const ref = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    ref.afterClosed().subscribe(()=>{
      this.dialogRef.close(1);
    });
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

  removeExtraCharges(extracharge) {
    this.nOrdrForm.get('extracharge').setValue(null);
    const ec = this.currOrder.extras.find((x) => x.idCargoExtra == extracharge);
    const id = this.currOrder.extras.indexOf(ec);
    this.currOrder.extras.splice(id, 1);
  }

  //AÑADE MONTO DE COBERTURA
  addCare() {
    if (this.nOrdrForm.get('montoCobertura').value !== '') {
      this.currOrder.extras.find((x) => x.idCargoExtra == 13).montoCobertura =
        +this.nOrdrForm.get('montoCobertura').value;
    }
  }

  onFormSubmit() {
    const delsubsc = this.deliveriesService.addOrder(this.currOrder, this.currentDelivery.idDelivery).subscribe(
      (response) => {
        this.loaders.loadingAdd = false;
        this.openSuccessDialog(
          'Operación Realizada Correctamente',
          response.message
        );
        delsubsc.unsubscribe();
      },
      (error) => {
        error.subscribe((err) => {
          this.openErrorDialog(err.statusText);
          this.loaders.loadingAdd = false;
          delsubsc.unsubscribe();
        });
      }
    );
  }
}
