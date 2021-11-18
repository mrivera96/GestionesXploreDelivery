import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SurchargesService} from "../../../../services/surcharges.service";
import {ErrorModalComponent} from "../../../../components/shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../../components/shared/success-modal/success-modal.component";
import {AddCustomerSurchargeDialogComponent} from "../add-customer-surcharge-dialog/add-customer-surcharge-dialog.component";

@Component({
  selector: 'app-surcharge-customers-dialog',
  templateUrl: './surcharge-customers-dialog.component.html',
  styles: []
})
export class SurchargeCustomersDialogComponent implements OnInit {
  loaders = {
    loadingData: false
  }
  surchargeCustomers: [] = []
  surchargeId: number

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private surchargeService: SurchargesService
  ) {
    this.surchargeId = this.data.surchargeId
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true
    const surchargeSubscription = this.surchargeService.getSurchargeCustomers(this.surchargeId).subscribe(response => {
      this.surchargeCustomers = response.data
      this.loaders.loadingData = false
      surchargeSubscription.unsubscribe()
    })
  }

  removeCustomerFromSurcharge(customer, recargo) {
    this.loaders.loadingData = true
    const surchargeSubscription = this.surchargeService.removeCustomerFromSurcharge(recargo, customer)
      .subscribe(response => {
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        this.loaders.loadingData = false
        surchargeSubscription.unsubscribe()

      }, error => {
        error.subscribe(error => {
          this.loaders.loadingData = false
          this.openErrorDialog(error.statusText)
          surchargeSubscription.unsubscribe()
        })
      })
  }

  showAddDialog() {
    const dialogRef = this.dialog.open(AddCustomerSurchargeDialogComponent, {
      data: {
        surchargeId: this.surchargeId,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
