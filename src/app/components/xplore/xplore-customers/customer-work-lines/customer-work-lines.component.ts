import {Component, Inject, OnInit} from '@angular/core';
import {CustomerWorkLines} from "../../../../models/customer-work-lines";
import {UsersService} from "../../../../services/users.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddCustomerRateDialogComponent} from "../../xplore-rates/rate-customers-dialog/add-customer-rate-dialog/add-customer-rate-dialog.component";
import {AddWorkLineComponent} from "./add-work-line/add-work-line.component";
import {WorkLinesService} from "../../../../services/work-lines.service";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";

@Component({
  selector: 'app-customer-work-lines',
  templateUrl: './customer-work-lines.component.html',
  styles: [
  ]
})
export class CustomerWorkLinesComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  customerWorkLines: CustomerWorkLines [] = []
  currentCustomer: number = 0
  constructor(
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private workLinesService: WorkLinesService,
  ) {
    this.currentCustomer = this.data.customer
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(){
    this.loaders.loadingData = true
    const usersSubscription = this.usersService.getCustomerWorkLines(this.currentCustomer)
      .subscribe(response => {
        this.customerWorkLines = response.data
        this.loaders.loadingData = false
        usersSubscription.unsubscribe()
      })
  }

  showAddDialog(){
    const dialogRef = this.dialog.open(AddWorkLineComponent, {
      data: {
        customerId: this.currentCustomer,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadData()
      }

    })
  }

  removeCustomerFromWorkLine(workline){
    this.loaders.loadingData = true
    const wlsubscription = this.workLinesService.removeCustomerFromWorkLine(this.currentCustomer, workline)
      .subscribe(response => {
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        this.loaders.loadingSubmit = false
        wlsubscription.unsubscribe()

      }, error => {
        error.subscribe(error => {
          this.openErrorDialog(error.statusText)
          this.loaders.loadingSubmit = false
          wlsubscription.unsubscribe()
        })
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
      this.dialogRef.close(true)
    })
  }

}
