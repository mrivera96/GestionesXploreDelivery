import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../../../models/user";
import {UsersService} from "../../../../services/users.service";
import {SuccessModalComponent} from "../../../../components/shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../../components/shared/error-modal/error-modal.component";

@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html'
})
export class AssignDialogComponent implements OnInit {
  asignForm: FormGroup
  loaders = {
    'loadingData': false
  }
  deliveryId
  conductores: User[]

  constructor(
    private deliveriesService: DeliveriesService,
    private usersService: UsersService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.deliveryId = data.deliveryId
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.asignForm = new FormGroup({
      idConductor: new FormControl(null, [Validators.required]),
    })

    const usersSubscription = this.usersService.getDrivers().subscribe(response => {
      this.conductores = response.data
      usersSubscription.unsubscribe()
    })
  }


  assignDelivery() {
    if (this.asignForm.valid) {
      this.loaders.loadingData = true
      const deliveriesSubscription = this.deliveriesService.assignDelivery(this.deliveryId, this.asignForm.value).subscribe(response => {
        this.loaders.loadingData = false
        this.openSuccessDialog('Asignación de reserva', response.data)
        deliveriesSubscription.unsubscribe()
      }, error => {
        this.loaders.loadingData = false
        this.openErrorDialog('Lo sentimos, ha ocurrido un error al asignar esta reserva. Por favor intente de nuevo.', false)
        deliveriesSubscription.unsubscribe()
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
      location.reload(true)
    })
  }

  openErrorDialog(error: string, reload: boolean): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

}
