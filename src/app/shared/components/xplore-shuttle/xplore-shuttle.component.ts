import { animate, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlankSpacesValidator } from 'src/app/helpers/blankSpaces.validator';
import { ConsolidatedHourValidate } from 'src/app/helpers/consolidatedHour.validator';
import { DateValidate } from 'src/app/helpers/date.validator';
import { Rate } from 'src/app/models/rate';
import { Schedule } from 'src/app/models/schedule';
import { CardsService } from 'src/app/services/cards.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { RatesService } from 'src/app/services/rates.service';
import { RoutesService } from 'src/app/services/routes.service';
import { SchedulesService } from 'src/app/services/schedules.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';

@Component({
  selector: 'app-xplore-shuttle',
  templateUrl: './xplore-shuttle.component.html',
  styles: [],
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
  paymentData: FormGroup;
  isEditable = true;
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

  constructor(
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private ratesService: RatesService,
    private routesService: RoutesService,
    private dialog: MatDialog,
    private schedulesService: SchedulesService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService
  ) {
    this.years.push(new Date().getFullYear());

    for (let i = 0; i <= 9; i++) {
      this.years.push(this.years[i] + 1);
    }

    this.reservData = this.formBuilder.group(
      {
        idTipoVehiculo: [null],
        idRuta: [null],
        dirRecogida: ['', [Validators.required]],
        coordsOrigen: ['', [Validators.required]],
        tarifaBase: [0, Validators.required],
        idCategoria: null,
        idTarifa: [null],
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
            Validators.maxLength(9),
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
      },
      {
        validators: [BlankSpacesValidator('nomDestinatario')],
      }
    );

    this.paymentData = this.formBuilder.group({
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expMonth: [null, Validators.required],
      expYear: [null, Validators.required],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
    });
  }

  ngOnInit(): void {
    this.openLoader();
    const routesSubsc = this.routesService.getRoutes().subscribe((response) => {
      this.routes = response.data;
      this.dialog.closeAll();
      routesSubsc.unsubscribe();
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
    const vehType = this.reservForm.idTipoVehiculo.value;
    const route = this.reservForm.idRuta.value;

    if (vehType !== null && route !== null) {
      const ratesSubsc = this.ratesService
        .findShuttleRate(vehType, route)
        .subscribe((response) => {
          this.currRate = response.data;
          this.reservForm.idCategoria.setValue(this.currRate.idCategoria);
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
    const vehType = this.reservForm.idTipoVehiculo.value;
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

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      location.reload();
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
        

          this.cardsService
            .saveFailTransaction(transactionDetails)
            .subscribe((response) => {
             
              transDetails.idTransaccion = response.transId;
          
              this.paymentsService.addPayment(transDetails).subscribe(
                () => {
                  
                  const shuttleSubsc = this.deliveriesService
                    .createShuttle(
                      this.reservData.value,
                      this.passengerData.value
                    )
                    .subscribe(
                      (response) => {
                        
                        this.openSuccessDialog(
                          'Operación Realizada Correctamente',
                          response.message
                        );
                        shuttleSubsc.unsubscribe();
                      },
                      (error) => {
                        error.subscribe((err) => {
                        
                          this.openErrorDialog(err.statusText);
                        });
                      }
                    );
                },
                (error) => {
                  error.subscribe((err) => {
                   
                    this.openErrorDialog(err.statusText);
                    
                  });
                }
              );
            },
            (error) => {
              error.subscribe((err) => {
              
                this.openErrorDialog(err.statusText);
                
              });
            });
        } else {
          this.openErrorDialog(transactionDetails.reasonCodeDescription);
          this.cardsService
            .saveFailTransaction(transactionDetails)
            .subscribe((response) => {
             
              this.openErrorDialog(transactionDetails.reasonCodeDescription);
            });
        }
      },
      (error) => {
        error.subscribe((err) => {
  
          this.openErrorDialog(err.statusText);
          
        });
      }
    );
  }
}
