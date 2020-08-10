import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit {
  loaders = {
    'loadingData': false
  }
  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private deliveriesService: DeliveriesService,
  ) { }

  ngOnInit(): void {
  }


  finishDelivery() {
    this.loaders.loadingData = true
    const deliveriesSubscription = this.deliveriesService.finishDelivery(this.data.deliveryId).subscribe(response => {
      this.loaders.loadingData = false
      this.openSuccessDialog('Finalización de reserva',  response.data)
      deliveriesSubscription.unsubscribe()
    }, error => {
      error.subscribe(error => {
        this.loaders.loadingData = false
        this.openErrorDialog(error.statusText)
        deliveriesSubscription.unsubscribe()
      })
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

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

}
