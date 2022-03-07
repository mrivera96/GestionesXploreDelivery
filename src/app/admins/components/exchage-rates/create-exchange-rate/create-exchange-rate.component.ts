import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-create-exchange-rate',
  templateUrl: './create-exchange-rate.component.html',
  styles: [],
})
export class CreateExchangeRateComponent implements OnInit {
  loaders = {
    loadingSubmit: false,
  };
  newExRate: FormGroup;

  constructor(
    private exRateService: ExchangeRatesService,
    public dialogRef: MatDialogRef<CreateExchangeRateComponent>,
    public dialog: MatDialog
  ) {
    this.dialogRef.disableClose = true;

    this.newExRate = new FormGroup({
      idMoneda: new FormControl(2, Validators.required),
      compra: new FormControl(0.0, [Validators.required, Validators.min(0.01)]),
      venta: new FormControl(0.0, [Validators.required, Validators.min(0.01)]),
      fechaI: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [
        Validators.required,
      ]),
      fechaF: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {}

  onFormSubmit() {
    if (this.newExRate.valid) {
      this.loaders.loadingSubmit = true;
      const exRateSubsc = this.exRateService
        .createExRate(this.newExRate.value)
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
