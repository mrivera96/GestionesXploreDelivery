import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RatesService} from "../../../../../services/rates.service";
import {ErrorModalComponent} from "../../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../../shared/success-modal/success-modal.component";
import {Customer} from "../../../../../models/customer";
import {UsersService} from "../../../../../services/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-customer-rate-dialog',
  templateUrl: './add-customer-rate-dialog.component.html',
  styleUrls: ['./add-customer-rate-dialog.component.css']
})
export class AddCustomerRateDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  rateId: number
  customers: Customer[]
  custForm: FormGroup
  filteredCustomers: Customer[]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private ratesService: RatesService,
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {
    this.rateId = this.data.rateId
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
    const usersSubscription = this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
      this.filteredCustomers = response.data
      this.loaders.loadingData = false
      usersSubscription.unsubscribe()
    })

  }

  onFormSubmit() {
    if (this.custForm.valid) {
      this.loaders.loadingSubmit = true
      const ratesSubscription = this.ratesService.addCustomerToRate(this.rateId, this.custForm.get('idCliente').value)
        .subscribe(response => {
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          this.loaders.loadingSubmit = false
          ratesSubscription.unsubscribe()
        }, error => {
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
            this.loaders.loadingSubmit = false
            ratesSubscription.unsubscribe()
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
