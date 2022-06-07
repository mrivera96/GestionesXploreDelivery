import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PaymentDateValidator } from 'src/app/helpers/paymentDate.validator';
import { Bank } from 'src/app/models/bank';
import { Payment } from 'src/app/models/payment';
import { PaymentType } from 'src/app/models/payment-type';
import { PaymentsService } from 'src/app/services/payments.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css'],
})
export class EditPaymentComponent implements OnInit {
  payForm: FormGroup;
  paymentTipes: PaymentType[];
  loaders = {
    loadingSubmit: false,
  };
  banks: Bank[];
  currPay: Payment;

  constructor(
    public dialogRef: MatDialogRef<EditPaymentComponent>,
    private formBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dialogRef.disableClose = true;
    this.currPay = this.data.currentPay;
    this.banks = [
      { descBanco: 'BAC', numCuenta: '730226831' },
      { descBanco: 'FICOHSA', numCuenta: '0-0-200007101178' },
    ];

    this.payForm = this.formBuilder.group(
      {
        idPago:[this.currPay.idPago],
        fechaPago: [
          formatDate(this.currPay.fechaPago, 'yyyy-MM-dd', 'en'),
          Validators.required,
        ],
        monto: [
          this.currPay.monto,
          [Validators.required, Validators.maxLength(20)],
        ],
        tipoPago: [this.currPay.tipoPago, [Validators.required]],
        numAutorizacion: [
          this.currPay.numAutorizacion,
          [Validators.minLength(6), Validators.maxLength(6)],
        ],
        referencia: [this.currPay.referencia, [Validators.maxLength(12)]],
        banco: [this.currPay.banco],
      },
      {
        validators: [PaymentDateValidator('fechaPago')],
      }
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  get f() {
    return this.payForm.controls;
  }

  loadData() {
    const paymentTypeSubscription = this.paymentsService
      .getPaymentTypes()
      .subscribe((response) => {
        this.paymentTipes = response.data;
        paymentTypeSubscription.unsubscribe();
      });
  }

  changeValidators(tipoPago) {
    if (tipoPago == 6) {
      this.f.numAutorizacion.setValidators([Validators.required]);
      this.f.referencia.setValidators(null);
      this.f.banco.setValidators(null);
      this.f.referencia.setErrors(null);
      this.f.banco.setErrors(null);
    } else if (tipoPago == 7) {
      this.f.referencia.setValidators([Validators.required]);
      this.f.banco.setValidators([Validators.required]);
      this.f.numAutorizacion.setValidators(null);
      this.f.numAutorizacion.setErrors(null);
    } else {
      this.f.referencia.setValidators(null);
      this.f.banco.setValidators(null);
      this.f.numAutorizacion.setValidators(null);
      this.f.referencia.setErrors(null);
      this.f.banco.setErrors(null);
      this.f.numAutorizacion.setErrors(null);
    }
  }

  onFormSubmit() {
    if (this.payForm.valid) {
      this.loaders.loadingSubmit = true;
      const paymentsSubscription = this.paymentsService
        .updatePayment(this.payForm.value)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            paymentsSubscription.unsubscribe();
          },
          (error) => {
            error.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
              paymentsSubscription.unsubscribe();
            });
          }
        );
    }
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef.close(true);
    });
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }
}
