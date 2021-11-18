import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RatesService} from '../../../../services/rates.service';
import {CategoriesService} from '../../../../services/categories.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ErrorModalComponent} from '../../../../components/shared/error-modal/error-modal.component';
import {Rate} from '../../../../models/rate';
import {Category} from '../../../../models/category';
import {Customer} from '../../../../models/customer';
import {SuccessModalComponent} from '../../../../components/shared/success-modal/success-modal.component';
import {RateType} from 'src/app/models/rate-type';

@Component({
  selector: 'app-edit-rate-dialog',
  templateUrl: './edit-rate-dialog.component.html',
  styleUrls: ['./edit-rate-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditRateDialogComponent implements OnInit {
  edRateForm: FormGroup
  categories: Category[]
  customers: Customer[]
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  currRate: Rate
  rateTypes: RateType[]

  constructor(
    private ratesService: RatesService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>
  ) {
    this.currRate = data.rate
    this.dialogRef.disableClose = true
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
        tYK: [this.currRate?.item_detail?.tYK || 0, Validators.min(0)],
        cobVehiculo: [this.currRate?.item_detail?.cobVehiculo || 0, Validators.min(0)],
        servChofer: [this.currRate?.item_detail?.servChofer || 0, Validators.min(0)],
        recCombustible: [this.currRate?.item_detail?.recCombustible || 0, Validators.min(0)],
        cobTransporte: [this.currRate?.item_detail?.cobTransporte || 0, Validators.min(0)],
        isv: [this.currRate?.item_detail?.isv || 0, Validators.min(0)],
        tasaTuris: [this.currRate?.item_detail?.tasaTuris || 0, Validators.min(0)],
        gastosReembolsables: [this.currRate?.item_detail?.gastosReembolsables || 0, Validators.min(0)],
        transportePersonas:[this.currRate?.item_detail?.transportePersonas || 0, Validators.min(0)],
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

      const tk = parseFloat(this.f.tYK?.value) ?? 0
      const cobVeh = parseFloat(this.f.cobVehiculo?.value) ?? 0
      const servChof = parseFloat(this.f.servChofer?.value) ?? 0
      const recComb = parseFloat(this.f.recCombustible?.value) ?? 0
      const cobTrans = parseFloat(this.f.cobTransporte?.value) ?? 0
      const isv = parseFloat(this.f.isv?.value) ?? 0
      const tasaTur = parseFloat(this.f.tasaTuris?.value) ?? 0
      const gastRe = parseFloat(this.f.gastosReembolsables?.value) ?? 0
      const transPer = parseFloat(this.f.transportePersonas?.value) ?? 0

      if (tk != 0 || cobVeh != 0 || servChof != 0 || recComb != 0
        || cobTrans != 0 || isv != 0 || tasaTur != 0 || gastRe != 0 || transPer != 0) {
        const sum = tk + cobVeh + servChof + recComb + cobTrans + isv + tasaTur + gastRe + transPer

        let toCompare = +this.currRate.precio
        if (this.f.precio.value != this.currRate.precio) {
          toCompare = +this.f.precio.value
        }

        if (sum > toCompare || sum < toCompare) {
          this.openErrorDialog('Los valores ingresados para facturación, no coinciden con el monto de la tarifa')
          this.loaders.loadingSubmit = false
        } else {
          const rateSubsc = this.ratesService.editRate(this.edRateForm.value)
            .subscribe(response => {
                this.loaders.loadingSubmit = false
                this.openSuccessDialog('Operación Realizada Correctamente', response.message)
                rateSubsc.unsubscribe()
              },
              error => {
                error.subscribe(error => {
                  this.loaders.loadingSubmit = false
                  this.openErrorDialog(error.statusText)
                  rateSubsc.unsubscribe()
                });
              });
        }
      } else {
        const rateSubsc = this.ratesService.editRate(this.edRateForm.value)
          .subscribe(response => {
              this.loaders.loadingSubmit = false
              this.openSuccessDialog('Operación Realizada Correctamente', response.message)
              rateSubsc.unsubscribe()
            },
            error => {
              error.subscribe(error => {
                this.loaders.loadingSubmit = false
                this.openErrorDialog(error.statusText)
                rateSubsc.unsubscribe()
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
    })
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(true)
    })
  }

}
