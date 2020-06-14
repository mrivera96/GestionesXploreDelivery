import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {User} from "../../../../models/user";
import {UsersService} from "../../../../services/users.service";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";

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
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.deliveryId = data.deliveryId
  }

  ngOnInit(): void {
    this.asignForm = new FormGroup({
      idConductor: new FormControl(null, [Validators.required]),
    })

    this.usersService.getDrivers().subscribe(response => {
      this.conductores = response.data
    })
  }


  assignDelivery() {
    if (this.asignForm.valid) {
      this.loaders.loadingData = true
      this.deliveriesService.assignDelivery(this.deliveryId, this.asignForm.value).subscribe(response => {

        this.loaders.loadingData = false

        this.openSuccessDialog('Asignación de reserva', response.data)
      }, error => {
        this.loaders.loadingData = false
        this.openErrorDialog('Lo sentimos, ha ocurrido un error al asignar esta reserva. Por favor intente de nuevo.', false)
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
