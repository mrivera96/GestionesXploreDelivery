import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RatesService} from "../../../../services/rates.service";
import {CategoriesService} from "../../../../services/categories.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {Rate} from "../../../../models/rate";
import {Category} from "../../../../models/category";
import {Customer} from "../../../../models/customer";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import { RateType } from 'src/app/models/rate-type';

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
        idTipoTarifa: [this.currRate.idTipoTarifa, Validators.required]
      }
    )

    const cateoriesSubscription = this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
      cateoriesSubscription.unsubscribe()
    })

    const ratesSubscription = this.ratesService.getRateTypes().subscribe(response => {
      this.rateTypes = response.data
      ratesSubscription.unsubscribe()
    })
  }

  get f() {
    return this.edRateForm.controls
  }

  onFormEditSubmit() {
    if (this.edRateForm.valid) {
      this.loaders.loadingSubmit = true
      this.ratesService.editRate(this.edRateForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente',response.message)
          },
          error => {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.openErrorDialog(error.statusText)
            })
          })
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
