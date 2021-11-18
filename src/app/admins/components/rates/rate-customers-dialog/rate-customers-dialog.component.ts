import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RatesService} from "../../../../services/rates.service";
import {ErrorModalComponent} from "../../../../components/shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../../components/shared/success-modal/success-modal.component";
import {AddCustomerRateDialogComponent} from "./add-customer-rate-dialog/add-customer-rate-dialog.component";

@Component({
  selector: 'app-rate-customers-dialog',
  templateUrl: './rate-customers-dialog.component.html',
  styleUrls: ['./rate-customers-dialog.component.css']
})
export class RateCustomersDialogComponent implements OnInit {
  loaders = {
    loadingData: false
  }
  rateCustomers: []
  rateId: number

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private ratesService: RatesService
  ) {
    this.rateId = this.data.rateId
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(){
    this.loaders.loadingData = true
    const ratesSubscription = this.ratesService.getRateCustomers(this.rateId).subscribe(response => {
      this.rateCustomers = response.data
      this.loaders.loadingData = false
      ratesSubscription.unsubscribe()
    })
  }

  removeCustomerFromRate(customer) {
    this.loaders.loadingData = true
    const ratesSubscription = this.ratesService.removeCustomerFromRate(this.rateId, customer).subscribe(response => {
      this.openSuccessDialog('Operación Realizada Correctamente', response.message)
      this.loaders.loadingData = false
      ratesSubscription.unsubscribe()

    }, error => {
      error.subscribe(error => {
        this.loaders.loadingData = false
        this.openErrorDialog(error.statusText)
        ratesSubscription.unsubscribe()
      })
    })
  }

  showAddDialog(){
    const dialogRef = this.dialog.open(AddCustomerRateDialogComponent, {
      data: {
        rateId: this.rateId,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadData()
      }

    })
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
      this.loadData()
    })
  }

}
