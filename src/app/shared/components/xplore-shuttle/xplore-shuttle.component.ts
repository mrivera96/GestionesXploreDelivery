import { animate, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/customers/components/new-delivery/confirm-dialog/confirm-dialog.component';
import { BlankSpacesValidator } from 'src/app/helpers/blankSpaces.validator';
import { ConsolidatedHourValidate } from 'src/app/helpers/consolidatedHour.validator';
import { DateValidate } from 'src/app/helpers/date.validator';
import { MustMatch } from 'src/app/helpers/mustMatch.validator';
import { Category } from 'src/app/models/category';
import { Rate } from 'src/app/models/rate';
import { Schedule } from 'src/app/models/schedule';
import { CardsService } from 'src/app/services/cards.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { GeoServiceService } from 'src/app/services/geo-service.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { RatesService } from 'src/app/services/rates.service';
import { RoutesService } from 'src/app/services/routes.service';
import { SchedulesService } from 'src/app/services/schedules.service';
import { ShuttleDetailsComponent } from '../../components/shuttle-details/shuttle-details.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
@Component({
  selector: 'app-xplore-shuttle',
  templateUrl: './xplore-shuttle.component.html',
  styleUrls: ['./xplore-shuttle.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class XploreShuttleComponent implements OnInit {
  shuttleForm: FormGroup;
  newShuttle: any;
  reservData: FormGroup;
  passengerData: FormGroup;
  vehicleData: FormGroup;
  paymentData: FormGroup;
  isEditable = true;
  paymentDetails;
  years = [];
  months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  currRate: Rate;
  routes: any[];
  schedules: Schedule[];
  idx = 0;
  selectedCountryCode = 'hn';
  phoneCode = '504';
  countryCodes = [
    'hn',
    'us',
    'es',
    'mx',
    'ca',
    'pa',
    'gt',
    'sv',
    'cr',
    'br',
    'co',
    'pr',
    'it',
    'fr',
    'jp',
  ];

  @ViewChild('vType') vType;
  @ViewChild('route') route;
  acceptTerms = false;
  categories: Category[];
  imgBasePath =
    'https://delivery.xplorerentacar.com/uploads/img/categories-img/';
  currentCategoryText = '';

  constructor(
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private ratesService: RatesService,
    private routesService: RoutesService,
    private dialog: MatDialog,
    private schedulesService: SchedulesService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private geoService: GeoServiceService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {
    this.years.push(new Date().getFullYear());

    for (let i = 0; i <= 9; i++) {
      this.years.push(this.years[i] + 1);
    }

    this.vehicleData = this.formBuilder.group({
      idCategoria: [null, Validators.required],
    });

    this.reservData = this.formBuilder.group(
      {
        idRuta: [null],
        dirRecogida: ['', [Validators.required]],
        coordsOrigen: ['', [Validators.required]],
        tarifaBase: [0, Validators.required],
        idTarifa: [null],
        instRecogida: [''],
        instEntrega: [''],
        fecha: [
          {
            value: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            disabled: false,
          },
          [Validators.required, DateValidate],
        ],
        hora: ['', Validators.required],
      },
      {
        validators: [ConsolidatedHourValidate('fecha', 'hora')],
      }
    );

    this.passengerData = this.formBuilder.group(
      {
        nFactura: ['XPLORE-SHUTTLE'],
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
            Validators.maxLength(20),
          ],
        ],
        direccion: ['', Validators.required],
        distancia: [0, Validators.required],
        tiempo: ['', Validators.required],
        coordsDestino: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
            Validators.maxLength(50),
          ],
        ],
        confirmMail: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
            Validators.maxLength(50),
          ],
        ],
      },
      {
        validators: [
          BlankSpacesValidator('nomDestinatario'),
          MustMatch('email', 'confirmMail'),
        ],
      }
    );

    this.paymentData = this.formBuilder.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(16)]],
      expMonth: [null, Validators.required],
      expYear: [null, Validators.required],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
      nomFacturacion: [''],
      rtn: [''],
    });
  }

  ngOnInit(): void {
    this.openLoader();
    const routesSubsc = this.routesService.getRoutes().subscribe((response) => {
      this.routes = response.data;
      this.dialog.closeAll();
      routesSubsc.unsubscribe();
    });

    const categoriesSubsc = this.categoriesService
      .getShuttleCategories()
      .subscribe((response) => {
        this.categories = response.data;
        categoriesSubsc.unsubscribe();
        this.dialog.closeAll();
      });
  }

  onFormSubmit() {}

  get reservForm() {
    return this.reservData.controls;
  }

  get passengerForm() {
    return this.passengerData.controls;
  }

  getRate() {
    const vehType = this.vehicleData.get('idCategoria').value;
    const route = this.reservForm.idRuta.value;

    if (vehType !== null && route !== null) {
      const ratesSubsc = this.ratesService
        .findShuttleRate(vehType, route)
        .subscribe((response) => {
          this.currRate = response.data;
          this.vehicleData.controls.idCategoria.setValue(
            this.currRate.idCategoria
          );
          this.reservForm.idTarifa.setValue(this.currRate.idTarifaDelivery);
          this.reservForm.tarifaBase.setValue(this.currRate.precio);
          this.getSchedules();
          ratesSubsc.unsubscribe();
        });
    }
  }

  setRoute(route) {
    this.reservForm.dirRecogida.setValue(route.puntoSalida);
    this.reservForm.coordsOrigen.setValue(
      route.latSalida + ', ' + route.lngSalida
    );

    this.passengerForm.direccion.setValue(route.puntoDestino);
    this.passengerForm.coordsDestino.setValue(
      route.latDestino + ', ' + route.lngDestino
    );
    this.passengerForm.distancia.setValue(route.distancia + ' km');
    this.passengerForm.tiempo.setValue(route.tiempo);
  }

  getSchedules() {
    const date = this.reservForm.fecha.value;
    const vehType = this.vehicleData.get('idCategoria').value;
    const route = this.reservForm.idRuta.value;

    if (
      vehType !== null &&
      route !== null &&
      date !== null &&
      this.reservForm.fecha.valid
    ) {
      this.schedules = [];
      const schSubsc = this.schedulesService
        .getShuttleSchedules(this.currRate.idTarifaDelivery, date)
        .subscribe((response) => {
          this.schedules = response.data;
          schSubsc.unsubscribe();
        });
    }
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }

  validateDate() {
    const currentDate = formatDate(new Date(), 'M/yyyy', 'en').split('/');
    const month = this.paymentData.controls.expMonth.value;
    const year = this.paymentData.controls.expYear.value;

    if (year < +currentDate[1]) {
      this.paymentData.controls.expYear.setErrors({ mustAfterDate: true });
    } else if (year == +currentDate[1] && month <= +currentDate[0]) {
      this.paymentData.controls.expMonth.setErrors({ mustAfterDate: true });
    }
  }

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  openSuccessDialog(succsTitle, succssMsg, id, paymentData) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.openDetail(id, paymentData);
    });
  }

  autorizePayment() {
    const paymentObject = {
      cardNumber: this.paymentData.controls.cardNumber.value,
      expDate:
        this.paymentData.controls.expMonth.value +
        '' +
        this.paymentData.controls.expYear.value.substring(2, 4),
      cvv: this.paymentData.controls.cvv.value,
      amount: this.currRate.precio,
    };
    this.openLoader();

    this.cardsService.autorizePayment(paymentObject).subscribe(
      (response) => {
        const transactionDetails = {
          reasonCode: response.CreditCardTransactionResults.ReasonCode,
          reasonCodeDescription:
            response.CreditCardTransactionResults.ReasonCodeDescription,
          authCode: response.CreditCardTransactionResults.AuthCode,
          orderNumber: response.OrderNumber,
          merchantId: response.MerchantId,
          originalResponseCode:
            response.CreditCardTransactionResults.OriginalResponseCode,
          referenceNumber:
            response.CreditCardTransactionResults.ReferenceNumber,
          signature: response.Signature,
        };

        if (
          response.CreditCardTransactionResults.ReasonCode == 1 &&
          response.CreditCardTransactionResults.ResponseCode == 1
        ) {
          const transDetails = {
            fechaPago: new Date(),
            monto: this.currRate.precio,
            tipoPago: 6,
            idCliente: 1,
            numAutorizacion: response.CreditCardTransactionResults.AuthCode,
            idTransaccion: null,
          };

          this.cardsService.saveFailTransaction(transactionDetails).subscribe(
            (response) => {
              transDetails.idTransaccion = response.transId;

              this.paymentsService.addShuttlePayment(transDetails).subscribe(
                () => {
                  const visibleDigits = 4;
                  let maskedSection = paymentObject.cardNumber
                    .toString()
                    .slice(0, -visibleDigits);
                  let visibleSection = paymentObject.cardNumber
                    .toString()
                    .slice(-visibleDigits);

                  const paymentData = {
                    cardNumber:
                      maskedSection.replace(/./g, '*') + visibleSection,
                    authCode: transactionDetails.authCode,
                    orderNumber: transactionDetails.orderNumber,
                    referenceNumber: transactionDetails.referenceNumber,
                    nomFacturacion:
                      this.paymentData.controls.nomFacturacion.value,
                    rtn: this.paymentData.controls.rtn.value,
                  };

                  const phone = this.passengerData.controls.numCel.value;
                  this.passengerData.controls.numCel.setValue(
                    '+' + this.phoneCode + ' ' + phone
                  );
                  const shuttleSubsc = this.deliveriesService
                    .createShuttle(
                      this.vehicleData.value,
                      this.reservData.value,
                      this.passengerData.value,
                      paymentData
                    )
                    .subscribe(
                      (response) => {
                        this.openSuccessDialog(
                          'Operación Realizada Correctamente',
                          response.message,
                          response.nDelivery,
                          paymentData
                        );
                        shuttleSubsc.unsubscribe();
                      },
                      (error) => {
                        error.subscribe((err) => {
                          this.dialog.closeAll();
                          this.openErrorDialog(err.statusText);
                          this.dialog.closeAll();
                        });
                      }
                    );
                },
                (error) => {
                  error.subscribe((err) => {
                    this.openErrorDialog(err.statusText);
                    this.dialog.closeAll();
                  });
                }
              );
            },
            (error) => {
              error.subscribe((err) => {
                this.openErrorDialog(err.statusText);
                this.dialog.closeAll();
              });
            }
          );
        } else {
          this.openErrorDialog(transactionDetails.reasonCodeDescription);
          this.cardsService
            .saveFailTransaction(transactionDetails)
            .subscribe((response) => {
              this.openErrorDialog(transactionDetails.reasonCodeDescription);
              this.dialog.closeAll();
            });
        }
      },
      (error) => {
        error.subscribe((err) => {
          this.openErrorDialog(err.statusText);
          this.dialog.closeAll();
        });
      }
    );
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.autorizePayment();
      } else {
      }
    });
  }

  next() {
    this.idx++;
  }

  previous() {
    this.idx--;
  }

  changeSelectedCountryCode(event): void {
    this.selectedCountryCode = event.toString();
    this.phoneCode = this.geoService.findCountryCodeByTwoLetterAbbreviation(
      this.selectedCountryCode
    );
  }

  generateResume() {
    if (this.passengerData.valid) {
      return {
        vType: this.currentCategoryText,
        route: this.route?._elementRef.nativeElement.innerText,
        date:
          this.reservForm.fecha?.value +
          ' ' +
          this.reservForm.hora?.value.substring(0, 5),
        total: this.currRate?.precio,
      };
    }
  }

  setModel(model) {
    this.vehicleData.controls.idCategoria.setValue(model.idCategoria);
    this.currentCategoryText = model.descCategoria;
  }

  openDetail(id, paymentData) {
    const ref = this.dialog.open(ShuttleDetailsComponent, {
      data: {
        shuttleId: id,
        paymentData: paymentData,
      },
    });

    ref.afterClosed().subscribe(() => {
      this.exit();
    });
  }

  testDetailDialog(){
    const id = 394;
    const paymentData = {
      cardNumber:
        "************4931",
      authCode: "123456",
      orderNumber: "VQUWJNJY",
      referenceNumber: "213619438603",
      nomFacturacion:
        "Melvin Rivera",
      rtn: "07031997016325",
    };

    const ref = this.dialog.open(ShuttleDetailsComponent, {
      data: {
        shuttleId: id,
        paymentData: paymentData,
      },
    });
  }

  exit() {
    location.reload();
  }
}
