import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsersService} from "../../../../services/users.service";
import {SurchargesService} from "../../../../services/surcharges.service";
import {Customer} from "../../../../models/customer";
import {Category} from "../../../../models/category";
import {CategoriesService} from "../../../../services/categories.service";
import {RateType} from "../../../../models/rate-type";
import {RatesService} from "../../../../services/rates.service";

@Component({
  selector: 'app-new-surcharge-dialog',
  templateUrl: './new-surcharge-dialog.component.html',
  styleUrls: ['./new-surcharge-dialog.component.css']
})
export class NewSurchargeDialogComponent implements OnInit {
  newSurchForm: FormGroup
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  customers: Customer[] = []
  categories: Category[] = []
  filteredCustomers: Customer[]
  surchargeCategories: Category[] = []
  isGeneral: boolean = false
  surchargeCustomers: Customer[] = []
  deliveryTypes: RateType [] = []
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private usersService: UsersService,
    private categoriesServices: CategoriesService,
    private ratesService: RatesService,
    private surchargesService: SurchargesService,
    public dialogRef: MatDialogRef<NewSurchargeDialogComponent>
  ) {
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {

    this.newSurchForm = this.formBuilder.group(
      {
        descRecargo:['', Validators.required],
        kilomMinimo: ['', Validators.required],
        kilomMaximo: ['', Validators.required],
        monto: ['', Validators.required],
        idCliente: [null],
        idCategoria:[null,Validators.required],
        idTipoEnvio: [1, Validators.required]
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
  get fNew() {
    return this.newSurchForm.controls
  }

  onFormNewSubmit() {
    if (this.newSurchForm.valid) {
      this.loaders.loadingSubmit = true
      this.surchargesService.createSurcharge(this.newSurchForm.value, this.surchargeCustomers)
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

  changeGeneral(checked) {
    if (checked) {
      this.isGeneral = true
      this.fNew.idCliente.setValue(1)
    } else {
      this.isGeneral = false
      this.fNew.idCliente.setValue(null)
    }
  }

  addCustomerToSurcharge(idCust) {
    let customerToAdd: Customer = {}
    this.customers.forEach(value => {
      if (value.idCliente == idCust) {
        customerToAdd = value
      }
    })

    if (!this.surchargeCustomers.includes(customerToAdd)) {
      this.surchargeCustomers.push(customerToAdd)
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

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
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

  removeFromArray(item) {
    let i = this.surchargeCustomers.indexOf(item)
    this.surchargeCustomers.splice(i, 1)
  }

}
