import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RatesService} from "../../../../services/rates.service";
import {CategoriesService} from "../../../../services/categories.service";
import {UsersService} from "../../../../services/users.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {Rate} from "../../../../models/rate";
import {Category} from "../../../../models/category";
import {Customer} from "../../../../models/customer";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";

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
  constructor(
    private ratesService: RatesService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>
  ) {
    this.currRate = data.rate
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
        idCliente: [this.currRate.idCliente, Validators.required]
      }
    )

    this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
    })

    this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
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
