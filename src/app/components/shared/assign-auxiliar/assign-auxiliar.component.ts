import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {DeliveriesService} from "../../../services/deliveries.service";
import {UsersService} from "../../../services/users.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {SuccessModalComponent} from "../success-modal/success-modal.component";
import {ErrorModalComponent} from "../error-modal/error-modal.component";

@Component({
  selector: 'app-assign-auxiliar',
  templateUrl: './assign-auxiliar.component.html',
  styleUrls: ['./assign-auxiliar.component.css']
})
export class AssignAuxiliarComponent implements OnInit {
  asignForm: FormGroup
  loaders = {
    'loadingData': false
  }
  orderId
  conductores: User[]

  constructor(
    private deliveriesService: DeliveriesService,
    private usersService: UsersService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.orderId = data.order
  }

  ngOnInit(): void {
    this.asignForm = new FormGroup({
      idAuxiliar: new FormControl(null, [Validators.required]),
    })

    const usersSubscription = this.usersService.getDrivers().subscribe(response => {
      this.conductores = response.data
      usersSubscription.unsubscribe()
    })
  }

  assignOrder() {
    if (this.asignForm.valid) {
      this.loaders.loadingData = true

      const deliveriesSubscription = this.deliveriesService.assigOrderAuxiliar(this.orderId, this.asignForm.get('idAuxiliar').value).subscribe(response => {
        this.loaders.loadingData = false
        this.openSuccessDialog('Asignación de envío', response.data)
        deliveriesSubscription.unsubscribe()
      }, error => {
        error.subscribe(error => {
          this.openErrorDialog(error.statusText, false)
        })
        this.loaders.loadingData = false
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
      this.dialog.closeAll()
    })
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })


  }

}
