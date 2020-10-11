import {Component, Inject, OnInit} from '@angular/core';
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../../services/users.service";
import {Customer} from "../../../../models/customer";
import {Surcharge} from "../../../../models/surcharge";
import {SurchargesService} from "../../../../services/surcharges.service";
import {Category} from "../../../../models/category";
import {CategoriesService} from "../../../../services/categories.service";
import {RateType} from "../../../../models/rate-type";
import {RatesService} from "../../../../services/rates.service";

@Component({
  selector: 'app-edit-surcharge-dialog',
  templateUrl: './edit-surcharge-dialog.component.html',
  styleUrls: ['./edit-surcharge-dialog.component.css']
})
export class EditSurchargeDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  edSurChForm: FormGroup
  customers: Customer[]
  filteredCustomers: Customer[]
  currSurch: Surcharge
  categories: Category[] = []
  deliveryTypes: RateType [] = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private surchargesService: SurchargesService,
    private categoriesServices: CategoriesService,
    private ratesService: RatesService,
    public dialogRef: MatDialogRef<EditSurchargeDialogComponent>
  ) {
    this.currSurch = data.surcharge
  }

  ngOnInit(): void {
    this.edSurChForm = this.formBuilder.group(
      {
        idRecargo: [this.currSurch.idRecargo],
        descRecargo:[this.currSurch.descRecargo, Validators.required],
        kilomMinimo: [this.currSurch.kilomMinimo, Validators.required],
        kilomMaximo: [this.currSurch.kilomMaximo, Validators.required],
        monto: [this.currSurch.monto, Validators.required],
        idCliente: [1, Validators.required],
        idCategoria: [this.currSurch.idCategoria, Validators.required],
        idTipoEnvio: [this.currSurch.idTipoEnvio, Validators.required]
      }
    )

    const usersSubscription = this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
      this.filteredCustomers = response.data
      usersSubscription.unsubscribe()
    })

    const categoriesSubscription = this.categoriesServices.getAllCategories().subscribe(response => {
      this.categories = response.data
      categoriesSubscription.unsubscribe()
    })

    const ratesSubscripion = this.ratesService.getRateTypes().subscribe(response => {
      this.deliveryTypes = response.data
      ratesSubscripion.unsubscribe()
    })
  }

  get f() {
    return this.edSurChForm.controls
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  onFormEditSubmit() {
    if (this.edSurChForm.valid) {
      this.loaders.loadingSubmit = true
      this.surchargesService.editSurcharge(this.edSurChForm.value)
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

  onKey(value) {
    this.filteredCustomers = this.search(value) ;
  }

  search(value: string) {
    let filter = value.toLowerCase();
    if(filter != ""){
      return  this.customers.filter(option => option.nomEmpresa.toLowerCase().includes(filter));
    }
    return this.customers
  }

}
