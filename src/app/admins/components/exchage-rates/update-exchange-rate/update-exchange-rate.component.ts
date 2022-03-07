import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ExchangeRate } from 'src/app/models/exchange-rate';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { CreateExchangeRateComponent } from '../create-exchange-rate/create-exchange-rate.component';

@Component({
  selector: 'app-update-exchange-rate',
  templateUrl: './update-exchange-rate.component.html',
  styles: [],
})
export class UpdateExchangeRateComponent implements OnInit {
  loaders = {
    loadingSubmit: false,
  };
  uptExRate: FormGroup;
  currentExRate: ExchangeRate;
  constructor(
    private exRateService: ExchangeRatesService,
    public dialogRef: MatDialogRef<CreateExchangeRateComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dialogRef.disableClose = true;
    this.currentExRate = this.data.currExRate;

    this.uptExRate = new FormGroup({
      idTasaCambio: new FormControl(
        this.currentExRate.idTasaCambio,
        Validators.required
      ),
      idMoneda: new FormControl(2, Validators.required),
      compra: new FormControl(this.currentExRate.compra, [
        Validators.required,
        Validators.min(0.01),
      ]),
      venta: new FormControl(this.currentExRate.venta, [
        Validators.required,
        Validators.min(0.01),
      ]),
      fechaI: new FormControl(
        formatDate(this.currentExRate.fechaI, 'yyyy-MM-dd', 'en'),
        [Validators.required]
      ),
      fechaF: new FormControl(
        formatDate(this.currentExRate.fechaF, 'yyyy-MM-dd', 'en'),
        [Validators.required]
      ),
    });
  }

  ngOnInit(): void {}

  onFormSubmit() {
    if (this.uptExRate.valid) {
      this.loaders.loadingSubmit = true;
      const exRateSubsc = this.exRateService
        .updateExRate(this.uptExRate.value)
        .subscribe(
          (res) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              res.message
            );
            exRateSubsc.unsubscribe();
          },
          (err) => {
            err.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
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

    dialogRef.afterClosed().subscribe(() => {
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
