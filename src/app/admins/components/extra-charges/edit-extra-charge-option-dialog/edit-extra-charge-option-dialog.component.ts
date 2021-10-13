import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtraChargesService } from '../../../../services/extra-charges.service';
import { ExtraChargeOption } from '../../../../models/extra-charge-option';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-edit-extra-charge-option-dialog',
  templateUrl: './edit-extra-charge-option-dialog.component.html',
  styleUrls: ['./edit-extra-charge-option-dialog.component.css'],
})
export class EditExtraChargeOptionDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  exChrgOptForm: FormGroup;
  currOption: ExtraChargeOption = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    private extraChargesServices: ExtraChargesService
  ) {
    this.currOption = this.data.option;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.exChrgOptForm = this.formBuilder.group({
      costo: [
        this.currOption.costo,
        [Validators.required, Validators.min(0.1)],
      ],
      tiempo: [
        this.currOption.tiempo,
        [Validators.required, Validators.min(1)],
      ],
      tYK: [this.currOption?.item_detail?.tYK || 0],
      cobVehiculo: [this.currOption?.item_detail?.cobVehiculo || 0],
      servChofer: [this.currOption?.item_detail?.servChofer || 0],
      recCombustible: [this.currOption?.item_detail?.recCombustible || 0],
      cobTransporte: [this.currOption?.item_detail?.cobTransporte || 0],
      isv: [this.currOption?.item_detail?.isv || 0],
      tasaTuris: [this.currOption?.item_detail?.tasaTuris || 0],
      gastosReembolsables: [
        this.currOption?.item_detail?.gastosReembolsables || 0,
      ],
    });
  }

  get f() {
    return this.exChrgOptForm.controls;
  }

  onFormSubmit() {
    if (this.exChrgOptForm.valid) {
      this.loaders.loadingSubmit = true;

      const tk = parseFloat(this.f.tYK.value) ?? 0;
      const cobVeh = parseFloat(this.f.cobVehiculo.value) ?? 0;
      const servChof = parseFloat(this.f.servChofer.value) ?? 0;
      const recComb = parseFloat(this.f.recCombustible.value) ?? 0;
      const cobTrans = parseFloat(this.f.cobTransporte.value) ?? 0;
      const isv = parseFloat(this.f.isv.value) ?? 0;
      const tasaTur = parseFloat(this.f.tasaTuris.value) ?? 0;
      const gastRe = parseFloat(this.f.gastosReembolsables.value) ?? 0;

      if (
        tk != 0 ||
        cobVeh != 0 ||
        servChof != 0 ||
        recComb != 0 ||
        cobTrans != 0 ||
        isv != 0 ||
        tasaTur != 0 ||
        gastRe != 0
      ) {
        const sum =
          tk + cobVeh + servChof + recComb + cobTrans + isv + tasaTur + gastRe;

        if (sum != this.currOption.costo) {
          this.openErrorDialog(
            'Los valores ingresados para facturación, no coinciden con el monto del cargo extra'
          );
          this.loaders.loadingSubmit = false;
        } else {
          const extraChargesSubscription = this.extraChargesServices
            .editExtraChargeOption(
              this.currOption.idCargoExtra,
              this.currOption.idDetalleOpcion,
              this.exChrgOptForm.value
            )
            .subscribe(
              (response) => {
                this.openSuccessDialog(
                  'Operación Realizada Correctamente',
                  response.message
                );
                this.loaders.loadingSubmit = false;
                extraChargesSubscription.unsubscribe();
              },
              (error) => {
                error.subscribe((error) => {
                  this.openErrorDialog(error.statusText);
                  this.loaders.loadingSubmit = false;
                  extraChargesSubscription.unsubscribe();
                });
              }
            );
        }
      } else {
        const extraChargesSubscription = this.extraChargesServices
          .editExtraChargeOption(
            this.currOption.idCargoExtra,
            this.currOption.idDetalleOpcion,
            this.exChrgOptForm.value
          )
          .subscribe(
            (response) => {
              this.openSuccessDialog(
                'Operación Realizada Correctamente',
                response.message
              );
              this.loaders.loadingSubmit = false;
              extraChargesSubscription.unsubscribe();
            },
            (error) => {
              error.subscribe((error) => {
                this.openErrorDialog(error.statusText);
                this.loaders.loadingSubmit = false;
                extraChargesSubscription.unsubscribe();
              });
            }
          );
      }
    }
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
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
      this.dialogRef.close(true);
    });
  }
}
