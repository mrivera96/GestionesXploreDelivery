import {Component, Inject, OnInit} from '@angular/core';
import {Customer} from "../../../../models/customer";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RatesService} from "../../../../services/rates.service";
import {UsersService} from "../../../../services/users.service";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {SurchargesService} from "../../../../services/surcharges.service";

@Component({
  selector: 'app-add-customer-surcharge-dialog',
  templateUrl: './add-customer-surcharge-dialog.component.html',
  styles: []
})
export class AddCustomerSurchargeDialogComponent implements OnInit {

  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  surchargeId: number
  customers: Customer[]
  custForm: FormGroup
  filteredCustomers: Customer[]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private surchargeService: SurchargesService,
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {
    this.surchargeId = this.data.surchargeId
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.custForm = this.formBuilder.group({
      idCliente: [null, [Validators.required]]
    })
  }

  loadData() {
    this.loaders.loadingData = true
    const usersSubscription = this.usersService.getCustomers()
      .subscribe(response => {
        this.customers = response.data
        this.filteredCustomers = response.data
        this.loaders.loadingData = false
        usersSubscription.unsubscribe()
      })
  }

  onFormSubmit() {
    if (this.custForm.valid) {
      this.loaders.loadingSubmit = true
      const surchargesSubscription = this.surchargeService.addCustomerToSurcharge(this.surchargeId, this.custForm.get('idCliente').value)
        .subscribe(response => {
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          this.loaders.loadingSubmit = false
          surchargesSubscription.unsubscribe()

        }, error => {
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
            this.loaders.loadingSubmit = false
            surchargesSubscription.unsubscribe()
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

  onKey(value) {
    this.filteredCustomers = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    filter = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (filter != "") {
      return this.customers.filter(option => option.nomEmpresa.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter));
    }
    return this.customers
  }
}
