import {Component, Inject, OnInit} from '@angular/core';
import {RatesService} from "../../../../services/rates.service";
import {CategoriesService} from "../../../../services/categories.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../../services/users.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Category} from "../../../../models/category";
import {Customer} from "../../../../models/customer";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";

@Component({
  selector: 'app-new-rate-dialog',
  templateUrl: './new-rate-dialog.component.html',
  styleUrls: ['./new-rate-dialog.component.css']
})
export class NewRateDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  newRateForm: FormGroup
  categories: Category[]
  customers: Customer[]
  constructor(
    private ratesService: RatesService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.newRateForm = this.formBuilder.group(
      {
        descTarifa: ['', Validators.required],
        idCategoria: [null, Validators.required],
        entregasMinimas: ['', Validators.required],
        entregasMaximas: ['', Validators.required],
        precio: ['', Validators.required],
        idCliente: [null, Validators.required]
      }
    )

    this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
    })

    this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
    })
  }

  get fNew() {
    return this.newRateForm.controls
  }

  onFormNewSubmit() {
    if (this.newRateForm.valid) {
      this.loaders.loadingSubmit = true
      this.ratesService.createRate(this.newRateForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente', response.message)
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
      location.reload(true)
    })
  }

}
