import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtraChargesService } from '../../../../services/extra-charges.service';
import { ExtraCharge } from '../../../../models/extra-charge';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-edit-extra-charge-dialog',
  templateUrl: './edit-extra-charge-dialog.component.html',
  styleUrls: ['./edit-extra-charge-dialog.component.css'],
})
export class EditExtraChargeDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  editECForm: FormGroup;
  currEc: ExtraCharge;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditExtraChargeDialogComponent>,
    private extraChargesService: ExtraChargesService
  ) {
    this.currEc = this.data.extraCharge;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.editECForm = this.formBuilder.group({
      nombre: [
        this.currEc.nombre,
        [Validators.required, Validators.maxLength(50)],
      ],
      costo: [this.currEc.costo, [Validators.required]],
      tipoCargo: [this.currEc.tipoCargo, [Validators.required]],
      tYK: [this.currEc?.item_detail?.tYK || 0],
      cobVehiculo: [this.currEc?.item_detail?.cobVehiculo || 0],
      servChofer: [this.currEc?.item_detail?.servChofer || 0],
      recCombustible: [this.currEc?.item_detail?.recCombustible || 0],
      cobTransporte: [this.currEc?.item_detail?.cobTransporte || 0],
      isv: [this.currEc?.item_detail?.isv || 0],
      tasaTuris: [this.currEc?.item_detail?.tasaTuris || 0],
      gastosReembolsables: [this.currEc?.item_detail?.gastosReembolsables || 0],
    });
  }

  get f() {
    return this.editECForm.controls;
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  onFormEditSubmit() {
    if (this.editECForm.valid) {
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

        if (sum != this.currEc.costo) {
          this.openErrorDialog(
            'Los valores ingresados para facturación, no coinciden con el monto del cargo extra'
          );
          this.loaders.loadingSubmit = false;
        } else {
          const extraChargesSubscription = this.extraChargesService
            .editExtraCharge(this.currEc.idCargoExtra, this.editECForm.value)
            .subscribe(
              (response) => {
                this.loaders.loadingSubmit = false;
                this.openSuccessDialog(
                  'Operación Realizada Correctamente',
                  response.message
                );
                extraChargesSubscription.unsubscribe();
              },
              (error) => {
                error.subscribe((error) => {
                  this.loaders.loadingSubmit = false;
                  this.openErrorDialog(error.statusText);
                  extraChargesSubscription.unsubscribe();
                });
              }
            );
        }
      } else {
        const extraChargesSubscription = this.extraChargesService
          .editExtraCharge(this.currEc.idCargoExtra, this.editECForm.value)
          .subscribe(
            (response) => {
              this.loaders.loadingSubmit = false;
              this.openSuccessDialog(
                'Operación Realizada Correctamente',
                response.message
              );
              extraChargesSubscription.unsubscribe();
            },
            (error) => {
              error.subscribe((error) => {
                this.loaders.loadingSubmit = false;
                this.openErrorDialog(error.statusText);
                extraChargesSubscription.unsubscribe();
              });
            }
          );
      }
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
}
