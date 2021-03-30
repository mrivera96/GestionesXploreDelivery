import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {State} from "../../../../models/state";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ConfirmModalComponent} from "../confirm-modal/confirm-modal.component";
import {AssignDialogComponent} from "../assign-dialog/assign-dialog.component";

@Component({
  selector: 'app-change-state-dialog',
  templateUrl: './change-state-dialog.component.html'
})
export class ChangeStateDialogComponent implements OnInit {
  changeForm: FormGroup
  states: State[]
  loaders = {
    'loadingData': false
  }
  deliveryId: number

  constructor(
    private deliveriesService: DeliveriesService,
    public dialogRef: MatDialogRef<ChangeStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.deliveryId = this.data.idDelivery
    this.changeForm = new FormGroup({
      idEstado: new FormControl(this.data.idEstado, [Validators.required]),
    })
    const deliveriesSubscription = this.deliveriesService.getStates().subscribe(response => {
      this.states = response.data.xploreDelivery
      deliveriesSubscription.unsubscribe()
    })
  }


  changeState() {
    if (this.changeForm.valid) {
      if (this.changeForm.get('idEstado').value == 37) {
        this.openAssignDialog()
      } else if (this.changeForm.get('idEstado').value == 39) {
        this.openConfirmDialog()
      } else {
        this.loaders.loadingData = true
        const deliveriesSubscription = this.deliveriesService.changeState(this.deliveryId, this.changeForm.value).subscribe(response => {
          this.loaders.loadingData = false
          this.openSuccessDialog('Cambio de Estado de Reserva', response.data)
          deliveriesSubscription.unsubscribe()

        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.loaders.loadingData = false
              this.openErrorDialog(error.statusText, false)
              deliveriesSubscription.unsubscribe()
            })
          }
        })
      }

    }

  }

  openErrorDialog(error: string, reload: boolean): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  openConfirmDialog() {
    this.dialog.open(ConfirmModalComponent, {
      data: {
        deliveryId: this.deliveryId
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

  openAssignDialog() {
    this.dialog.open(AssignDialogComponent, {
      data: {
        deliveryId: this.deliveryId
      }
    })
  }


}
