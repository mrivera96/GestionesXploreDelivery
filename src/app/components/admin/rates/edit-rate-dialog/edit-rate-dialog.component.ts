import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatesService } from '../../../../services/rates.service';
import { CategoriesService } from '../../../../services/categories.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from '../../../shared/error-modal/error-modal.component';
import { Rate } from '../../../../models/rate';
import { Category } from '../../../../models/category';
import { Customer } from '../../../../models/customer';
import { SuccessModalComponent } from '../../../shared/success-modal/success-modal.component';
import { RateType } from 'src/app/models/rate-type';

@Component({
  selector: 'app-edit-rate-dialog',
  templateUrl: './edit-rate-dialog.component.html',
  styleUrls: ['./edit-rate-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditRateDialogComponent implements OnInit {
  edRateForm: FormGroup;
  categories: Category[];
  customers: Customer[];
  loaders = {
    loadingData: false,
    loadingSubmit: false
  };
  currRate: Rate;
  rateTypes: RateType[];


  constructor(
    private ratesService: RatesService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>
  ) {
    this.currRate = data.rate;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.edRateForm = this.formBuilder.group(
      {
        idTarifaDelivery: [this.currRate.idTarifaDelivery],
        descTarifa: [this.currRate.descTarifa, Validators.required],
        idCategoria: [this.currRate.idCategoria, Validators.required],
        entregasMinimas: [this.currRate.entregasMinimas, Validators.required],
        entregasMaximas: [this.currRate.entregasMaximas, Validators.required],
        precio: [this.currRate.precio, Validators.required],
        idTipoTarifa: [this.currRate.idTipoTarifa, Validators.required],
        tYK: [this.currRate?.item_detail?.tYK || 0],
        cobVehiculo: [this.currRate?.item_detail?.cobVehiculo || 0],
        servChofer: [this.currRate?.item_detail?.servChofer || 0],
        recCombustible: [this.currRate?.item_detail?.recCombustible || 0],
        cobTransporte: [this.currRate?.item_detail?.cobTransporte || 0],
        isv: [this.currRate?.item_detail?.isv || 0],
        tasaTuris: [this.currRate?.item_detail?.tasaTuris || 0],
        gastosReembolsables: [this.currRate?.item_detail?.gastosReembolsables || 0]
      }
    );

    const cateoriesSubscription = this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data;
      cateoriesSubscription.unsubscribe();
    });

    const ratesSubscription = this.ratesService.getRateTypes().subscribe(response => {
      this.rateTypes = response.data;
      ratesSubscription.unsubscribe();
    });
  }

  get f() {
    return this.edRateForm.controls;
  }

  onFormEditSubmit() {
    if (this.edRateForm.valid) {
      this.loaders.loadingSubmit = true;

      const tk = this.f.tYK.value
      const cobVeh = this.f.cobVehiculo.value
      const servChof = this.f.servChofer.value
      const recComb = this.f.recCombustible.value
      const cobTrans = this.f.cobTransporte.value
      const isv = this.f.isv.value
      const tasaTur = this.f.tasaTuris.value
      const gastRe = this.f.gastosReembolsables.value

      if (tk != 0 || cobVeh != 0 || servChof != 0 || recComb != 0
        || cobTrans != 0 || isv != 0 || tasaTur != 0 || gastRe != 0) {
        const sum = tk + cobVeh + servChof + recComb + cobTrans + isv + tasaTur + gastRe

        if (sum != this.currRate.precio) {
          this.openErrorDialog('Los valores ingresados para facturación, no coinciden con el monto de la tarifa')
          this.loaders.loadingSubmit = false
        } else {
          this.ratesService.editRate(this.edRateForm.value)
            .subscribe(response => {
              this.loaders.loadingSubmit = false;
              this.openSuccessDialog('Operación Realizada Correctamente', response.message);
            },
              error => {
                error.subscribe(error => {
                  this.loaders.loadingSubmit = false;
                  this.openErrorDialog(error.statusText);
                });
              });
        }
      }else{
        this.ratesService.editRate(this.edRateForm.value)
            .subscribe(response => {
              this.loaders.loadingSubmit = false;
              this.openSuccessDialog('Operación Realizada Correctamente', response.message);
            },
              error => {
                error.subscribe(error => {
                  this.loaders.loadingSubmit = false;
                  this.openErrorDialog(error.statusText);
                })
              })
      }

    }
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    });
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(true);
    });
  }

}
